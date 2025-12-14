"""Example Usage of Agent Role Scoping & Permissions

Demonstrates how to enforce strict role boundaries.
"""

from backend.ai.agents import (
    PermissionEnforcer,
    AgentRole,
    Permission,
    RoleValidator
)


def example_1_check_basic_permission():
    """Example 1: Check if agent has permission"""
    print("=" * 60)
    print("EXAMPLE 1: Basic Permission Check")
    print("=" * 60)
    
    enforcer = PermissionEnforcer()
    
    # Test 1: Can HINT_AGENT generate code?
    can_hint_code = enforcer.check_permission(
        agent_role=AgentRole.HINT,
        permission=Permission.GENERATE_FULL_SOLUTION
    )
    print(f"HINT_AGENT can generate solution: {can_hint_code}")  # False
    
    # Test 2: Can CODING_AGENT generate code?
    can_coding_code = enforcer.check_permission(
        agent_role=AgentRole.CODING,
        permission=Permission.GENERATE_FULL_SOLUTION,
        context={'user_consent': True, 'attempt_count': 3, 'in_contest': False}
    )
    print(f"CODING_AGENT can generate solution (authorized): {can_coding_code}")  # True
    
    # Test 3: Can TEACHER explain concepts?
    can_teacher_explain = enforcer.check_permission(
        agent_role=AgentRole.TEACHER,
        permission=Permission.EXPLAIN_CONCEPT
    )
    print(f"TEACHER_AGENT can explain concepts: {can_teacher_explain}")  # True
    
    print()


