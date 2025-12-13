# Quick Reference: CodeEX Auto-Grader Data Models

## Import Statement

```python
from models import (
    Submission, SubmissionStatus,
    TestCase,
    ExecutionResult, Verdict,
    VerdictReport
)
```

## Model Hierarchy

```
Submission              → User's code submission
    ├─ TestCase         → Individual test case for a problem
    ├─ ExecutionResult  → Result of running code on one test case
    └─ VerdictReport    → Final aggregated verdict
```

## Verdict Types (Priority Order)

```python
class Verdict(str, Enum):
    CE = "CE"      # Compilation Error (highest priority)
    RE = "RE"      # Runtime Error
    TLE = "TLE"    # Time Limit Exceeded
    MLE = "MLE"    # Memory Limit Exceeded
    WA = "WA"      # Wrong Answer
    AC = "AC"      # Accepted (lowest priority, best)
```

## Submission Status Flow

```
QUEUED → GRADING → COMPLETED
           ↓
         ERROR (if system failure)
```

## Key Field Limits

| Field | Limit | Notes |
|-------|-------|-------|
| `source_code` | 100 KB | Max code size |
| `stdout` | 10 MB | Max output captured |
| `stderr` | 1 MB | Max error output |
| `error_message` | 10 KB | Max error description |

## Common Patterns

### Create Submission
```python
sub = Submission(
    submission_id="sub_xyz",
    problem_id="two-sum",
    user_id="user_123",
    language="python",
    source_code="def solve(): pass"
)
```

### Create TestCase
```python
tc = TestCase(
    testcase_id="test_1",
    problem_id="two-sum",
    input_data="input here",
    expected_output="output here",
    time_limit_ms=2000,
    memory_limit_kb=262144
)
```

### Record Execution Result
```python
result = ExecutionResult(
    testcase_id="test_1",
    verdict=Verdict.AC,
    runtime_ms=45,
    memory_kb=8192,
    exit_code=0,
    stdout="output",
    stderr=""
)
```

### Generate Verdict Report
```python
report = VerdictReport(
    submission_id="sub_xyz",
    problem_id="two-sum",
    final_verdict=Verdict.AC,
    passed_tests=3,
    total_tests=3,
    max_runtime_ms=52,
    max_memory_kb=9216,
    testcase_results=[result1, result2, result3],
    grading_duration_ms=5000,
    language="python"
)
```

## Serialization

```python
# To JSON string
json_str = submission.model_dump_json()

# To JSON with indentation
pretty = submission.model_dump_json(indent=2)

# To dict
data = submission.model_dump()

# From JSON
sub = Submission.model_validate_json(json_str)

# From dict
sub = Submission.model_validate(data)
```

## Validation Examples

```python
# ✓ Valid
Submission(..., language="python")    # OK
Submission(..., language="cpp")       # OK
Submission(..., language="java")      # OK

# ✗ Invalid
Submission(..., language="rust")      # ValueError
Submission(..., source_code="")       # ValueError (too short)
TestCase(..., time_limit_ms=-1)       # ValueError (must be > 0)
TestCase(..., memory_limit_kb=0)      # ValueError (must be > 0)
```

## Metadata Usage

All models have a `metadata: dict` field for custom data:

```python
# Submission metadata
submission.metadata = {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0",
    "retry_count": 0
}

# ExecutionResult metadata
result.metadata = {
    "container_id": "abc123",
    "worker_id": "worker_1",
    "signal": "SIGSEGV"
}

# VerdictReport metadata
report.metadata = {
    "grading_server": "grader-01",
    "queue_wait_ms": 1500
}
```

## Common Checks

```python
# Check if submission is complete
if submission.status == SubmissionStatus.COMPLETED:
    print(f"Verdict: {submission.verdict}")

# Check if all tests passed
if report.final_verdict == Verdict.AC:
    print("All tests passed!")

# Check if timed out
if result.timed_out:
    assert result.verdict == Verdict.TLE

# Check if crashed
if result.exit_code != 0 and not result.timed_out:
    assert result.verdict == Verdict.RE
```

## Best Practices

1. **Always use Enums** for verdict and status (type-safe)
2. **Validate before saving** - Pydantic does this automatically
3. **Truncate large outputs** - stdout/stderr have size limits
4. **Set metadata** - useful for debugging and auditing
5. **Use timestamps** - created_at and graded_at for tracking
6. **Store detailed errors** - error_message field for CE/RE cases

## Integration with Database

```python
# Store to database (pseudo-code)
db.submissions.insert_one(submission.model_dump())

# Load from database
data = db.submissions.find_one({"submission_id": "sub_xyz"})
submission = Submission.model_validate(data)
```

## Integration with Queue

```python
# Enqueue for grading
redis.lpush("grading_queue", submission.model_dump_json())

# Dequeue for processing
data = redis.brpop("grading_queue", timeout=5)
submission = Submission.model_validate_json(data[1])
```

## No AI Fields

These models contain **zero AI-related fields**. They are deterministic grading data only.

Future AI integration will consume these models but **never modify verdicts**.

---

**Status:** ✅ Production-ready  
**Dependencies:** `pydantic>=2.0.0`  
**Testing:** Run `python models_example.py`
