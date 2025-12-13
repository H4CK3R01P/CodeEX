"""
Verdict Engine

Aggregates testcase results into final verdict.
"""

from typing import List
from datetime import datetime

from models import VerdictReport, ExecutionResult, Verdict


class VerdictEngine:
    """Aggregates execution results into final verdict"""
    
    def aggregate(
        self,
        submission_id: str,
        problem_id: str,
        testcase_results: List[ExecutionResult],
        language: str,
        grading_start_time: datetime = None
    ) -> VerdictReport:
        """
        Aggregate testcase results into final verdict.
        
        Verdict priority: CE > RE > TLE > MLE > WA > AC
        
        Args:
            submission_id: Submission identifier
            problem_id: Problem identifier
            testcase_results: List of execution results
            language: Programming language
            grading_start_time: When grading started
            
        Returns:
            VerdictReport with aggregated results
        """
        if not testcase_results:
            raise ValueError("No testcase results provided")
        
        # Determine final verdict (priority order)
        final_verdict = self._determine_final_verdict(testcase_results)
        
        # Count passed tests
        passed_tests = sum(1 for tc in testcase_results if tc.verdict == Verdict.AC)
        total_tests = len(testcase_results)
        
        # Get max runtime and memory
        max_runtime_ms = max((tc.runtime_ms for tc in testcase_results), default=0)
        max_memory_kb = max((tc.memory_kb for tc in testcase_results), default=0)
        
        # Find first failed test
        first_failed_test = None
        for tc in testcase_results:
            if tc.verdict != Verdict.AC:
                first_failed_test = tc.testcase_id
                break
        
        # Calculate grading duration
        grading_duration_ms = 0
        if grading_start_time:
            grading_duration_ms = int((datetime.utcnow() - grading_start_time).total_seconds() * 1000)
        
        return VerdictReport(
            submission_id=submission_id,
            problem_id=problem_id,
            final_verdict=final_verdict,
            passed_tests=passed_tests,
            total_tests=total_tests,
            max_runtime_ms=max_runtime_ms,
            max_memory_kb=max_memory_kb,
            first_failed_test=first_failed_test,
            testcase_results=testcase_results,
            graded_at=datetime.utcnow(),
            grading_duration_ms=grading_duration_ms,
            language=language
        )
    
    def _determine_final_verdict(self, results: List[ExecutionResult]) -> Verdict:
        """
        Determine final verdict from testcase results.
        
        Priority: CE > RE > TLE > MLE > WA > AC
        """
        verdict_priority = {
            Verdict.CE: 6,
            Verdict.RE: 5,
            Verdict.TLE: 4,
            Verdict.MLE: 3,
            Verdict.WA: 2,
            Verdict.AC: 1
        }
        
        # Get highest priority verdict
        max_priority = 0
        final_verdict = Verdict.AC
        
        for result in results:
            priority = verdict_priority.get(result.verdict, 0)
            if priority > max_priority:
                max_priority = priority
                final_verdict = result.verdict
        
        return final_verdict
