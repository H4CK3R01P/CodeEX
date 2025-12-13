"""
ExecutionResult Model

Represents the outcome of executing code against a single test case.
Captures runtime metrics, output, and verdict.
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class Verdict(str, Enum):
    """Possible verdicts for code execution"""
    AC = "AC"      # Accepted
    WA = "WA"      # Wrong Answer
    TLE = "TLE"    # Time Limit Exceeded
    MLE = "MLE"    # Memory Limit Exceeded
    CE = "CE"      # Compilation Error
    RE = "RE"      # Runtime Error


class ExecutionResult(BaseModel):
    """
    Execution result data model.
    
    Captures the complete outcome of running code against one test case.
    """
    
    # Reference
    testcase_id: str = Field(
        ...,
        description="Which test case was executed",
        examples=["test_1"]
    )
    
    # Verdict
    verdict: Verdict = Field(
        ...,
        description="Execution verdict for this test case"
    )
    
    # Runtime Metrics
    runtime_ms: int = Field(
        ...,
        description="Actual execution time (milliseconds)",
        ge=0
    )
    
    memory_kb: int = Field(
        ...,
        description="Peak memory usage (kilobytes)",
        ge=0
    )
    
    # Process Information
    exit_code: int = Field(
        ...,
        description="Process exit code (0 = success, non-zero = error)"
    )
    
    # Output Capture
    stdout: str = Field(
        default="",
        description="Standard output from the program",
        max_length=10_000_000  # 10MB limit
    )
    
    stderr: str = Field(
        default="",
        description="Standard error output from the program",
        max_length=1_000_000  # 1MB limit
    )
    
    # Execution Flags
    timed_out: bool = Field(
        default=False,
        description="Did execution exceed time limit?"
    )
    
    oom_killed: bool = Field(
        default=False,
        description="Was process killed due to out-of-memory?"
    )
    
    # Output Comparison (for WA cases)
    expected_output: Optional[str] = Field(
        default=None,
        description="Expected output (stored for WA verdict analysis)",
        max_length=10_000_000
    )
    
    actual_output: Optional[str] = Field(
        default=None,
        description="Actual output produced (for WA verdict analysis)",
        max_length=10_000_000
    )
    
    # Error Details
    error_message: Optional[str] = Field(
        default=None,
        description="Detailed error message (for CE/RE verdicts)",
        max_length=10_000
    )
    
    # Metadata
    metadata: dict = Field(
        default_factory=dict,
        description="Additional execution metadata (signal, container ID, etc.)"
    )
    
    class Config:
        json_schema_extra = {
            "example_ac": {
                "testcase_id": "test_1",
                "verdict": "AC",
                "runtime_ms": 45,
                "memory_kb": 8192,
                "exit_code": 0,
                "stdout": "0 1\n",
                "stderr": "",
                "timed_out": False,
                "oom_killed": False
            },
            "example_wa": {
                "testcase_id": "test_3",
                "verdict": "WA",
                "runtime_ms": 52,
                "memory_kb": 9216,
                "exit_code": 0,
                "stdout": "2 3\n",
                "stderr": "",
                "timed_out": False,
                "oom_killed": False,
                "expected_output": "0 1\n",
                "actual_output": "2 3\n"
            },
            "example_tle": {
                "testcase_id": "test_2",
                "verdict": "TLE",
                "runtime_ms": 2001,
                "memory_kb": 12288,
                "exit_code": -1,
                "stdout": "",
                "stderr": "",
                "timed_out": True,
                "oom_killed": False
            },
            "example_re": {
                "testcase_id": "test_4",
                "verdict": "RE",
                "runtime_ms": 15,
                "memory_kb": 5120,
                "exit_code": 139,
                "stdout": "",
                "stderr": "Segmentation fault (core dumped)\n",
                "timed_out": False,
                "oom_killed": False,
                "error_message": "SIGSEGV: Invalid memory access"
            }
        }
