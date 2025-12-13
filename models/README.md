# CodeEX Auto-Grader Data Models

## Overview

Production-ready data models for the CodeEX Auto-Grader system using Pydantic V2.

## Models

### 1. Submission (`submission.py`)
Represents a user's code submission.

**Key Fields:**
- `submission_id`: Unique identifier
- `problem_id`: Problem being solved
- `user_id`: User who submitted
- `language`: Programming language (python, cpp, java)
- `source_code`: Raw source code
- `status`: QUEUED → GRADING → COMPLETED
- `verdict`: Final verdict (AC, WA, TLE, MLE, CE, RE)
- `runtime_ms`, `memory_kb`: Performance metrics

### 2. TestCase (`testcase.py`)
Defines a single test case for a problem.

**Key Fields:**
- `testcase_id`: Unique identifier
- `input_data`: Input for the test
- `expected_output`: Expected output
- `time_limit_ms`: Time limit for this test
- `memory_limit_kb`: Memory limit for this test
- `is_sample`: Is this visible to user?
- `is_hidden`: Is this hidden from user?

### 3. ExecutionResult (`result.py`)
Outcome of running code against one test case.

**Key Fields:**
- `testcase_id`: Which test was run
- `verdict`: AC, WA, TLE, MLE, CE, or RE
- `runtime_ms`: Actual execution time
- `memory_kb`: Peak memory usage
- `exit_code`: Process exit code
- `stdout`, `stderr`: Program output
- `timed_out`: Did it exceed time limit?
- `oom_killed`: Killed due to memory?

### 4. VerdictReport (`verdict.py`)
Final grading report aggregating all test results.

**Key Fields:**
- `submission_id`: Reference to submission
- `final_verdict`: Overall verdict
- `passed_tests`: Number passed
- `total_tests`: Total executed
- `max_runtime_ms`, `max_memory_kb`: Peak metrics
- `first_failed_test`: Which test failed first
- `testcase_results`: List of ExecutionResult objects
- `grading_duration_ms`: Total grading time

## Usage Examples

### Creating a Submission

```python
from models import Submission, SubmissionStatus

submission = Submission(
    submission_id="sub_abc123",
    problem_id="two-sum",
    user_id="user_456",
    language="python",
    source_code="def solve():\n    pass",
    status=SubmissionStatus.QUEUED
)

# Serialize to JSON
json_data = submission.model_dump_json()

# Deserialize from JSON
submission = Submission.model_validate_json(json_data)
```

### Creating a TestCase

```python
from models import TestCase

testcase = TestCase(
    testcase_id="test_1",
    problem_id="two-sum",
    input_data="4\n2 7 11 15\n9",
    expected_output="0 1",
    time_limit_ms=2000,
    memory_limit_kb=262144,
    is_sample=True,
    is_hidden=False
)
```

### Recording Execution Result

```python
from models import ExecutionResult, Verdict

result = ExecutionResult(
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
```

### Creating Verdict Report

```python
from models import VerdictReport, Verdict, ExecutionResult

report = VerdictReport(
    submission_id="sub_abc123",
    problem_id="two-sum",
    final_verdict=Verdict.AC,
    passed_tests=3,
    total_tests=3,
    max_runtime_ms=52,
    max_memory_kb=9216,
    testcase_results=[result1, result2, result3],
    grading_duration_ms=5234,
    language="python"
)

# Save to JSON file
with open("verdict.json", "w") as f:
    f.write(report.model_dump_json(indent=2))
```

## Validation

All models include automatic validation:

```python
# This will raise ValidationError
submission = Submission(
    submission_id="sub_123",
    problem_id="two-sum",
    user_id="user_456",
    language="rust",  # ❌ Not supported yet
    source_code="fn main() {}"
)
# ValueError: Language 'rust' not supported. Allowed: ['python', 'cpp', 'java']
```

## Serialization

All models are fully serializable:

```python
# To dict
data = submission.model_dump()

# To JSON string
json_str = submission.model_dump_json()

# To JSON with indentation
json_pretty = submission.model_dump_json(indent=2)

# From dict
submission = Submission.model_validate(data)

# From JSON
submission = Submission.model_validate_json(json_str)
```

## Verdict Priority

When aggregating test results, verdicts follow this priority:

```
CE > RE > TLE > MLE > WA > AC
```

Example: If 2 tests pass (AC) and 1 test times out (TLE), final verdict is **TLE**.

## No AI Fields

These models are **deterministic grading data only**. No AI-related fields are included. AI integration (for teaching feedback) will be a separate layer that consumes these models but never modifies verdicts.

## Dependencies

```bash
pip install pydantic>=2.0.0
```

## Testing

Run the example test file:

```bash
python models_example.py
```

## License

Part of CodeEX Auto-Grader System
