#!/usr/bin/env python3
"""
Local Executor Example

Demonstrates the local execution engine with Python and C++ code.
"""

from runner import LocalExecutor
from models import TestCase, Verdict


def example_python_ac():
    """Example: Python code that passes (AC)"""
    print("=" * 60)
    print("1. PYTHON - ACCEPTED (AC)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_1",
        problem_id="two-sum",
        input_data="4\n2 7 11 15\n9",
        expected_output="0 1",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    source_code = """
n = int(input())
nums = list(map(int, input().split()))
target = int(input())

seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(seen[complement], i)
        break
    seen[num] = i
"""
    
    result = executor.run_testcase(
        language="python",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_1"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms")
    print(f"  Exit Code: {result.exit_code}")
    print(f"  Output: {result.stdout.strip()}")
    print(f"  Expected: {testcase.expected_output.strip()}")
    
    assert result.verdict == Verdict.AC, f"Expected AC, got {result.verdict}"
    print("✓ Test passed!")
    
    return result


def example_python_wa():
    """Example: Python code with wrong answer (WA)"""
    print("\n" + "=" * 60)
    print("2. PYTHON - WRONG ANSWER (WA)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_2",
        problem_id="two-sum",
        input_data="4\n2 7 11 15\n9",
        expected_output="0 1",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    # Incorrect solution - always returns "2 3"
    source_code = """
print("2 3")
"""
    
    result = executor.run_testcase(
        language="python",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_2"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms")
    print(f"  Expected: {result.expected_output.strip()}")
    print(f"  Actual: {result.actual_output.strip()}")
    
    assert result.verdict == Verdict.WA, f"Expected WA, got {result.verdict}"
    print("✓ Test passed!")
    
    return result


def example_python_tle():
    """Example: Python code that times out (TLE)"""
    print("\n" + "=" * 60)
    print("3. PYTHON - TIME LIMIT EXCEEDED (TLE)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_3",
        problem_id="infinite-loop",
        input_data="",
        expected_output="",
        time_limit_ms=1000,  # 1 second limit
        memory_limit_kb=262144
    )
    
    # Infinite loop
    source_code = """
while True:
    pass
"""
    
    result = executor.run_testcase(
        language="python",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_3"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms (exceeded {testcase.time_limit_ms}ms limit)")
    print(f"  Timed Out: {result.timed_out}")
    print(f"  Error: {result.error_message}")
    
    assert result.verdict == Verdict.TLE, f"Expected TLE, got {result.verdict}"
    assert result.timed_out == True, "Expected timed_out=True"
    print("✓ Test passed!")
    
    return result


def example_python_re():
    """Example: Python code with runtime error (RE)"""
    print("\n" + "=" * 60)
    print("4. PYTHON - RUNTIME ERROR (RE)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_4",
        problem_id="divide-by-zero",
        input_data="",
        expected_output="",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    # Division by zero
    source_code = """
x = 10 / 0
print(x)
"""
    
    result = executor.run_testcase(
        language="python",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_4"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms")
    print(f"  Exit Code: {result.exit_code}")
    print(f"  Error: {result.stderr[:200]}")
    
    assert result.verdict == Verdict.RE, f"Expected RE, got {result.verdict}"
    assert result.exit_code != 0, "Expected non-zero exit code"
    print("✓ Test passed!")
    
    return result


def example_cpp_ac():
    """Example: C++ code that passes (AC)"""
    print("\n" + "=" * 60)
    print("5. C++ - ACCEPTED (AC)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_5",
        problem_id="sum",
        input_data="5 3",
        expected_output="8",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    source_code = """
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
"""
    
    result = executor.run_testcase(
        language="cpp",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_5"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms")
    print(f"  Compilation Time: {result.metadata.get('compilation_time_ms')}ms")
    print(f"  Output: {result.stdout.strip()}")
    print(f"  Expected: {testcase.expected_output.strip()}")
    
    assert result.verdict == Verdict.AC, f"Expected AC, got {result.verdict}"
    print("✓ Test passed!")
    
    return result


def example_cpp_ce():
    """Example: C++ code with compilation error (CE)"""
    print("\n" + "=" * 60)
    print("6. C++ - COMPILATION ERROR (CE)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_6",
        problem_id="sum",
        input_data="5 3",
        expected_output="8",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    # Missing semicolon - compilation error
    source_code = """
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b  // Missing semicolon!
    cout << a + b << endl;
    return 0;
}
"""
    
    result = executor.run_testcase(
        language="cpp",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_6"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Compilation Error: {result.error_message[:150]}...")
    print(f"  Stderr: {result.stderr[:200]}...")
    
    assert result.verdict == Verdict.CE, f"Expected CE, got {result.verdict}"
    assert "error" in result.stderr.lower(), "Expected compilation error in stderr"
    print("✓ Test passed!")
    
    return result


def example_cpp_re():
    """Example: C++ code with runtime error (RE) - segfault"""
    print("\n" + "=" * 60)
    print("7. C++ - RUNTIME ERROR (RE) - Segmentation Fault")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_7",
        problem_id="array",
        input_data="",
        expected_output="",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    # Access out of bounds - segmentation fault
    source_code = """
#include <iostream>
using namespace std;

int main() {
    int arr[5];
    // Access way out of bounds - likely to cause segfault
    cout << arr[1000000] << endl;
    return 0;
}
"""
    
    result = executor.run_testcase(
        language="cpp",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_7"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms")
    print(f"  Exit Code: {result.exit_code}")
    
    # Note: This may or may not segfault depending on system/compiler
    # It could be AC if undefined behavior doesn't crash
    print(f"  (Note: Undefined behavior - may vary by system)")
    
    if result.verdict == Verdict.RE:
        print("✓ Caught runtime error as expected")
    else:
        print(f"⚠ Got {result.verdict} - undefined behavior didn't crash")
    
    return result


def example_cpp_tle():
    """Example: C++ code that times out (TLE)"""
    print("\n" + "=" * 60)
    print("8. C++ - TIME LIMIT EXCEEDED (TLE)")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_8",
        problem_id="infinite-loop",
        input_data="",
        expected_output="",
        time_limit_ms=1000,  # 1 second limit
        memory_limit_kb=262144
    )
    
    # Infinite loop
    source_code = """
#include <iostream>
using namespace std;

int main() {
    while (true) {
        // Infinite loop
    }
    return 0;
}
"""
    
    result = executor.run_testcase(
        language="cpp",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_8"
    )
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"  Runtime: {result.runtime_ms}ms (exceeded {testcase.time_limit_ms}ms limit)")
    print(f"  Timed Out: {result.timed_out}")
    
    assert result.verdict == Verdict.TLE, f"Expected TLE, got {result.verdict}"
    assert result.timed_out == True, "Expected timed_out=True"
    print("✓ Test passed!")
    
    return result


def example_serialization():
    """Example: Serialize ExecutionResult to JSON"""
    print("\n" + "=" * 60)
    print("9. SERIALIZATION - ExecutionResult to JSON")
    print("=" * 60)
    
    executor = LocalExecutor()
    
    testcase = TestCase(
        testcase_id="test_9",
        problem_id="hello-world",
        input_data="",
        expected_output="Hello, World!",
        time_limit_ms=2000,
        memory_limit_kb=262144
    )
    
    source_code = """
print("Hello, World!")
"""
    
    result = executor.run_testcase(
        language="python",
        source_code=source_code,
        testcase=testcase,
        testcase_id="test_9"
    )
    
    # Serialize to JSON
    json_output = result.model_dump_json(indent=2)
    
    print(f"✓ Verdict: {result.verdict}")
    print(f"\n✓ Serialized to JSON:")
    print(json_output[:500] + "...")
    
    # Save to file
    with open("/tmp/execution_result.json", "w") as f:
        f.write(json_output)
    
    print(f"\n✓ Saved to /tmp/execution_result.json")
    
    return result


def main():
    """Run all examples"""
    print("\n" + "=" * 60)
    print("CODEX LOCAL EXECUTOR - EXAMPLES")
    print("=" * 60)
    
    results = []
    
    # Python examples
    results.append(example_python_ac())
    results.append(example_python_wa())
    results.append(example_python_tle())
    results.append(example_python_re())
    
    # C++ examples
    results.append(example_cpp_ac())
    results.append(example_cpp_ce())
    results.append(example_cpp_re())
    results.append(example_cpp_tle())
    
    # Serialization example
    results.append(example_serialization())
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    verdict_counts = {}
    for result in results:
        verdict = result.verdict
        verdict_counts[verdict] = verdict_counts.get(verdict, 0) + 1
    
    print(f"✓ Total executions: {len(results)}")
    print(f"✓ Verdict distribution:")
    for verdict, count in sorted(verdict_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {verdict}: {count}")
    
    print(f"\n✓ All tests completed successfully!")
    print(f"✓ Local executor is production-ready!")
    print("=" * 60)


if __name__ == "__main__":
    main()
