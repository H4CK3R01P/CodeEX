# CodeEX_brain - AI Agent Orchestration System

**Version:** 1.0.0  
**Status:** Design + Scaffolding Complete  
**Type:** Backend Internal System

---

## 📋 Overview

CodeEX_brain is a sophisticated AI agent orchestration system with **role-based permission enforcement**. It provides a secure, scalable architecture for managing multiple AI agents with strict access control and violation handling.

### Key Features

✅ **Role-Based Access Control** - Granular permission system for 9 specialized agents  
✅ **Permission Enforcement** - Decorator-based enforcement with automatic violation handling  
✅ **Master Controller** - Centralized orchestration with input sanitization  
✅ **Security First** - Comprehensive violation logging and alerting  
✅ **No Direct Access** - Agents never access database or testcases directly  
✅ **Audit Trail** - Complete logging of all agent operations and violations  

---

## 🏗️ Architecture

```
CodeEX_brain (Master Controller)
        │
        ├─── Input Sanitization
        ├─── Permission Registry
        ├─── Violation Handler
        │
        └─── Agent Fleet
             ├── PLANNER
             ├── TEACHER
             ├── HINT
             ├── CODING
             ├── DEBUGGING
             ├── REFACTOR
             ├── PROJECT_INSPECTOR
             ├── RESEARCH
             └── MEMORY
```

### Core Principles

1. **Single Entry Point**: All agent interactions go through CodeEX_brain
2. **No Direct Communication**: Agents cannot call each other
3. **Sanitized Inputs**: All data is sanitized before reaching agents
4. **Verified Outputs**: All outputs are verified before returning
5. **No Privilege Escalation**: Agents cannot exceed their defined permissions
6. **Audit Everything**: All operations and violations are logged

---

## 🎯 Agents & Roles

### Agent Overview

| Agent | Role | Primary Purpose | Risk Level |
|-------|------|----------------|------------|
| **PLANNER** | `planner` | Problem breakdown & strategy | LOW |
| **TEACHER** | `teacher` | Conceptual explanations | LOW |
| **HINT** | `hint` | Partial guidance only | LOW |
| **CODING** | `coding` | Solution generation | HIGH |
| **DEBUGGING** | `debugging` | Error analysis & fixes | MEDIUM |
| **REFACTOR** | `refactor` | Code improvement | MEDIUM |
| **PROJECT_INSPECTOR** | `project_inspector` | Project analysis | LOW |
| **RESEARCH** | `research` | Context gathering | LOW |
| **MEMORY** | `memory` | Context storage | MEDIUM |

---

## 🔐 Permission Matrix

### Permission Categories

```python
# Code Generation
GENERATE_FULL_SOLUTION       # ⚠️ HIGH RISK - Coding agent only
GENERATE_PARTIAL_SOLUTION    # Coding agent
GENERATE_BOILERPLATE         # Coding agent

# Hints (Limited Disclosure)
PROVIDE_ALGORITHM_HINT       # Hint, Teacher agents
PROVIDE_SYNTAX_HINT          # Hint agent
PROVIDE_EDGE_CASE_HINT       # Hint agent

# Explanations (Educational)
EXPLAIN_CONCEPT              # Teacher agent
EXPLAIN_ALGORITHM            # Teacher, Planner agents
EXPLAIN_COMPLEXITY           # Teacher agent
EXPLAIN_APPROACH             # Teacher, Planner agents

# Code Analysis
ANALYZE_CODE_QUALITY         # Refactor, Inspector agents
ANALYZE_BUGS                 # Debugging agent
ANALYZE_PERFORMANCE          # Inspector agent
SUGGEST_OPTIMIZATIONS        # Refactor agent

# Planning
CREATE_PROBLEM_BREAKDOWN     # Planner agent
SUGGEST_APPROACH             # Planner agent
IDENTIFY_SUBPROBLEMS         # Planner agent

# Research
SEARCH_SIMILAR_PROBLEMS      # Research agent
GATHER_CONTEXT               # Research, Planner agents
FIND_REFERENCES              # Research agent

# Memory Operations
STORE_CONTEXT                # Memory agent
RETRIEVE_CONTEXT             # Memory agent
UPDATE_CONTEXT               # Memory agent
DELETE_CONTEXT               # ⚠️ HIGH RISK - Memory agent only

# Debugging
IDENTIFY_ERROR_TYPE          # Debugging agent
SUGGEST_FIX                  # Debugging agent
PROVIDE_TEST_CASE            # Debugging agent
EXPLAIN_ERROR                # Debugging, Teacher agents

# Refactoring
REFACTOR_CODE                # Refactor agent
IMPROVE_READABILITY          # Refactor agent
SUGGEST_PATTERNS             # Refactor, Coding agents

# Project Inspection
INSPECT_STRUCTURE            # Inspector agent
ANALYZE_DEPENDENCIES         # Inspector agent
ASSESS_QUALITY               # Inspector agent
```

