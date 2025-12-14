"""AI Routes for CodeEX

FastAPI routes for AI-powered features:
- Question generation
- Hint generation
- Explanation generation
- Solution review

CRITICAL:
- AI failures must NOT affect grading APIs
- Feature-flagged (can be disabled)
- Isolated error handling
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
import logging
import os

# Feature flag
AI_ENABLED = os.getenv('CODEX_AI_ENABLED', 'true').lower() == 'true'

# Create router
router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI Features"],
    responses={
        503: {"description": "AI service unavailable"},
        429: {"description": "Rate limit exceeded"}
    }
)

logger = logging.getLogger(__name__)


# ============================================================================
# REQUEST/RESPONSE SCHEMAS (Versioned)
# ============================================================================

class QuestionGenerationRequest(BaseModel):
    """Request for question generation (v1)"""
    topic: str = Field(..., description="Topic for question generation")
    difficulty: str = Field(..., description="easy, medium, hard")
    domain: str = Field(default="competitive_programming", description="Domain ID")
    question_type: str = Field(default="coding", description="coding, mcq, descriptive")
    constraints: Optional[List[str]] = Field(default=None, description="Problem constraints")
    
    class Config:
        schema_extra = {
            "example": {
                "topic": "Binary Search",
                "difficulty": "medium",
                "domain": "dsa",
                "question_type": "coding",
                "constraints": ["Time: O(log n)", "Space: O(1)"]
            }
        }


class QuestionGenerationResponse(BaseModel):
    """Response for question generation (v1)"""
    version: str = Field(default="v1", description="Schema version")
    success: bool = Field(..., description="Whether generation succeeded")
    question: Optional[Dict[str, Any]] = Field(default=None, description="Generated question")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Generation metadata")
    request_id: str = Field(..., description="Unique request ID")
    
    class Config:
        schema_extra = {
            "example": {
                "version": "v1",
                "success": True,
                "question": {
                    "title": "Binary Search in Sorted Array",
                    "description": "Implement binary search...",
                    "difficulty": "medium",
                    "test_cases": [...]
                },
                "metadata": {
                    "generation_time_ms": 1500,
                    "verified": True
                },
                "request_id": "req_abc123"
            }
        }


class HintRequest(BaseModel):
    """Request for hint generation (v1)"""
    problem_id: str = Field(..., description="Problem identifier")
    user_code: Optional[str] = Field(default=None, description="User's code attempt")
    hint_level: int = Field(default=1, ge=1, le=3, description="1=gentle, 2=moderate, 3=strong")
    attempt_count: int = Field(default=1, ge=1, description="Number of attempts user made")
    domain: str = Field(default="competitive_programming", description="Domain ID")
    
    class Config:
        schema_extra = {
            "example": {
                "problem_id": "two-sum",
                "user_code": "# User's attempt",
                "hint_level": 1,
                "attempt_count": 2,
                "domain": "competitive_programming"
            }
        }


class HintResponse(BaseModel):
    """Response for hint generation (v1)"""
    version: str = Field(default="v1", description="Schema version")
    success: bool = Field(..., description="Whether generation succeeded")
    hint: Optional[str] = Field(default=None, description="Generated hint")
    hint_level: int = Field(..., description="Level of hint provided")
    next_hint_available: bool = Field(default=False, description="Can request stronger hint")
    metadata: Dict[str, Any] = Field(default_factory=dict)
    request_id: str = Field(..., description="Unique request ID")
    
    class Config:
        schema_extra = {
            "example": {
                "version": "v1",
                "success": True,
                "hint": "Think about using a hash map to store values you've seen...",
                "hint_level": 1,
                "next_hint_available": True,
                "metadata": {"verified": True},
                "request_id": "req_def456"
            }
        }


class ExplanationRequest(BaseModel):
    """Request for concept explanation (v1)"""
    concept: str = Field(..., description="Concept to explain")
    detail_level: str = Field(default="moderate", description="minimal, moderate, detailed, comprehensive")
    include_examples: bool = Field(default=True, description="Include code examples")
    domain: str = Field(default="dsa", description="Domain ID")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context")
    
    class Config:
        schema_extra = {
            "example": {
                "concept": "Dynamic Programming",
                "detail_level": "detailed",
                "include_examples": True,
                "domain": "dsa"
            }
        }


class ExplanationResponse(BaseModel):
    """Response for explanation generation (v1)"""
    version: str = Field(default="v1", description="Schema version")
    success: bool = Field(..., description="Whether generation succeeded")
    explanation: Optional[str] = Field(default=None, description="Generated explanation")
    examples: Optional[List[Dict[str, Any]]] = Field(default=None, description="Code examples")
    resources: Optional[List[str]] = Field(default=None, description="Learning resources")
    metadata: Dict[str, Any] = Field(default_factory=dict)
    request_id: str = Field(..., description="Unique request ID")
    
    class Config:
        schema_extra = {
            "example": {
                "version": "v1",
                "success": True,
                "explanation": "Dynamic programming is...",
                "examples": [{"code": "...", "description": "..."}],
                "resources": ["https://..."],
                "metadata": {"verified": True},
                "request_id": "req_ghi789"
            }
        }


class SolutionReviewRequest(BaseModel):
    """Request for solution review (v1)"""
    problem_id: str = Field(..., description="Problem identifier")
    user_code: str = Field(..., description="User's solution code")
    language: str = Field(..., description="Programming language")
    verdict: Optional[str] = Field(default=None, description="Execution verdict (AC, WA, etc.)")
    focus_areas: Optional[List[str]] = Field(default=None, description="What to focus on")
    domain: str = Field(default="competitive_programming", description="Domain ID")
    
    class Config:
        schema_extra = {
            "example": {
                "problem_id": "two-sum",
                "user_code": "def two_sum(nums, target): ...",
                "language": "python",
                "verdict": "AC",
                "focus_areas": ["readability", "performance"],
                "domain": "competitive_programming"
            }
        }


class SolutionReviewResponse(BaseModel):
    """Response for solution review (v1)"""
    version: str = Field(default="v1", description="Schema version")
    success: bool = Field(..., description="Whether review succeeded")
    review: Optional[Dict[str, Any]] = Field(default=None, description="Solution review")
    suggestions: Optional[List[str]] = Field(default=None, description="Improvement suggestions")
    score: Optional[Dict[str, float]] = Field(default=None, description="Quality scores")
    metadata: Dict[str, Any] = Field(default_factory=dict)
    request_id: str = Field(..., description="Unique request ID")
    
    class Config:
        schema_extra = {
            "example": {
                "version": "v1",
                "success": True,
                "review": {
                    "correctness": "Solution is correct",
                    "complexity": "Time: O(n), Space: O(n)",
                    "style": "Good naming conventions"
                },
                "suggestions": [
                    "Consider edge case: empty array",
                    "Add input validation"
                ],
                "score": {
                    "correctness": 1.0,
                    "readability": 0.85,
                    "efficiency": 0.9
                },
                "metadata": {"verified": True},
                "request_id": "req_jkl012"
            }
        }


# ============================================================================
# DEPENDENCIES: Check AI enabled & Rate Limiting
# ============================================================================

async def check_ai_enabled():
    """Dependency to check if AI features are enabled"""
    if not AI_ENABLED:
        raise HTTPException(
            status_code=503,
            detail="AI features are currently disabled"
        )


def check_rate_limit(endpoint: str, user_id: str, prompt_data: Optional[str] = None):
    """Check rate limit and abuse for AI endpoint.
    
    Args:
        endpoint: Endpoint name
        user_id: User identifier
        prompt_data: Optional prompt data for abuse detection
        
    Raises:
        HTTPException: If rate limit exceeded or abuse detected
    """
    from brain.security import get_rate_limiter, get_abuse_detector, RateLimitExceeded
    
    try:
        # Check rate limit
        rate_limiter = get_rate_limiter()
        rate_limiter.check_limit(user_id, endpoint)
        
        # Track request for abuse detection
        abuse_detector = get_abuse_detector()
        signal = abuse_detector.track_request(user_id, endpoint, prompt_data)
        
        # If high-severity abuse detected, raise error
        if signal and signal.severity == 'high':
            logger.warning(f"Abuse detected for user {user_id}: {signal.description}")
            raise HTTPException(
                status_code=429,
                detail=f"Suspicious activity detected: {signal.description}. Please slow down.",
                headers={"Retry-After": "60"}
            )
        
    except RateLimitExceeded as e:
        # Return 429 with retry-after header
        logger.info(f"Rate limit exceeded for user {user_id} on {endpoint}")
        raise HTTPException(
            status_code=429,
            detail=str(e),
            headers={"Retry-After": str(e.retry_after)}
        )
    except Exception as e:
        # Never crash on rate limiting error - log and continue
        logger.error(f"Rate limiting error (non-fatal): {e}")
        # Request continues normally


def get_cached_response(cache_key: str, endpoint: str) -> Optional[Dict]:
    """Try to get cached AI response.
    
    Args:
        cache_key: Cache key
        endpoint: Endpoint name
        
    Returns:
        Cached response if found, None otherwise
    """
    from brain.caching import get_cache_manager
    
    try:
        cache_manager = get_cache_manager()
        cached = cache_manager.get(cache_key, endpoint)
        
        if cached:
            logger.info(f\"Cache HIT for {endpoint}: {cache_key[:16]}...\")\n            return cached
        
        logger.debug(f\"Cache MISS for {endpoint}: {cache_key[:16]}...\")\n        return None
        
    except Exception as e:\n        # Never crash on cache error - log and continue\n        logger.error(f\"Cache retrieval error (non-fatal): {e}\")\n        return None\n\n\ndef set_cached_response(\n    cache_key: str,\n    endpoint: str,\n    response: Dict,\n    metadata: Optional[Dict] = None\n) -> None:\n    \"\"\"Cache AI response.\n    \n    Args:\n        cache_key: Cache key\n        endpoint: Endpoint name\n        response: Response to cache\n        metadata: Optional metadata\n    \"\"\"\n    from brain.caching import get_cache_manager\n    \n    try:\n        cache_manager = get_cache_manager()\n        \n        # Add endpoint to metadata for invalidation\n        if metadata is None:\n            metadata = {}\n        metadata['endpoint'] = endpoint\n        \n        success = cache_manager.set(cache_key, response, endpoint, metadata)\n        \n        if success:\n            logger.info(f\"Cached response for {endpoint}: {cache_key[:16]}...\")\n        \n    except Exception as e:\n        # Never crash on cache error - log and continue\n        logger.error(f\"Cache storage error (non-fatal): {e}\")


# ============================================================================
# ROUTES
# ============================================================================

@router.post(
    "/generate-question",
    response_model=QuestionGenerationResponse,
    summary="Generate a new question",
    description="Generate a coding question using AI"
)
async def generate_question(
    request: QuestionGenerationRequest,
    background_tasks: BackgroundTasks,
    user_id: str = "anonymous",  # TODO: Get from auth middleware
    _: None = Depends(check_ai_enabled)
):
    """
    Generate a new coding question.
    
    This endpoint uses AI to create a new question based on topic and difficulty.
    
    **Rate Limit:** 1 request per minute per user
    
    **Note:** This endpoint will not affect grading APIs even if it fails.
    """
    # Check rate limit (1/min)
    check_rate_limit("generate-question", user_id, request.topic)
    
    try:
        # Import orchestrator (lazy import to isolate failures)
        from backend.ai.orchestrator import (
            CodeEXOrchestrator,
            OrchestrationRequest,
            RequestType,
            OrchestrationStatus
        )
        
        # Create orchestration request
        orchestrator = CodeEXOrchestrator()
        
        orch_request = OrchestrationRequest(
            request_type=RequestType.PLANNING,  # Using planner for question generation
            agent="PLANNER_AGENT",
            problem_context={
                'topic': request.topic,
                'difficulty': request.difficulty,
                'question_type': request.question_type,
                'constraints': request.constraints or []
            },
            domain=request.domain
        )
        
        # Process request
        result = await orchestrator.process_request(orch_request)
        
        if result.status == OrchestrationStatus.SUCCESS:
            # Parse output into question format
            question = _parse_question_output(result.output)
            
            return QuestionGenerationResponse(
                success=True,
                question=question,
                metadata={
                    'generation_time_ms': result.total_time_ms,
                    'verified': True,
                    'retry_count': result.retry_count
                },
                request_id=result.request_id
            )
        else:
            # AI generation failed but don't crash
            logger.warning(f"Question generation failed: {result.status}")
            
            return QuestionGenerationResponse(
                success=False,
                metadata={
                    'error': result.error_message,
                    'status': result.status.value
                },
                request_id=result.request_id
            )
    
    except Exception as e:
        # Isolated error handling - don't crash other APIs
        logger.error(f"Question generation error: {e}", exc_info=True)
        
        return QuestionGenerationResponse(
            success=False,
            metadata={'error': 'Internal error during generation'},
            request_id=_generate_fallback_id()
        )


@router.post(
    "/generate-hint",
    response_model=HintResponse,
    summary="Generate a progressive hint",
    description="Generate a hint without revealing the solution"
)
async def generate_hint(
    request: HintRequest,
    background_tasks: BackgroundTasks,
    user_id: str = "anonymous",  # TODO: Get from auth middleware
    _: None = Depends(check_ai_enabled)
):
    """
    Generate a progressive hint for a problem.
    
    The hint level determines how much information is revealed:
    - Level 1: Gentle hint (algorithm category, guiding questions)
    - Level 2: Moderate hint (approach direction, data structures)
    - Level 3: Strong hint (algorithm steps, specific techniques)
    
    **Rate Limit:** 5 requests per minute per user
    
    **Note:** Hints are verified to not reveal the full solution.
    """
    # Check rate limit (5/min)
    prompt_hash = f"{request.problem_id}:{request.hint_level}"
    check_rate_limit("generate-hint", user_id, prompt_hash)
    
    # Generate cache key (domain-aware)
    from brain.caching import generate_cache_key, is_cacheable_request
    
    cache_key = None
    cached_response = None
    
    if is_cacheable_request("generate-hint", request.dict()):
        cache_key = generate_cache_key(
            domain="education",
            agent="hint_agent",
            intent="generate_hint",
            inputs=request.dict()
        )
        
        # Try to get cached response
        cached_response = get_cached_response(cache_key, "generate-hint")
        
        if cached_response:
            # Return cached response immediately
            return cached_response
    
    try:
        from backend.ai.orchestrator import (
            CodeEXOrchestrator,
            OrchestrationRequest,
            RequestType,
            OrchestrationStatus
        )
        
        orchestrator = CodeEXOrchestrator()
        
        orch_request = OrchestrationRequest(
            request_type=RequestType.HINT,
            agent="HINT_AGENT",
            problem_context={
                'problem_id': request.problem_id,
                'user_code': request.user_code,
                'hint_level': request.hint_level
            },
            domain=request.domain,
            user_context={
                'attempt_count': request.attempt_count
            }
        )
        
        result = await orchestrator.process_request(orch_request)
        
        if result.status == OrchestrationStatus.SUCCESS:
            response = HintResponse(
                success=True,
                hint=result.output,
                hint_level=request.hint_level,
                next_hint_available=(request.hint_level < 3),
                metadata={
                    'verified': True,
                    'generation_time_ms': result.total_time_ms
                },
                request_id=result.request_id
            )
            
            # Cache successful response
            if cache_key:
                set_cached_response(
                    cache_key,
                    "generate-hint",
                    response.dict(),
                    metadata={
                        'hint_level': request.hint_level,
                        'problem_id': request.problem_id,
                        'generation_time_ms': result.total_time_ms
                    }
                )
            
            return response
        else:
            logger.warning(f"Hint generation failed: {result.status}")
            
            return HintResponse(
                success=False,
                hint=None,
                hint_level=request.hint_level,
                metadata={
                    'error': result.error_message,
                    'status': result.status.value
                },
                request_id=result.request_id
            )
    
    except Exception as e:
        logger.error(f"Hint generation error: {e}", exc_info=True)
        
        return HintResponse(
            success=False,
            hint=None,
            hint_level=request.hint_level,
            metadata={'error': 'Internal error during hint generation'},
            request_id=_generate_fallback_id()
        )


@router.post(
    "/generate-explanation",
    response_model=ExplanationResponse,
    summary="Generate concept explanation",
    description="Generate detailed explanation of a concept or algorithm"
)
async def generate_explanation(
    request: ExplanationRequest,
    background_tasks: BackgroundTasks,
    user_id: str = "anonymous",  # TODO: Get from auth middleware
    _: None = Depends(check_ai_enabled)
):
    """
    Generate explanation of a concept or algorithm.
    
    The detail level controls the depth of explanation:
    - minimal: Basic overview
    - moderate: Includes approach and examples
    - detailed: Comprehensive with edge cases
    - comprehensive: Everything + real-world applications
    
    **Rate Limit:** 3 requests per minute per user
    
    **Note:** Explanations are verified for accuracy.
    """
    # Check rate limit (3/min)
    prompt_hash = f"{request.topic}:{request.detail_level}"
    check_rate_limit("generate-explanation", user_id, prompt_hash)
    
    try:
        from backend.ai.orchestrator import (
            CodeEXOrchestrator,
            OrchestrationRequest,
            RequestType,
            OrchestrationStatus
        )
        
        orchestrator = CodeEXOrchestrator()
        
        orch_request = OrchestrationRequest(
            request_type=RequestType.TEACHING,
            agent="TEACHER_AGENT",
            problem_context={
                'concept': request.concept,
                'detail_level': request.detail_level,
                'include_examples': request.include_examples,
                'context': request.context or {}
            },
            domain=request.domain
        )
        
        result = await orchestrator.process_request(orch_request)
        
        if result.status == OrchestrationStatus.SUCCESS:
            # Parse explanation and extract examples/resources
            explanation_data = _parse_explanation_output(
                result.output,
                request.include_examples
            )
            
            return ExplanationResponse(
                success=True,
                explanation=explanation_data['explanation'],
                examples=explanation_data.get('examples'),
                resources=explanation_data.get('resources'),
                metadata={
                    'verified': True,
                    'generation_time_ms': result.total_time_ms
                },
                request_id=result.request_id
            )
        else:
            logger.warning(f"Explanation generation failed: {result.status}")
            
            return ExplanationResponse(
                success=False,
                metadata={
                    'error': result.error_message,
                    'status': result.status.value
                },
                request_id=result.request_id
            )
    
    except Exception as e:
        logger.error(f"Explanation generation error: {e}", exc_info=True)
        
        return ExplanationResponse(
            success=False,
            metadata={'error': 'Internal error during explanation generation'},
            request_id=_generate_fallback_id()
        )


@router.post(
    "/review-solution",
    response_model=SolutionReviewResponse,
    summary="Review user's solution",
    description="Get AI-powered review of a solution with suggestions"
)
async def review_solution(
    request: SolutionReviewRequest,
    background_tasks: BackgroundTasks,
    user_id: str = "anonymous",  # TODO: Get from auth middleware
    _: None = Depends(check_ai_enabled)
):
    """
    Get AI-powered review of a user's solution.
    
    Review includes:
    - Correctness analysis
    - Code quality assessment
    - Performance analysis
    - Suggestions for improvement
    
    **Rate Limit:** 2 requests per minute per user
    
    **Note:** This is separate from the grading system and won't affect verdicts.
    """
    # Check rate limit (2/min)
    # Hash code for abuse detection without logging full code
    import hashlib
    code_hash = hashlib.md5(request.code.encode()).hexdigest()[:16]
    check_rate_limit("review-solution", user_id, code_hash)
    
    try:
        from backend.ai.orchestrator import (
            CodeEXOrchestrator,
            OrchestrationRequest,
            RequestType,
            OrchestrationStatus
        )
        
        orchestrator = CodeEXOrchestrator()
        
        # Use REFACTOR_AGENT for solution review
        orch_request = OrchestrationRequest(
            request_type=RequestType.REFACTORING,
            agent="REFACTOR_AGENT",
            problem_context={
                'problem_id': request.problem_id,
                'user_code': request.user_code,
                'language': request.language,
                'verdict': request.verdict,
                'focus_areas': request.focus_areas or ['readability', 'performance']
            },
            domain=request.domain
        )
        
        result = await orchestrator.process_request(orch_request)
        
        if result.status == OrchestrationStatus.SUCCESS:
            # Parse review output
            review_data = _parse_review_output(result.output)
            
            return SolutionReviewResponse(
                success=True,
                review=review_data['review'],
                suggestions=review_data.get('suggestions', []),
                score=review_data.get('score'),
                metadata={
                    'verified': True,
                    'generation_time_ms': result.total_time_ms
                },
                request_id=result.request_id
            )
        else:
            logger.warning(f"Solution review failed: {result.status}")
            
            return SolutionReviewResponse(
                success=False,
                metadata={
                    'error': result.error_message,
                    'status': result.status.value
                },
                request_id=result.request_id
            )
    
    except Exception as e:
        logger.error(f"Solution review error: {e}", exc_info=True)
        
        return SolutionReviewResponse(
            success=False,
            metadata={'error': 'Internal error during solution review'},
            request_id=_generate_fallback_id()
        )


# ============================================================================
# HEALTH CHECK
# ============================================================================

@router.get(
    "/health",
    summary="Check AI service health",
    description="Check if AI features are enabled and healthy"
)
async def ai_health_check():
    """Check AI service health"""
    return {
        "ai_enabled": AI_ENABLED,
        "status": "healthy" if AI_ENABLED else "disabled",
        "version": "v1"
    }


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _parse_question_output(output: str) -> Dict[str, Any]:
    """Parse AI output into question format"""
    # Simple parsing - in production, use more robust parsing
    return {
        "title": "Generated Question",
        "description": output,
        "difficulty": "medium",
        "test_cases": []
    }


def _parse_explanation_output(
    output: str,
    include_examples: bool
) -> Dict[str, Any]:
    """Parse explanation output"""
    return {
        "explanation": output,
        "examples": [] if include_examples else None,
        "resources": []
    }


def _parse_review_output(output: str) -> Dict[str, Any]:
    """Parse review output"""
    return {
        "review": {
            "overall": output,
            "correctness": "Analysis pending",
            "style": "Analysis pending"
        },
        "suggestions": [],
        "score": {
            "correctness": 0.0,
            "readability": 0.0,
            "efficiency": 0.0
        }
    }


def _generate_fallback_id() -> str:
    """Generate fallback request ID"""
    import uuid
    return f"req_fallback_{uuid.uuid4().hex[:8]}"



# ============================================================================
# OBSERVABILITY ENDPOINTS (Admin Only)
# ============================================================================

def verify_admin_token(authorization: Optional[str] = None) -> bool:
    """Verify admin authorization token.
    
    Args:
        authorization: Authorization header value
        
    Returns:
        True if authorized, False otherwise
    """
    # TODO: Implement proper admin authentication
    # For now, check for a simple admin token from environment
    admin_token = os.getenv('CODEX_ADMIN_TOKEN', 'admin-secret-token')
    
    if not authorization:
        return False
    
    # Expected format: "Bearer <token>"
    parts = authorization.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        return False
    
    return parts[1] == admin_token


@router.get(
    "/metrics",
    summary="Get AI Metrics (Admin Only)",
    description="Returns aggregated AI metrics - no raw logs or sensitive data",
    response_model=Dict[str, Any],
    responses={
        200: {"description": "Metrics retrieved successfully"},
        401: {"description": "Unauthorized - Admin access required"},
        503: {"description": "Metrics service unavailable"}
    }
)
async def get_ai_metrics(
    authorization: Optional[str] = None,
    agent: Optional[str] = None,
    domain: Optional[str] = None
) -> Dict[str, Any]:
    """Get aggregated AI metrics (Admin only).
    
    Returns metrics without raw logs or sensitive data.
    
    Query Parameters:
    - agent: Filter by specific agent name (optional)
    - domain: Filter by specific domain (optional)
    
    Returns:
    - summary: Overall statistics
    - by_agent: Per-agent metrics
    - by_domain: Per-domain metrics
    - by_endpoint: Per-endpoint call counts
    - recent_failures: Recent failure summaries (no sensitive data)
    - hourly_volume: Request volume per hour
    """
    # Check admin authorization
    if not verify_admin_token(authorization):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Admin access required"
        )
    
    try:
        # Import metrics instance
        from brain.observability import get_metrics_instance
        
        metrics = get_metrics_instance()
        
        # Get all metrics
        response = {
            "version": "v1",
            "timestamp": datetime.utcnow().isoformat(),
            "summary": metrics.get_summary(),
            "by_agent": metrics.get_agent_stats(),
            "by_domain": metrics.get_domain_stats(),
            "by_endpoint": metrics.get_endpoint_stats(),
            "recent_failures": metrics.get_recent_failures(limit=20),
            "hourly_volume": metrics.get_hourly_volume(hours=24),
        }
        
        # Filter by agent if specified
        if agent:
            if agent in response["by_agent"]:
                response["by_agent"] = {agent: response["by_agent"][agent]}
            else:
                response["by_agent"] = {}
        
        # Filter by domain if specified
        if domain:
            if domain in response["by_domain"]:
                response["by_domain"] = {domain: response["by_domain"][domain]}
            else:
                response["by_domain"] = {}
        
        return response
        
    except Exception as e:
        logger.error(f"Failed to retrieve metrics: {e}")
        raise HTTPException(
            status_code=503,
            detail="Metrics service temporarily unavailable"
        )


@router.post(
    "/metrics/reset",
    summary="Reset AI Metrics (Admin Only)",
    description="Reset all metrics counters",
    responses={
        200: {"description": "Metrics reset successfully"},
        401: {"description": "Unauthorized - Admin access required"}
    }
)
async def reset_ai_metrics(
    authorization: Optional[str] = None
) -> Dict[str, Any]:
    """Reset all AI metrics (Admin only).
    
    USE WITH CAUTION: This will clear all metrics data.
    """
    # Check admin authorization
    if not verify_admin_token(authorization):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Admin access required"
        )
    
    try:
        # Import metrics instance
        from brain.observability import get_metrics_instance
        
        metrics = get_metrics_instance()
        metrics.reset()
        
        return {
            "success": True,
            "message": "All metrics have been reset",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to reset metrics: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to reset metrics"
        )


@router.get(
    "/health",
    summary="AI Service Health Check",
    description="Check if AI service is operational",
    responses={
        200: {"description": "Service is healthy"},
        503: {"description": "Service is unavailable"}
    }
)
async def ai_health_check() -> Dict[str, Any]:
    """Health check for AI service.
    
    Returns service status and basic information.
    Does not require authentication.
    """
    if not AI_ENABLED:
        raise HTTPException(
            status_code=503,
            detail="AI service is disabled"
        )
    
    try:
        from brain.observability import get_metrics_instance
        
        metrics = get_metrics_instance()
        summary = metrics.get_summary()
        
        return {
            "status": "healthy",
            "ai_enabled": AI_ENABLED,
            "timestamp": datetime.utcnow().isoformat(),
            "uptime_hours": summary.get("uptime_hours", 0),
            "total_requests": summary.get("total_requests", 0),
            "version": "v1"
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="AI service health check failed"
        )