def example_2_enforce_and_block():
    """Example 2: Enforce permission and block violations"""
    print("=" * 60)
    print("EXAMPLE 2: Enforcement & Blocking")
    print("=" * 60)
    
    enforcer = PermissionEnforcer()
    
    # Attempt 1: HINT tries to generate code (BLOCKED)
    print("Attempt: HINT_AGENT tries to generate solution...")
    allowed = enforcer.enforce(
        agent_role=AgentRole.HINT,
        permission=Permission.GENERATE_FULL_SOLUTION,
        action_name=\"generate_solution\"
    )
    
    if allowed:
        print("  ✅ ALLOWED\")\n    else:\n        print(\"  ❌ BLOCKED - HINT cannot generate solutions\")\n    \n    # Attempt 2: TEACHER tries to debug (BLOCKED)\n    print(\"\\nAttempt: TEACHER_AGENT tries to debug code...\")\n    allowed = enforcer.enforce(\n        agent_role=AgentRole.TEACHER,\n        permission=Permission.ANALYZE_BUGS,\n        action_name=\"analyze_bugs\"\n    )\n    \n    if allowed:\n        print(\"  ✅ ALLOWED\")\n    else:\n        print(\"  ❌ BLOCKED - TEACHER cannot debug code\")\n    \n    # Attempt 3: DEBUGGING analyzes bugs (ALLOWED)\n    print(\"\\nAttempt: DEBUGGING_AGENT analyzes bugs...\")\n    allowed = enforcer.enforce(\n        agent_role=AgentRole.DEBUGGING,\n        permission=Permission.ANALYZE_BUGS,\n        action_name=\"analyze_bugs\"\n    )\n    \n    if allowed:\n        print(\"  ✅ ALLOWED - DEBUGGING can analyze bugs\")\n    else:\n        print(\"  ❌ BLOCKED\")\n    \n    print()\n\n\ndef example_3_authorization_required():\n    \"\"\"Example 3: Authorization requirements\"\"\"\n    print(\"=\" * 60)\n    print(\"EXAMPLE 3: Authorization Requirements\")\n    print(\"=\" * 60)\n    \n    enforcer = PermissionEnforcer()\n    \n    # Scenario 1: User hasn't attempted enough times\n    print(\"Scenario: User attempted only 1 time\")\n    context = {\n        'user_consent': True,\n        'attempt_count': 1,\n        'in_contest': False\n    }\n    \n    allowed = enforcer.check_permission(\n        agent_role=AgentRole.CODING,\n        permission=Permission.GENERATE_FULL_SOLUTION,\n        context=context\n    )\n    print(f\"  Result: {'✅ ALLOWED' if allowed else '❌ BLOCKED - Need 3+ attempts'}\")\n    \n    # Scenario 2: User attempted enough times\n    print(\"\\nScenario: User attempted 3 times\")\n    context['attempt_count'] = 3\n    \n    allowed = enforcer.check_permission(\n        agent_role=AgentRole.CODING,\n        permission=Permission.GENERATE_FULL_SOLUTION,\n        context=context\n    )\n    print(f\"  Result: {'✅ ALLOWED - Authorization granted' if allowed else '❌ BLOCKED'}\")\n    \n    # Scenario 3: In contest mode\n    print(\"\\nScenario: User in contest mode\")\n    context['in_contest'] = True\n    \n    allowed = enforcer.check_permission(\n        agent_role=AgentRole.CODING,\n        permission=Permission.GENERATE_FULL_SOLUTION,\n        context=context\n    )\n    print(f\"  Result: {'✅ ALLOWED' if allowed else '❌ BLOCKED - Contest mode'}\")\n    \n    print()\n\n\ndef example_4_validate_agent_output():\n    \"\"\"Example 4: Validate agent output\"\"\"\n    print(\"=\" * 60)\n    print(\"EXAMPLE 4: Output Validation\")\n    print(\"=\" * 60)\n    \n    validator = RoleValidator()\n    \n    # Test 1: HINT provides code (VIOLATION)\n    print(\"Test 1: HINT_AGENT output contains code\")\n    hint_with_code = \"\"\"\n    Here's how to solve it:\n    \n    def two_sum(nums, target):\n        seen = {}\n        for i, num in enumerate(nums):\n            if target - num in seen:\n                return [seen[target - num], i]\n            seen[num] = i\n    \"\"\"\n    \n    result = validator.validate_output(\n        agent_role=AgentRole.HINT,\n        output_text=hint_with_code\n    )\n    \n    print(f\"  Valid: {result.is_valid}\")\n    if not result.is_valid:\n        print(\"  Issues found:\")\n        for issue in result.issues:\n            print(f\"    - [{issue.severity}] {issue.description}\")\n    \n    # Test 2: HINT provides proper hint (OK)\n    print(\"\\nTest 2: HINT_AGENT provides proper hint\")\n    proper_hint = \"\"\"\n    Think about using a hash map to store values you've seen.\n    You need to find two numbers that sum to the target.\n    Consider: what's the complement of each number?\n    \"\"\"\n    \n    result = validator.validate_output(\n        agent_role=AgentRole.HINT,\n        output_text=proper_hint\n    )\n    \n    print(f\"  Valid: {'✅ YES' if result.is_valid else '❌ NO'}\")\n    \n    # Test 3: PLANNER provides code (VIOLATION)\n    print(\"\\nTest 3: PLANNER_AGENT output contains implementation\")\n    planner_with_code = \"\"\"\n    Step 1: Create a hash map\n    Step 2: Iterate through array\n    \n    def solve():\n        for i in range(len(arr)):\n            # implementation\n    \"\"\"\n    \n    result = validator.validate_output(\n        agent_role=AgentRole.PLANNER,\n        output_text=planner_with_code\n    )\n    \n    print(f\"  Valid: {result.is_valid}\")\n    if not result.is_valid:\n        print(\"  Issues found:\")\n        for issue in result.issues:\n            print(f\"    - [{issue.severity}] {issue.description}\")\n    \n    print()\n\n\ndef example_5_get_agent_capabilities():\n    \"\"\"Example 5: Get what an agent can/cannot do\"\"\"\n    print(\"=\" * 60)\n    print(\"EXAMPLE 5: Agent Capabilities\")\n    print(\"=\" * 60)\n    \n    enforcer = PermissionEnforcer()\n    \n    # Get HINT_AGENT capabilities\n    print(\"HINT_AGENT Capabilities:\")\n    print(\"\\nALLOWED ACTIONS:\")\n    allowed = enforcer.get_allowed_actions(AgentRole.HINT)\n    for action in allowed[:5]:\n        print(f\"  ✅ {action}\")\n    print(f\"  ... and {len(allowed) - 5} more\")\n    \n    print(\"\\nFORBIDDEN ACTIONS:\")\n    forbidden = enforcer.get_forbidden_actions(AgentRole.HINT)\n    for item in forbidden[:3]:\n        print(f\"  ❌ {item['action']}\")\n        print(f\"     Reason: {item['reason']}\")\n    \n    print()\n\n\ndef example_6_violation_report():\n    \"\"\"Example 6: Get violation report\"\"\"\n    print(\"=\" * 60)\n    print(\"EXAMPLE 6: Violation Report\")\n    print(\"=\" * 60)\n    \n    enforcer = PermissionEnforcer()\n    \n    # Simulate some violations\n    enforcer.enforce(AgentRole.HINT, Permission.GENERATE_FULL_SOLUTION, \"gen_solution\")\n    enforcer.enforce(AgentRole.TEACHER, Permission.ANALYZE_BUGS, \"analyze_bug\")\n    enforcer.enforce(AgentRole.PLANNER, Permission.GENERATE_BOILERPLATE, \"gen_boilerplate\")\n    \n    # Get report\n    report = enforcer.get_violation_report()\n    \n    print(f\"Total violations: {report['total_violations']}\")\n    print(f\"\\nBy agent:\")\n    for agent, count in report['by_agent'].items():\n        print(f\"  {agent}: {count}\")\n    \n    print(f\"\\nBy severity:\")\n    for severity, count in report['by_severity'].items():\n        print(f\"  {severity}: {count}\")\n    \n    print(f\"\\nRecent violations:\")\n    for violation in report['recent_violations']:\n        print(f\"  - {violation['agent']}: {violation['action']} ({violation['severity']})\")\n    \n    print()\n\n\ndef example_7_permission_matrix():\n    \"\"\"Example 7: Display permission matrix\"\"\"\n    print(\"=\" * 60)\n    print(\"EXAMPLE 7: Permission Matrix\")\n    print(\"=\" * 60)\n    \n    enforcer = PermissionEnforcer()\n    \n    agents = [\n        AgentRole.PLANNER,\n        AgentRole.TEACHER,\n        AgentRole.HINT,\n        AgentRole.CODING,\n        AgentRole.DEBUGGING\n    ]\n    \n    permissions = [\n        Permission.GENERATE_FULL_SOLUTION,\n        Permission.PROVIDE_ALGORITHM_HINT,\n        Permission.EXPLAIN_CONCEPT,\n        Permission.ANALYZE_BUGS\n    ]\n    \n    print(\"\\nPermission Matrix:\")\n    print(\"-\" * 60)\n    \n    # Header\n    print(f\"{'Permission':<30}\", end=\"\")\n    for agent in agents:\n        print(f\"{agent.value[:6]:<8}\", end=\"\")\n    print()\n    print(\"-\" * 60)\n    \n    # Rows\n    for perm in permissions:\n        print(f\"{perm.value:<30}\", end=\"\")\n        for agent in agents:\n            has_perm = enforcer.check_permission(agent, perm)\n            symbol = \"✅\" if has_perm else \"❌\"\n            print(f\"{symbol:<8}\", end=\"\")\n        print()\n    \n    print()\n\n\nif __name__ == \"__main__\":\n    examples = [\n        example_1_check_basic_permission,\n        example_2_enforce_and_block,\n        example_3_authorization_required,\n        example_4_validate_agent_output,\n        example_5_get_agent_capabilities,\n        example_6_violation_report,\n        example_7_permission_matrix,\n    ]\n    \n    for example in examples:\n        example()\n        print(\"\\n\")\n