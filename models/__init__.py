"""
CodeEX Auto-Grader Data Models

Core data structures for the grading system.
All models are Pydantic V2 for validation and serialization.
"""

from .submission import Submission, SubmissionStatus
from .testcase import TestCase
from .result import ExecutionResult, Verdict
from .verdict import VerdictReport

__all__ = [
    "Submission",
    "SubmissionStatus",
    "TestCase",
    "ExecutionResult",
    "Verdict",
    "VerdictReport",
]
