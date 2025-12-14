# CodeEX Brain Client

**File:** `backend/ai/brain_client.py`  
**Version:** 1.0.0  
**Status:** ✅ Complete

---

## 🎯 Purpose

Interfaces with **Emergent CodeEX_brain** AI system to call subagents.

### **Responsibilities:**
- ✅ Call Emergent CodeEX_brain API
- ✅ Select correct subagent
- ✅ Pass domain configuration
- ✅ Receive raw AI output

### **NOT Responsible For:**
- ❌ Verification (done in `verification/`)
- ❌ Permission checking (done in `agents/`)
- ❌ Business logic
- ❌ Output validation

---

## ⚠️ **CRITICAL SECURITY WARNING**

### **ALL AI OUTPUTS ARE UNTRUSTED**

```python
response = client.call_teacher("Binary Search")

# ⚠️ response.raw_output is UNTRUSTED
# ⚠️ MUST verify before using
# ⚠️ NEVER show directly to user
```

**Every response has:**
- `is_verified = False` (always)
- `requires_verification = True` (always)

---

## 🚀 Quick Start

### **1. Initialize Client**

```python
from backend.ai.brain_client import CodeEXBrainClient

# Initialize with API credentials
client = CodeEXBrainClient(
    api_endpoint="https://api.emergent.ai/codex-brain",
    api_key="your_api_key",
    timeout=30
)

# Or use environment variables
# CODEX_BRAIN_ENDPOINT=https://api.emergent.ai/codex-brain
# CODEX_BRAIN_API_KEY=your_key
client = CodeEXBrainClient()
```

### **2. Call an Agent**

```python
# Call TEACHER_AGENT
response = client.call_teacher(
    concept="Dynamic Programming",
    detail_level="detailed",
    include_examples=True,
    domain="dsa"
)

# ⚠️ Output is UNTRUSTED
print(response.raw_output)  # Never show this directly to user!
```

### **3. Verify Output**

```python
# ALWAYS verify before use
from backend.ai.verification import VerificationPipeline

pipeline = VerificationPipeline()
verified = pipeline.verify_explanation(
    explanation=response.raw_output,
    context=...
)

if verified.is_acceptable:
    # NOW safe to show to user
    return response.raw_output
else:
    # Reject and regenerate
    return fallback()
```

---

## 🤖 **Available Agents**

### **1. PLANNER_AGENT** 📋

**Purpose:** Break down problems, create plans

```python
response = client.call_planner(
    problem_description="Find two numbers that sum to target",
    constraints=["Time: O(n)", "Space: O(n)"],
    domain="competitive_programming"
)
```

**Output:** High-level approach, subproblems, plan
**⚠️ Untrusted**

---

### **2. TEACHER_AGENT** 👨‍🏫

**Purpose:** Explain concepts and algorithms

```python
response = client.call_teacher(
    concept="Binary Search Algorithm",
    detail_level="moderate",  # "minimal", "moderate", "detailed"
    include_examples=True,
    domain="dsa"
)
```

**Output:** Concept explanation, examples
**⚠️ Untrusted**

---

### **3. HINT_AGENT** 💡

**Purpose:** Progressive hints without revealing solution

```python
response = client.call_hint(
    problem_description="Two sum problem",
    user_code="# User's attempt",
    hint_level=1,  # 1=gentle, 2=moderate, 3=strong
    attempt_count=2,
    domain="competitive_programming"
)
```

**Output:** Progressive hint
**⚠️ Untrusted - MUST verify doesn't reveal solution**

---

### **4. CODING_AGENT** 💻

**Purpose:** Generate code solutions

```python
# ⚠️ CHECK AUTHORIZATION FIRST
# from backend.ai.agents import PermissionEnforcer
# if not enforcer.check_permission(...):
#     raise PermissionError("Not authorized")

response = client.call_coding(
    problem_description="Implement two-sum",
    language="python",
    user_consent=True,
    attempt_count=3,  # User tried 3 times
    in_contest=False,
    domain="competitive_programming"
)
```

**Output:** Full solution code
**⚠️ Untrusted - MUST verify before showing**

---

### **5. DEBUGGING_AGENT** 🐛

