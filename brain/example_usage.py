"""
Example Usage of CodeEX_brain System

Demonstrates the role-scoping enforcement system in action.
"""

from brain import CodeEXBrain
from brain.core.permissions import AgentRole, Permission
from brain.core.enforcement import PermissionDeniedError
from brain.agents import HintAgent, CodingAgent, TeacherAgent


def example_1_basic_usage():
    """Example 1: Basic CodeEX_brain usage"""
    print("\n" + "="*60)
    print("EXAMPLE 1: Basic CodeEX_brain Usage")
    print("="*60)
    
    # Initialize master controller
    brain = CodeEXBrain()
    
    # Check system health
    health = brain.health_check()
    print(f"\n✅ System Status: {health['status']}")
    print(f"✅ Agents Available: {health['agents_count']}")
    print(f"✅ Active Agents: {', '.join(health['agents'])}")
    
    # Get agent statistics
    stats = brain.get_agent_stats()
    print(f"\n📊 Agent Statistics:")
    for agent_name, agent_stats in stats['agents'].items():
        print(f"   - {agent_name}: {agent_stats['operation_count']} operations")


def example_2_hint_agent():
    """Example 2: Using Hint Agent (Allowed Operations)"""
    print("\n" + "="*60)
    print("EXAMPLE 2: Hint Agent - Allowed Operations")
    print("="*60)
    
    brain = CodeEXBrain()
    
    problem = {
        "id": "two-sum",
        "title": "Two Sum",
        "description": "Find two numbers that add up to target"
    }
    
    # Get algorithm hint (ALLOWED)
    print("\n🔹 Requesting algorithm hint...")
    result = brain.get_hint(problem, hint_type="algorithm")
    print(f"✅ Success: {result.get('verified', False)}")
    print(f"   Agent: {result.get('agent')}")
    
    # Get syntax hint (ALLOWED)
    print("\n🔹 Requesting syntax hint...")
    result = brain.execute_agent(
        AgentRole.HINT,
        {
            "hint_type": "syntax",
            "code": "def two_sum(nums, target):",
            "language": "python"
        }
    )
    print(f"✅ Success: {result.get('verified', False)}")


def example_3_permission_violation():
    """Example 3: Permission Violation Detection"""
    print("\n" + "="*60)
    print("EXAMPLE 3: Permission Violation Detection")
    print("="*60)
    
    # Create hint agent directly (bypassing controller for demo)
    hint_agent = HintAgent()
    
    print("\n⚠️  Attempting unauthorized operation...")
    print("   Hint agent trying to generate full solution...")
    
    try:
        # This will FAIL - Hint agent doesn't have this permission
        from brain.core.enforcement import requires_permission
        
        # Simulate calling a method that requires GENERATE_FULL_SOLUTION
        @requires_permission(Permission.GENERATE_FULL_SOLUTION)
        def generate_solution_test(agent):
            return {"code": "solution"}
        
        generate_solution_test(hint_agent)
        
    except PermissionDeniedError as e:
        print(f"❌ BLOCKED: {e}")
        print("✅ Security system working correctly!")
    except AttributeError:
        # If method doesn't exist, that's also fine for demo
        print("✅ Method doesn't exist - permission system prevents it")


def example_4_teacher_agent():
    """Example 4: Teacher Agent Explanations"""
    print("\n" + "="*60)
    print("EXAMPLE 4: Teacher Agent - Conceptual Explanations")
    print("="*60)
    
    brain = CodeEXBrain()
    
    # Explain a concept (ALLOWED)
    print("\n🔹 Requesting concept explanation...")
    result = brain.explain_concept(
        concept="dynamic_programming",
        context={"difficulty": "medium"}
    )
    print(f"✅ Success: {result.get('verified', False)}")
    print(f"   Agent: {result.get('agent')}")


