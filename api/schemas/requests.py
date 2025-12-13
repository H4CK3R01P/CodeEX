"""
API Request Schemas
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class SubmissionRequest(BaseModel):
    """Request to submit code for grading"""
    
    problem_id: str = Field(
        ...,
        description="Problem identifier",
        examples=["two-sum"]
    )
    
    language: str = Field(
        ...,
        description="Programming language",
        examples=["python"]
    )
    
    source_code: str = Field(
        ...,
        description="Source code to grade",
        min_length=1,
        max_length=100_000
    )
    
    user_id: Optional[str] = Field(
        None,
        description="User identifier (optional)"
    )
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v):
        allowed = ['python', 'cpp', 'java']
        if v not in allowed:
            raise ValueError(f"Language must be one of {allowed}")
        return v
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "problem_id": "two-sum",
                "language": "python",
                "source_code": "def two_sum(nums, target):\n    pass",
                "user_id": "user_123"
            }
        }
    }
