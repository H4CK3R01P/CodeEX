"""
Failure Classifier

Deterministic classification of code execution failures.
"""

from enum import Enum
from typing import Optional, Dict, Any, List
from dataclasses import dataclass

from models import VerdictReport, Verdict, ExecutionResult


class FailureCategory(str, Enum):
    """Failure categories for classification"""
    # Compilation Errors
    SYNTAX_ERROR = "syntax_error"
    TYPE_ERROR = "type_error"
    MISSING_INCLUDE = "missing_include"
    UNDECLARED_VARIABLE = "undeclared_variable"
    
    # Runtime Errors
    SEGMENTATION_FAULT = "segmentation_fault"
    NULL_POINTER = "null_pointer"
    ARRAY_OUT_OF_BOUNDS = "array_out_of_bounds"
    DIVIDE_BY_ZERO = "divide_by_zero"
    STACK_OVERFLOW = "stack_overflow"
    EXCEPTION = "exception"
    
    # Logic Errors
    OFF_BY_ONE = "off_by_one"
    WRONG_ALGORITHM = "wrong_algorithm"
    EDGE_CASE_FAILURE = "edge_case_failure"
    PRECISION_ERROR = "precision_error"
    OUTPUT_FORMAT_ERROR = "output_format_error"
    
    # Performance Issues
    TIME_LIMIT_EXCEEDED = "time_limit_exceeded"
    MEMORY_LIMIT_EXCEEDED = "memory_limit_exceeded"
    INFINITE_LOOP = "infinite_loop"
    
    # Other
    SUCCESS = "success"
    UNKNOWN = "unknown"


@dataclass
class Classification:
    """Result of failure classification"""
    category: FailureCategory
    subcategory: Optional[str] = None
    confidence: float = 1.0
    evidence: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.evidence is None:
            self.evidence = {}