def example_5_authorized_solution():
    """Example 5: Authorized Full Solution Generation"""
    print("\n" + "="*60)
    print("EXAMPLE 5: Authorized Full Solution (Controlled)")
    print("="*60)
    
    brain = CodeEXBrain()
    
    problem = {
        "id": "two-sum",
        "title": "Two Sum"
    }
    
    print("\n🔹 Requesting authorized full solution...")
    print("   (Only after user made 5 attempts)")
    
    result = brain.authorize_full_solution(
        problem=problem,
        reason="User attempted 5 times, educational context"
    )
    
    print(f"✅ Authorized: {result.get('verified', False)}")
    print(f"   Agent: {result.get('agent')}")
    print("⚠️  Operation logged for audit")


def example_6_violation_report():
    """Example 6: Violation Reporting"""
    print("\n" + "="*60)
    print("EXAMPLE 6: Violation Reporting & Monitoring")
    print("="*60)
    
    brain = CodeEXBrain()
    
    # Attempt some operations (some will fail)
    print("\n🔹 Simulating various agent operations...")
    
    # Valid operation
    brain.get_hint({"id": "test"}, "algorithm")
    
    # Try to trigger a violation by direct agent access
    hint_agent = HintAgent()
    try:
        # This will fail and be logged
        from brain.core.enforcement import requires_permission
        
        @requires_permission(Permission.GENERATE_FULL_SOLUTION)
        def unauthorized_test(agent):
            return {}
        
        unauthorized_test(hint_agent)
    except PermissionDeniedError:
        pass  # Expected
    
    # Get violation report
    print("\n📊 Violation Report:")
    report = brain.get_violation_report()
    print(f"   Total Violations: {report['total_violations']}")
    print(f"   By Role: {report['violations_by_role']}")
    
    if report['recent_violations']:
        print(f"\n   Recent Violations:")
        for v in report['recent_violations'][-3:]:
            print(f"      - {v['role']} attempted {v['permission']}")
            print(f"        Severity: {v['severity']}")


def example_7_agent_permissions():
    """Example 7: Check Agent Permissions"""
    print("\n" + "="*60)
    print("EXAMPLE 7: Agent Permission Inspection")
    print("="*60)
    
    # Create different agents
    hint_agent = HintAgent()
    teacher_agent = TeacherAgent()
    coding_agent = CodingAgent()
    
    print("\n🔹 Hint Agent Permissions:")
    for perm in hint_agent.permissions:
        print(f"   ✅ {perm.value}")
    
    print(f"\n🔹 Teacher Agent Permissions:")
    for perm in list(teacher_agent.permissions)[:5]:  # First 5
        print(f"   ✅ {perm.value}")
    print(f"   ... and {len(teacher_agent.permissions) - 5} more")
    
    print(f"\n🔹 Coding Agent Permissions:")
    for perm in coding_agent.permissions:
        print(f"   ✅ {perm.value}")
    
    # Check specific permissions
    print(f"\n🔍 Permission Checks:")
    print(f"   Hint can provide hints? {hint_agent.has_permission(Permission.PROVIDE_ALGORITHM_HINT)}")
    print(f"   Hint can generate code? {hint_agent.has_permission(Permission.GENERATE_FULL_SOLUTION)}")
    print(f"   Teacher can explain? {teacher_agent.has_permission(Permission.EXPLAIN_CONCEPT)}")
    print(f"   Teacher can code? {teacher_agent.has_permission(Permission.GENERATE_FULL_SOLUTION)}")


def main():
    """Run all examples"""
    print("\n" + "="*60)
    print("CodeEX_brain - Role-Scoping Enforcement System")
    print("DEMO: Design + Scaffolding")
    print("="*60)
    
    try:
        example_1_basic_usage()
        example_2_hint_agent()
        example_3_permission_violation()
        example_4_teacher_agent()
        example_5_authorized_solution()
        example_6_violation_report()
        example_7_agent_permissions()
        
        print("\n" + "="*60)
        print("✅ All Examples Completed Successfully!")
        print("="*60)
        print("\nNext Steps:")
        print("1. Implement LLM integration for actual AI responses")
        print("2. Add persistent storage for violations and context")
        print("3. Create API endpoints for frontend integration")
        print("4. Add comprehensive testing suite")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
