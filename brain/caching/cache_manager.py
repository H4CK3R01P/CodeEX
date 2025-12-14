"""AI response cache manager.

Provides in-memory caching with TTL, metrics, and safety guarantees.

RULES:
- Cache failures must fallback to live AI
- No stale unsafe content
- User-specific content must not leak
- Caching must not break correctness
"""

import time
import threading
import os
from typing import Any, Dict, Optional, Tuple
from collections import defaultdict
from datetime import datetime, timedelta
from enum import Enum


class CachePolicy(Enum):
    """Cache policies for different endpoints."""
    HINT = ('generate-hint', 24 * 3600)           # 24 hours
    EXPLANATION = ('generate-explanation', 7 * 24 * 3600)  # 7 days
    REVIEW = ('review-solution', 0)               # NO CACHE
    QUESTION = ('generate-question', 30 * 24 * 3600)  # 30 days
    
    def __init__(self, endpoint: str, ttl: int):
        self.endpoint = endpoint
        self.ttl = ttl  # seconds


class CacheEntry:
    """Single cache entry with metadata."""
    
    def __init__(
        self,
        key: str,
        value: Any,
        ttl: int,
        metadata: Optional[Dict] = None
    ):
        """Initialize cache entry.
        
        Args:
            key: Cache key
            value: Cached value (verified AI output)
            ttl: Time to live in seconds
            metadata: Optional metadata
        """
        self.key = key
        self.value = value
        self.ttl = ttl
        self.created_at = time.time()
        self.expires_at = self.created_at + ttl if ttl > 0 else float('inf')
        self.hits = 0
        self.metadata = metadata or {}
    
    def is_expired(self) -> bool:
        """Check if entry has expired."""
        if self.ttl == 0:  # Never expires
            return False
        return time.time() > self.expires_at
    
    def record_hit(self) -> None:
        """Record cache hit."""
        self.hits += 1


