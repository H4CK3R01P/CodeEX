"""
Submission Model

Represents a user's code submission to be graded.
Contains source code, metadata, and current grading status.
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class SubmissionStatus(str, Enum):
    """Current status of a submission in the grading pipeline"""
    QUEUED = "QUEUED"          # Waiting in queue
    GRADING = "GRADING"        # Being graded by worker
    COMPLETED = "COMPLETED"    # Grading finished
    ERROR = "ERROR"            # System error during grading


class Submission(BaseModel):
    """
    Submission data model.
    
    Represents a complete code submission with all metadata needed for grading.
    """
    
    # Identity
    submission_id: str = Field(
        ...,
        description="Unique submission identifier",
        examples=["sub_abc123xyz"]
    )
    
    problem_id: str = Field(
        ...,
        description="Problem identifier being solved",
        examples=["two-sum", "binary-search"]
    )
    
    user_id: str = Field(
        ...,
        description="User who submitted the code",
        examples=["user_123"]
    )
    
    # Code
    language: str = Field(
        ...,
        description="Programming language",
        examples=["python", "cpp", "java"]
    )
    
    source_code: str = Field(
        ...,
        description="Raw source code submitted by user",
        min_length=1,
        max_length=100_000  # 100KB limit
    )
    
    # Status
    status: SubmissionStatus = Field(
        default=SubmissionStatus.QUEUED,
        description="Current grading status"
    )
    
    # Grading Results (populated after grading)
    verdict: Optional[str] = Field(
        default=None,
        description="Final verdict (AC, WA, TLE, MLE, CE, RE)"
    )
    
    passed_tests: int = Field(
        default=0,
        description="Number of test cases passed",
        ge=0
    )
    
    total_tests: int = Field(
        default=0,
        description="Total number of test cases",
        ge=0
    )
    
    runtime_ms: Optional[int] = Field(
        default=None,
        description="Maximum runtime across all test cases (milliseconds)",
        ge=0
    )
    
    memory_kb: Optional[int] = Field(
        default=None,
        description="Maximum memory usage across all test cases (kilobytes)",
        ge=0
    )
    
    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When submission was received"
    )
    
    graded_at: Optional[datetime] = Field(
        default=None,
        description="When grading completed"
    )
    
    # Error handling
    error_message: Optional[str] = Field(
        default=None,
        description="Error details if status is ERROR",
        max_length=10_000
    )
    
    # Metadata
    metadata: dict = Field(
        default_factory=dict,
        description="Additional submission metadata (IP, user agent, etc.)"
    )
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v: str) -> str:
        """Ensure language is supported"""
        allowed = ['python', 'cpp', 'java']  # Phase 1 & 2
        if v not in allowed:
            raise ValueError(f"Language '{v}' not supported. Allowed: {allowed}")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "submission_id": "sub_abc123xyz",
                "problem_id": "two-sum",
                "user_id": "user_123",
                "language": "python",
                "source_code": "def two_sum(nums, target):\n    # solution\n    pass",
                "status": "COMPLETED",
                "verdict": "AC",
                "passed_tests": 3,
                "total_tests": 3,
                "runtime_ms": 45,
                "memory_kb": 8192,
                "created_at": "2025-08-15T10:30:00Z",
                "graded_at": "2025-08-15T10:30:05Z"
            }
        }
