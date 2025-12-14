"""Abuse detection for AI endpoints.

Detects:
- Rapid retries
- Identical prompts (possible bot/script)
- Excessive failures
- Suspicious patterns
"""

import time
import hashlib
import threading
from typing import Dict, List, Optional, Tuple
from collections import defaultdict, deque
from datetime import datetime, timedelta


class AbuseSignal:
    """Represents a detected abuse signal."""
    
    def __init__(
        self,
        user_id: str,
        signal_type: str,
        severity: str,
        description: str,
        timestamp: float
    ):
        self.user_id = user_id
        self.signal_type = signal_type
        self.severity = severity  # 'low', 'medium', 'high'
        self.description = description
        self.timestamp = timestamp


class AbuseDetector:
    """Detect abuse patterns in AI usage.
    
    Tracks:
    - Rapid retries (same endpoint in quick succession)
    - Identical prompts (hash-based detection)
    - Excessive failures (repeated errors)
    - Request patterns (burst detection)
    """
    
    def __init__(self):
        """Initialize abuse detector."""
        self._lock = threading.Lock()
        
        # Track recent requests per user
        # Structure: {user_id: deque([timestamp, ...])}
        self._request_times: Dict[str, deque] = defaultdict(lambda: deque(maxlen=100))
        
        # Track recent prompt hashes per user
        # Structure: {user_id: deque([(hash, timestamp), ...])}
        self._prompt_hashes: Dict[str, deque] = defaultdict(lambda: deque(maxlen=50))
        
        # Track failures per user
        # Structure: {user_id: deque([timestamp, ...])}
        self._failure_times: Dict[str, deque] = defaultdict(lambda: deque(maxlen=50))
        
        # Detected abuse signals
        self._signals: List[AbuseSignal] = []
        self._max_signals = 1000  # Keep last 1000 signals
        
        # Thresholds
        self.RAPID_RETRY_THRESHOLD = 3  # requests in 5 seconds
        self.RAPID_RETRY_WINDOW = 5  # seconds
        
        self.IDENTICAL_PROMPT_THRESHOLD = 3  # same prompt in 60 seconds
        self.IDENTICAL_PROMPT_WINDOW = 60  # seconds
        
        self.EXCESSIVE_FAILURE_THRESHOLD = 5  # failures in 60 seconds
        self.EXCESSIVE_FAILURE_WINDOW = 60  # seconds
        
        self.BURST_THRESHOLD = 10  # requests in 10 seconds
        self.BURST_WINDOW = 10  # seconds
    
    def track_request(
        self,
        user_id: str,
        endpoint: str,
        prompt_data: Optional[str] = None
    ) -> Optional[AbuseSignal]:
        """Track a request and check for abuse patterns.
        
        Args:
            user_id: User identifier
            endpoint: Endpoint name
            prompt_data: Optional prompt/request data for duplicate detection
            
        Returns:
            AbuseSignal if abuse detected, None otherwise
        """
        now = time.time()
        
        with self._lock:
            # Track request time
            self._request_times[user_id].append(now)
            
            # Check for rapid retries
            signal = self._check_rapid_retries(user_id, now)
            if signal:
                self._add_signal(signal)
                return signal
            
            # Check for burst traffic
            signal = self._check_burst(user_id, now)
            if signal:
                self._add_signal(signal)
                return signal
            
            # Check for identical prompts if data provided
            if prompt_data:
                signal = self._check_identical_prompts(user_id, prompt_data, now)
                if signal:
                    self._add_signal(signal)
                    return signal
        
        return None
    
    def track_failure(
        self,
        user_id: str,
        error_type: str
    ) -> Optional[AbuseSignal]:
        """Track a request failure.
        
        Args:
            user_id: User identifier
            error_type: Type of error
            
        Returns:
            AbuseSignal if excessive failures detected
        """
        now = time.time()
        
        with self._lock:
            # Track failure time
            self._failure_times[user_id].append(now)
            
            # Check for excessive failures
            signal = self._check_excessive_failures(user_id, now)
            if signal:
                self._add_signal(signal)
                return signal
        
        return None
    
    def _check_rapid_retries(
        self,
        user_id: str,
        now: float
    ) -> Optional[AbuseSignal]:
        """Check for rapid retries.
        
        Args:
            user_id: User identifier
            now: Current timestamp
            
        Returns:
            AbuseSignal if detected
        """
        times = self._request_times[user_id]
        
        # Count requests in window
        recent = sum(1 for t in times if now - t <= self.RAPID_RETRY_WINDOW)
        
        if recent >= self.RAPID_RETRY_THRESHOLD:
            return AbuseSignal(
                user_id=user_id,
                signal_type='rapid_retry',
                severity='medium',
                description=f"{recent} requests in {self.RAPID_RETRY_WINDOW} seconds",
                timestamp=now
            )
        
        return None
    
    def _check_burst(
        self,
        user_id: str,
        now: float
    ) -> Optional[AbuseSignal]:
        """Check for burst traffic.
        
        Args:
            user_id: User identifier
            now: Current timestamp
            
        Returns:
            AbuseSignal if detected
        """
        times = self._request_times[user_id]
        
        # Count requests in window
        recent = sum(1 for t in times if now - t <= self.BURST_WINDOW)
        
        if recent >= self.BURST_THRESHOLD:
            return AbuseSignal(
                user_id=user_id,
                signal_type='burst_traffic',
                severity='high',
                description=f"{recent} requests in {self.BURST_WINDOW} seconds",
                timestamp=now
            )
        
        return None
    
    def _check_identical_prompts(
        self,
        user_id: str,
        prompt_data: str,
        now: float
    ) -> Optional[AbuseSignal]:
        """Check for identical prompts.
        
        Args:
            user_id: User identifier
            prompt_data: Prompt/request data
            now: Current timestamp
            
        Returns:
            AbuseSignal if detected
        """
        # Hash the prompt data
        prompt_hash = hashlib.md5(prompt_data.encode()).hexdigest()
        
        # Track this hash
        self._prompt_hashes[user_id].append((prompt_hash, now))
        
        # Count identical prompts in window
        identical_count = sum(
            1 for h, t in self._prompt_hashes[user_id]
            if h == prompt_hash and now - t <= self.IDENTICAL_PROMPT_WINDOW
        )
        
        if identical_count >= self.IDENTICAL_PROMPT_THRESHOLD:
            return AbuseSignal(
                user_id=user_id,
                signal_type='identical_prompt',
                severity='high',
                description=f"Same prompt repeated {identical_count} times in {self.IDENTICAL_PROMPT_WINDOW} seconds",
                timestamp=now
            )
        
        return None
    
    def _check_excessive_failures(
        self,
        user_id: str,
        now: float
    ) -> Optional[AbuseSignal]:
        """Check for excessive failures.
        
        Args:
            user_id: User identifier
            now: Current timestamp
            
        Returns:
            AbuseSignal if detected
        """
        times = self._failure_times[user_id]
        
        # Count failures in window
        recent = sum(1 for t in times if now - t <= self.EXCESSIVE_FAILURE_WINDOW)
        
        if recent >= self.EXCESSIVE_FAILURE_THRESHOLD:
            return AbuseSignal(
                user_id=user_id,
                signal_type='excessive_failures',
                severity='medium',
                description=f"{recent} failures in {self.EXCESSIVE_FAILURE_WINDOW} seconds",
                timestamp=now
            )
        
        return None
    
    def _add_signal(self, signal: AbuseSignal) -> None:
        """Add abuse signal to list.
        
        Args:
            signal: AbuseSignal to add
        """
        self._signals.append(signal)
        
        # Limit signal storage
        if len(self._signals) > self._max_signals:
            self._signals = self._signals[-self._max_signals:]
    
    def get_user_signals(
        self,
        user_id: str,
        since: Optional[float] = None
    ) -> List[AbuseSignal]:
        """Get abuse signals for a user.
        
        Args:
            user_id: User identifier
            since: Optional timestamp to filter signals
            
        Returns:
            List of abuse signals
        """
        with self._lock:
            signals = [
                s for s in self._signals
                if s.user_id == user_id
            ]
            
            if since:
                signals = [s for s in signals if s.timestamp >= since]
            
            return signals
    
    def get_recent_signals(
        self,
        limit: int = 50
    ) -> List[Dict]:
        """Get recent abuse signals (admin).
        
        Args:
            limit: Maximum signals to return
            
        Returns:
            List of signal dictionaries
        """
        with self._lock:
            recent = self._signals[-limit:]
            
            return [
                {
                    'user_id_hash': hashlib.sha256(s.user_id.encode()).hexdigest()[:16],
                    'signal_type': s.signal_type,
                    'severity': s.severity,
                    'description': s.description,
                    'timestamp': datetime.fromtimestamp(s.timestamp).isoformat()
                }
                for s in recent
            ]
    
    def is_suspicious(
        self,
        user_id: str,
        threshold: int = 3
    ) -> bool:
        """Check if user has suspicious activity.
        
        Args:
            user_id: User identifier
            threshold: Number of high-severity signals to consider suspicious
            
        Returns:
            True if user is suspicious
        """
        # Get signals from last hour
        one_hour_ago = time.time() - 3600
        signals = self.get_user_signals(user_id, since=one_hour_ago)
        
        # Count high-severity signals
        high_severity = sum(1 for s in signals if s.severity == 'high')
        
        return high_severity >= threshold
    
    def reset_user(self, user_id: str) -> None:
        """Reset tracking for a user.
        
        Args:
            user_id: User identifier
        """
        with self._lock:
            if user_id in self._request_times:
                del self._request_times[user_id]
            if user_id in self._prompt_hashes:
                del self._prompt_hashes[user_id]
            if user_id in self._failure_times:
                del self._failure_times[user_id]
            
            # Remove signals for user
            self._signals = [
                s for s in self._signals
                if s.user_id != user_id
            ]
    
    def get_stats(self) -> Dict:
        """Get abuse detector statistics.
        
        Returns:
            Dictionary with stats
        """
        with self._lock:
            return {
                'tracked_users': len(self._request_times),
                'total_signals': len(self._signals),
                'signals_by_type': self._count_signals_by_type(),
                'signals_by_severity': self._count_signals_by_severity(),
            }
    
    def _count_signals_by_type(self) -> Dict[str, int]:
        """Count signals by type."""
        counts = defaultdict(int)
        for signal in self._signals:
            counts[signal.signal_type] += 1
        return dict(counts)
    
    def _count_signals_by_severity(self) -> Dict[str, int]:
        """Count signals by severity."""
        counts = defaultdict(int)
        for signal in self._signals:
            counts[signal.severity] += 1
        return dict(counts)


# Global abuse detector instance
_abuse_detector = AbuseDetector()


def get_abuse_detector() -> AbuseDetector:
    """Get the global abuse detector instance."""
    return _abuse_detector
