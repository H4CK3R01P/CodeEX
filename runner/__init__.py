"""
CodeEX Auto-Grader Runner Module

Local and Docker-based execution engines.
"""

from .local_executor import LocalExecutor, CompilationResult
from .docker_executor import DockerExecutor

__all__ = ["LocalExecutor", "CompilationResult", "DockerExecutor"]