**Purpose:** Analyze bugs and suggest fixes

```python
response = client.call_debugging(
    user_code="def solve(): ...",
    error_message="IndexError: list index out of range",
    language="python",
    test_case_failed="Input: [1,2,3], Expected: 6",
    domain="competitive_programming"
)
```

**Output:** Bug analysis, suggested fix
**⚠️ Untrusted - MUST verify doesn't rewrite entire solution**

---

### **6. REFACTOR_AGENT** ♻️

**Purpose:** Improve existing working code

```python
response = client.call_refactor(
    user_code="def solve(): ...",
    language="python",
    focus_areas=["readability", "performance"],
    domain="competitive_programming"
)
```

**Output:** Refactored code, improvements
**⚠️ Untrusted - User code must be working first**

---

### **7. PROJECT_INSPECTOR_AGENT** 🔍

**Purpose:** Analyze project structure

```python
response = client.call_project_inspector(
    project_structure={
        "files": [...],
        "dependencies": [...]
    },
    analysis_type="quality",  # or "security", "performance"
    domain="web_development"
)
```

**Output:** Project analysis, recommendations
**⚠️ Untrusted**

---

### **8. RESEARCH_AGENT** 🔎

**Purpose:** Gather context and find references

```python
response = client.call_research(
    query="Two sum problem",
    search_type="similar_problems",  # or "references", "resources"
    domain="competitive_programming"
)
```

**Output:** Similar problems, references, links
**⚠️ Untrusted**

---

### **9. MEMORY_AGENT** 🧠

**Purpose:** Store and retrieve context

```python
# Store context
response = client.call_memory(
    operation="store",
    data={"problem_id": "two-sum", "progress": "attempted 3 times"},
    authorization={}
)

# Retrieve context
response = client.call_memory(
    operation="retrieve",
    query={"problem_id": "two-sum"}
)

# Delete (requires authorization)
response = client.call_memory(
    operation="delete",
    query={"problem_id": "two-sum"},
    authorization={"explicit_authorization": True}
)
```

**Output:** Operation result
**⚠️ Untrusted - Delete requires authorization**

---

## 📦 **Data Structures**

### **BrainRequest**

```python
@dataclass
class BrainRequest:
    agent: BrainAgent
    problem_context: Dict[str, Any]
    domain_config: Optional[Dict[str, Any]] = None
    user_context: Optional[Dict[str, Any]] = None
    additional_params: Optional[Dict[str, Any]] = None
```

### **BrainResponse**

```python
@dataclass
class BrainResponse:
    agent: BrainAgent
    raw_output: str
    metadata: Dict[str, Any]
    request_id: str
    is_verified: bool = False  # ⚠️ Always False
    requires_verification: bool = True  # ⚠️ Always True
```

---

## 🔧 **Helper Functions**

### **Load Domain Config**

```python
from backend.ai.brain_client import load_domain_config

# Load domain configuration
config = load_domain_config('competitive_programming')

# Returns domain settings for Brain API
# {
#   'domain_id': 'competitive_programming',
#   'difficulty_levels': {...},
#   'explanation_depth': {...},
#   'ai_assistant': {...}
# }
```

### **Create Problem Context**

```python
from backend.ai.brain_client import create_problem_context

context = create_problem_context(
    problem_id="two-sum",
    problem_title="Two Sum",
    problem_description="Find two numbers...",
    difficulty="easy",
    constraints=["Time O(n)", "Space O(n)"],
    examples=[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]
)
```

---

## 🔄 **Complete Workflow**

### **Step 1: Check Permissions**

```python
from backend.ai.agents import PermissionEnforcer, AgentRole, Permission

enforcer = PermissionEnforcer()

# Check if agent can perform action
if not enforcer.check_permission(
    agent_role=AgentRole.CODING,
    permission=Permission.GENERATE_FULL_SOLUTION,
    context={'user_consent': True, 'attempt_count': 3}
):
    raise PermissionError("Not authorized")
```

### **Step 2: Call Brain Client**

