"""Metrics tracking for AI subsystem.

Tracks:
- Call counts per agent
- Call counts per domain
- Average latency per agent
- Failure rates
- Request volume over time

RULES:
- Metrics collection must be non-blocking
- No sensitive data in metrics
- Thread-safe operations
- Graceful degradation on errors
"""

import threading
import time
from collections import defaultdict
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import statistics


class AIMetrics:
    """Thread-safe metrics collector for AI operations.
    
    Tracks various metrics about AI requests without blocking
    or affecting request processing.
    """
    
    def __init__(self):
        """Initialize metrics collector."""
        self._lock = threading.Lock()
        
        # Call counts
        self._agent_calls: Dict[str, int] = defaultdict(int)
        self._domain_calls: Dict[str, int] = defaultdict(int)
        self._endpoint_calls: Dict[str, int] = defaultdict(int)
        
        # Latency tracking (list of latencies per agent)
        self._agent_latencies: Dict[str, List[float]] = defaultdict(list)
        self._domain_latencies: Dict[str, List[float]] = defaultdict(list)
        
        # Failure tracking
        self._agent_failures: Dict[str, int] = defaultdict(int)
        self._domain_failures: Dict[str, int] = defaultdict(int)
        self._failure_reasons: List[Dict[str, Any]] = []
        
        # Time-series data (hourly buckets)
        self._hourly_requests: Dict[str, int] = defaultdict(int)
        
        # Startup time
        self._start_time = datetime.utcnow()
        
        # Max samples to keep in memory (prevent memory bloat)
        self._max_latency_samples = 1000
        self._max_failure_logs = 100
    
    def record_request(
        self,
        agent_name: str,
        domain: str,
        endpoint: str,
        latency_ms: float,
        success: bool,
        failure_reason: Optional[str] = None
    ) -> None:
        """Record metrics for an AI request.
        
        This is non-blocking and thread-safe.
        
        Args:
            agent_name: Name of agent that handled request
            domain: AI domain
            endpoint: API endpoint
            latency_ms: Request latency in milliseconds
            success: Whether request succeeded
            failure_reason: Reason for failure if applicable
        """
        try:
            with self._lock:
                # Increment call counts
                self._agent_calls[agent_name] += 1
                self._domain_calls[domain] += 1
                self._endpoint_calls[endpoint] += 1
                
                # Track latency
                self._agent_latencies[agent_name].append(latency_ms)
                self._domain_latencies[domain].append(latency_ms)
                
                # Limit sample size
                if len(self._agent_latencies[agent_name]) > self._max_latency_samples:
                    self._agent_latencies[agent_name] = \
                        self._agent_latencies[agent_name][-self._max_latency_samples:]
                
                if len(self._domain_latencies[domain]) > self._max_latency_samples:
                    self._domain_latencies[domain] = \
                        self._domain_latencies[domain][-self._max_latency_samples:]
                
                # Track failures
                if not success:
                    self._agent_failures[agent_name] += 1
                    self._domain_failures[domain] += 1
                    
                    if failure_reason:
                        self._failure_reasons.append({
                            'agent': agent_name,
                            'domain': domain,
                            'reason': failure_reason,
                            'timestamp': datetime.utcnow().isoformat()
                        })
                        
                        # Limit failure logs
                        if len(self._failure_reasons) > self._max_failure_logs:
                            self._failure_reasons = self._failure_reasons[-self._max_failure_logs:]
                
                # Track hourly requests
                hour_key = datetime.utcnow().strftime('%Y-%m-%d-%H')
                self._hourly_requests[hour_key] += 1
        
        except Exception as e:
            # Never crash on metrics error
            print(f"[Metrics] Failed to record request: {e}")
    
    def get_agent_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics per agent.
        
        Returns:
            Dictionary mapping agent name to stats
        """
        try:
            with self._lock:
                stats = {}
                
                for agent_name in self._agent_calls.keys():
                    total_calls = self._agent_calls[agent_name]
                    failures = self._agent_failures.get(agent_name, 0)
                    latencies = self._agent_latencies.get(agent_name, [])
                    
                    stats[agent_name] = {
                        'total_calls': total_calls,
                        'successful_calls': total_calls - failures,
                        'failed_calls': failures,
                        'failure_rate': round(failures / total_calls * 100, 2) if total_calls > 0 else 0,
                        'avg_latency_ms': round(statistics.mean(latencies), 2) if latencies else 0,
                        'min_latency_ms': round(min(latencies), 2) if latencies else 0,
                        'max_latency_ms': round(max(latencies), 2) if latencies else 0,
                        'p50_latency_ms': round(statistics.median(latencies), 2) if latencies else 0,
                        'p95_latency_ms': round(self._percentile(latencies, 0.95), 2) if len(latencies) > 1 else 0,
                        'p99_latency_ms': round(self._percentile(latencies, 0.99), 2) if len(latencies) > 1 else 0,
                    }
                
                return stats
        except Exception as e:
            print(f"[Metrics] Failed to get agent stats: {e}")
            return {}
    
    def get_domain_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics per domain.
        
        Returns:
            Dictionary mapping domain to stats
        """
        try:
            with self._lock:
                stats = {}
                
                for domain in self._domain_calls.keys():
                    total_calls = self._domain_calls[domain]
                    failures = self._domain_failures.get(domain, 0)
                    latencies = self._domain_latencies.get(domain, [])
                    
                    stats[domain] = {
                        'total_calls': total_calls,
                        'successful_calls': total_calls - failures,
                        'failed_calls': failures,
                        'failure_rate': round(failures / total_calls * 100, 2) if total_calls > 0 else 0,
                        'avg_latency_ms': round(statistics.mean(latencies), 2) if latencies else 0,
                    }
                
                return stats
        except Exception as e:
            print(f"[Metrics] Failed to get domain stats: {e}")
            return {}
    
    def get_endpoint_stats(self) -> Dict[str, int]:
        """Get call counts per endpoint.
        
        Returns:
            Dictionary mapping endpoint to call count
        """
        try:
            with self._lock:
                return dict(self._endpoint_calls)
        except Exception as e:
            print(f"[Metrics] Failed to get endpoint stats: {e}")
            return {}
    
    def get_recent_failures(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent failure logs.
        
        Args:
            limit: Maximum number of failures to return
            
        Returns:
            List of recent failures
        """
        try:
            with self._lock:
                return self._failure_reasons[-limit:]
        except Exception as e:
            print(f"[Metrics] Failed to get recent failures: {e}")
            return []
    
    def get_hourly_volume(self, hours: int = 24) -> Dict[str, int]:
        """Get request volume per hour.
        
        Args:
            hours: Number of hours to include
            
        Returns:
            Dictionary mapping hour to request count
        """
        try:
            with self._lock:
                # Get last N hours
                now = datetime.utcnow()
                hour_keys = []
                
                for i in range(hours):
                    hour = now - timedelta(hours=i)
                    hour_key = hour.strftime('%Y-%m-%d-%H')
                    hour_keys.append(hour_key)
                
                return {
                    hour_key: self._hourly_requests.get(hour_key, 0)
                    for hour_key in hour_keys
                }
        except Exception as e:
            print(f"[Metrics] Failed to get hourly volume: {e}")
            return {}
    
    def get_summary(self) -> Dict[str, Any]:
        """Get overall summary statistics.
        
        Returns:
            Summary dictionary with aggregated stats
        """
        try:
            with self._lock:
                total_requests = sum(self._agent_calls.values())
                total_failures = sum(self._agent_failures.values())
                
                # Aggregate all latencies
                all_latencies = []
                for latencies in self._agent_latencies.values():
                    all_latencies.extend(latencies)
                
                uptime_seconds = (datetime.utcnow() - self._start_time).total_seconds()
                
                return {
                    'total_requests': total_requests,
                    'successful_requests': total_requests - total_failures,
                    'failed_requests': total_failures,
                    'overall_failure_rate': round(total_failures / total_requests * 100, 2) if total_requests > 0 else 0,
                    'overall_avg_latency_ms': round(statistics.mean(all_latencies), 2) if all_latencies else 0,
                    'overall_p50_latency_ms': round(statistics.median(all_latencies), 2) if all_latencies else 0,
                    'overall_p95_latency_ms': round(self._percentile(all_latencies, 0.95), 2) if len(all_latencies) > 1 else 0,
                    'overall_p99_latency_ms': round(self._percentile(all_latencies, 0.99), 2) if len(all_latencies) > 1 else 0,
                    'total_agents': len(self._agent_calls),
                    'total_domains': len(self._domain_calls),
                    'total_endpoints': len(self._endpoint_calls),
                    'uptime_seconds': round(uptime_seconds, 2),
                    'uptime_hours': round(uptime_seconds / 3600, 2),
                    'requests_per_minute': round(total_requests / (uptime_seconds / 60), 2) if uptime_seconds > 0 else 0,
                    'start_time': self._start_time.isoformat(),
                    'current_time': datetime.utcnow().isoformat(),
                }
        except Exception as e:
            print(f"[Metrics] Failed to get summary: {e}")
            return {}
    
    def reset(self) -> None:
        """Reset all metrics (for testing or admin action)."""
        try:
            with self._lock:
                self._agent_calls.clear()
                self._domain_calls.clear()
                self._endpoint_calls.clear()
                self._agent_latencies.clear()
                self._domain_latencies.clear()
                self._agent_failures.clear()
                self._domain_failures.clear()
                self._failure_reasons.clear()
                self._hourly_requests.clear()
                self._start_time = datetime.utcnow()
        except Exception as e:
            print(f"[Metrics] Failed to reset: {e}")
    
    @staticmethod
    def _percentile(data: List[float], percentile: float) -> float:
        """Calculate percentile of data.
        
        Args:
            data: List of numbers
            percentile: Percentile to calculate (0.0 to 1.0)
            
        Returns:
            Percentile value
        """
        if not data:
            return 0.0
        
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile)
        return sorted_data[min(index, len(sorted_data) - 1)]


# Global metrics instance
_metrics_instance = AIMetrics()


def get_metrics_instance() -> AIMetrics:
    """Get the global metrics instance."""
    return _metrics_instance
