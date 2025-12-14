# AI Verification Pipelines

**Version:** 1.0.0  
**Type:** Verification System (Not AI Agents)  
**Status:** ✅ Complete

---

## 🎯 Purpose

**NEVER trust AI output directly.** This verification system validates all AI-generated content before it reaches users.

### Core Principle:
```
AI Generation → Verification Pipeline → User
                      ↓
                   REJECT if bad
```

---

## 📁 Structure

```
backend/ai/verification/
├── __init__.py                    # Package exports
├── README.md                      # This file
├── verification_pipeline.py       # Orchestrator
├── solution_validator.py          # Execute & validate solutions
├── test_case_generator.py         # Generate edge cases
├── explanation_checker.py         # Verify explanations
└── determinism_guard.py           # Check consistency
```

---

## 🔍 Verification Components

### 1. **Solution Validator** (`solution_validator.py`)

**Purpose:** Execute AI-generated code in Docker sandbox

**What it does:**
- Security checks (detect malicious code)
- Execute code in isolated Docker container
- Validate against test cases
- Check for timeouts, errors, crashes

**Rejection Criteria:**
- ❌ Malicious code patterns (eval, exec, os.system)
- ❌ Compilation errors
- ❌ Runtime errors
- ❌ Wrong output
- ❌ Timeout

**Usage:**
```python
from backend.ai.verification import SolutionValidator

validator = SolutionValidator(use_docker=True)
result = validator.validate(
    source_code=ai_generated_code,
    language='python',
    test_cases=test_cases
)

if not result.is_valid:
    # REJECT - Don't show to user
    print(f"Rejected: {result.status}")
```

---

### 2. **Test Case Generator** (`test_case_generator.py`)

**Purpose:** Generate edge cases to thoroughly test solutions

**What it generates:**
- Empty inputs
- Single elements
- Maximum size inputs
- Boundary values
- Corner cases
- Duplicate elements

**Test Types:**
- Array tests (empty, single, large, duplicates)
- String tests (empty, single char, max length)
- Numeric tests (zero, min, max, negative)
- Graph tests (single node, disconnected, complete)

**Usage:**
```python
from backend.ai.verification import TestCaseGenerator

generator = TestCaseGenerator()

# Generate array edge cases
edge_cases = generator.generate_array_tests(
    min_size=0,
    max_size=1000,
    count=5
)

# Generate string edge cases
string_cases = generator.generate_string_tests(
    max_length=1000,
    charset='abc',
    count=5
)
```

---

### 3. **Explanation Checker** (`explanation_checker.py`)

**Purpose:** Verify explanations match the actual code logic

**What it checks:**
- Algorithm mentions match code structure
- Complexity claims match implementation
- No hallucinated features
- No missing key concepts

**Detection:**
- ✅ Extracts code features (loops, recursion, data structures)
- ✅ Extracts explanation claims
- ✅ Finds mismatches and hallucinations
- ✅ Verifies complexity claims (O(n), O(n²), etc.)

**Rejection Criteria:**
- ❌ Hallucinations (mentions non-existent features)
- ❌ Wrong complexity claims
- ❌ Missing important concepts
- ❌ Accuracy < 70%

**Usage:**
```python
from backend.ai.verification import ExplanationChecker

checker = ExplanationChecker()
result = checker.check(
    source_code=code,
    explanation=ai_explanation,
    language='python'
)

if not result.is_acceptable:
    # REJECT explanation
    print(f"Issues: {result.issues}")
    print(f"Hallucinated: {result.hallucinated_concepts}")
```

---

### 4. **Determinism Guard** (`determinism_guard.py`)

**Purpose:** Detect inconsistent AI outputs by re-running generation

**What it does:**
- Runs AI generation 3 times
- Compares outputs for similarity
- Detects significant variations
- Calculates consistency score

**Rejection Criteria:**
- ❌ Similarity < 85% (outputs differ significantly)
- ❌ Completely different solutions
- ❌ Inconsistent logic

**Usage:**
```python
from backend.ai.verification import DeterminismGuard

guard = DeterminismGuard(num_runs=3, min_acceptable_similarity=0.85)

# For async AI calls
result = await guard.check_async(ai_generation_function)

if result.should_reject:
    # REJECT - AI is too inconsistent
    print(f"Consistency: {result.similarity_score:.2f}")
    print(f"Unique outputs: {result.unique_count}")
```

---

## 🔄 Verification Pipeline

### Execution Order:

```
1. DETERMINISM CHECK
   ↓ (if inconsistent → REJECT)
   
2. SOLUTION VALIDATION
   ↓ (if invalid → REJECT)
   
3. EDGE CASE GENERATION & TESTING
   ↓ (if fails edge cases → REJECT)
   
4. EXPLANATION CHECK
   ↓ (if hallucinations → REJECT)
   
5. ✅ PASS → Show to user
```

### Pipeline Usage:

```python
from backend.ai.verification import VerificationPipeline

pipeline = VerificationPipeline(
    enable_determinism_check=True,
    enable_solution_validation=True,
    enable_edge_case_generation=True,
    enable_explanation_check=True,
    strict_mode=True  # Reject on any failure
)

result = await pipeline.verify_solution_async(
    source_code=ai_generated_code,
    language='python',
    test_cases=test_cases,
    explanation=ai_explanation,
    ai_generator_func=generator_function
)

if result.is_acceptable:
    # ✅ PASSED all checks - safe to show user
    return ai_generated_code
else:
    # ❌ FAILED - Reject and regenerate
    print(f"Rejection reason: {result.rejection_reason}")
    print(f"Passed: {result.passed_stages}/{result.total_stages}")
    # Don't show to user, try again or use fallback
```