### Role-Permission Mapping

#### PLANNER Agent
- ✅ CREATE_PROBLEM_BREAKDOWN
- ✅ SUGGEST_APPROACH
- ✅ IDENTIFY_SUBPROBLEMS
- ✅ EXPLAIN_APPROACH
- ✅ GATHER_CONTEXT

#### TEACHER Agent
- ✅ EXPLAIN_CONCEPT
- ✅ EXPLAIN_ALGORITHM
- ✅ EXPLAIN_COMPLEXITY
- ✅ EXPLAIN_APPROACH
- ✅ PROVIDE_ALGORITHM_HINT
- ✅ EXPLAIN_ERROR

#### HINT Agent
- ✅ PROVIDE_ALGORITHM_HINT
- ✅ PROVIDE_SYNTAX_HINT
- ✅ PROVIDE_EDGE_CASE_HINT
- ❌ CANNOT generate code
- ❌ CANNOT provide full solutions

#### CODING Agent
- ✅ GENERATE_FULL_SOLUTION (⚠️ requires explicit authorization)
- ✅ GENERATE_PARTIAL_SOLUTION
- ✅ GENERATE_BOILERPLATE
- ✅ SUGGEST_PATTERNS

#### DEBUGGING Agent
- ✅ IDENTIFY_ERROR_TYPE
- ✅ SUGGEST_FIX
- ✅ PROVIDE_TEST_CASE
- ✅ EXPLAIN_ERROR
- ✅ ANALYZE_BUGS

#### REFACTOR Agent
- ✅ REFACTOR_CODE
- ✅ IMPROVE_READABILITY
- ✅ SUGGEST_PATTERNS
- ✅ SUGGEST_OPTIMIZATIONS
- ✅ ANALYZE_CODE_QUALITY

#### PROJECT_INSPECTOR Agent
- ✅ INSPECT_STRUCTURE
- ✅ ANALYZE_DEPENDENCIES
- ✅ ASSESS_QUALITY
- ✅ ANALYZE_CODE_QUALITY
- ✅ ANALYZE_PERFORMANCE

#### RESEARCH Agent
- ✅ SEARCH_SIMILAR_PROBLEMS
- ✅ GATHER_CONTEXT
- ✅ FIND_REFERENCES

#### MEMORY Agent
- ✅ STORE_CONTEXT
- ✅ RETRIEVE_CONTEXT
- ✅ UPDATE_CONTEXT
- ✅ DELETE_CONTEXT (⚠️ high risk operation)

---

## 🚦 Permission Enforcement

### How It Works

1. **Decorator-Based**: Methods use `@requires_permission` decorator
2. **Automatic Checking**: Permission checked before method execution
3. **Violation Logging**: Unauthorized attempts are logged
4. **Error Raising**: `PermissionDeniedError` raised on violation
5. **No Bypass**: No way to bypass permission checks

### Example Usage

```python
from backend-v2.brain.core.enforcement import requires_permission
from backend-v2.brain.core.permissions import Permission

class MyAgent(AgentBase):
    @requires_permission(Permission.GENERATE_FULL_SOLUTION)
    def generate_solution(self, problem):
        # This only executes if agent has permission
        return {"code": "..."}
```

### Violation Handling

When an agent attempts an unauthorized operation:

1. **Blocked**: Operation is immediately blocked
2. **Logged**: Violation recorded with full context
3. **Alerted**: Security alert if threshold exceeded
4. **Error**: `PermissionDeniedError` raised to caller

---

## 📁 File Structure

```
backend-v2/brain/
├── __init__.py                    # Package exports
├── controller.py                  # Master controller (CodeEX_brain)
├── config.py                      # Configuration settings
├── README.md                      # This file
│
├── core/                          # Core permission system
│   ├── __init__.py
│   ├── agent_base.py             # Base class for all agents
│   ├── permissions.py            # Permission definitions & registry
│   ├── enforcement.py            # @requires_permission decorator
│   └── violations.py             # Violation handling & logging
│
└── agents/                        # Individual agent implementations
    ├── __init__.py
    ├── planner.py                # Problem planning agent
    ├── teacher.py                # Teaching/explanation agent
    ├── hint.py                   # Hint generation agent
    ├── coding.py                 # Code generation agent
    ├── debugging.py              # Debugging assistance agent
    ├── refactor.py               # Code refactoring agent
    ├── project_inspector.py      # Project analysis agent
    ├── research.py               # Research/context agent
    └── memory.py                 # Context memory agent
```

---

## 🚀 Usage Examples

### Initialize CodeEX_brain

