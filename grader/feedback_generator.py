"""
Feedback Generator

Generates deterministic educational feedback.
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass

from models import VerdictReport, Verdict
from .failure_classifier import Classification, FailureCategory


@dataclass
class BaseFeedback:
    """Deterministic base feedback"""
    title: str
    summary: str
    details: Optional[str] = None
    suggestions: List[str] = None
    error_location: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.suggestions is None:
            self.suggestions = []


class FeedbackGenerator:
    """Generate deterministic feedback from classification"""
    
    def generate(
        self,
        classification: Classification,
        signals: Dict[str, Any],
        verdict_report: VerdictReport
    ) -> BaseFeedback:
        """
        Generate base feedback.
        
        Args:
            classification: Failure classification
            signals: Extracted signals
            verdict_report: Verdict from judge
            
        Returns:
            Base feedback with title, summary, suggestions
        """
        category = classification.category
        
        if category == FailureCategory.SUCCESS:
            return self._feedback_success(verdict_report)
        elif category in [FailureCategory.SYNTAX_ERROR, FailureCategory.TYPE_ERROR, 
                          FailureCategory.MISSING_INCLUDE, FailureCategory.UNDECLARED_VARIABLE]:
            return self._feedback_compilation_error(classification, signals)
        elif category in [FailureCategory.SEGMENTATION_FAULT, FailureCategory.DIVIDE_BY_ZERO,
                          FailureCategory.ARRAY_OUT_OF_BOUNDS, FailureCategory.STACK_OVERFLOW,
                          FailureCategory.EXCEPTION]:
            return self._feedback_runtime_error(classification, signals)
        elif category in [FailureCategory.TIME_LIMIT_EXCEEDED, FailureCategory.INFINITE_LOOP]:
            return self._feedback_tle(classification, verdict_report)
        elif category == FailureCategory.MEMORY_LIMIT_EXCEEDED:
            return self._feedback_mle(verdict_report)
        elif category in [FailureCategory.OFF_BY_ONE, FailureCategory.WRONG_ALGORITHM,
                          FailureCategory.OUTPUT_FORMAT_ERROR, FailureCategory.PRECISION_ERROR]:
            return self._feedback_wrong_answer(classification, signals, verdict_report)
        else:
            return self._feedback_unknown(verdict_report)
    
    def _feedback_success(self, report: VerdictReport) -> BaseFeedback:
        return BaseFeedback(
            title="Accepted",
            summary=f"All {report.total_tests} test cases passed!",
            details=f"Runtime: {report.max_runtime_ms}ms, Memory: {report.max_memory_kb // 1024}MB",
            suggestions=["Great job! Try solving similar problems to practice."]
        )
    
    def _feedback_compilation_error(self, classification: Classification, signals: Dict) -> BaseFeedback:
        error_loc = signals.get('error_location')
        location_str = f" at line {error_loc['line']}" if error_loc else ""
        
        suggestions = [
            "Check for syntax errors (missing semicolons, braces)",
            "Verify variable declarations",
            "Ensure all includes are present"
        ]
        
        return BaseFeedback(
            title="Compilation Error",
            summary=f"Your code failed to compile{location_str}",
            details="Fix the compilation errors before running tests.",
            suggestions=suggestions,
            error_location=error_loc
        )
    
    def _feedback_runtime_error(self, classification: Classification, signals: Dict) -> BaseFeedback:
        category = classification.category
        exception = signals.get('exception_type', 'Unknown')
        
        if category == FailureCategory.SEGMENTATION_FAULT:
            title = "Runtime Error - Segmentation Fault"
            summary = "Your program accessed invalid memory"
            suggestions = [
                "Check array bounds",
                "Verify pointer usage",
                "Look for null pointer dereferences"
            ]
        elif category == FailureCategory.DIVIDE_BY_ZERO:
            title = "Runtime Error - Division by Zero"
            summary = "Your program attempted to divide by zero"
            suggestions = [
                "Add checks before division operations",
                "Handle edge cases where divisor is zero"
            ]
        elif category == FailureCategory.ARRAY_OUT_OF_BOUNDS:
            title = f"Runtime Error - {exception}"
            summary = "Array index out of bounds"
            suggestions = [
                "Check array indices (0-based indexing)",
                "Verify loop bounds",
                "Ensure array size matches your access pattern"
            ]
        elif category == FailureCategory.STACK_OVERFLOW:
            title = f"Runtime Error - {exception}"
            summary = "Stack overflow (likely infinite recursion)"
            suggestions = [
                "Check recursion base case",
                "Consider iterative approach",
                "Add recursion depth limit"
            ]
        else:
            title = f"Runtime Error - {exception}"
            summary = "Your program crashed during execution"
            suggestions = [
                "Check for edge cases",
                "Add error handling",
                "Review logic for potential crashes"
            ]
        
        return BaseFeedback(
            title=title,
            summary=summary,
            suggestions=suggestions
        )
    
    def _feedback_tle(self, classification: Classification, report: VerdictReport) -> BaseFeedback:
        if classification.category == FailureCategory.INFINITE_LOOP:
            return BaseFeedback(
                title="Time Limit Exceeded - Infinite Loop",
                summary="All test cases timed out (likely infinite loop)",
                suggestions=[
                    "Check loop termination conditions",
                    "Verify while loop conditions",
                    "Look for missing break/return statements"
                ]
            )
        else:
            return BaseFeedback(
                title="Time Limit Exceeded",
                summary=f"Your solution is too slow ({report.max_runtime_ms}ms)",
                suggestions=[
                    "Optimize your algorithm (reduce time complexity)",
                    "Use more efficient data structures",
                    "Consider a different approach"
                ]
            )
    
    def _feedback_mle(self, report: VerdictReport) -> BaseFeedback:
        return BaseFeedback(
            title="Memory Limit Exceeded",
            summary=f"Your solution uses too much memory ({report.max_memory_kb // 1024}MB)",
            suggestions=[
                "Reduce space complexity",
                "Avoid storing unnecessary data",
                "Consider in-place algorithms",
                "Check for memory leaks"
            ]
        )
    
    def _feedback_wrong_answer(self, classification: Classification, signals: Dict, report: VerdictReport) -> BaseFeedback:
        category = classification.category
        output_diff = signals.get('output_diff', {})
        
        if category == FailureCategory.OFF_BY_ONE:
            return BaseFeedback(
                title="Wrong Answer - Off by One Error",
                summary="Your output differs by exactly 1 from expected",
                details=f"Expected: {output_diff.get('expected', 'N/A')}\nGot: {output_diff.get('actual', 'N/A')}",
                suggestions=[
                    "Check loop bounds (< vs <=)",
                    "Review array indexing (0-based vs 1-based)",
                    "Verify edge cases"
                ]
            )
        elif category == FailureCategory.OUTPUT_FORMAT_ERROR:
            return BaseFeedback(
                title="Wrong Answer - Output Format Error",
                summary="Your output format doesn't match expected format",
                details="Content may be correct but formatting is wrong",
                suggestions=[
                    "Check whitespace (spaces, newlines)",
                    "Verify output case (upper/lower)",
                    "Follow exact output format"
                ]
            )
        elif category == FailureCategory.PRECISION_ERROR:
            return BaseFeedback(
                title="Wrong Answer - Precision Error",
                summary="Floating point precision issue",
                suggestions=[
                    "Use appropriate precision for floating point",
                    "Consider rounding errors",
                    "Use double instead of float if needed"
                ]
            )
        else:
            return BaseFeedback(
                title="Wrong Answer",
                summary=f"Failed on test {report.first_failed_test or 'unknown'}",
                details=f"Passed: {report.passed_tests}/{report.total_tests}\n" +
                        f"Expected: {output_diff.get('expected', 'N/A')}\nGot: {output_diff.get('actual', 'N/A')}",
                suggestions=[
                    "Review your algorithm logic",
                    "Test with the provided examples",
                    "Check edge cases"
                ]
            )
    
    def _feedback_unknown(self, report: VerdictReport) -> BaseFeedback:
        return BaseFeedback(
            title="Grading Result",
            summary=f"Verdict: {report.final_verdict}",
            details=f"Passed: {report.passed_tests}/{report.total_tests}",
            suggestions=["Review the test results for more details"]
        )
