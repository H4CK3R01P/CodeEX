# CodeEX Brain Agent Role Scoping & Permissions

**Version:** 1.0.0  
**Type:** Permission System (Not Agents)  
**Status:** ✅ Complete

---

## 🎯 Purpose

Defines **STRICT ROLE BOUNDARIES** for CodeEX Brain subagents.

Each agent has:
- ✅ **Allowed actions** (what it CAN do)
- ❌ **Forbidden actions** (what it CANNOT do)
- 🔒 **Authorization requirements** (when approval needed)

---

## 📁 Structure

```
backend/ai/agents/
├── __init__.py                    # Package exports
├── README.md                      # This file
├── roles.yaml                     # Agent role definitions
├── permissions.yaml               # Permission matrix
├── permission_enforcer.py         # Enforcement engine
├── role_validator.py              # Output validator
└── examples.py                    # Usage examples
```

---

## 🤖 Agent Roles

### 1. **PLANNER_AGENT** 📋

**Role:** Problem breakdown and planning

**CAN DO:**
- ✅ Analyze problem requirements
- ✅ Break into subproblems
- ✅ Suggest algorithmic approach (high-level)
- ✅ Recommend data structures
- ✅ Create step-by-step outline
- ✅ Discuss time/space complexity

**CANNOT DO:**
- ❌ Write actual code
- ❌ Provide implementation details
- ❌ Solve problem completely

**Severity:** CRITICAL if violated

---

### 2. **TEACHER_AGENT** 👨‍🏫

**Role:** Explain concepts and algorithms

**CAN DO:**
- ✅ Explain algorithms and data structures
- ✅ Explain complexity analysis
- ✅ Provide generic examples
- ✅ Explain best practices
- ✅ Clarify terminology
- ✅ Recommend learning resources

**CANNOT DO:**
- ❌ Solve specific problems
- ❌ Provide problem solutions
- ❌ Debug user code

**Severity:** CRITICAL if violated

---

### 3. **HINT_AGENT** 💡

**Role:** Progressive hints WITHOUT revealing solution

**CAN DO:**
- ✅ Suggest algorithm category ("Think about sorting")
- ✅ Hint at data structure ("Consider hash map")
- ✅ Ask guiding questions
- ✅ Provide edge case hints
- ✅ Suggest optimization direction

**CANNOT DO:**
- ❌ ❌ ❌ **Provide full solution**
- ❌ ❌ ❌ **Provide working code**
- ❌ Reveal test case outputs
- ❌ Give step-by-step implementation

**Severity:** CRITICAL if violated

**Hint Levels:**
1. **Gentle:** Algorithm category, guiding questions
2. **Moderate:** Approach direction, partial logic
3. **Strong:** Algorithm steps, specific technique

---

### 4. **CODING_AGENT** 💻

**Role:** Generate code solutions

**CAN DO:**
- ✅ Generate full solution (**REQUIRES AUTHORIZATION**)
- ✅ Generate partial solution
- ✅ Generate boilerplate/templates
- ✅ Write helper functions
- ✅ Generate test cases

**CANNOT DO:**
- ❌ Generate without authorization
- ❌ Provide solutions during contests
- ❌ Generate code on first attempt

**Authorization Required When:**
- ✅ User attempted 3+ times
- ✅ Practice mode only
- ✅ Educational context
- ❌ NOT in contest mode

**Severity:** CRITICAL if violated

---

### 5. **DEBUGGING_AGENT** 🐞

**Role:** Help identify and fix bugs

**CAN DO:**
- ✅ Analyze error messages
- ✅ Identify bug type
- ✅ Suggest targeted fixes
- ✅ Explain error cause
- ✅ Provide test case revealing bug

