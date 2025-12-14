# CodeEX_brain Quick Reference

## 🚀 Quick Start

### Initialize System
```python
from backend-v2.brain import CodeEXBrain

brain = CodeEXBrain()
```

### Check Health
```python
health = brain.health_check()
# Returns: {"status": "healthy", "agents_count": 9, ...}
```

---

## 📋 Common Operations

### Get a Hint
```python
problem = {"id": "two-sum", "title": "Two Sum"}
result = brain.get_hint(problem, hint_type="algorithm")
```

### Explain Concept
```python
result = brain.explain_concept("dynamic_programming", context={})
```

### Debug Code
```python
result = brain.debug_code(
    code="def func(): ...",
    error_data={"type": "WA"},
    language="python"
)
```

### Plan Solution
```python
result = brain.plan_solution(problem)
```

---

## 🔐 Permission Quick Reference

| Agent | Can Generate Code? | Can Explain? | Can Debug? |
|-------|-------------------|--------------|------------|
| HINT | ❌ No | ⚠️ Limited | ❌ No |
| TEACHER | ❌ No | ✅ Yes | ⚠️ Explain only |
| CODING | ✅ Yes* | ❌ No | ❌ No |
| DEBUGGING | ❌ No | ⚠️ Errors | ✅ Yes |

*Requires authorization

---

## 🎯 Agent Roles at a Glance

- **PLANNER**: Problem breakdown, strategy
- **TEACHER**: Explanations, concepts
- **HINT**: Partial guidance only
- **CODING**: Solution generation*
- **DEBUGGING**: Error analysis, fixes
- **REFACTOR**: Code improvement
- **PROJECT_INSPECTOR**: Project analysis
- **RESEARCH**: Context gathering
- **MEMORY**: Context storage

---

## ⚠️ High-Risk Operations

### Generate Full Solution (Requires Auth)
```python
result = brain.authorize_full_solution(
    problem=problem,
    reason="User attempted 5 times"
)
```

### Delete Context
```python
# Only through Memory agent, logged
memory_agent = brain.agents[AgentRole.MEMORY]
result = memory_agent.delete_context("context_id")
```

---

## 📊 Monitoring

### Agent Stats
```python
stats = brain.get_agent_stats(AgentRole.HINT)
# Or all agents:
stats = brain.get_agent_stats()
```

### Violation Report
```python
report = brain.get_violation_report()
print(report['total_violations'])
print(report['violations_by_role'])
```

---

## 🔒 Security

### What's Protected
- ✅ All agent operations permission-checked
- ✅ Violations logged and blocked
- ✅ Input sanitization (planned)
- ✅ Output verification (planned)
- ✅ No direct agent-to-agent communication
- ✅ No database access from agents

### What to Monitor
- 🚨 Violation counts > 3
- 🚨 CRITICAL severity violations
- 🚨 Unauthorized solution attempts
- 🚨 Unusual agent activity patterns

---

## 🧪 Testing Permission Enforcement

```python
from brain.agents import HintAgent
from brain.core.enforcement import PermissionDeniedError

hint_agent = HintAgent()

# Check what hint agent can do
print(hint_agent.has_permission(Permission.PROVIDE_ALGORITHM_HINT))  # True
print(hint_agent.has_permission(Permission.GENERATE_FULL_SOLUTION))  # False
```

---

## 📝 Adding New Features

### Add Permission
1. Add to `Permission` enum in `core/permissions.py`
2. Map to roles in `PermissionRegistry.ROLE_PERMISSIONS`
3. Use `@requires_permission` decorator

### Add Agent
1. Create in `agents/` directory
2. Inherit from `AgentBase`
3. Use `@requires_permission` decorators
4. Register in `controller.py`

---

## 🆘 Troubleshooting

### PermissionDeniedError
- Check agent role has required permission
- Review permission matrix in README
- Check violation logs

### Agent Not Found
- Ensure agent registered in controller
- Check AgentRole enum value
- Verify initialization

### No Output
- Check if operation is supported
- Review agent's process() method
- Check input data structure

---

## 📞 Need Help?

1. Read main README.md
2. Check permission matrix
3. Review example_usage.py
4. Check violation logs
5. Review agent source code

---

**Version**: 1.0.0  
**Status**: Design + Scaffolding Complete
