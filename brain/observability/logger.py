"""Structured logging for AI pipeline.

RULES:
- DO NOT log user code, solutions, or test cases
- DO NOT log LLM prompts verbatim
- DO NOT log any sensitive data (passwords, tokens, PII)
- Logs must never crash requests
- All user IDs must be hashed
"""

import logging
import hashlib
import json
import traceback
from typing import Any, Dict, Optional
from datetime import datetime
from contextlib import contextmanager
import time
import uuid

# Configure structured logger
logger = logging.getLogger("codex_brain.ai")


class SensitiveDataFilter(logging.Filter):
    """Filter to prevent sensitive data from appearing in logs."""
    
    SENSITIVE_KEYS = {
        'password', 'token', 'api_key', 'secret', 'credit_card',
        'ssn', 'private_key', 'code', 'solution', 'test_case',
        'prompt', 'user_code', 'submission_code'
    }
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Filter out records containing sensitive data keys."""
        if hasattr(record, 'msg'):
            msg_lower = str(record.msg).lower()
            for key in self.SENSITIVE_KEYS:
                if key in msg_lower:
                    # Replace with sanitized version
                    record.msg = self._sanitize_message(record.msg)
        return True
    
    def _sanitize_message(self, msg: Any) -> str:
        """Sanitize message to remove sensitive values."""
        return "[REDACTED - Sensitive data filtered]"


def hash_user_id(user_id: Optional[str]) -> str:
    """Hash user ID for privacy.
    
    Args:
        user_id: User identifier
        
    Returns:
        SHA256 hash of user ID
    """
    if not user_id:
        return "anonymous"
    
    # Use SHA256 for one-way hashing
    return hashlib.sha256(user_id.encode()).hexdigest()[:16]


class AILogger:
    """Structured logger for AI operations.
    
    Provides safe, structured logging for AI pipeline with automatic
    sanitization and error handling.
    """
    
    def __init__(self):
        """Initialize AI logger with filter."""
        self.logger = logging.getLogger("codex_brain.ai")
        
        # Add sensitive data filter
        self.logger.addFilter(SensitiveDataFilter())
        
        # Set log level from environment or default to INFO
        self.logger.setLevel(logging.INFO)
    
    def _sanitize_input(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove sensitive data from log entry.
        
        Args:
            data: Log data dictionary
            
        Returns:
            Sanitized dictionary
        """
        sanitized = data.copy()
        
        # Remove or hash sensitive fields
        sensitive_fields = [
            'code', 'solution', 'test_case', 'test_cases',
            'user_code', 'submission_code', 'expected_output',
            'prompt', 'llm_prompt', 'password', 'token',
            'api_key', 'secret'
        ]
        
        for field in sensitive_fields:
            if field in sanitized:
                if field == 'code' or field.endswith('_code'):
                    # Keep only length info for code
                    sanitized[field] = f"<redacted:{len(str(sanitized[field]))} chars>"
                else:
                    sanitized[field] = "<redacted>"
        
        # Hash user ID if present
        if 'user_id' in sanitized:
            sanitized['user_id_hash'] = hash_user_id(sanitized['user_id'])
            del sanitized['user_id']
        
        return sanitized
    
    def log_request(
        self,
        request_id: str,
        user_id: Optional[str],
        domain: str,
        agent_name: str,
        endpoint: str,
        operation: str,
        **kwargs
    ) -> None:
        """Log AI request start.
        
        Args:
            request_id: Unique request identifier
            user_id: User identifier (will be hashed)
            domain: AI domain (e.g., 'education', 'code_review')
            agent_name: Name of agent handling request
            endpoint: API endpoint called
            operation: Operation being performed
            **kwargs: Additional context (will be sanitized)
        """
        try:
            log_data = {
                'event': 'ai_request_start',
                'request_id': request_id,
                'user_id_hash': hash_user_id(user_id),
                'domain': domain,
                'agent_name': agent_name,
                'endpoint': endpoint,
                'operation': operation,
                'timestamp': datetime.utcnow().isoformat(),
                **self._sanitize_input(kwargs)
            }
            
            self.logger.info(
                f"AI Request Started: {agent_name}/{operation}",
                extra={'structured': json.dumps(log_data)}
            )
        except Exception as e:
            # Never crash on logging error
            self.logger.error(f"Failed to log request: {e}")
    
    def log_response(
        self,
        request_id: str,
        agent_name: str,
        success: bool,
        latency_ms: float,
        failure_reason: Optional[str] = None,
        **kwargs
    ) -> None:
        """Log AI request completion.
        
        Args:
            request_id: Request identifier
            agent_name: Name of agent
            success: Whether request succeeded
            latency_ms: Request duration in milliseconds
            failure_reason: Reason for failure if applicable
            **kwargs: Additional context (will be sanitized)
        """
        try:
            log_data = {
                'event': 'ai_request_complete',
                'request_id': request_id,
                'agent_name': agent_name,
                'success': success,
                'latency_ms': round(latency_ms, 2),
                'timestamp': datetime.utcnow().isoformat(),
                **self._sanitize_input(kwargs)
            }
            
            if not success and failure_reason:
                log_data['failure_reason'] = failure_reason
            
            log_level = logging.INFO if success else logging.WARNING
            self.logger.log(
                log_level,
                f"AI Request {'Completed' if success else 'Failed'}: {agent_name} ({latency_ms:.2f}ms)",
                extra={'structured': json.dumps(log_data)}
            )
        except Exception as e:
            # Never crash on logging error
            self.logger.error(f"Failed to log response: {e}")
    
    def log_error(
        self,
        request_id: str,
        agent_name: str,
        error: Exception,
        context: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log AI error.
        
        Args:
            request_id: Request identifier
            agent_name: Name of agent
            error: Exception that occurred
            context: Additional context (will be sanitized)
        """
        try:
            log_data = {
                'event': 'ai_error',
                'request_id': request_id,
                'agent_name': agent_name,
                'error_type': type(error).__name__,
                'error_message': str(error),
                'timestamp': datetime.utcnow().isoformat(),
            }
            
            if context:
                log_data.update(self._sanitize_input(context))
            
            # Include traceback but limit size
            tb = traceback.format_exc()
            log_data['traceback'] = tb[:1000] if len(tb) > 1000 else tb
            
            self.logger.error(
                f"AI Error: {agent_name} - {type(error).__name__}",
                extra={'structured': json.dumps(log_data)}
            )
        except Exception as e:
            # Never crash on logging error
            self.logger.error(f"Failed to log error: {e}")
    
    def log_metric(
        self,
        metric_name: str,
        value: float,
        tags: Optional[Dict[str, str]] = None
    ) -> None:
        """Log a metric value.
        
        Args:
            metric_name: Name of metric
            value: Metric value
            tags: Optional tags for metric
        """
        try:
            log_data = {
                'event': 'ai_metric',
                'metric_name': metric_name,
                'value': value,
                'timestamp': datetime.utcnow().isoformat(),
            }
            
            if tags:
                log_data['tags'] = tags
            
            self.logger.info(
                f"Metric: {metric_name}={value}",
                extra={'structured': json.dumps(log_data)}
            )
        except Exception as e:
            # Never crash on logging error
            self.logger.error(f"Failed to log metric: {e}")


# Global logger instance
_ai_logger = AILogger()


@contextmanager
def log_ai_request(
    user_id: Optional[str],
    domain: str,
    agent_name: str,
    endpoint: str,
    operation: str,
    **context
):
    """Context manager for logging AI requests.
    
    Automatically logs request start, completion, and errors.
    Tracks latency and handles exceptions gracefully.
    
    Usage:
        with log_ai_request(
            user_id="user123",
            domain="education",
            agent_name="hint_agent",
            endpoint="/api/v1/ai/hints",
            operation="generate_hint",
            problem_id="two-sum"
        ) as request_id:
            # Perform AI operation
            result = agent.process()
    
    Args:
        user_id: User identifier (will be hashed)
        domain: AI domain
        agent_name: Agent name
        endpoint: API endpoint
        operation: Operation name
        **context: Additional context
        
    Yields:
        request_id: Unique request identifier
    """
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    # Log request start
    _ai_logger.log_request(
        request_id=request_id,
        user_id=user_id,
        domain=domain,
        agent_name=agent_name,
        endpoint=endpoint,
        operation=operation,
        **context
    )
    
    success = True
    failure_reason = None
    
    try:
        yield request_id
    except Exception as e:
        success = False
        failure_reason = f"{type(e).__name__}: {str(e)}"
        
        # Log error
        _ai_logger.log_error(
            request_id=request_id,
            agent_name=agent_name,
            error=e,
            context=context
        )
        
        # Re-raise to not swallow exceptions
        raise
    finally:
        # Always log completion
        latency_ms = (time.time() - start_time) * 1000
        
        _ai_logger.log_response(
            request_id=request_id,
            agent_name=agent_name,
            success=success,
            latency_ms=latency_ms,
            failure_reason=failure_reason,
            domain=domain,
            endpoint=endpoint,
            operation=operation
        )


def get_logger() -> AILogger:
    """Get the global AI logger instance."""
    return _ai_logger