class FailureClassifier:
    """Deterministic failure classification using pattern matching"""
    
    def classify(self, verdict_report: VerdictReport) -> Classification:
        """
        Classify failure based on verdict and execution data.
        
        Args:
            verdict_report: Immutable verdict from judge
            
        Returns:
            Classification with category and confidence
        """
        verdict = verdict_report.final_verdict
        
        if verdict == Verdict.CE:
            return self._classify_compilation_error(verdict_report)
        elif verdict == Verdict.RE:
            return self._classify_runtime_error(verdict_report)
        elif verdict == Verdict.TLE:
            return self._classify_time_limit_exceeded(verdict_report)
        elif verdict == Verdict.MLE:
            return self._classify_memory_limit_exceeded(verdict_report)
        elif verdict == Verdict.WA:
            return self._classify_wrong_answer(verdict_report)
        else:  # AC
            return Classification(category=FailureCategory.SUCCESS, confidence=1.0)
    
    def _classify_compilation_error(self, report: VerdictReport) -> Classification:
        """Classify compilation errors"""
        # Get compilation stderr from first failed test
        stderr = self._get_error_output(report)
        
        if any(p in stderr.lower() for p in ['syntax error', 'expected ;', 'expected }', 'unexpected token']):
            return Classification(
                category=FailureCategory.SYNTAX_ERROR,
                confidence=0.95,
                evidence={"pattern_match": "syntax error"}
            )
        
        if any(p in stderr.lower() for p in ['type mismatch', 'cannot convert', 'incompatible types']):
            return Classification(
                category=FailureCategory.TYPE_ERROR,
                confidence=0.90,
                evidence={"pattern_match": "type error"}
            )
        
        if any(p in stderr.lower() for p in ['undeclared', 'not declared', 'undefined reference']):
            return Classification(
                category=FailureCategory.UNDECLARED_VARIABLE,
                confidence=0.85,
                evidence={"pattern_match": "undeclared"}
            )
        
        return Classification(
            category=FailureCategory.SYNTAX_ERROR,
            subcategory="unknown",
            confidence=0.50
        )
    
    def _classify_runtime_error(self, report: VerdictReport) -> Classification:
        """Classify runtime errors"""
        failed_test = self._get_first_failed_test(report)
        if not failed_test:
            return Classification(category=FailureCategory.EXCEPTION, confidence=0.5)
        
        exit_code = failed_test.exit_code
        stderr = failed_test.stderr.lower()
        
        # Segmentation fault
        if exit_code == 139 or 'segmentation fault' in stderr:
            return Classification(
                category=FailureCategory.SEGMENTATION_FAULT,
                confidence=1.0,
                evidence={"exit_code": exit_code}
            )
        
        # Divide by zero
        if exit_code == 136 or any(p in stderr for p in ['division by zero', 'zerodivisionerror']):
            return Classification(
                category=FailureCategory.DIVIDE_BY_ZERO,
                confidence=0.95,
                evidence={"exit_code": exit_code}
            )
        
        # Python exceptions
        if 'indexerror' in stderr:
            return Classification(
                category=FailureCategory.ARRAY_OUT_OF_BOUNDS,
                subcategory="IndexError",
                confidence=0.95,
                evidence={"exception": "IndexError"}
            )
        
        if 'recursionerror' in stderr or 'maximum recursion' in stderr:
            return Classification(
                category=FailureCategory.STACK_OVERFLOW,
                subcategory="RecursionError",
                confidence=0.95,
                evidence={"exception": "RecursionError"}
            )
        
        return Classification(
            category=FailureCategory.EXCEPTION,
            subcategory="unknown",
            confidence=0.60,
            evidence={"exit_code": exit_code}
        )
    
    def _classify_time_limit_exceeded(self, report: VerdictReport) -> Classification:
        """Classify TLE"""
        tle_count = sum(1 for tc in report.testcase_results if tc.verdict == Verdict.TLE)
        total_count = len(report.testcase_results)
        
        if tle_count == total_count:
            return Classification(
                category=FailureCategory.INFINITE_LOOP,
                confidence=0.85,
                evidence={"all_tests_tle": True}
            )
        else:
            return Classification(
                category=FailureCategory.TIME_LIMIT_EXCEEDED,
                subcategory="inefficient_algorithm",
                confidence=0.75,
                evidence={"tle_ratio": f"{tle_count}/{total_count}"}
            )
    
    def _classify_memory_limit_exceeded(self, report: VerdictReport) -> Classification:
        """Classify MLE"""
        return Classification(
            category=FailureCategory.MEMORY_LIMIT_EXCEEDED,
            confidence=1.0,
            evidence={"max_memory_kb": report.max_memory_kb}
        )
    
    def _classify_wrong_answer(self, report: VerdictReport) -> Classification:
        """Classify wrong answer"""
        failed_test = self._get_first_failed_test(report)
        if not failed_test:
            return Classification(category=FailureCategory.WRONG_ALGORITHM, confidence=0.5)
        
        expected = failed_test.expected_output or ""
        actual = failed_test.actual_output or ""
        
        # Off by one
        if self._is_off_by_one(expected, actual):
            return Classification(
                category=FailureCategory.OFF_BY_ONE,
                confidence=0.85,
                evidence={"output_diff": "numeric difference of 1"}
            )
        
        # Format error (whitespace)
        if expected.replace(" ", "").replace("\n", "") == actual.replace(" ", "").replace("\n", ""):
            return Classification(
                category=FailureCategory.OUTPUT_FORMAT_ERROR,
                subcategory="whitespace_mismatch",
                confidence=0.90,
                evidence={"content_matches_ignoring_whitespace": True}
            )
        
        # Case mismatch
        if expected.lower() == actual.lower():
            return Classification(
                category=FailureCategory.OUTPUT_FORMAT_ERROR,
                subcategory="case_mismatch",
                confidence=0.95,
                evidence={"case_insensitive_match": True}
            )
        
        # Precision error
        if self._is_precision_error(expected, actual):
            return Classification(
                category=FailureCategory.PRECISION_ERROR,
                confidence=0.80,
                evidence={"floating_point_diff": True}
            )
        
        return Classification(
            category=FailureCategory.WRONG_ALGORITHM,
            confidence=0.60,
            evidence={"output_completely_different": True}
        )
    
    # Helper methods
    def _get_first_failed_test(self, report: VerdictReport) -> Optional[ExecutionResult]:
        """Get first failed test case"""
        for tc in report.testcase_results:
            if tc.verdict != Verdict.AC:
                return tc
        return None
    
    def _get_error_output(self, report: VerdictReport) -> str:
        """Get error output from failed test"""
        failed = self._get_first_failed_test(report)
        return failed.stderr if failed else ""
    
    def _is_off_by_one(self, expected: str, actual: str) -> bool:
        """Check if outputs differ by exactly 1"""
        try:
            exp_nums = [int(x) for x in expected.split()]
            act_nums = [int(x) for x in actual.split()]
            if len(exp_nums) != len(act_nums):
                return False
            diffs = [abs(e - a) for e, a in zip(exp_nums, act_nums)]
            return all(d == 1 for d in diffs) and len(diffs) > 0
        except:
            return False
    
    def _is_precision_error(self, expected: str, actual: str) -> bool:
        """Check if floating point precision issue"""
        try:
            exp_floats = [float(x) for x in expected.split()]
            act_floats = [float(x) for x in actual.split()]
            if len(exp_floats) != len(act_floats):
                return False
            return all(abs(e - a) < 1e-6 for e, a in zip(exp_floats, act_floats))
        except:
            return False
