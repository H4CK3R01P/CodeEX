"""
VerdictReport Model

Aggregates execution results to produce a final grading verdict.
Contains summary statistics and detailed per-test results.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from .result import ExecutionResult, Verdict


class VerdictReport(BaseModel):
    """
    Verdict report data model.
    
    Final grading report aggregating all test case execution results.
    """
    
    # Reference
    submission_id: str = Field(
        ...,
        description="Submission being reported on",
        examples=["sub_abc123xyz"]
    )
    
    problem_id: str = Field(
        ...,
        description="Problem that was attempted",
        examples=["two-sum"]
    )
    
    # Final Verdict
    final_verdict: Verdict = Field(
        ...,
        description="Overall verdict (highest priority failure or AC)"
    )
    
    # Test Summary
    passed_tests: int = Field(
        ...,
        description="Number of test cases passed",
        ge=0
    )
    
    total_tests: int = Field(
        ...,
        description="Total test cases executed",
        ge=0
    )
    
    # Performance Metrics
    max_runtime_ms: int = Field(
        ...,
        description="Maximum runtime across all test cases",
        ge=0
    )
    
    max_memory_kb: int = Field(
        ...,
        description="Maximum memory usage across all test cases",
        ge=0
    )
    
    # Failure Information
    first_failed_test: Optional[str] = Field(
        default=None,
        description="ID of the first test case that failed (if any)",
        examples=["test_3"]
    )
    
    # Compilation (if applicable)
    compilation_time_ms: Optional[int] = Field(
        default=None,
        description="Time taken to compile (for compiled languages)",
        ge=0
    )
    
    compilation_error: Optional[str] = Field(
        default=None,
        description="Compilation error message (if CE verdict)",
        max_length=10_000
    )
    
    # Detailed Results
    testcase_results: List[ExecutionResult] = Field(
        default_factory=list,
        description="Detailed execution result for each test case"
    )
    
    # Timestamps
    graded_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When grading completed"
    )
    
    grading_duration_ms: int = Field(
        ...,
        description="Total time spent grading (including queue wait)",
        ge=0
    )
    
    # Language Info
    language: str = Field(
        ...,
        description="Programming language used",
        examples=["python", "cpp"]
    )
    
    # Metadata
    metadata: dict = Field(
        default_factory=dict,
        description="Additional grading metadata (worker ID, retry count, etc.)"
    )
    
    # Scoring (for partial credit)
    score: Optional[float] = Field(
        default=None,
        description="Score achieved (if partial credit enabled)",
        ge=0.0,
        le=100.0
    )
    
    class Config:
        json_schema_extra = {
            "example_ac": {
                "submission_id": "sub_abc123xyz",
                "problem_id": "two-sum",
                "final_verdict": "AC",
                "passed_tests": 3,
                "total_tests": 3,
                "max_runtime_ms": 52,
                "max_memory_kb": 9216,
                "first_failed_test": None,
                "testcase_results": [
                    {
                        "testcase_id": "test_1",
                        "verdict": "AC",
                        "runtime_ms": 45,
                        "memory_kb": 8192,
                        "exit_code": 0
                    },
                    {
                        "testcase_id": "test_2",
                        "verdict": "AC",
                        "runtime_ms": 52,
                        "memory_kb": 9216,
                        "exit_code": 0
                    },
                    {
                        "testcase_id": "test_3",
                        "verdict": "AC",
                        "runtime_ms": 48,
                        "memory_kb": 8704,
                        "exit_code": 0
                    }
                ],
                "graded_at": "2025-08-15T10:30:05Z",
                "grading_duration_ms": 5234,
                "language": "python"
            },
            "example_wa": {
                "submission_id": "sub_xyz789abc",
                "problem_id": "two-sum",
                "final_verdict": "WA",
                "passed_tests": 2,
                "total_tests": 3,
                "max_runtime_ms": 78,
                "max_memory_kb": 12800,
                "first_failed_test": "test_3",
                "testcase_results": [
                    {
                        "testcase_id": "test_1",
                        "verdict": "AC",
                        "runtime_ms": 45,
                        "memory_kb": 8192,
                        "exit_code": 0
                    },
                    {
                        "testcase_id": "test_2",
                        "verdict": "AC",
                        "runtime_ms": 52,
                        "memory_kb": 9216,
                        "exit_code": 0
                    },
                    {
                        "testcase_id": "test_3",
                        "verdict": "WA",
                        "runtime_ms": 78,
                        "memory_kb": 12800,
                        "exit_code": 0,
                        "expected_output": "3\n",
                        "actual_output": "2\n"
                    }
                ],
                "graded_at": "2025-08-15T10:32:18Z",
                "grading_duration_ms": 4987,
                "language": "python"
            }
        }
