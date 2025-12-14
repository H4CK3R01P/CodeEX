"""Rate limiting for AI endpoints.

RULES:
- DO NOT rate-limit grading APIs
- AI rate limiting is isolated
- Legitimate usage degrades gracefully
- Rate limit failures don't break frontend

Limits:
- generate-hint: 5/min/user
- generate-explanation: 3/min/user
- review-solution: 2/min/user
- generate-question: 1/min/user
"""

import time
import threading
from typing import Dict, Optional, Tuple
from collections import defaultdict
from datetime import datetime, timedelta
import os


class RateLimitExceeded(Exception):
    """Exception raised when rate limit is exceeded."""
    
    def __init__(self, message: str, retry_after: int):
        """Initialize exception.
        
        Args:
            message: Error message
            retry_after: Seconds until limit resets
        """
        super().__init__(message)
        self.retry_after = retry_after


class TokenBucket:
    """Token bucket algorithm for rate limiting.
    
    Implements a token bucket that refills at a constant rate.
    More flexible than fixed window counters.
    """
    
    def __init__(self, capacity: int, refill_rate: float):
        """Initialize token bucket.
        
        Args:
            capacity: Maximum tokens in bucket
            refill_rate: Tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()
        self._lock = threading.Lock()
    
    def consume(self, tokens: int = 1) -> Tuple[bool, float]:
        """Try to consume tokens from bucket.
        
        Args:
            tokens: Number of tokens to consume
            
        Returns:
            Tuple of (success, retry_after_seconds)
        """
        with self._lock:
            # Refill tokens based on time passed
            now = time.time()
            time_passed = now - self.last_refill
            self.tokens = min(
                self.capacity,
                self.tokens + (time_passed * self.refill_rate)
            )
            self.last_refill = now
            
            # Try to consume tokens
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True, 0
            else:
                # Calculate retry after
                tokens_needed = tokens - self.tokens
                retry_after = tokens_needed / self.refill_rate
                return False, retry_after


class AIRateLimiter:
    """Rate limiter for AI endpoints.
    
    Implements per-user, per-endpoint rate limiting with:
    - Token bucket algorithm
    - Automatic cleanup of old entries
    - Thread-safe operations
    - Graceful error handling
    """
    
    # Rate limits per endpoint (requests per minute)
    RATE_LIMITS = {
        'generate-hint': 5,
        'generate-explanation': 3,
        'review-solution': 2,
        'generate-question': 1,
    }
    
    def __init__(self, enabled: Optional[bool] = None):
        """Initialize rate limiter.
        
        Args:
            enabled: Whether rate limiting is enabled (from env if None)
        """
        # Check feature flag
        if enabled is None:
            enabled = os.getenv('CODEX_AI_RATE_LIMIT_ENABLED', 'true').lower() == 'true'
        
        self.enabled = enabled
        
        # Store token buckets per user per endpoint
        # Structure: {user_id: {endpoint: TokenBucket}}
        self._buckets: Dict[str, Dict[str, TokenBucket]] = defaultdict(dict)
        
        # Lock for thread safety
        self._lock = threading.Lock()
        
        # Track last cleanup time
        self._last_cleanup = time.time()
        self._cleanup_interval = 300  # 5 minutes
        
        # Track disabled users (admin can disable)
        self._disabled_users: set = set()
    
    def check_limit(
        self,
        user_id: str,
        endpoint: str,
        tokens: int = 1
    ) -> None:
        """Check if request is within rate limit.
        
        Args:
            user_id: User identifier
            endpoint: Endpoint name (e.g., 'generate-hint')
            tokens: Number of tokens to consume (default 1)
            
        Raises:
            RateLimitExceeded: If rate limit is exceeded
        """
        # If rate limiting is disabled, allow all requests
        if not self.enabled:
            return
        
        # Check if user is disabled
        if user_id in self._disabled_users:
            raise RateLimitExceeded(
                "Account temporarily suspended due to abuse",
                retry_after=3600  # 1 hour
            )
        
        # Get rate limit for endpoint
        limit = self.RATE_LIMITS.get(endpoint)
        if limit is None:
            # Unknown endpoint - allow (default to no limit)
            return
        
        # Get or create token bucket for this user/endpoint
        bucket = self._get_bucket(user_id, endpoint, limit)
        
        # Try to consume tokens
        allowed, retry_after = bucket.consume(tokens)
        
        if not allowed:
            raise RateLimitExceeded(
                f"Rate limit exceeded for {endpoint}. Try again in {int(retry_after)} seconds.",
                retry_after=int(retry_after) + 1
            )
        
        # Periodic cleanup of old buckets
        self._maybe_cleanup()
    
    def _get_bucket(self, user_id: str, endpoint: str, limit: int) -> TokenBucket:
        """Get or create token bucket for user/endpoint.
        
        Args:
            user_id: User identifier
            endpoint: Endpoint name
            limit: Rate limit (requests per minute)
            
        Returns:
            TokenBucket instance
        """
        with self._lock:
            if endpoint not in self._buckets[user_id]:
                # Create new bucket
                # Capacity = limit (max requests per minute)
                # Refill rate = limit / 60 (tokens per second)
                self._buckets[user_id][endpoint] = TokenBucket(
                    capacity=limit,
                    refill_rate=limit / 60.0
                )
            
            return self._buckets[user_id][endpoint]
    
    def _maybe_cleanup(self) -> None:
        """Periodically cleanup old bucket entries."""
        now = time.time()
        
        if now - self._last_cleanup < self._cleanup_interval:
            return
        
        with self._lock:
            # Remove buckets that haven't been used in 10 minutes
            users_to_remove = []
            
            for user_id, endpoints in self._buckets.items():
                endpoints_to_remove = []
                
                for endpoint, bucket in endpoints.items():
                    # If bucket is at full capacity and hasn't been used recently
                    if bucket.tokens == bucket.capacity:
                        if now - bucket.last_refill > 600:  # 10 minutes
                            endpoints_to_remove.append(endpoint)
                
                for endpoint in endpoints_to_remove:
                    del endpoints[endpoint]
                
                # If user has no endpoints left, mark for removal
                if not endpoints:
                    users_to_remove.append(user_id)
            
            for user_id in users_to_remove:
                del self._buckets[user_id]
            
            self._last_cleanup = now
    
    def get_remaining(
        self,
        user_id: str,
        endpoint: str
    ) -> Optional[int]:
        """Get remaining requests for user/endpoint.
        
        Args:
            user_id: User identifier
            endpoint: Endpoint name
            
        Returns:
            Number of remaining requests, or None if no limit
        """
        if not self.enabled:
            return None
        
        limit = self.RATE_LIMITS.get(endpoint)
        if limit is None:
            return None
        
        bucket = self._get_bucket(user_id, endpoint, limit)
        
        # Trigger refill calculation
        with bucket._lock:
            now = time.time()
            time_passed = now - bucket.last_refill
            tokens = min(
                bucket.capacity,
                bucket.tokens + (time_passed * bucket.refill_rate)
            )
            return int(tokens)
    
    def reset_user(self, user_id: str) -> None:
        """Reset rate limits for a user (admin action).
        
        Args:
            user_id: User identifier
        """
        with self._lock:
            if user_id in self._buckets:
                del self._buckets[user_id]
            
            if user_id in self._disabled_users:
                self._disabled_users.remove(user_id)
    
    def disable_user(self, user_id: str) -> None:
        """Disable AI access for a user (abuse protection).
        
        Args:
            user_id: User identifier
        """
        with self._lock:
            self._disabled_users.add(user_id)
    
    def enable_user(self, user_id: str) -> None:
        """Re-enable AI access for a user.
        
        Args:
            user_id: User identifier
        """
        with self._lock:
            if user_id in self._disabled_users:
                self._disabled_users.remove(user_id)
    
    def get_stats(self) -> Dict:
        """Get rate limiter statistics.
        
        Returns:
            Dictionary with stats
        """
        with self._lock:
            return {
                'enabled': self.enabled,
                'total_users': len(self._buckets),
                'disabled_users': len(self._disabled_users),
                'rate_limits': self.RATE_LIMITS,
            }


# Global rate limiter instance
_rate_limiter = AIRateLimiter()


def get_rate_limiter() -> AIRateLimiter:
    """Get the global rate limiter instance."""
    return _rate_limiter
