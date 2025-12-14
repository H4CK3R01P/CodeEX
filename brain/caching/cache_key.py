"""Cache key generation for AI responses.

RULES:
- Keys must be domain-aware
- User-specific content must not leak between users
- Hash must be stable and deterministic
- No sensitive data in keys
"""

import hashlib
import json
from typing import Any, Dict, Optional


def generate_cache_key(
    domain: str,
    agent: str,
    intent: str,
    inputs: Dict[str, Any],
    user_context: Optional[Dict[str, Any]] = None
) -> str:
    """Generate stable cache key for AI response.
    
    Key format: hash(domain + agent + intent + inputs + user_context)
    
    Args:
        domain: AI domain (e.g., 'education', 'code_review')
        agent: Agent name (e.g., 'hint_agent', 'teacher_agent')
        intent: Operation intent (e.g., 'generate_hint', 'explain_concept')
        inputs: Input parameters (sanitized)
        user_context: Optional user-specific context (for personalized content)
        
    Returns:
        Stable SHA256 hash as cache key
    """
    # Build cache key components
    key_components = {
        'domain': domain,
        'agent': agent,
        'intent': intent,
        'inputs': _sanitize_inputs(inputs),
    }
    
    # Add user context if provided (for personalized content)
    if user_context:
        key_components['user_context'] = user_context
    
    # Convert to stable JSON string
    # Sort keys to ensure deterministic ordering
    key_string = json.dumps(key_components, sort_keys=True, separators=(',', ':'))
    
    # Generate SHA256 hash
    cache_key = hashlib.sha256(key_string.encode()).hexdigest()
    
    return cache_key


def _sanitize_inputs(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize inputs for cache key generation.
    
    Removes sensitive or variable data that shouldn't affect caching.
    
    Args:
        inputs: Raw input dictionary
        
    Returns:
        Sanitized inputs for cache key
    """
    sanitized = {}
    
    # Keys to exclude from cache key (too variable or sensitive)
    exclude_keys = {
        'request_id', 'timestamp', 'user_id',
        'session_id', 'api_key', 'token',
        'code',  # User code is too variable, exclude from key
    }
    
    for key, value in inputs.items():
        # Skip excluded keys
        if key in exclude_keys:
            continue
        
        # Include in cache key
        sanitized[key] = value
    
    return sanitized


def is_cacheable_request(
    endpoint: str,
    inputs: Dict[str, Any]
) -> bool:
    """Check if request is cacheable.
    
    Some requests should never be cached:
    - User-specific code reviews
    - Requests with user code
    - Personalized content
    
    Args:
        endpoint: Endpoint name
        inputs: Request inputs
        
    Returns:
        True if request can be cached
    """
    # Never cache solution reviews (user-specific)
    if endpoint == 'review-solution':
        return False
    
    # Don't cache if contains user code
    if 'code' in inputs or 'user_code' in inputs:
        return False
    
    # Don't cache if user-specific
    if 'user_specific' in inputs and inputs['user_specific']:
        return False
    
    return True