**CANNOT DO:**
- ❌ Rewrite entire solution
- ❌ Provide full correct code
- ❌ Optimize working code (REFACTOR's job)

**Severity:** HIGH if violated

---

### 6. **REFACTOR_AGENT** ♻️

**Role:** Improve existing working code

**CAN DO:**
- ✅ Improve readability
- ✅ Optimize performance
- ✅ Suggest better patterns
- ✅ Improve variable names
- ✅ Apply design patterns

**CANNOT DO:**
- ❌ Refactor broken code (must work first)
- ❌ Change algorithm fundamentally
- ❌ Fix bugs (DEBUGGING's job)

**Severity:** MEDIUM if violated

---

### 7. **PROJECT_INSPECTOR_AGENT** 🔍

**Role:** Analyze project structure

**CAN DO:**
- ✅ Analyze project structure
- ✅ Assess code quality
- ✅ Detect anti-patterns
- ✅ Identify security issues
- ✅ Suggest improvements

**CANNOT DO:**
- ❌ Modify code
- ❌ Implement solutions
- ❌ Access sensitive data

**Severity:** HIGH if violated

---

### 8. **RESEARCH_AGENT** 🔎

**Role:** Gather context and references

**CAN DO:**
- ✅ Search similar problems
- ✅ Find algorithm references
- ✅ Gather learning resources
- ✅ Find documentation
- ✅ Research design patterns

**CANNOT DO:**
- ❌ Provide direct solutions
- ❌ Copy solutions from references
- ❌ Implement found solutions

**Severity:** CRITICAL if violated

---

### 9. **MEMORY_AGENT** 🧠

**Role:** Context storage and retrieval

**CAN DO:**
- ✅ Store conversation context
- ✅ Retrieve past context
- ✅ Update user progress
- ✅ Track attempted problems

**CANNOT DO:**
- ❌ Delete without authorization
- ❌ Access other user's data
- ❌ Store sensitive data
- ❌ Modify context maliciously

**Severity:** CRITICAL if violated

---

## 📊 Permission Matrix

| Permission | PLANNER | TEACHER | HINT | CODING | DEBUG | REFACTOR | INSPECTOR | RESEARCH | MEMORY |
|------------|---------|---------|------|--------|-------|----------|-----------|----------|--------|
| Generate Full Solution | ❌ | ❌ | ❌ | ✅🔒 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate Partial | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate Boilerplate | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Algorithm Hint | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Syntax Hint | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edge Case Hint | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Explain Concept | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Explain Algorithm | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Explain Complexity | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Analyze Code Quality | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Analyze Bugs | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Analyze Performance | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Store Context | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Retrieve Context | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delete Context | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅🔒 |
| Search Similar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Gather Context | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

**Legend:**
- ✅ = Allowed
- ❌ = Forbidden
- 🔒 = Requires Authorization

---

## ⚠️ Critical Restrictions

### **HINT_AGENT** - Most Restricted

```yaml
STRICTLY FORBIDDEN:
  - Provide full solution
  - Provide working code
  - Reveal test case outputs
  - Give step-by-step implementation

Severity: CRITICAL
Reason: "Defeats learning purpose"
```

### **CODING_AGENT** - Requires Authorization

```yaml
AUTHORIZATION REQUIRED:
  - Generate full solution
  
Criteria:
  - user_consent: true
  - attempt_count: >= 3
  - context: "educational"
  - not_in_contest: true

Severity: CRITICAL if bypassed
```

### **MEMORY_AGENT** - Data Protection

```yaml
STRICTLY FORBIDDEN:
  - Delete without authorization
  - Access other user data
  - Store sensitive data
  - Modify maliciously

Severity: CRITICAL
Reason: "Privacy & data protection"
```

---

## 🔧 Usage Examples

### Example 1: Check Permission

```python
from backend.ai.agents import PermissionEnforcer, AgentRole, Permission

enforcer = PermissionEnforcer()

# Check if HINT_AGENT can generate code
can_generate = enforcer.check_permission(
    agent_role=AgentRole.HINT,
    permission=Permission.GENERATE_FULL_SOLUTION
)

print(can_generate)  # False - HINT cannot generate code
```

### Example 2: Enforce Permission

```python
# Try to generate solution with HINT_AGENT
allowed = enforcer.enforce(
    agent_role=AgentRole.HINT,
    permission=Permission.GENERATE_FULL_SOLUTION,
    action_name="generate_solution"
)

if not allowed:
    print("BLOCKED: HINT_AGENT cannot generate solutions")
    # Violation logged automatically
```

### Example 3: Authorization Required

```python
# CODING_AGENT needs authorization for full solution
context = {
    'user_consent': True,
    'attempt_count': 3,
    'in_contest': False
}

allowed = enforcer.check_permission(
    agent_role=AgentRole.CODING,
    permission=Permission.GENERATE_FULL_SOLUTION,
    context=context
)

print(allowed)  # True - authorization criteria met
```

### Example 4: Validate Output

```python
from backend.ai.agents import RoleValidator

validator = RoleValidator()

# Validate HINT_AGENT output
output = """
def two_sum(nums, target):
    return [0, 1]
"""

result = validator.validate_output(
    agent_role=AgentRole.HINT,
    output_text=output
)

if not result.is_valid:
    print("VIOLATION: HINT provided code!")
    for issue in result.issues:
        print(f"  - {issue.description}")
```

### Example 5: Get Allowed Actions

```python
# Get what PLANNER can do
allowed = enforcer.get_allowed_actions(AgentRole.PLANNER)

print("PLANNER_AGENT can:")
for action in allowed:
    print(f"  - {action}")

# Output:
# - analyze_problem_requirements
# - break_into_subproblems
# - suggest_algorithmic_approach
# ...
```

### Example 6: Get Forbidden Actions

```python
# Get what HINT cannot do
forbidden = enforcer.get_forbidden_actions(AgentRole.HINT)

print("HINT_AGENT CANNOT:")
for item in forbidden:
    print(f"  - {item['action']}: {item['reason']}")

# Output:
# - provide_full_solution: Defeats learning purpose
# - provide_working_code: Must guide, not solve
# ...
```

### Example 7: Violation Report

```python
# Get violation statistics
report = enforcer.get_violation_report()

print(f"Total violations: {report['total_violations']}")
print(f"By severity: {report['by_severity']}")
print(f"By agent: {report['by_agent']}")
```

---

## 🔒 Enforcement Flow

```
1. Agent attempts action
   ↓
2. PermissionEnforcer.enforce()
   ↓
3. Check permission matrix
   ↓
4. Is agent allowed?
   ├─ YES → Check if authorization required
   │         ├─ YES → Check authorization criteria
   │         │         ├─ MET → ✅ ALLOW
   │         │         └─ NOT MET → ❌ BLOCK & LOG
   │         └─ NO → ✅ ALLOW
   └─ NO → ❌ BLOCK & LOG
   ↓
5. Log violation (if blocked)
   ↓
6. Handle based on severity:
   - CRITICAL → Block + Alert
   - HIGH → Block + Log
   - MEDIUM → Block + Warn
   - LOW → Warn only
```

---

## 🚨 Violation Handling

### Severity Levels:

**CRITICAL:**
- Action: IMMEDIATE_BLOCK
- Log: ✅ Yes
- Alert: ✅ Yes
- Retry: ❌ No

**HIGH:**
- Action: BLOCK_AND_LOG
- Log: ✅ Yes
- Alert: ✅ Yes
- Retry: ❌ No

**MEDIUM:**
- Action: BLOCK_AND_WARN
- Log: ✅ Yes
- Alert: ❌ No
- Retry: ✅ Yes

**LOW:**
- Action: WARN_ONLY
- Log: ✅ Yes
- Alert: ❌ No
- Retry: ✅ Yes

---

## 📋 Audit Trail

All violations are logged with:
- Timestamp
- Agent ID
- Action attempted
- Permission required
- Authorization status
- Violation severity
- Blocked reason
- Context data

**Retention:** 90 days

---

## ⚙️ Configuration

### roles.yaml
Defines what each agent **CAN DO**

### permissions.yaml
Defines:
- Permission matrix (who can do what)
- Forbidden actions (what's strictly prohibited)
- Authorization requirements
- Enforcement rules

### Customization

Edit YAML files to:
- Add new permissions
- Modify authorization criteria
- Change severity levels
- Update enforcement rules

---

## ✅ Status

- ✅ Role definitions complete (9 agents)
- ✅ Permission matrix defined
- ✅ Forbidden actions specified
- ✅ Authorization requirements set
- ✅ Enforcement engine implemented
- ✅ Output validator implemented
- ✅ Documentation complete
- ⏳ Integration with agents (pending)

**Status:** 🟢 **COMPLETE - READY FOR USE**

---

*Strict role scoping ensures agents stay within their boundaries.*
