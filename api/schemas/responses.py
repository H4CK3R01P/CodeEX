"""
API Response Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class SubmissionStatus(str, Enum):
    QUEUED = "QUEUED"
    GRADING = "GRADING"
    COMPLETED = "COMPLETED"
    ERROR = "ERROR"


class SubmissionResponse(BaseModel):
    """Response after submitting code"""
    submission_id: str
    status: SubmissionStatus
    message: str
    submitted_at: datetime
    estimated_completion_seconds: int = 5
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "submission_id": "sub_abc123xyz",
                "status": "QUEUED",
                "message": "Submission accepted",
                "submitted_at": "2025-08-15T10:30:00Z",
                "estimated_completion_seconds": 5
            }
        }
    }


class VerdictResponse(BaseModel):
    """Response with grading verdict"""
    submission_id: str
    status: str
    verdict: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    graded_at: Optional[datetime] = None
    language: Optional[str] = None
    problem_id: Optional[str] = None


class FeedbackResponse(BaseModel):
    """Response with educational feedback"""
    submission_id: str
    status: str
    verdict: Optional[str] = None
    feedback: Optional[Dict[str, Any]] = None
    version: str = "v1"
    generated_at: Optional[datetime] = None
    ai_enabled: bool = False


class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    message: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
