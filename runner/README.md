# Local Executor - Subprocess-Based Code Execution

## Overview

Production-ready local execution engine for CodeEX Auto-Grader. Executes Python and C++ code using subprocess with time limits and comprehensive error handling.

## Features

✅ **Language Support**: Python 3.x and C++ (g++)  
✅ **Compilation**: Automatic C++ compilation with g++ (Python skips this step)  
✅ **Time Limits**: Wall-clock time enforcement with subprocess timeouts  
✅ **Output Capture**: stdout and stderr with size limits (10MB/1MB)  
✅ **Exit Code Tracking**: Proper exit code handling  
✅ **Verdict Mapping**: Automatic mapping to AC/WA/TLE/MLE/CE/RE  
✅ **Phase 1 Integration**: Returns ExecutionResult models  
✅ **Resource Cleanup**: Automatic temp file cleanup  

## Architecture

```
LocalExecutor
    │
    ├── compile()           → Compile C++ code (skip for Python)
    │   ├── g++ -O2 -std=c++17
    │   └── Returns CompilationResult
    │
    ├── execute()           → Run code with timeout
    │   ├── subprocess.run(timeout=limit)
    │   ├── Capture stdout/stderr
    │   └── Returns (exit_code, stdout, stderr, runtime, timed_out)
    │
    └── run_testcase()      → Main entry point
        ├── Create temp directory
        ├── Write source code
        ├── Compile (if needed)
        ├── Write input data
        ├── Execute with timeout
        ├── Determine verdict
        └── Return ExecutionResult
```

## Usage

### Basic Example

```python
from runner import LocalExecutor
from models import TestCase

# Create executor
executor = LocalExecutor()

# Define test case
testcase = TestCase(
    testcase_id="test_1",
    problem_id="two-sum",
    input_data="4\n2 7 11 15\n9",
    expected_output="0 1",
    time_limit_ms=2000,
    memory_limit_kb=262144
)

# Python code
result = executor.run_testcase(
    language="python",
    source_code="print('0 1')",
    testcase=testcase,
    testcase_id="test_1"
)

print(f"Verdict: {result.verdict}")  # Verdict.AC
print(f"Runtime: {result.runtime_ms}ms")
```

### C++ Example

```python
cpp_code = """
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
    source_code=cpp_code,
    testcase=testcase,
    testcase_id="test_1"
)
```

## Verdict Determination

### Priority Flow

```
1. Compilation Failed?   → CE (Compilation Error)
2. Timed Out?            → TLE (Time Limit Exceeded)
3. Exit Code != 0?       → RE (Runtime Error)
4. Output Matches?       → AC (Accepted) or WA (Wrong Answer)
```

### Verdict Mapping

| Condition | Verdict | Description |
|-----------|---------|-------------|
| Compilation fails | **CE** | g++ returns non-zero exit code |
| Process timeout | **TLE** | Exceeds `time_limit_ms` |
| Exit code != 0 | **RE** | Crash, exception, segfault |
| Output matches | **AC** | Correct answer |
| Output differs | **WA** | Wrong answer |

## Configuration

### Language Settings

```python
LANGUAGE_CONFIGS = {
    'python': {
        'extension': '.py',
        'requires_compilation': False,
        'execute_command': ['python3', '{source_file}']
    },
    'cpp': {
        'extension': '.cpp',
        'requires_compilation': True,
        'compile_command': [
            'g++', '-O2', '-std=c++17', '-Wall',
            '{source_file}', '-o', '{binary_file}'
        ],
        'execute_command': ['{binary_file}']
    }
}
```

### Limits

| Limit | Value | Description |
|-------|-------|-------------|
| Max stdout | 10 MB | Output truncated beyond this |
| Max stderr | 1 MB | Error output truncated |
| Compile timeout | 10 seconds | Compilation time limit |
| Work directory | `/tmp/codex_executor` | Temp files location |

## Error Handling

### Compilation Errors (CE)

```python
# Missing semicolon
source_code = """
#include <iostream>
int main() {
    std::cout << "Hello"  // Missing semicolon
    return 0;
}
"""

result = executor.run_testcase(...)
# result.verdict == Verdict.CE
# result.stderr contains compiler error message
```

### Runtime Errors (RE)

```python
# Division by zero
source_code = """
x = 10 / 0
"""

result = executor.run_testcase(...)
# result.verdict == Verdict.RE
# result.exit_code != 0
# result.stderr contains traceback
```

