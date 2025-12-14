"""Solution Validator

Executes AI-generated solutions in Docker sandbox to verify correctness.
NEVER trust AI-generated code without execution verification.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import time

try:
    from runner import DockerExecutor, LocalExecutor
    from models import TestCase, ExecutionResult, Verdict
except ImportError:
    # Fallback for testing
    DockerExecutor = None
    LocalExecutor = None
    TestCase = None
    ExecutionResult = None
    Verdict = None


class ValidationStatus(str, Enum):
    """Validation result status"""
    PASSED = "PASSED"              # Solution is correct
    FAILED = "FAILED"              # Solution produces wrong output
    TIMEOUT = "TIMEOUT"            # Solution exceeds time limit
    RUNTIME_ERROR = "RUNTIME_ERROR"  # Solution crashes
    COMPILATION_ERROR = "COMPILATION_ERROR"  # Code doesn't compile
    MALICIOUS = "MALICIOUS"        # Potentially dangerous code detected


@dataclass
class ValidationResult:
    """Result of solution validation"""
    status: ValidationStatus
    passed_tests: int
    total_tests: int
    execution_results: List[Any]  # List of ExecutionResult
    validation_time_ms: int
    error_message: Optional[str] = None
    rejected_reason: Optional[str] = None
    
    @property
    def is_valid(self) -> bool:
        """Check if solution passed validation"""
        return self.status == ValidationStatus.PASSED
    
    @property
    def pass_rate(self) -> float:
        """Calculate pass rate"""
        if self.total_tests == 0:
            return 0.0
        return self.passed_tests / self.total_tests


class SolutionValidator:
    """Validates AI-generated solutions by executing them"""
    
    # Security checks
    DANGEROUS_IMPORTS = [
        'os',
        'sys',
        'subprocess',
        'eval',
        'exec',
        '__import__',
        'open',
        'file',
        'input',
        'raw_input',
    ]
    
    DANGEROUS_PATTERNS = [
        'import os',
        'import sys',
        'subprocess.',
        'eval(',
        'exec(',
        '__import__',
        'open(',
        'file(',
    ]
    
    def __init__(self, use_docker: bool = True):
        """
        Initialize solution validator.
        
        Args:
            use_docker: Use Docker executor (recommended) or local
        """
        self.use_docker = use_docker
        
        if use_docker:
            try:
                if DockerExecutor:
                    self.executor = DockerExecutor()
                else:
                    print("Warning: DockerExecutor not available, using LocalExecutor")
                    self.executor = LocalExecutor() if LocalExecutor else None
            except Exception as e:
                print(f"Warning: Failed to initialize DockerExecutor: {e}")
                self.executor = LocalExecutor() if LocalExecutor else None
        else:
            self.executor = LocalExecutor() if LocalExecutor else None
    
    def _security_check(self, source_code: str, language: str) -> tuple[bool, Optional[str]]:
        """Check for dangerous code patterns"""
        
        # Python-specific checks
        if language == 'python':
            for pattern in self.DANGEROUS_PATTERNS:
                if pattern in source_code:
                    return False, f"Dangerous pattern detected: {pattern}"
            
            # Check for suspicious eval/exec
            if 'eval' in source_code or 'exec' in source_code:
                return False, "eval/exec usage detected"
        
        # C++ specific checks
        if language == 'cpp':
            if 'system(' in source_code:
                return False, "system() call detected"
            if '#include <cstdlib>' in source_code or '#include <stdlib.h>' in source_code:
                # Check if system/exec functions are used
                dangerous_funcs = ['system', 'popen', 'exec']
                for func in dangerous_funcs:
                    if f'{func}(' in source_code:
                        return False, f"Dangerous function {func}() detected"
        
        return True, None
    
    async def validate_async(
        self,
        source_code: str,
        language: str,
        test_cases: List[Any],  # List[TestCase]
        timeout_multiplier: float = 1.0
    ) -> ValidationResult:
        """Validate solution asynchronously"""
        start_time = time.time()
        
        # Security check first
        is_safe, reason = self._security_check(source_code, language)
        if not is_safe:
            return ValidationResult(
                status=ValidationStatus.MALICIOUS,
                passed_tests=0,
                total_tests=len(test_cases),
                execution_results=[],
                validation_time_ms=int((time.time() - start_time) * 1000),
                error_message="Security check failed",
                rejected_reason=reason
            )
        
        if not self.executor:
            return ValidationResult(
                status=ValidationStatus.FAILED,
                passed_tests=0,
                total_tests=len(test_cases),
                execution_results=[],
                validation_time_ms=0,
                error_message="Executor not available"
            )
        
        # Execute against all test cases
        execution_results = []
        passed_tests = 0
        
        for i, test_case in enumerate(test_cases):
            try:
                # Run in thread pool to avoid blocking
                result = await asyncio.to_thread(
                    self.executor.run_testcase,
                    language=language,
                    source_code=source_code,
                    testcase=test_case,
                    testcase_id=f"validation_{i}"
                )
                
                execution_results.append(result)
                
                # Check if passed
                if hasattr(result, 'verdict'):
                    if str(result.verdict) == 'Verdict.AC' or result.verdict == 'AC':
                        passed_tests += 1
            
            except Exception as e:
                # Execution failed
                return ValidationResult(
                    status=ValidationStatus.RUNTIME_ERROR,
                    passed_tests=passed_tests,
                    total_tests=len(test_cases),
                    execution_results=execution_results,
                    validation_time_ms=int((time.time() - start_time) * 1000),
                    error_message=f"Execution error: {str(e)}"
                )
        
        validation_time_ms = int((time.time() - start_time) * 1000)
        
        # Determine final status
        if passed_tests == len(test_cases):
            status = ValidationStatus.PASSED
        elif passed_tests == 0:
            # Check if compilation error
            if execution_results and hasattr(execution_results[0], 'verdict'):
                verdict = str(execution_results[0].verdict)
                if 'CE' in verdict:
                    status = ValidationStatus.COMPILATION_ERROR
                elif 'TLE' in verdict:
                    status = ValidationStatus.TIMEOUT
                elif 'RE' in verdict:
                    status = ValidationStatus.RUNTIME_ERROR
                else:
                    status = ValidationStatus.FAILED
            else:
                status = ValidationStatus.FAILED
        else:
            status = ValidationStatus.FAILED
        
        return ValidationResult(
            status=status,
            passed_tests=passed_tests,
            total_tests=len(test_cases),
            execution_results=execution_results,
            validation_time_ms=validation_time_ms
        )
    
    def validate(
        self,
        source_code: str,
        language: str,
        test_cases: List[Any],  # List[TestCase]
        timeout_multiplier: float = 1.0
    ) -> ValidationResult:
        """Validate solution synchronously"""
        return asyncio.run(self.validate_async(
            source_code, language, test_cases, timeout_multiplier
        ))
