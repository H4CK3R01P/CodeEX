"""
Local Execution Engine

Subprocess-based code execution for Python and C++.
No Docker required - uses native subprocess with timeouts.

Supported Languages:
- Python 3.x
- C++ (g++ compiler)

Features:
- Compilation (C++ only)
- Time-limited execution
- stdout/stderr capture
- Exit code tracking
- Automatic verdict mapping
"""

import os
import subprocess
import time
import tempfile
import shutil
from typing import Optional, Tuple
from pathlib import Path
from dataclasses import dataclass

from models import ExecutionResult, Verdict, TestCase


@dataclass
class CompilationResult:
    """
    Result of code compilation.
    
    Attributes:
        success: Whether compilation succeeded
        binary_path: Path to compiled binary (if success)
        stderr: Compiler error output
        compile_time_ms: Time taken to compile
    """
    success: bool
    binary_path: Optional[str] = None
    stderr: str = ""
    compile_time_ms: int = 0


class LocalExecutor:
    """
    Local code execution engine using subprocess.
    
    Executes code in isolated temporary directories with time limits.
    Maps execution outcomes to ExecutionResult models from Phase 1.
    
    Example:
        >>> executor = LocalExecutor()
        >>> result = executor.run_testcase(
        ...     language="python",
        ...     source_code="print('Hello')",
        ...     testcase=testcase,
        ...     testcase_id="test_1"
        ... )
        >>> print(result.verdict)  # Verdict.AC
    """
    
    # Output size limits (bytes)
    MAX_STDOUT_SIZE = 10 * 1024 * 1024  # 10 MB
    MAX_STDERR_SIZE = 1 * 1024 * 1024   # 1 MB
    
    # Language configurations
    LANGUAGE_CONFIGS = {
        'python': {
            'extension': '.py',
            'requires_compilation': False,
            'compile_command': None,
            'execute_command': ['python3', '{source_file}']
        },
        'cpp': {
            'extension': '.cpp',
            'requires_compilation': True,
            'compile_command': [
                'g++',
                '-O2',                    # Optimization level 2
                '-std=c++17',             # C++17 standard
                '-Wall',                  # All warnings
                '{source_file}',
                '-o', '{binary_file}'
            ],
            'execute_command': ['{binary_file}']
        }
    }
    
    def __init__(self, work_dir: Optional[str] = None):
        """
        Initialize the local executor.
        
        Args:
            work_dir: Directory for temporary files (default: /tmp/codex_executor)
        """
        self.work_dir = Path(work_dir or "/tmp/codex_executor")
        self.work_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_language_config(self, language: str) -> dict:
        """
        Get configuration for a programming language.
        
        Args:
            language: Language name (python, cpp)
            
        Returns:
            Configuration dictionary
            
        Raises:
            ValueError: If language is not supported
        """
        config = self.LANGUAGE_CONFIGS.get(language)
        if not config:
            raise ValueError(
                f"Language '{language}' not supported. "
                f"Supported: {list(self.LANGUAGE_CONFIGS.keys())}"
            )
        return config
    
    def _create_temp_directory(self) -> Path:
        """
        Create a unique temporary directory for this execution.
        
        Returns:
            Path to temporary directory
        """
        temp_dir = tempfile.mkdtemp(dir=self.work_dir, prefix="exec_")
        return Path(temp_dir)
    
    def _write_source_file(self, temp_dir: Path, source_code: str, extension: str) -> Path:
        """
        Write source code to a file.
        
        Args:
            temp_dir: Temporary directory
            source_code: Source code content
            extension: File extension (.py, .cpp)
            
        Returns:
            Path to source file
        """
        source_file = temp_dir / f"solution{extension}"
        source_file.write_text(source_code, encoding='utf-8')
        return source_file
    
    def _write_input_file(self, temp_dir: Path, input_data: str) -> Path:
        """
        Write test input to a file.
        
        Args:
            temp_dir: Temporary directory
            input_data: Test input data
            
        Returns:
            Path to input file
        """
        input_file = temp_dir / "input.txt"
        input_file.write_text(input_data, encoding='utf-8')
        return input_file
    
    def compile(self, language: str, source_file: Path, temp_dir: Path) -> CompilationResult:
        """
        Compile source code (for compiled languages like C++).
        
        Args:
            language: Programming language
            source_file: Path to source file
            temp_dir: Temporary directory for output
            
        Returns:
            CompilationResult with success status and details
        """
        config = self._get_language_config(language)
        
        # Skip compilation for interpreted languages
        if not config['requires_compilation']:
            return CompilationResult(success=True)
        
        # Prepare compilation command
        binary_file = temp_dir / "solution"
        compile_cmd = [
            part.format(source_file=str(source_file), binary_file=str(binary_file))
            for part in config['compile_command']
        ]
        
        # Compile with timeout
        compile_timeout = 10  # 10 seconds for compilation
        start_time = time.time()
        
        try:
            result = subprocess.run(
                compile_cmd,
                cwd=str(temp_dir),
                capture_output=True,
                text=True,
                timeout=compile_timeout
            )
            
            compile_time_ms = int((time.time() - start_time) * 1000)
            
            if result.returncode == 0:
                return CompilationResult(
                    success=True,
                    binary_path=str(binary_file),
                    stderr="",
                    compile_time_ms=compile_time_ms
                )
            else:
                # Compilation failed
                stderr = result.stderr[:self.MAX_STDERR_SIZE]
                return CompilationResult(
                    success=False,
                    stderr=stderr,
                    compile_time_ms=compile_time_ms
                )
                
        except subprocess.TimeoutExpired:
            compile_time_ms = int((time.time() - start_time) * 1000)
            return CompilationResult(
                success=False,
                stderr="Compilation timeout: exceeded 10 seconds",
                compile_time_ms=compile_time_ms
            )
        except Exception as e:
            return CompilationResult(
                success=False,
                stderr=f"Compilation error: {str(e)}",
                compile_time_ms=0
            )
    
    def execute(
        self,
        language: str,
        source_file: Path,
        binary_file: Optional[Path],
        input_file: Path,
        time_limit_ms: int,
        temp_dir: Path
    ) -> Tuple[int, str, str, int, bool]:
        """
        Execute code with input and time limit.
        
        Args:
            language: Programming language
            source_file: Path to source file
            binary_file: Path to compiled binary (for C++)
            input_file: Path to input file
            time_limit_ms: Time limit in milliseconds
            temp_dir: Temporary directory
            
        Returns:
            Tuple of (exit_code, stdout, stderr, runtime_ms, timed_out)
        """
        config = self._get_language_config(language)
        
        # Prepare execution command
        if config['requires_compilation']:
            execute_cmd = [
                part.format(binary_file=str(binary_file))
                for part in config['execute_command']
            ]
        else:
            execute_cmd = [
                part.format(source_file=str(source_file))
                for part in config['execute_command']
            ]
        
        # Read input data
        input_data = input_file.read_text(encoding='utf-8')
        
        # Execute with timeout
        timeout_seconds = time_limit_ms / 1000.0
        start_time = time.time()
        timed_out = False
        
        try:
            result = subprocess.run(
                execute_cmd,
                cwd=str(temp_dir),
                input=input_data,
                capture_output=True,
                text=True,
                timeout=timeout_seconds
            )
            
            runtime_ms = int((time.time() - start_time) * 1000)
            
            # Truncate outputs to size limits
            stdout = result.stdout[:self.MAX_STDOUT_SIZE]
            stderr = result.stderr[:self.MAX_STDERR_SIZE]
            
            return result.returncode, stdout, stderr, runtime_ms, False
            
        except subprocess.TimeoutExpired:
            # Process exceeded time limit
            runtime_ms = int((time.time() - start_time) * 1000)
            timed_out = True
            
            return -1, "", "Time limit exceeded", runtime_ms, True
            
        except Exception as e:
            runtime_ms = int((time.time() - start_time) * 1000)
            return -1, "", f"Execution error: {str(e)}", runtime_ms, False
    
    def _determine_verdict(
        self,
        exit_code: int,
        timed_out: bool,
        stdout: str,
        expected_output: str
    ) -> Verdict:
        """
        Determine verdict from execution results.
        
        Priority: TLE > RE > (AC/WA determined by output comparison)
        
        Args:
            exit_code: Process exit code
            timed_out: Whether execution timed out
            stdout: Program output
            expected_output: Expected output
            
        Returns:
            Verdict enum value
            
        Note:
            AC vs WA determination requires output comparison,
            which is done by comparing stdout with expected_output.
            This is a simplified comparison (exact match after stripping).
        """
        # Check for timeout
        if timed_out:
            return Verdict.TLE
        
        # Check for runtime error
        if exit_code != 0:
            return Verdict.RE
        
        # Compare output (simplified exact match)
        # In production, use more sophisticated comparison (token-based, float epsilon, etc.)
        actual_output = stdout.strip()
        expected = expected_output.strip()
        
        if actual_output == expected:
            return Verdict.AC
        else:
            return Verdict.WA
    
    def run_testcase(
        self,
        language: str,
        source_code: str,
        testcase: TestCase,
        testcase_id: str
    ) -> ExecutionResult:
        """
        Run code against a single test case.
        
        This is the main entry point for executing a submission.
        Handles compilation, execution, and verdict determination.
        
        Args:
            language: Programming language (python, cpp)
            source_code: Source code to execute
            testcase: TestCase object with input/output/limits
            testcase_id: Unique identifier for this test case
            
        Returns:
            ExecutionResult model with verdict and execution details
            
        Example:
            >>> executor = LocalExecutor()
            >>> testcase = TestCase(
            ...     testcase_id="test_1",
            ...     problem_id="two-sum",
            ...     input_data="4\\n2 7 11 15\\n9",
            ...     expected_output="0 1",
            ...     time_limit_ms=2000,
            ...     memory_limit_kb=262144
            ... )
            >>> result = executor.run_testcase(
            ...     language="python",
            ...     source_code="print('0 1')",
            ...     testcase=testcase,
            ...     testcase_id="test_1"
            ... )
            >>> print(result.verdict)  # Verdict.AC
        """
        temp_dir = None
        
        try:
            # Create temporary directory
            temp_dir = self._create_temp_directory()
            
            # Get language configuration
            config = self._get_language_config(language)
            
            # Write source code to file
            source_file = self._write_source_file(
                temp_dir,
                source_code,
                config['extension']
            )
            
            # Compile if needed
            compilation_result = self.compile(language, source_file, temp_dir)
            
            if not compilation_result.success:
                # Compilation failed → CE verdict
                return ExecutionResult(
                    testcase_id=testcase_id,
                    verdict=Verdict.CE,
                    runtime_ms=0,
                    memory_kb=0,  # Not tracked in local mode
                    exit_code=-1,
                    stdout="",
                    stderr=compilation_result.stderr,
                    timed_out=False,
                    oom_killed=False,
                    error_message=f"Compilation failed: {compilation_result.stderr[:500]}",
                    metadata={
                        "compilation_time_ms": compilation_result.compile_time_ms
                    }
                )
            
            # Write input data to file
            input_file = self._write_input_file(temp_dir, testcase.input_data)
            
            # Execute code
            exit_code, stdout, stderr, runtime_ms, timed_out = self.execute(
                language=language,
                source_file=source_file,
                binary_file=Path(compilation_result.binary_path) if compilation_result.binary_path else None,
                input_file=input_file,
                time_limit_ms=testcase.time_limit_ms,
                temp_dir=temp_dir
            )
            
            # Determine verdict
            verdict = self._determine_verdict(
                exit_code=exit_code,
                timed_out=timed_out,
                stdout=stdout,
                expected_output=testcase.expected_output
            )
            
            # Build execution result
            result = ExecutionResult(
                testcase_id=testcase_id,
                verdict=verdict,
                runtime_ms=runtime_ms,
                memory_kb=0,  # Not tracked in subprocess mode
                exit_code=exit_code,
                stdout=stdout,
                stderr=stderr,
                timed_out=timed_out,
                oom_killed=False,  # Not applicable without Docker
                expected_output=testcase.expected_output if verdict == Verdict.WA else None,
                actual_output=stdout if verdict == Verdict.WA else None,
                error_message=stderr if verdict in [Verdict.RE, Verdict.TLE] else None,
                metadata={
                    "language": language,
                    "time_limit_ms": testcase.time_limit_ms,
                    "compilation_time_ms": compilation_result.compile_time_ms if compilation_result.compile_time_ms else 0
                }
            )
            
            return result
            
        except Exception as e:
            # Unexpected error during execution
            return ExecutionResult(
                testcase_id=testcase_id,
                verdict=Verdict.RE,
                runtime_ms=0,
                memory_kb=0,
                exit_code=-1,
                stdout="",
                stderr="",
                timed_out=False,
                oom_killed=False,
                error_message=f"System error during execution: {str(e)}",
                metadata={"exception": str(e)}
            )
            
        finally:
            # Cleanup temporary directory
            if temp_dir and temp_dir.exists():
                try:
                    shutil.rmtree(temp_dir)
                except Exception:
                    pass  # Best effort cleanup
    
    def cleanup_work_dir(self):
        """
        Clean up all temporary files in work directory.
        
        Should be called periodically to prevent disk space issues.
        """
        if self.work_dir.exists():
            try:
                shutil.rmtree(self.work_dir)
                self.work_dir.mkdir(parents=True, exist_ok=True)
            except Exception as e:
                print(f"Warning: Failed to cleanup work directory: {e}")
