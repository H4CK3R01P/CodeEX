"""Example Usage of Verification Pipelines

Demonstrates how to use verification system to validate AI outputs.
"""

import asyncio
from backend.ai.verification import (
    SolutionValidator,
    TestCaseGenerator,
    ExplanationChecker,
    DeterminismGuard,
    VerificationPipeline
)


def example_1_validate_solution():
    """Example 1: Validate an AI-generated solution"""
    print("=" * 60)
    print("EXAMPLE 1: Solution Validation")
    print("=" * 60)
    
    # AI-generated code (simulated)
    ai_code = """
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
"""
    
    # Create mock test case
    class MockTestCase:
        def __init__(self, id, input_data, expected):
            self.testcase_id = id
            self.problem_id = "two-sum"
            self.input_data = input_data
            self.expected_output = expected
            self.time_limit_ms = 2000
            self.memory_limit_kb = 262144
    
    test_cases = [
        MockTestCase("test_1", "4\n2 7 11 15\n9", "0 1"),
        MockTestCase("test_2", "3\n3 2 4\n6", "1 2"),
    ]
    
    # Validate
    validator = SolutionValidator(use_docker=False)  # Use local for demo
    
    print("Validating solution...")
    print(f"Code length: {len(ai_code)} characters")
    print(f"Test cases: {len(test_cases)}")
    print()
    
    # Security check demo
    is_safe, reason = validator._security_check(ai_code, 'python')
    print(f"Security check: {'✅ SAFE' if is_safe else '❌ UNSAFE'}")
    if not is_safe:
        print(f"Reason: {reason}")
    print()


def example_2_generate_edge_cases():
    """Example 2: Generate edge cases"""
    print("=" * 60)
    print("EXAMPLE 2: Edge Case Generation")
    print("=" * 60)
    
    generator = TestCaseGenerator(seed=42)
    
    # Generate array edge cases
    print("Array Edge Cases:")
    array_tests = generator.generate_array_tests(
        min_size=0,
        max_size=100,
        count=3
    )
    
    for i, test in enumerate(array_tests[:5], 1):
        print(f"\n{i}. {test.description}")
        print(f"   Type: {test.test_type.value}")
        print(f"   Input preview: {test.input_data[:50]}...")
    
    print("\n" + "-" * 60)
    print("String Edge Cases:")
    string_tests = generator.generate_string_tests(
        max_length=50,
        count=3
    )
    
    for i, test in enumerate(string_tests[:3], 1):
        print(f"\n{i}. {test.description}")
        print(f"   Type: {test.test_type.value}")
        print(f"   Input: '{test.input_data.strip()}'")
    
    print()


def example_3_check_explanation():
    """Example 3: Verify explanation matches code"""
    print("=" * 60)
    print("EXAMPLE 3: Explanation Verification")
    print("=" * 60)
    
    code = """
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
"""
    
    # Good explanation
    good_explanation = """
This solution uses binary search algorithm to find the target.
Time complexity is O(log n) because we divide the search space in half each iteration.
We use two pointers (left and right) and compare the middle element.
"""
    
    # Bad explanation (hallucination)
    bad_explanation = """
This solution uses quicksort to first sort the array.
Then it uses dynamic programming with memoization.
Time complexity is O(n^2) due to nested loops.
"""
    
    checker = ExplanationChecker()
    
    print("Code features detected:")
    features = checker._extract_code_features(code, 'python')
    for feature in sorted(features):
        print(f"  - {feature}")
    print()
    
    print("Checking GOOD explanation:")
    result = checker.check(code, good_explanation, 'python')
    print(f"  Verdict: {result.verdict.value}")
    print(f"  Accuracy: {result.accuracy_score:.2%}")
    print(f"  Matched concepts: {result.matched_concepts}")
    print(f"  Status: {'✅ ACCEPTABLE' if result.is_acceptable else '❌ REJECTED'}")
    print()
    
    print("Checking BAD explanation (with hallucinations):")
    result = checker.check(code, bad_explanation, 'python')
    print(f"  Verdict: {result.verdict.value}")
    print(f"  Accuracy: {result.accuracy_score:.2%}")
    print(f"  Hallucinated: {result.hallucinated_concepts}")
    print(f"  Issues found: {len(result.issues)}")
    for issue in result.issues[:3]:
        print(f"    - [{issue.severity}] {issue.description}")
    print(f"  Status: {'✅ ACCEPTABLE' if result.is_acceptable else '❌ REJECTED'}")
    print()