### Time Limit Exceeded (TLE)

```python
# Infinite loop
source_code = """
while True:
    pass
"""

result = executor.run_testcase(...)
# result.verdict == Verdict.TLE
# result.timed_out == True
# result.runtime_ms > testcase.time_limit_ms
```

## Temporary Files

### Directory Structure

```
/tmp/codex_executor/
└── exec_{random_id}/
    ├── solution.py        # Python source
    ├── solution.cpp       # C++ source
    ├── solution           # Compiled C++ binary
    └── input.txt          # Test input
```

### Cleanup

Automatic cleanup after each execution:

```python
# Manual cleanup of all temp files
executor.cleanup_work_dir()
```

## Output Comparison

Currently uses **exact string matching** after stripping whitespace:

```python
actual_output = stdout.strip()
expected = expected_output.strip()

if actual_output == expected:
    verdict = Verdict.AC
else:
    verdict = Verdict.WA
```

### Future Enhancements

- Token-based comparison (whitespace-insensitive)
- Floating-point comparison with epsilon tolerance
- Custom checker support

## Integration with Phase 1 Models

Returns `ExecutionResult` from Phase 1:

```python
ExecutionResult(
    testcase_id="test_1",
    verdict=Verdict.AC,
    runtime_ms=45,
    memory_kb=0,              # Not tracked in local mode
    exit_code=0,
    stdout="0 1\n",
    stderr="",
    timed_out=False,
    oom_killed=False,         # Not applicable without Docker
    metadata={
        "language": "python",
        "time_limit_ms": 2000,
        "compilation_time_ms": 0
    }
)
```

## Limitations

### Current Limitations

1. **No Memory Tracking**: `memory_kb` always 0 (requires Docker/cgroups)
2. **No OOM Detection**: `oom_killed` always False
3. **Simple Output Comparison**: Exact string match only
4. **No Security Isolation**: Runs on host system (use Docker for production)
5. **Single Test Case**: Executes one test at a time (by design)

### Production Considerations

⚠️ **Security Warning**: This executor runs code directly on the host system. For production:
- Use Docker-based sandbox (Phase 3)
- Enable seccomp filtering
- Enforce resource limits via cgroups
- Run in isolated environment

## Testing

Run comprehensive tests:

```bash
python runner_example.py
```

Tests cover:
- ✅ Python AC (Accepted)
- ✅ Python WA (Wrong Answer)
- ✅ Python TLE (Time Limit Exceeded)
- ✅ Python RE (Runtime Error)
- ✅ C++ AC (Accepted)
- ✅ C++ CE (Compilation Error)
- ✅ C++ RE (Runtime Error - Segfault)
- ✅ C++ TLE (Time Limit Exceeded)
- ✅ JSON Serialization

## Performance

Typical execution times (on modern hardware):

| Operation | Time |
|-----------|------|
| Python execution | 20-50ms |
| C++ compilation | 1-3 seconds |
| C++ execution | 5-20ms |
| Temp file cleanup | <1ms |

## API Reference

### LocalExecutor

```python
class LocalExecutor:
    def __init__(self, work_dir: Optional[str] = None)
    
    def run_testcase(
        self,
        language: str,
        source_code: str,
        testcase: TestCase,
        testcase_id: str
    ) -> ExecutionResult
    
    def compile(
        self,
        language: str,
        source_file: Path,
        temp_dir: Path
    ) -> CompilationResult
    
    def execute(
        self,
        language: str,
        source_file: Path,
        binary_file: Optional[Path],
        input_file: Path,
        time_limit_ms: int,
        temp_dir: Path
    ) -> Tuple[int, str, str, int, bool]
    
    def cleanup_work_dir(self)
```

### CompilationResult

```python
@dataclass
class CompilationResult:
    success: bool
    binary_path: Optional[str] = None
    stderr: str = ""
    compile_time_ms: int = 0
```

## Dependencies

```bash
# Python 3.x (built-in subprocess module)
# g++ compiler for C++
sudo apt-get install g++
```

## Next Steps - Phase 3

Future Docker-based executor will add:
- ✅ Memory tracking via cgroups
- ✅ OOM detection
- ✅ Security isolation
- ✅ Network isolation
- ✅ Filesystem restrictions
- ✅ Resource limits enforcement

---

**Status**: ✅ Production-ready for development/testing  
**Security**: ⚠️ Use Docker sandbox for production  
**Phase**: 2 of 4 (Local Executor Complete)
