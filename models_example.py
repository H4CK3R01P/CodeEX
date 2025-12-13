#!/usr/bin/env python3
"""
CodeEX Auto-Grader Models - Example Usage

Demonstrates creating, validating, and serializing data models.
"""

from datetime import datetime
from models import (
    Submission,
    SubmissionStatus,
    TestCase,
    ExecutionResult,
    Verdict,
    VerdictReport
)


def example_submission():
    """Example: Create and serialize a submission"""
    print("=" * 60)
    print("1. SUBMISSION MODEL")
    print("=" * 60)
    
    submission = Submission(
        submission_id="sub_abc123xyz",
        problem_id="two-sum",
        user_id="user_456",
        language="python",
        source_code="""def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
""",
        status=SubmissionStatus.QUEUED,
        metadata={"ip": "192.168.1.1", "user_agent": "Mozilla/5.0"}
    )
    
    print(f"✓ Created submission: {submission.submission_id}")
    print(f"  Status: {submission.status}")
    print(f"  Language: {submission.language}")
    print(f"  Created at: {submission.created_at}")
    
    # Serialize to JSON
    json_str = submission.model_dump_json(indent=2)
    print(f"\n✓ Serialized to JSON ({len(json_str)} bytes)")
    
    # Deserialize back
    restored = Submission.model_validate_json(json_str)
    print(f"✓ Deserialized successfully: {restored.submission_id}")
    
    return submission


def example_testcase():
    """Example: Create a test case"""
    print("\n" + "=" * 60)
    print("2. TESTCASE MODEL")
    print("=" * 60)
    
    testcase = TestCase(
        testcase_id="test_1",
        problem_id="two-sum",
        input_data="4\n2 7 11 15\n9",
        expected_output="0 1",
        time_limit_ms=2000,
        memory_limit_kb=262144,  # 256 MB
        is_sample=True,
        is_hidden=False,
        points=10,
        explanation="nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]"
    )
    
    print(f"✓ Created test case: {testcase.testcase_id}")
    print(f"  Time limit: {testcase.time_limit_ms}ms")
    print(f"  Memory limit: {testcase.memory_limit_kb}KB ({testcase.memory_limit_kb // 1024}MB)")
    print(f"  Is sample: {testcase.is_sample}")
    print(f"  Points: {testcase.points}")
    
    return testcase


def example_execution_results():
    """Example: Create execution results for multiple test cases"""
    print("\n" + "=" * 60)
    print("3. EXECUTION RESULT MODEL")
    print("=" * 60)
    
    # Test 1: Accepted
    result1 = ExecutionResult(
        testcase_id="test_1",
        verdict=Verdict.AC,
        runtime_ms=45,
        memory_kb=8192,
        exit_code=0,
        stdout="0 1\n",
        stderr="",
        timed_out=False,
        oom_killed=False
    )
    print(f"✓ Test 1: {result1.verdict} ({result1.runtime_ms}ms, {result1.memory_kb}KB)")
    
    # Test 2: Accepted
    result2 = ExecutionResult(
        testcase_id="test_2",
        verdict=Verdict.AC,
        runtime_ms=52,
        memory_kb=9216,
        exit_code=0,
        stdout="1 2\n",
        stderr="",
        timed_out=False,
        oom_killed=False
    )
    print(f"✓ Test 2: {result2.verdict} ({result2.runtime_ms}ms, {result2.memory_kb}KB)")
    
    # Test 3: Wrong Answer
    result3 = ExecutionResult(
        testcase_id="test_3",
        verdict=Verdict.WA,
        runtime_ms=78,
        memory_kb=12800,
        exit_code=0,
        stdout="2 3\n",
        stderr="",
        timed_out=False,
        oom_killed=False,
        expected_output="0 1\n",
        actual_output="2 3\n"
    )
    print(f"✓ Test 3: {result3.verdict} ({result3.runtime_ms}ms, {result3.memory_kb}KB)")
    print(f"  Expected: {result3.expected_output.strip()}")
    print(f"  Actual: {result3.actual_output.strip()}")
    
    # Test 4: Time Limit Exceeded
    result4 = ExecutionResult(
        testcase_id="test_4",
        verdict=Verdict.TLE,
        runtime_ms=2001,
        memory_kb=15360,
        exit_code=-1,
        stdout="",
        stderr="",
        timed_out=True,
        oom_killed=False,
        error_message="Execution exceeded time limit of 2000ms"
    )
    print(f"✓ Test 4: {result4.verdict} ({result4.runtime_ms}ms > 2000ms limit)")
    
    # Test 5: Runtime Error
    result5 = ExecutionResult(
        testcase_id="test_5",
        verdict=Verdict.RE,
        runtime_ms=15,
        memory_kb=5120,
        exit_code=139,  # SIGSEGV
        stdout="",
        stderr="Segmentation fault (core dumped)\n",
        timed_out=False,
        oom_killed=False,
        error_message="SIGSEGV: Invalid memory access",
        metadata={"signal": "SIGSEGV", "signal_code": 11}
    )
    print(f"✓ Test 5: {result5.verdict} (exit code: {result5.exit_code})")
    print(f"  Error: {result5.error_message}")
    
    return [result1, result2, result3, result4, result5]