```python
from backend-v2.brain import CodeEXBrain

# Initialize master controller
brain = CodeEXBrain()

# Check system health
health = brain.health_check()
print(health)
```

### Get a Hint

```python
problem = {
    "id": "two-sum",
    "title": "Two Sum",
    "description": "..."
}

# Get algorithm hint
result = brain.get_hint(problem, hint_type="algorithm")
print(result["output"])
```

### Explain a Concept

```python
# Get concept explanation
result = brain.explain_concept(
    concept="dynamic_programming",
    context={"difficulty": "medium"}
)
print(result["output"])
```

### Debug Code

```python
code = """
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
"""

error_data = {
    "type": "WrongAnswer",
    "message": "Output differs from expected"
}

# Get debugging suggestions
result = brain.debug_code(
    code=code,
    error_data=error_data,
    language="python"
)
print(result["output"])
```

### Authorize Full Solution (Controlled)

```python
# Only use after multiple failed attempts
result = brain.authorize_full_solution(
    problem=problem,
    reason="User attempted 5 times, educational context"
)
print(result["output"])
```

### Get Agent Statistics

```python
from backend-v2.brain.core.permissions import AgentRole

# Get stats for specific agent
stats = brain.get_agent_stats(AgentRole.HINT)

# Get stats for all agents
all_stats = brain.get_agent_stats()
```

### Get Violation Report

```python
# Check for security violations
violations = brain.get_violation_report()
print(f"Total violations: {violations['total_violations']}")
print(f"By role: {violations['violations_by_role']}")
```

---

## 🔒 Security Features

### Input Sanitization

All inputs are sanitized before reaching agents:
- ❌ No database IDs
- ❌ No test case solutions
- ❌ No sensitive user data
- ❌ No authentication tokens
- ✅ Size limits enforced
- ✅ Structure validation

### Output Verification

All outputs are verified before returning:
- ❌ No sensitive data leaks
- ❌ No unauthorized information
- ✅ Schema validation
- ✅ Permission alignment check

### Violation Monitoring

Comprehensive violation tracking:
- 📊 Real-time monitoring
- 🚨 Automatic alerting (threshold-based)
- 📝 Audit trail
- 🔍 Pattern detection
- ⚠️ Security incident triggers

### Authorization Gates

High-risk operations require explicit authorization:
- `GENERATE_FULL_SOLUTION` - Requires authorization flag
- `DELETE_CONTEXT` - Logged and monitored
- All operations - Tracked and audited

---

## 📊 Monitoring & Logging

### Agent Statistics

Each agent tracks:
- Operation count
- Last operation timestamp
- Granted permissions
- Creation time
- Agent ID

### Violation Logs

Each violation records:
- Timestamp
- Agent role
- Attempted permission
- Method name
- Severity level
- Context data

### Severity Levels

- **CRITICAL**: Master agent violations (should never happen)
- **HIGH**: Attempts to generate full solutions without auth
- **MEDIUM**: Operations outside defined scope
- **LOW**: Minor permission issues

---

## ⚙️ Configuration

### Environment Variables

```bash
# LLM Integration
BRAIN_LLM_PROVIDER=openai
BRAIN_LLM_MODEL=gpt-4
BRAIN_LLM_API_KEY=sk-...
BRAIN_LLM_TIMEOUT_SECONDS=30
BRAIN_LLM_MAX_TOKENS=2000

# Agent Settings
BRAIN_MAX_AGENT_OPERATIONS=100
BRAIN_AGENT_TIMEOUT_SECONDS=30

# Security
BRAIN_VIOLATION_ALERT_THRESHOLD=3
BRAIN_ENABLE_AUDIT_LOGGING=true
BRAIN_LOG_LEVEL=INFO

# Input Sanitization
BRAIN_MAX_INPUT_SIZE_BYTES=1000000
BRAIN_MAX_CODE_LENGTH=50000
BRAIN_STRIP_SENSITIVE_DATA=true

# Output Verification
BRAIN_VERIFY_OUTPUTS=true
BRAIN_MAX_OUTPUT_SIZE_BYTES=2000000

# Authorization
BRAIN_REQUIRE_AUTH_FOR_FULL_SOLUTIONS=true
BRAIN_MIN_ATTEMPTS_FOR_SOLUTION=3

# Memory Agent
BRAIN_MEMORY_RETENTION_DAYS=7
BRAIN_MAX_CONTEXT_SIZE_KB=100
```

---

## 🧪 Testing

### Test Permission Enforcement

```python
from backend-v2.brain.agents import HintAgent
from backend-v2.brain.core.enforcement import PermissionDeniedError

hint_agent = HintAgent()

try:
    # This should FAIL - Hint agent cannot generate full solutions
    hint_agent.generate_full_solution({"id": "test"}, "python")
except PermissionDeniedError as e:
    print(f"✅ Correctly denied: {e}")
```