def example_4_check_determinism():
    """Example 4: Check for consistent outputs"""
    print("=" * 60)
    print("EXAMPLE 4: Determinism Check")
    print("=" * 60)
    
    guard = DeterminismGuard(num_runs=3, min_acceptable_similarity=0.85)
    
    # Simulate consistent AI output
    def consistent_generator():
        return "def solve(n): return n * 2"
    
    # Simulate inconsistent AI output
    import random
    def inconsistent_generator():
        options = [
            "def solve(n): return n * 2",
            "def solve(x): return x + x",
            "def compute(value): return value << 1"
        ]
        return random.choice(options)
    
    print("Checking CONSISTENT outputs:")
    result = guard.check(consistent_generator)
    print(f"  Consistency: {result.consistency_level.value}")
    print(f"  Similarity: {result.similarity_score:.2%}")
    print(f"  Unique outputs: {result.unique_count}")
    print(f"  Status: {'✅ ACCEPTABLE' if result.is_acceptable else '❌ REJECTED'}")
    print()
    
    print("Checking INCONSISTENT outputs:")
    result = guard.check(inconsistent_generator)
    print(f"  Consistency: {result.consistency_level.value}")
    print(f"  Similarity: {result.similarity_score:.2%}")
    print(f"  Unique outputs: {result.unique_count}")
    print(f"  Status: {'✅ ACCEPTABLE' if result.is_acceptable else '❌ REJECTED'}")
    print()


def example_5_full_pipeline():
    """Example 5: Complete verification pipeline"""
    print("=" * 60)
    print("EXAMPLE 5: Complete Verification Pipeline")
    print("=" * 60)
    
    # Simulated AI-generated solution
    ai_code = """
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
"""
    
    ai_explanation = """
This solution calculates the nth Fibonacci number using iteration.
Time complexity is O(n) because we iterate n-1 times.
Space complexity is O(1) as we only use two variables.
"""
    
    print("AI Generated Solution:")
    print(ai_code[:100] + "...")
    print()
    
    print("AI Generated Explanation:")
    print(ai_explanation[:100] + "...")
    print()
    
    # Create pipeline
    pipeline = VerificationPipeline(
        enable_determinism_check=False,  # Skip for demo (needs async)
        enable_solution_validation=False,  # Skip for demo (needs executor)
        enable_edge_case_generation=False,
        enable_explanation_check=True,
        strict_mode=True
    )
    
    print("Running verification pipeline...")
    print()
    
    # For demo, just check explanation
    checker = ExplanationChecker()
    result = checker.check(ai_code, ai_explanation, 'python')
    
    print("Pipeline Results:")
    print(f"  Explanation Check: {'✅ PASSED' if result.is_acceptable else '❌ FAILED'}")
    print(f"  Accuracy Score: {result.accuracy_score:.2%}")
    print(f"  Verdict: {result.verdict.value}")
    print()
    
    if result.is_acceptable:
        print("✅ ALL CHECKS PASSED - Safe to show to user")
    else:
        print("❌ VERIFICATION FAILED - Reject and regenerate")
        print(f"Issues: {[issue.description for issue in result.issues]}")
    print()


def example_6_security_checks():
    """Example 6: Security validation"""
    print("=" * 60)
    print("EXAMPLE 6: Security Checks")
    print("=" * 60)
    
    validator = SolutionValidator()
    
    # Safe code
    safe_code = """
def solve(nums):
    return sorted(nums)
"""
    
    # Malicious code examples
    malicious_codes = [
        ("eval() usage", "result = eval(user_input)"),
        ("os import", "import os\nos.system('rm -rf /')"),
        ("exec() usage", "exec('malicious_code')"),
        ("subprocess", "import subprocess\nsubprocess.call(['ls'])"),
    ]
    
    print("Testing SAFE code:")
    is_safe, reason = validator._security_check(safe_code, 'python')
    print(f"  Result: {'✅ SAFE' if is_safe else '❌ UNSAFE'}")
    print()
    
    print("Testing MALICIOUS code patterns:")
    for name, code in malicious_codes:
        is_safe, reason = validator._security_check(code, 'python')
        status = '✅ SAFE' if is_safe else '❌ BLOCKED'
        print(f"  {name}: {status}")
        if not is_safe:
            print(f"    Reason: {reason}")
    print()


if __name__ == "__main__":
    examples = [
        example_1_validate_solution,
        example_2_generate_edge_cases,
        example_3_check_explanation,
        example_4_check_determinism,
        example_5_full_pipeline,
        example_6_security_checks,
    ]
    
    for example in examples:
        example()
        print("\n")
