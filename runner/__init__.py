"""
CodeEX Auto-Grader Runner Module

Local execution engine for running code submissions.
"""

from .local_executor import LocalExecutor, CompilationResult

__all__ = ["LocalExecutor", "CompilationResult"]