### Test Violation Handler

```python
from backend-v2.brain.core.violations import ViolationHandler
from backend-v2.brain.core.permissions import AgentRole, Permission

handler = ViolationHandler(alert_threshold=2)

# Simulate violations
handler.handle_violation(
    role=AgentRole.HINT,
    permission=Permission.GENERATE_FULL_SOLUTION,
    method_name="generate_solution",
    agent_id="hint_12345"
)

# Check violations
report = handler.get_report()
print(report)
```

---

## 🔄 Extension Guide

### Adding a New Agent

1. **Create agent file** in `agents/` directory
2. **Inherit from AgentBase**
3. **Define role** in constructor
4. **Use @requires_permission** decorators
5. **Implement process()** method
6. **Update permissions.py** if new permissions needed
7. **Register in controller.py**

Example:

```python
from ..core.agent_base import AgentBase
from ..core.permissions import AgentRole, Permission
from ..core.enforcement import requires_permission

class MyNewAgent(AgentBase):
    def __init__(self, agent_id=None):
        super().__init__(role=AgentRole.MY_NEW_AGENT, agent_id=agent_id)
    
    @requires_permission(Permission.MY_NEW_PERMISSION)
    def my_operation(self, input_data):
        self._record_operation()
        # Implementation
        return {"result": "..."}
    
    def process(self, input_data):
        operation = input_data.get("operation")
        if operation == "my_operation":
            return self.my_operation(input_data)
```

### Adding a New Permission

1. **Add to Permission enum** in `core/permissions.py`
2. **Map to roles** in `PermissionRegistry.ROLE_PERMISSIONS`
3. **Document in README** (this file)
4. **Use in agent methods** with `@requires_permission`

---

## 📝 TODO: Future Implementation

### LLM Integration

- [ ] Implement actual LLM calls (OpenAI, Anthropic, Google)
- [ ] Add prompt templates for each agent
- [ ] Implement response parsing and validation
- [ ] Add fallback mechanisms for LLM failures
- [ ] Implement rate limiting and cost tracking

### Input Sanitization

- [ ] Comprehensive data cleaning
- [ ] PII detection and removal
- [ ] Test case solution stripping
- [ ] Size limit enforcement
- [ ] Schema validation

### Output Verification

- [ ] Schema validation
- [ ] Sensitive data detection
- [ ] Permission-based filtering
- [ ] Response quality checks

### Persistent Storage

- [ ] Database integration for Memory agent
- [ ] Audit log persistence
- [ ] Violation history storage
- [ ] Context retention management

### API Integration

- [ ] REST API endpoints for CodeEX_brain
- [ ] WebSocket support for real-time interactions
- [ ] Rate limiting per user/agent
- [ ] Authentication and authorization

### Monitoring & Observability

- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Alert integration (Slack, PagerDuty)
- [ ] Performance profiling

---

## 🎓 Best Practices

### For Agent Developers

1. **Always use @requires_permission** on protected methods
2. **Never access database directly** - always through CodeEX_brain
3. **Record operations** with `self._record_operation()`
4. **Handle errors gracefully** with try-except
5. **Return structured data** (Dict[str, Any])
6. **Document permission requirements** in docstrings

### For System Integrators

1. **Always use CodeEX_brain** as entry point
2. **Never bypass input sanitization**
3. **Check violation reports regularly**
4. **Set appropriate alert thresholds**
5. **Monitor agent statistics**
6. **Authorize high-risk operations carefully**

### For Security

1. **Review violation logs daily**
2. **Set up automated alerts**
3. **Audit agent permissions regularly**
4. **Test permission enforcement**
5. **Monitor for privilege escalation attempts**
6. **Keep audit trail immutable**

---

## 📖 References

- **CodeEX Auto-Grader**: `/app/grader/`
- **Existing Models**: `/app/models/`
- **Configuration**: `/app/config/settings.py`
- **API**: `/app/api/main.py`

---

## 🤝 Contributing

When contributing to CodeEX_brain:

1. ✅ Follow existing code structure
2. ✅ Add proper type hints
3. ✅ Use @requires_permission decorators
4. ✅ Update permission matrix in README
5. ✅ Add tests for new features
6. ✅ Document security implications
7. ✅ Update violation handling if needed

---

## 📄 License

CodeEX_brain is part of the CodeEX platform.

---

## 📞 Support

For questions about CodeEX_brain:
- Check this README first
- Review permission matrix
- Check violation logs
- Review agent statistics

---

**Status**: ✅ **Design + Scaffolding Complete**  
**Next Steps**: LLM Integration → API Endpoints → Frontend Integration  
**Security Level**: 🔒 **High** (Role-based enforcement active)

---

*End of Documentation*
