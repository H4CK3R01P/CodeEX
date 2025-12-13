# Quick Start: Local Executor

## 1-Minute Setup

```python
from runner import LocalExecutor
from models import TestCase

# Create executor
executor = LocalExecutor()

# Create test case
testcase = TestCase(
    testcase_id="test_1",
    problem_id="hello-world",
    input_data="",
    expected_output="Hello, World!",
    time_limit_ms=2000,
    memory_limit_kb=262144
)

# Run Python code
result = executor.run_testcase(
    language="python",
    source_code='print("Hello, World!")',
    testcase=testcase,
    testcase_id="test_1"
)

# Check result
print(f"Verdict: {result.verdict}")  # Verdict.AC
print(f"Runtime: {result.runtime_ms}ms")
print(f"Output: {result.stdout.strip()}")
```

## Common Patterns

### Python Execution

```python
python_code = """
n = int(input())
print(n * 2)
"""

testcase = TestCase(
    testcase_id="test_1",
    problem_id="double",
    input_data="5",
    expected_output="10",
    time_limit_ms=2000,
    memory_limit_kb=262144
)

result = executor.run_testcase("python", python_code, testcase, "test_1")
```

### C++ Execution

```python
cpp_code = """
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << n * 2 << endl;
    return 0;
}
"""

result = executor.run_testcase("cpp", cpp_code, testcase, "test_1")
# Compilation happens automatically
```

### Check Verdict

```python
from models import Verdict

if result.verdict == Verdict.AC:
    print("✓ Accepted!")
elif result.verdict == Verdict.WA:
    print(f"✗ Wrong Answer")
    print(f"  Expected: {result.expected_output}")
    print(f"  Got: {result.actual_output}")
elif result.verdict == Verdict.TLE:
    print(f"✗ Time Limit Exceeded ({result.runtime_ms}ms)")
elif result.verdict == Verdict.RE:
    print(f"✗ Runtime Error: {result.error_message}")
elif result.verdict == Verdict.CE:
    print(f"✗ Compilation Error: {result.error_message}")
```

### Multiple Test Cases

```python
testcases = [
    TestCase(testcase_id="test_1", input_data="5", expected_output="10", ...),
    TestCase(testcase_id="test_2", input_data="10", expected_output="20", ...),
    TestCase(testcase_id="test_3", input_data="0", expected_output="0", ...),
]

results = []
for tc in testcases:
    result = executor.run_testcase(
        language="python",
        source_code=code,
        testcase=tc,
        testcase_id=tc.testcase_id
    )
    results.append(result)
    
    # Early exit on first failure
    if result.verdict != Verdict.AC:
        break

# Count passed tests
passed = sum(1 for r in results if r.verdict == Verdict.AC)
print(f"Passed: {passed}/{len(results)}")
```

### Serialize to JSON

```python
# Single result
json_str = result.model_dump_json(indent=2)
print(json_str)

# Save to file
with open("result.json", "w") as f:
    f.write(result.model_dump_json(indent=2))

# All results
results_json = [r.model_dump() for r in results]
import json
with open("all_results.json", "w") as f:
    json.dump(results_json, f, indent=2)
```

## Verdict Examples

### Accepted (AC)

```python
# Correct solution
code = "print('Hello, World!')"
testcase.expected_output = "Hello, World!"

result = executor.run_testcase("python", code, testcase, "test_1")
assert result.verdict == Verdict.AC
```

### Wrong Answer (WA)

```python
# Incorrect solution
code = "print('Goodbye, World!')"
testcase.expected_output = "Hello, World!"

result = executor.run_testcase("python", code, testcase, "test_1")
assert result.verdict == Verdict.WA
print(f"Expected: {result.expected_output}")
print(f"Got: {result.actual_output}")
```

### Time Limit Exceeded (TLE)

```python
# Infinite loop
code = "while True: pass"
testcase.time_limit_ms = 1000  # 1 second

result = executor.run_testcase("python", code, testcase, "test_1")
assert result.verdict == Verdict.TLE
assert result.timed_out == True
```

### Runtime Error (RE)

```python
# Division by zero
code = "print(10 / 0)"

result = executor.run_testcase("python", code, testcase, "test_1")
assert result.verdict == Verdict.RE
assert result.exit_code != 0
```

### Compilation Error (CE)

```python
# C++ with syntax error
code = """
#include <iostream>
int main() {
    std::cout << "Hello"  // Missing semicolon
    return 0;
}
"""

result = executor.run_testcase("cpp", code, testcase, "test_1")
assert result.verdict == Verdict.CE
print(result.stderr)  # Compiler error message
```

## Error Handling

```python
try:
    result = executor.run_testcase(
        language="rust",  # Unsupported language
        source_code="fn main() {}",
        testcase=testcase,
        testcase_id="test_1"
    )
except ValueError as e:
    print(f"Error: {e}")
    # "Language 'rust' not supported"
```

## Cleanup

```python
# Cleanup all temporary files
executor.cleanup_work_dir()

# Or let Python's garbage collector handle it
# (temp files are cleaned up after each execution)
```

## Testing

```bash
# Run examples
python runner_example.py

# Expected output:
# ✓ All tests completed successfully!
```

## Tips

1. **Always check verdict**: Don't assume success
2. **Handle timeouts**: Set reasonable time limits
3. **Capture errors**: Check stderr for debug info
4. **Early exit**: Stop on first failure for efficiency
5. **Cleanup**: Periodically cleanup temp files
6. **Security**: Don't use in production without Docker sandbox

## Full Example

```python
#!/usr/bin/env python3
from runner import LocalExecutor
from models import TestCase, Verdict

def grade_submission(code: str, language: str):
    executor = LocalExecutor()
    
    # Define test cases
    tests = [
        TestCase(
            testcase_id=f"test_{i}",
            problem_id="sum",
            input_data=f"{i} {i}",
            expected_output=str(i * 2),
            time_limit_ms=2000,
            memory_limit_kb=262144
        )
        for i in range(1, 6)
    ]
    
    # Run all tests
    passed = 0
    for test in tests:
        result = executor.run_testcase(
            language=language,
            source_code=code,
            testcase=test,
            testcase_id=test.testcase_id
        )
        
        if result.verdict == Verdict.AC:
            passed += 1
            print(f"✓ {test.testcase_id}: AC ({result.runtime_ms}ms)")
        else:
            print(f"✗ {test.testcase_id}: {result.verdict}")
            break  # Early exit
    
    print(f"\nResult: {passed}/{len(tests)} tests passed")
    return passed == len(tests)

# Test it
python_code = """
a, b = map(int, input().split())
print(a + b)
"""

success = grade_submission(python_code, "python")
```

---

**Ready to use!** 🚀