class AICacheManager:
    """Manager for AI response caching.
    
    Features:
    - In-memory LRU-like cache
    - Per-endpoint TTL policies
    - Hit/miss metrics
    - Cost savings estimation
    - Thread-safe operations
    - Automatic cleanup
    """
    
    def __init__(self, enabled: Optional[bool] = None, max_size: int = 10000):
        """Initialize cache manager.
        
        Args:
            enabled: Whether caching is enabled (from env if None)
            max_size: Maximum cache entries
        """
        # Check feature flag
        if enabled is None:
            enabled = os.getenv('CODEX_AI_CACHE_ENABLED', 'true').lower() == 'true'
        
        self.enabled = enabled
        self.max_size = max_size
        
        # Cache storage: {key: CacheEntry}
        self._cache: Dict[str, CacheEntry] = {}
        
        # Lock for thread safety
        self._lock = threading.Lock()
        
        # Metrics
        self._hits = 0
        self._misses = 0
        self._evictions = 0
        
        # Cost metrics (estimated)
        self._estimated_cost_per_request = 0.01  # $0.01 per AI request
        self._total_savings = 0.0
        
        # Cleanup tracking
        self._last_cleanup = time.time()
        self._cleanup_interval = 300  # 5 minutes
        
        # Policy mapping
        self._policies = {
            policy.endpoint: policy.ttl
            for policy in CachePolicy
        }
    
    def get(
        self,
        key: str,
        endpoint: str
    ) -> Optional[Any]:
        """Get cached value.
        
        Args:
            key: Cache key
            endpoint: Endpoint name (for policy lookup)
            
        Returns:
            Cached value if found and valid, None otherwise
        """
        if not self.enabled:
            return None
        
        with self._lock:
            entry = self._cache.get(key)
            
            if entry is None:
                self._misses += 1
                return None
            
            # Check if expired
            if entry.is_expired():
                # Remove expired entry
                del self._cache[key]
                self._misses += 1
                return None
            
            # Cache hit
            entry.record_hit()
            self._hits += 1
            
            # Track cost savings
            self._total_savings += self._estimated_cost_per_request
            
            return entry.value
    
    def set(
        self,
        key: str,
        value: Any,
        endpoint: str,
        metadata: Optional[Dict] = None
    ) -> bool:
        """Set cached value.
        
        Args:
            key: Cache key
            value: Value to cache (verified AI output)
            endpoint: Endpoint name (for policy lookup)
            metadata: Optional metadata
            
        Returns:
            True if cached successfully
        """
        if not self.enabled:
            return False
        
        # Get TTL policy for endpoint
        ttl = self._policies.get(endpoint, 0)
        
        # Don't cache if TTL is 0 (NO CACHE policy)
        if ttl == 0:
            return False
        
        with self._lock:
            # Check cache size
            if len(self._cache) >= self.max_size:
                self._evict_lru()
            
            # Create cache entry
            entry = CacheEntry(
                key=key,
                value=value,
                ttl=ttl,
                metadata=metadata
            )
            
            self._cache[key] = entry
            
            # Periodic cleanup
            self._maybe_cleanup()
            
            return True
    
    def _evict_lru(self) -> None:
        """Evict least recently used entries.
        
        Removes 10% of cache when full.
        """
        if not self._cache:
            return
        
        # Sort by last access (hits indicate recent use)
        # Remove entries with fewest hits (LRU approximation)
        sorted_entries = sorted(
            self._cache.items(),
            key=lambda x: x[1].hits
        )
        
        # Remove bottom 10%
        num_to_remove = max(1, len(self._cache) // 10)
        
        for key, _ in sorted_entries[:num_to_remove]:
            del self._cache[key]
            self._evictions += 1
    
    def _maybe_cleanup(self) -> None:
        """Periodically cleanup expired entries."""
        now = time.time()
        
        if now - self._last_cleanup < self._cleanup_interval:
            return
        
        # Remove expired entries
        expired_keys = [
            key for key, entry in self._cache.items()
            if entry.is_expired()
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        self._last_cleanup = now
    
    def invalidate(
        self,
        key: Optional[str] = None,
        endpoint: Optional[str] = None
    ) -> int:
        """Invalidate cache entries.
        
        Args:
            key: Specific key to invalidate (None = all)
            endpoint: Invalidate all entries for endpoint
            
        Returns:
            Number of entries invalidated
        """
        with self._lock:
            if key:
                # Invalidate specific key
                if key in self._cache:
                    del self._cache[key]
                    return 1
                return 0
            
            if endpoint:
                # Invalidate all entries for endpoint
                # (Need to track endpoint in metadata)
                keys_to_remove = [
                    k for k, v in self._cache.items()
                    if v.metadata.get('endpoint') == endpoint
                ]
                for k in keys_to_remove:
                    del self._cache[k]
                return len(keys_to_remove)
            
            # Invalidate all
            count = len(self._cache)
            self._cache.clear()
            return count
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics.
        
        Returns:
            Dictionary with cache stats
        """
        with self._lock:
            total_requests = self._hits + self._misses
            hit_rate = (self._hits / total_requests * 100) if total_requests > 0 else 0
            miss_rate = 100 - hit_rate
            
            return {
                'enabled': self.enabled,
                'size': len(self._cache),
                'max_size': self.max_size,
                'hits': self._hits,
                'misses': self._misses,
                'hit_rate': round(hit_rate, 2),
                'miss_rate': round(miss_rate, 2),
                'evictions': self._evictions,
                'estimated_savings_usd': round(self._total_savings, 2),
                'policies': {
                    name: f"{ttl}s" if ttl > 0 else "NO CACHE"
                    for name, ttl in self._policies.items()
                },
            }
    
    def get_entry_stats(self) -> Dict[str, Any]:
        """Get detailed entry statistics.
        
        Returns:
            Statistics about cached entries
        """
        with self._lock:
            if not self._cache:
                return {
                    'total_entries': 0,
                    'expired_entries': 0,
                    'avg_hits_per_entry': 0,
                    'total_hits': 0,
                }
            
            expired = sum(1 for e in self._cache.values() if e.is_expired())
            total_hits = sum(e.hits for e in self._cache.values())
            avg_hits = total_hits / len(self._cache) if self._cache else 0
            
            # Group by TTL/policy
            by_ttl = defaultdict(int)
            for entry in self._cache.values():
                by_ttl[entry.ttl] += 1
            
            return {
                'total_entries': len(self._cache),
                'expired_entries': expired,
                'avg_hits_per_entry': round(avg_hits, 2),
                'total_hits': total_hits,
                'by_ttl': {
                    f"{ttl}s": count
                    for ttl, count in by_ttl.items()
                },
            }
    
    def reset_metrics(self) -> None:
        """Reset metrics (admin action)."""
        with self._lock:
            self._hits = 0
            self._misses = 0
            self._evictions = 0
            self._total_savings = 0.0
    
    def clear(self) -> None:
        """Clear all cache entries (admin action)."""
        with self._lock:
            self._cache.clear()


# Global cache manager instance
_cache_manager = AICacheManager()


def get_cache_manager() -> AICacheManager:
    """Get the global cache manager instance."""
    return _cache_manager