---

## ⚙️ Configuration

### Strict Mode vs. Permissive Mode

**Strict Mode (Recommended):**
- Rejects if ANY check fails
- Highest quality guarantee
- May need more retries

**Permissive Mode:**
- Accepts if MOST checks pass
- Faster (fewer retries)
- Lower quality guarantee

### Customization:

```python
# Custom pipeline
pipeline = VerificationPipeline(
    enable_determinism_check=True,    # Check consistency
    enable_solution_validation=True,  # Execute code
    enable_edge_case_generation=False, # Skip edge cases
    enable_explanation_check=True,    # Verify explanation
    strict_mode=True                  # Reject on any failure
)

# Custom determinism guard
guard = DeterminismGuard(
    num_runs=5,                      # Run 5 times (more thorough)
    min_acceptable_similarity=0.90   # Require 90% similarity
)

# Custom test generator
generator = TestCaseGenerator(seed=42)  # Reproducible tests
```

---

## 🚨 Security Features

### Malicious Code Detection:

```python
# BLOCKED patterns:
- import os
- import sys
- subprocess.*
- eval()
- exec()
- __import__
- open()
- system()
```

### Sandbox Execution:
- ✅ Docker isolation
- ✅ No network access
- ✅ Resource limits (CPU, memory)
- ✅ Time limits
- ✅ Read-only filesystem

---

## 📊 Metrics & Monitoring

### Pipeline Result:
```python
result = pipeline.verify_solution(...)

print(f"Status: {result.status}")
print(f"Passed: {result.passed_stages}/{result.total_stages}")
print(f"Duration: {result.total_duration_ms}ms")

# Individual stage results
for stage, stage_result in result.stage_results.items():
    print(f"{stage}: {'✅' if stage_result.passed else '❌'}")
    if not stage_result.passed:
        print(f"  Error: {stage_result.error}")
```

---

## 🔧 Integration Examples

### Example 1: Validate AI Solution

```python
from backend.ai.verification import VerificationPipeline

# AI generates solution
ai_code = ai_model.generate_solution(problem)

# Verify before showing to user
pipeline = VerificationPipeline(strict_mode=True)
result = pipeline.verify_solution(
    source_code=ai_code,
    language='python',
    test_cases=problem.test_cases
)

if result.is_acceptable:
    return {"code": ai_code, "verified": True}
else:
    # Regenerate or use fallback
    return {"error": "Verification failed", "reason": result.rejection_reason}
```

### Example 2: Validate with Explanation

```python
# AI generates both code and explanation
ai_output = ai_model.generate_solution_with_explanation(problem)

pipeline = VerificationPipeline()
result = await pipeline.verify_solution_async(
    source_code=ai_output['code'],
    language='python',
    test_cases=problem.test_cases,
    explanation=ai_output['explanation']
)

if result.is_acceptable:
    return ai_output
else:
    # Check what failed
    explanation_stage = result.stage_results.get(PipelineStage.EXPLANATION_CHECK)
    if explanation_stage and not explanation_stage.passed:
        # Regenerate only explanation
        ai_output['explanation'] = ai_model.regenerate_explanation(ai_output['code'])
```

### Example 3: Retry Logic

```python
MAX_RETRIES = 3

for attempt in range(MAX_RETRIES):
    ai_code = ai_model.generate_solution(problem)
    
    result = pipeline.verify_solution(
        source_code=ai_code,
        language='python',
        test_cases=problem.test_cases
    )
    
    if result.is_acceptable:
        return ai_code  # SUCCESS
    
    print(f"Attempt {attempt + 1} failed: {result.rejection_reason}")

# All retries failed - use fallback or return error
return None
```

---

## ⚠️ Important Notes

### These Are NOT Agents:
- ✅ Pure verification logic
- ✅ No AI/LLM calls
- ✅ Deterministic checks
- ❌ Not autonomous agents

### Key Principles:
1. **Never trust AI output directly**
2. **Always verify before showing to user**
3. **Reject bad outputs immediately**
4. **Execute in isolated sandbox**
5. **Check for hallucinations**
6. **Test edge cases**
7. **Verify consistency**

### Failure Modes:
- If verification fails → **REJECT and regenerate**
- If retries exhausted → **Use fallback or return error**
- Never show unverified AI output to users

---

## 🚀 Future Enhancements

- [ ] Plagiarism detection
- [ ] Style consistency checks
- [ ] Performance benchmarking
- [ ] Security vulnerability scanning
- [ ] Code quality metrics
- [ ] Test coverage analysis
- [ ] Multi-language support expansion

---

## 📈 Performance

**Typical Execution Times:**
- Determinism Check: 3-10 seconds (3 AI calls)
- Solution Validation: 0.5-2 seconds per test case
- Edge Case Generation: < 100ms
- Explanation Check: < 50ms

**Total Pipeline:** 5-15 seconds (depends on test case count)

---

## ✅ Status

- ✅ Solution Validator implemented
- ✅ Test Case Generator implemented
- ✅ Explanation Checker implemented
- ✅ Determinism Guard implemented
- ✅ Verification Pipeline orchestrator
- ✅ Docker sandbox integration
- ✅ Security checks
- ⏳ Integration with AI agents (pending)

**Status:** 🟢 **COMPLETE - READY FOR USE**

---

*Never trust AI output directly. Always verify.*