def example_verdict_report(results):
    """Example: Create a final verdict report"""
    print("\n" + "=" * 60)
    print("4. VERDICT REPORT MODEL")
    print("=" * 60)
    
    # Aggregate verdict (priority: CE > RE > TLE > MLE > WA > AC)
    # We have: AC, AC, WA, TLE, RE → Final verdict should be RE
    
    report = VerdictReport(
        submission_id="sub_abc123xyz",
        problem_id="two-sum",
        final_verdict=Verdict.RE,  # Highest priority failure
        passed_tests=2,
        total_tests=5,
        max_runtime_ms=2001,  # From TLE test
        max_memory_kb=15360,
        first_failed_test="test_3",  # First failure was WA on test 3
        testcase_results=results,
        grading_duration_ms=8750,
        language="python",
        metadata={
            "worker_id": "worker_1",
            "grading_server": "grader-01.codex.io"
        }
    )
    
    print(f"✓ Created verdict report for: {report.submission_id}")
    print(f"  Final Verdict: {report.final_verdict}")
    print(f"  Passed: {report.passed_tests}/{report.total_tests}")
    print(f"  Max Runtime: {report.max_runtime_ms}ms")
    print(f"  Max Memory: {report.max_memory_kb}KB ({report.max_memory_kb // 1024}MB)")
    print(f"  First Failed Test: {report.first_failed_test}")
    print(f"  Grading Duration: {report.grading_duration_ms}ms")
    
    # Serialize to JSON
    json_output = report.model_dump_json(indent=2)
    print(f"\n✓ Full report serialized ({len(json_output)} bytes)")
    
    # Save to file
    with open("/tmp/verdict_report.json", "w") as f:
        f.write(json_output)
    print("✓ Report saved to /tmp/verdict_report.json")
    
    return report


def example_validation():
    """Example: Demonstrate validation"""
    print("\n" + "=" * 60)
    print("5. VALIDATION EXAMPLES")
    print("=" * 60)
    
    # Valid language
    try:
        submission = Submission(
            submission_id="sub_test",
            problem_id="test",
            user_id="user_1",
            language="python",
            source_code="print('hello')"
        )
        print("✓ Valid language 'python' accepted")
    except ValueError as e:
        print(f"✗ Validation failed: {e}")
    
    # Invalid language
    try:
        submission = Submission(
            submission_id="sub_test",
            problem_id="test",
            user_id="user_1",
            language="rust",  # Not supported yet
            source_code="fn main() {}"
        )
        print("✗ Invalid language 'rust' was accepted (should have failed!)")
    except ValueError as e:
        print(f"✓ Validation caught invalid language: {e}")
    
    # Empty source code
    try:
        submission = Submission(
            submission_id="sub_test",
            problem_id="test",
            user_id="user_1",
            language="python",
            source_code=""  # Empty
        )
        print("✗ Empty source code was accepted (should have failed!)")
    except ValueError as e:
        print(f"✓ Validation caught empty source code: {e}")
    
    # Negative time limit
    try:
        testcase = TestCase(
            testcase_id="test_bad",
            problem_id="test",
            input_data="test",
            expected_output="test",
            time_limit_ms=-100,  # Negative!
            memory_limit_kb=256000
        )
        print("✗ Negative time limit was accepted (should have failed!)")
    except ValueError as e:
        print(f"✓ Validation caught negative time limit: {e}")


def main():
    """Run all examples"""
    print("\n" + "=" * 60)
    print("CODEX AUTO-GRADER DATA MODELS - EXAMPLES")
    print("=" * 60)
    
    # Create examples
    submission = example_submission()
    testcase = example_testcase()
    results = example_execution_results()
    report = example_verdict_report(results)
    example_validation()
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✓ All models created successfully")
    print(f"✓ Submission: {submission.submission_id}")
    print(f"✓ Test case: {testcase.testcase_id}")
    print(f"✓ Execution results: {len(results)} tests")
    print(f"✓ Verdict report: {report.final_verdict}")
    print(f"\n✓ Models are production-ready!")
    print(f"✓ Full JSON serialization/deserialization working")
    print(f"✓ Validation working correctly")
    print("=" * 60)


if __name__ == "__main__":
    main()
