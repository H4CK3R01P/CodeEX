# CodeEX AI Orchestrator

**File:** `backend/ai/orchestrator.py`  
**Version:** 1.0.0  
**Status:** ✅ Complete

---

## 🎯 Purpose

**Main orchestration layer** that integrates all AI systems:
- Domain configuration
- Agent permissions
- Brain client
- Verification pipelines
- Database storage

---

## 🔄 **Complete Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                      API REQUEST                            │
│  process_request(OrchestrationRequest)                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: LOAD DOMAIN CONFIGURATION                          │
│  ───────────────────────────────────                        │
│  • Load from domains/ (competitive_programming.yaml)        │
│  • Get difficulty levels, AI settings, constraints          │
│  • Pass config to subsequent steps                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: CHECK PERMISSIONS                                  │
│  ───────────────────────────                                │
│  • agents/permission_enforcer.py                            │
│  • Check if agent can perform action                        │
│  • Verify authorization criteria (if needed)                │
│  ├─ ❌ DENIED → Return FAILED_PERMISSION                    │
│  └─ ✅ ALLOWED → Continue                                   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: CALL CODEX_BRAIN (with retry)                     │
│  ───────────────────────────────────                        │
│  • brain_client.py                                          │
│  • Select subagent (TEACHER, HINT, CODING, etc.)           │
│  • Pass domain config + problem context                     │
│  • Retry on failure (max 3 attempts)                        │
│  ├─ ❌ API FAILURE → Return FAILED_API / RETRY_EXHAUSTED    │
│  └─ ✅ SUCCESS → Receive UNTRUSTED output                   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: VERIFY OUTPUT                                      │
│  ───────────────────────                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  4a. ROLE VALIDATION                                 │   │
│  │  agents/role_validator.py                            │   │
│  │  • Check output against agent role                   │   │
│  │  • HINT: Must not contain code                       │   │
│  │  • PLANNER: Must not have implementation             │   │
│  ├─ ❌ VIOLATION → Return FAILED_VERIFICATION            │   │
│  └─ ✅ VALID → Continue                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│          ↓                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  4b. CONTENT VERIFICATION (if applicable)            │   │
│  │  verification/verification_pipeline.py               │   │
│  │                                                       │   │
│  │  For SOLUTION requests:                              │   │
│  │  • Execute code in Docker                            │   │
│  │  • Test against test cases                           │   │
│  │  • Check edge cases                                  │   │
│  │  • Verify explanation matches code                   │   │
│  ├─ ❌ FAILED → Return FAILED_VERIFICATION                │   │
│  └─ ✅ PASSED → Continue                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: SAVE TO DATABASE                                   │
│  ───────────────────────────                                │
│  • Store request + response                                 │
│  • Store verification results                               │
│  • Track metrics (time, retries, etc.)                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: RETURN SAFE RESPONSE                               │
│  ───────────────────────────────                            │
│  OrchestrationResult {                                      │
│    status: SUCCESS                                          │
│    output: "verified AI output"  ✅ SAFE TO USE             │
│    metadata: {...}                                          │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ **Error Handling Strategy**

### **1. Permission Denied**
```
Permission Check → ❌ DENIED
         ↓
Return FAILED_PERMISSION
         ↓
DON'T call Brain
DON'T retry
ABORT immediately
```

**Status:** `FAILED_PERMISSION`  
**Action:** Inform user of authorization issue

---

### **2. Brain API Failure**
```
Call Brain → ❌ API ERROR
      ↓
Retry (attempt 1/3)
      ↓
❌ Still failing
      ↓
Retry (attempt 2/3)
      ↓
❌ Still failing
      ↓
Retry (attempt 3/3)
      ↓
❌ All retries exhausted
      ↓
Return FAILED_RETRY_EXHAUSTED
```

**Status:** `FAILED_API` or `FAILED_RETRY_EXHAUSTED`  
**Action:** Use fallback or inform user of service issue

---

### **3. Verification Failure**
```
Verification → ❌ FAILED
         ↓
    Option A: REGENERATE
         ↓
Call Brain again (new attempt)
         ↓
Verify again
         ↓
✅ Pass → Return success
❌ Fail → Retry until max

    Option B: ABORT
         ↓
Return FAILED_VERIFICATION
Don't show output to user
```

**Status:** `FAILED_VERIFICATION`  
**Action:** Regenerate or use fallback

---

### **4. Unexpected Error**
```
Any step → ❌ EXCEPTION
      ↓
Log error with stack trace
      ↓
Return ABORTED
      ↓
DON'T expose internal details to user
```

**Status:** `ABORTED`  
**Action:** Generic error message to user

---

## 🚀 **Usage Examples**

### **Example 1: Teacher Request**

```python
from backend.ai.orchestrator import (
    CodeEXOrchestrator,
    OrchestrationRequest,
    RequestType,
    OrchestrationStatus
)

# Initialize orchestrator
orchestrator = CodeEXOrchestrator()

# Create request
request = OrchestrationRequest(
    request_type=RequestType.TEACHING,
    agent="TEACHER_AGENT",
    problem_context={
        'concept': 'Binary Search Algorithm',
        'detail_level': 'detailed'
    },
    domain="dsa"
)

# Process request
result = await orchestrator.process_request(request)

# Check result
if result.status == OrchestrationStatus.SUCCESS:
    print("✅ Success!")
    print(f"Output: {result.output}")
    print(f"Time: {result.total_time_ms}ms")
else:
    print(f"❌ Failed: {result.status}")
    print(f"Reason: {result.rejection_reason}")
```

---

### **Example 2: Hint Request (with validation)**

```python
# Request hint
request = OrchestrationRequest(
    request_type=RequestType.HINT,
    agent="HINT_AGENT",
    problem_context={
        'problem_description': 'Find two numbers that sum to target',
        'user_code': '# User attempt',
        'hint_level': 1
    },
    domain="competitive_programming",
    user_context={
        'attempt_count': 2
    }
)

result = await orchestrator.process_request(request)

# Orchestrator automatically:
# 1. Checks HINT_AGENT permissions ✓
# 2. Calls Brain ✓
# 3. Validates hint doesn't reveal solution ✓
# 4. Returns safe hint ✓

if result.status == OrchestrationStatus.SUCCESS:
    # Safe to show - already validated
    return result.output
```

---

### **Example 3: Solution Generation (with authorization)**

```python
# Request solution
request = OrchestrationRequest(
    request_type=RequestType.SOLUTION,
    agent="CODING_AGENT",
    problem_context={
        'problem_description': 'Two sum problem',
        'language': 'python',
        'test_cases': test_cases
    },
    domain="competitive_programming",
    user_context={
        'user_consent': True,
        'attempt_count': 3,  # User tried 3 times
        'in_contest': False
    }
)

result = await orchestrator.process_request(request)

# Orchestrator automatically:
# 1. Checks authorization (3+ attempts, consent) ✓
# 2. Calls CODING_AGENT ✓
# 3. Executes solution in Docker ✓
# 4. Verifies correctness ✓
# 5. Returns only if all checks pass ✓

if result.status == OrchestrationStatus.SUCCESS:
    # Solution is VERIFIED and SAFE
    return result.output
elif result.status == OrchestrationStatus.FAILED_PERMISSION:
    return "Not authorized - need more attempts"
elif result.status == OrchestrationStatus.FAILED_VERIFICATION:
    return "Generated solution didn't pass verification"
```

---

### **Example 4: With Retry Configuration**

```python
request = OrchestrationRequest(
    request_type=RequestType.TEACHING,
    agent="TEACHER_AGENT",
    problem_context={'concept': 'Dynamic Programming'},
    domain="dsa",
    retry_config={
        'max_retries': 5,  # Try up to 5 times
        'delay_ms': 2000    # 2 second delay between retries
    }
)

result = await orchestrator.process_request(request)

print(f"Retry count: {result.retry_count}")
```

---

## 📦 **Data Structures**

### **OrchestrationRequest**

```python
@dataclass
class OrchestrationRequest:
    request_type: RequestType          # Type of request
    agent: str                         # Agent name
    problem_context: Dict[str, Any]    # Problem data
    domain: str = "competitive_programming"
    user_context: Optional[Dict] = None
    verification_config: Optional[Dict] = None
    retry_config: Optional[Dict] = None
```

### **OrchestrationResult**

```python
@dataclass
class OrchestrationResult:
    status: OrchestrationStatus        # SUCCESS / FAILED_*
    output: Optional[str]              # Verified output (if success)
    metadata: Dict[str, Any]           # Additional info
    
    # Pipeline results
    permission_check: Optional[Dict]
    brain_response: Optional[Dict]
    verification_result: Optional[Dict]
    
    # Tracking
    request_id: str
    total_time_ms: int
    retry_count: int
    
    # Errors
    error_message: Optional[str]
    rejection_reason: Optional[str]
```

---

## 🔧 **Convenience Functions**

### **Teacher Request**

```python
from backend.ai.orchestrator import process_teacher_request

result = await process_teacher_request(
    concept="Binary Search",
    domain="dsa",
    detail_level="detailed"
)
```

### **Hint Request**

```python
from backend.ai.orchestrator import process_hint_request

result = await process_hint_request(
    problem_description="Two sum problem",
    user_code="# User's code",
    hint_level=1,
    attempt_count=2
)
```

### **Solution Request**

```python
from backend.ai.orchestrator import process_solution_request

result = await process_solution_request(
    problem_description="Two sum",
    language="python",
    test_cases=test_cases,
    user_consent=True,
    attempt_count=3
)
```

---

## 🔐 **Verdict Logic Protection**

### **CRITICAL RULE:**
**Verdict logic must NEVER be modified by AI orchestrator**

```python
# ✅ CORRECT: Orchestrator only orchestrates
result = await orchestrator.process_request(...)

# Verdict is determined by:
# 1. Grader/VerdictEngine (frozen logic)
# 2. Execution results (Docker sandbox)
# 3. Test case comparisons (exact match)

# AI can only add:
# - Educational feedback
# - Explanations
# - Hints

# AI CANNOT change:
# - Verdict (AC, WA, TLE, etc.)
# - Test case results
# - Performance metrics
```

### **Enforcement:**

1. **Verdict determination is isolated** in `grader/verdict_engine.py`
2. **AI output goes through verification** but doesn't affect verdict
3. **AutoGrader only adds feedback** (`grader/auto_grader.py`)
4. **Orchestrator doesn't touch verdict logic** at all

---

## 📊 **Status Codes**

| Status | Meaning | Action |
|--------|---------|--------|
| `SUCCESS` | ✅ All checks passed | Use output |
| `FAILED_PERMISSION` | ❌ Permission denied | Show auth error |
| `FAILED_VERIFICATION` | ❌ Output didn't verify | Regenerate or fallback |
| `FAILED_API` | ❌ Brain API error | Retry or fallback |
| `FAILED_RETRY_EXHAUSTED` | ❌ All retries failed | Use fallback |
| `ABORTED` | ❌ Unexpected error | Generic error message |

---

## ⚙️ **Configuration**

### **Default Settings:**

```python
DEFAULT_MAX_RETRIES = 3
DEFAULT_RETRY_DELAY_MS = 1000
```

### **Custom Configuration:**

```python
orchestrator = CodeEXOrchestrator(
    brain_client=custom_client,
    permission_enforcer=custom_enforcer,
    verification_pipeline=custom_pipeline,
    db_client=custom_db
)
```

---

## 🔄 **Integration Points**

### **1. With Domain Config:**
```python
# Automatically loaded
# domains/competitive_programming.yaml → orchestrator
```

### **2. With Permissions:**
```python
# Automatically checked
# agents/permissions.yaml → permission_enforcer → orchestrator
```

### **3. With Brain Client:**
```python
# Automatically called
# brain_client.py → orchestrator
```

### **4. With Verification:**
```python
# Automatically verified
# verification/ → orchestrator
```

### **5. With Database:**
```python
# Automatically saved
# orchestrator → db_client → database
```

---

## 🚨 **Error Recovery**

### **Recovery Strategies:**

```python
# Strategy 1: Retry with exponential backoff
retry_config = {
    'max_retries': 5,
    'delay_ms': 1000,  # 1s, 2s, 4s, 8s, 16s
    'exponential_backoff': True
}

# Strategy 2: Regenerate with different parameters
if result.status == OrchestrationStatus.FAILED_VERIFICATION:
    # Try with different hint level
    request.problem_context['hint_level'] = 2
    result = await orchestrator.process_request(request)

# Strategy 3: Fallback to simpler agent
if result.status == OrchestrationStatus.FAILED_API:
    # Fall back to TEACHER instead of CODING
    request.agent = "TEACHER_AGENT"
    result = await orchestrator.process_request(request)

# Strategy 4: Use cached response
if result.status in [OrchestrationStatus.FAILED_API, 
                     OrchestrationStatus.FAILED_RETRY_EXHAUSTED]:
    # Use previously cached response
    return get_cached_response(request_key)
```

---

## 📝 **Complete Workflow Example**

```python
import asyncio
from backend.ai.orchestrator import (
    CodeEXOrchestrator,
    OrchestrationRequest,
    RequestType,
    OrchestrationStatus
)

async def complete_workflow():
    # 1. Initialize orchestrator
    orchestrator = CodeEXOrchestrator()
    
    # 2. Create request
    request = OrchestrationRequest(
        request_type=RequestType.HINT,
        agent="HINT_AGENT",
        problem_context={
            'problem_description': 'Two sum problem',
            'hint_level': 1
        },
        domain="competitive_programming",
        user_context={'attempt_count': 2}
    )
    
    # 3. Process with error handling
    try:
        result = await orchestrator.process_request(request)
        
        # 4. Handle result
        if result.status == OrchestrationStatus.SUCCESS:
            print(f"✅ Success: {result.output}")
            return result.output
        
        elif result.status == OrchestrationStatus.FAILED_PERMISSION:
            print(f"❌ Permission denied: {result.rejection_reason}")
            return "You need more attempts first"
        
        elif result.status == OrchestrationStatus.FAILED_VERIFICATION:
            print(f"❌ Verification failed: {result.rejection_reason}")
            # Retry with different parameters
            request.problem_context['hint_level'] = 2
            result = await orchestrator.process_request(request)
            return result.output if result.status == OrchestrationStatus.SUCCESS else None
        
        else:
            print(f"❌ Error: {result.error_message}")
            return fallback_hint()
    
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return fallback_hint()

# Run
result = asyncio.run(complete_workflow())
```

---

## ✅ **Summary**

**CodeEX AI Orchestrator:**
- ✅ Main integration layer
- ✅ Coordinates all AI systems
- ✅ 6-step verification pipeline
- ✅ Automatic retry logic
- ✅ Error handling & recovery
- ✅ Database storage
- ✅ Verdict logic protection

**Flow:**
1. Load domain config
2. Check permissions
3. Call Brain (with retry)
4. Verify output (role + content)
5. Save to database
6. Return safe response

**Error Handling:**
- Permission denied → Abort immediately
- API failure → Retry up to 3 times
- Verification failure → Regenerate or abort
- Unexpected error → Log and abort

**Status:** 🟢 **COMPLETE - READY FOR PRODUCTION**

---

*The orchestrator ensures only verified, safe AI outputs reach users.*