```python
from backend.ai.brain_client import CodeEXBrainClient

client = CodeEXBrainClient()

response = client.call_coding(
    problem_description="...",
    language="python",
    user_consent=True,
    attempt_count=3,
    in_contest=False
)

# ⚠️ response.raw_output is UNTRUSTED
```

### **Step 3: Verify Output**

```python
from backend.ai.verification import VerificationPipeline

pipeline = VerificationPipeline(strict_mode=True)

result = pipeline.verify_solution(
    source_code=response.raw_output,
    language="python",
    test_cases=test_cases,
    explanation=None
)

if not result.is_acceptable:
    # REJECT - don't show to user
    raise ValueError(f"Verification failed: {result.rejection_reason}")
```

### **Step 4: Validate Against Role**

```python
from backend.ai.agents import RoleValidator

validator = RoleValidator()

validation = validator.validate_output(
    agent_role=AgentRole.HINT,
    output_text=response.raw_output
)

if not validation.is_valid:
    # REJECT - agent violated role boundaries
    raise ValueError(f"Role violation: {validation.issues}")
```

### **Step 5: Return to User**

```python
# Only after ALL checks pass
return {
    'output': response.raw_output,
    'verified': True,
    'agent': response.agent.value
}
```

---

## ⚙️ **Configuration**

### **Environment Variables**

```bash
# Brain API endpoint
CODEX_BRAIN_ENDPOINT=https://api.emergent.ai/codex-brain

# API key
CODEX_BRAIN_API_KEY=your_api_key_here
```

### **Initialization Options**

```python
client = CodeEXBrainClient(
    api_endpoint="https://custom-endpoint.com",
    api_key="custom_key",
    timeout=60  # seconds
)
```

---

## 🚨 **Error Handling**

```python
from backend.ai.brain_client import BrainAPIError

try:
    response = client.call_teacher("Binary Search")
except BrainAPIError as e:
    # API call failed
    logger.error(f"Brain API error: {e}")
    # Use fallback or retry
except requests.exceptions.Timeout:
    # Request timed out
    logger.error("Brain API timeout")
except Exception as e:
    # Unexpected error
    logger.error(f"Unexpected error: {e}")
```

---

## 📝 **Important Notes**

### **1. No Business Logic**
This client is a **thin wrapper** around the API. All business logic belongs elsewhere.

### **2. No Verification**
This client does **ZERO verification**. All verification happens in `verification/`.

### **3. No Permission Checking**
Permission checking happens in `agents/` before calling this client.

### **4. Always Untrusted**
Every response is marked as untrusted. Never skip verification.

### **5. Domain Configuration**
Always pass domain config for context-aware responses.

---

## 🎯 **Integration Points**

### **With Domain Config:**
```python
from backend.ai.domains import load_domain
from backend.ai.brain_client import CodeEXBrainClient

domain = load_domain('competitive_programming')
client = CodeEXBrainClient()

response = client.call_agent(
    agent=BrainAgent.TEACHER,
    problem_context={...},
    domain_config=domain.raw_config
)
```

### **With Permission System:**
```python
from backend.ai.agents import PermissionEnforcer
from backend.ai.brain_client import CodeEXBrainClient

enforcer = PermissionEnforcer()
client = CodeEXBrainClient()

# Check permission first
if enforcer.check_permission(...):
    response = client.call_agent(...)
```

### **With Verification:**
```python
from backend.ai.verification import VerificationPipeline
from backend.ai.brain_client import CodeEXBrainClient

client = CodeEXBrainClient()
pipeline = VerificationPipeline()

# Call Brain
response = client.call_coding(...)

# Verify output
result = pipeline.verify_solution(response.raw_output, ...)
```

---

## ✅ **Summary**

**CodeEX Brain Client:**
- ✅ Thin wrapper around Brain API
- ✅ Calls 9 different subagents
- ✅ Passes domain configuration
- ✅ Returns raw, untrusted output
- ✅ No business logic
- ✅ No verification
- ✅ Simple, clean interface

**Usage:**
1. Check permissions (`agents/`)
2. Call Brain Client
3. Verify output (`verification/`)
4. Validate role (`agents/`)
5. Return to user

**Status:** 🟢 **COMPLETE - READY FOR USE**

---

*Never trust AI output directly. Always verify.*
