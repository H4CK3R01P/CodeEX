"""
Signal Extractor

Extracts actionable signals from execution results.
"""

from typing import Dict, Any, Optional
import re

from models import VerdictReport, ExecutionResult


class SignalExtractor:
    """Extract actionable signals from stderr/stdout"""
    
    def extract(self, verdict_report: VerdictReport) -> Dict[str, Any]:
        """
        Extract signals from verdict report.
        
        Args:
            verdict_report: Verdict from judge
            
        Returns:
            Dictionary of extracted signals
        """
        signals = {}
        
        # Get first failed test
        failed_test = self._get_first_failed_test(verdict_report)
        
        if failed_test:
            # Extract error location
            error_location = self._extract_error_location(failed_test.stderr)
            if error_location:
                signals['error_location'] = error_location
            
            # Extract exception type
            exception_type = self._extract_exception_type(failed_test.stderr)
            if exception_type:
                signals['exception_type'] = exception_type
            
            # Extract output diff
            if failed_test.expected_output and failed_test.actual_output:
                signals['output_diff'] = {
                    'expected': failed_test.expected_output[:200],
                    'actual': failed_test.actual_output[:200]
                }
        
        # Performance metrics
        signals['performance'] = {
            'max_runtime_ms': verdict_report.max_runtime_ms,
            'max_memory_kb': verdict_report.max_memory_kb,
            'passed_tests': verdict_report.passed_tests,
            'total_tests': verdict_report.total_tests
        }
        
        return signals
    
    def _get_first_failed_test(self, report: VerdictReport) -> Optional[ExecutionResult]:
        """Get first failed test"""
        for tc in report.testcase_results:
            if tc.verdict != "AC":
                return tc
        return None
    
    def _extract_error_location(self, stderr: str) -> Optional[Dict[str, Any]]:
        """Extract line/column from error message"""
        # C++ error: "file.cpp:15:10: error"
        cpp_pattern = r'solution\.cpp:(\d+):(\d+):'
        match = re.search(cpp_pattern, stderr)
        if match:
            return {
                'line': int(match.group(1)),
                'column': int(match.group(2)),
                'file': 'solution.cpp'
            }
        
        # Python error: "File "solution.py", line 15"
        py_pattern = r'File "solution\.py", line (\d+)'
        match = re.search(py_pattern, stderr)
        if match:
            return {
                'line': int(match.group(1)),
                'file': 'solution.py'
            }
        
        return None
    
    def _extract_exception_type(self, stderr: str) -> Optional[str]:
        """Extract exception type from stderr"""
        # Python: "IndexError: list index out of range"
        py_exception = r'(\w+Error|\w+Exception):'
        match = re.search(py_exception, stderr)
        if match:
            return match.group(1)
        
        return None
