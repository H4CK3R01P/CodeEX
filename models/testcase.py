"""
TestCase Model

Represents a single test case for a problem.
Defines input, expected output, and resource limits.
"""

from typing import Optional
from pydantic import BaseModel, Field


class TestCase(BaseModel):
    """
    Test case data model.
    
    Defines a single test case with input/output and execution limits.
    """
    
    # Identity
    testcase_id: str = Field(
        ...,
        description="Unique test case identifier",
        examples=["test_1", "test_2_hidden"]
    )
    
    problem_id: str = Field(
        ...,
        description="Problem this test case belongs to",
        examples=["two-sum"]
    )
    
    # Test Data
    input_data: str = Field(
        ...,
        description="Input data for the test case",
        examples=["4\n2 7 11 15\n9"]
    )
    
    expected_output: str = Field(
        ...,
        description="Expected output for the test case",
        examples=["0 1"]
    )
    
    # Visibility
    is_sample: bool = Field(
        default=False,
        description="Is this a sample test case (shown to user)?"
    )
    
    is_hidden: bool = Field(
        default=True,
        description="Is this test case hidden from user?"
    )
    
    # Resource Limits
    time_limit_ms: int = Field(
        ...,
        description="Time limit for this test case (milliseconds)",
        gt=0,
        examples=[2000, 5000]
    )
    
    memory_limit_kb: int = Field(
        ...,
        description="Memory limit for this test case (kilobytes)",
        gt=0,
        examples=[262144]  # 256MB
    )
    
    # Scoring (for partial credit problems)
    points: int = Field(
        default=1,
        description="Points awarded for passing this test case",
        ge=0
    )
    
    # Metadata
    explanation: Optional[str] = Field(
        default=None,
        description="Explanation of the test case (for educational purposes)",
        max_length=1000
    )
    
    metadata: dict = Field(
        default_factory=dict,
        description="Additional test case metadata"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "testcase_id": "test_1",
                "problem_id": "two-sum",
                "input_data": "4\n2 7 11 15\n9",
                "expected_output": "0 1",
                "is_sample": True,
                "is_hidden": False,
                "time_limit_ms": 2000,
                "memory_limit_kb": 262144,
                "points": 1,
                "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
            }
        }
