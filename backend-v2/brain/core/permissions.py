"""
Permission System

Defines all permissions, roles, and permission mappings for CodeEX_brain agents.
"""

from enum import Enum
from typing import Dict, Set, Optional
from dataclasses import dataclass


class Permission(str, Enum):
    """All possible permissions in the CodeEX_brain system"""
    
    # Code Generation Permissions
    GENERATE_FULL_SOLUTION = "generate_full_solution"
    GENERATE_PARTIAL_SOLUTION = "generate_partial_solution"
    GENERATE_BOILERPLATE = "generate_boilerplate"
    
    # Hint Permissions
    PROVIDE_ALGORITHM_HINT = "provide_algorithm_hint"
    PROVIDE_SYNTAX_HINT = "provide_syntax_hint"
    PROVIDE_EDGE_CASE_HINT = "provide_edge_case_hint"
    
    # Explanation Permissions
    EXPLAIN_CONCEPT = "explain_concept"
    EXPLAIN_ALGORITHM = "explain_algorithm"
    EXPLAIN_COMPLEXITY = "explain_complexity"
    EXPLAIN_APPROACH = "explain_approach"
    
    # Code Analysis Permissions
    ANALYZE_CODE_QUALITY = "analyze_code_quality"
    ANALYZE_BUGS = "analyze_bugs"
    ANALYZE_PERFORMANCE = "analyze_performance"
    SUGGEST_OPTIMIZATIONS = "suggest_optimizations"
    
    # Planning Permissions
    CREATE_PROBLEM_BREAKDOWN = "create_problem_breakdown"
    SUGGEST_APPROACH = "suggest_approach"
    IDENTIFY_SUBPROBLEMS = "identify_subproblems"
    
    # Research Permissions
    SEARCH_SIMILAR_PROBLEMS = "search_similar_problems"
    GATHER_CONTEXT = "gather_context"
    FIND_REFERENCES = "find_references"
    
    # Memory Permissions
    STORE_CONTEXT = "store_context"
    RETRIEVE_CONTEXT = "retrieve_context"
    UPDATE_CONTEXT = "update_context"
    DELETE_CONTEXT = "delete_context"
    
    # Refactoring Permissions
    REFACTOR_CODE = "refactor_code"
    IMPROVE_READABILITY = "improve_readability"
    SUGGEST_PATTERNS = "suggest_patterns"
    
    # Debugging Permissions
    IDENTIFY_ERROR_TYPE = "identify_error_type"
    SUGGEST_FIX = "suggest_fix"
    PROVIDE_TEST_CASE = "provide_test_case"
    EXPLAIN_ERROR = "explain_error"
    
    # Project Inspection Permissions
    INSPECT_STRUCTURE = "inspect_structure"
    ANALYZE_DEPENDENCIES = "analyze_dependencies"
    ASSESS_QUALITY = "assess_quality"


class PermissionLevel(str, Enum):
    """Permission access levels"""
    NONE = "none"          # No access
    READ = "read"          # Can read/view only
    WRITE = "write"        # Can modify/create
    EXECUTE = "execute"    # Can execute operations
    FULL = "full"          # Full access (master only)


class AgentRole(str, Enum):
    """All agent roles in the CodeEX_brain system"""
    MASTER = "master"                      # CodeEX_brain (full privileges)
    PLANNER = "planner"                    # Problem planning agent
    TEACHER = "teacher"                    # Teaching/explanation agent
    HINT = "hint"                          # Hint generation agent
    CODING = "coding"                      # Code generation agent
    DEBUGGING = "debugging"                # Debugging assistance agent
    REFACTOR = "refactor"                  # Code refactoring agent
    PROJECT_INSPECTOR = "project_inspector" # Project analysis agent
    RESEARCH = "research"                  # Research/context agent
    MEMORY = "memory"                      # Context memory agent


@dataclass
class PermissionConfig:
    """Permission configuration for a specific agent role"""
    role: AgentRole
    allowed_permissions: Set[Permission]
    description: str


class PermissionRegistry:
    """
    Central registry for all role-permission mappings.
    
    This is the SINGLE SOURCE OF TRUTH for agent permissions.
    """
    
    # Permission mappings for each agent role
    ROLE_PERMISSIONS: Dict[AgentRole, PermissionConfig] = {
        AgentRole.MASTER: PermissionConfig(
            role=AgentRole.MASTER,
            allowed_permissions=set(Permission),  # All permissions
            description="Master controller with full access to all operations"
        ),
        
        AgentRole.PLANNER: PermissionConfig(
            role=AgentRole.PLANNER,
            allowed_permissions={
                Permission.CREATE_PROBLEM_BREAKDOWN,
                Permission.SUGGEST_APPROACH,
                Permission.IDENTIFY_SUBPROBLEMS,
                Permission.EXPLAIN_APPROACH,
                Permission.GATHER_CONTEXT,
            },
            description="Planning agent for problem breakdown and approach suggestion"
        ),
        
        AgentRole.TEACHER: PermissionConfig(
            role=AgentRole.TEACHER,
            allowed_permissions={
                Permission.EXPLAIN_CONCEPT,
                Permission.EXPLAIN_ALGORITHM,
                Permission.EXPLAIN_COMPLEXITY,
                Permission.EXPLAIN_APPROACH,
                Permission.PROVIDE_ALGORITHM_HINT,
                Permission.EXPLAIN_ERROR,
            },
            description="Teaching agent for conceptual explanations and learning"
        ),
        
        AgentRole.HINT: PermissionConfig(
            role=AgentRole.HINT,
            allowed_permissions={
                Permission.PROVIDE_ALGORITHM_HINT,
                Permission.PROVIDE_SYNTAX_HINT,
                Permission.PROVIDE_EDGE_CASE_HINT,
            },
            description="Hint agent providing partial guidance without full solutions"
        ),
        
        AgentRole.CODING: PermissionConfig(
            role=AgentRole.CODING,
            allowed_permissions={
                Permission.GENERATE_FULL_SOLUTION,
                Permission.GENERATE_PARTIAL_SOLUTION,
                Permission.GENERATE_BOILERPLATE,
                Permission.SUGGEST_PATTERNS,
            },
            description="Coding agent for solution generation (only when authorized)"
        ),
        
        AgentRole.DEBUGGING: PermissionConfig(
            role=AgentRole.DEBUGGING,
            allowed_permissions={
                Permission.IDENTIFY_ERROR_TYPE,
                Permission.SUGGEST_FIX,
                Permission.PROVIDE_TEST_CASE,
                Permission.EXPLAIN_ERROR,
                Permission.ANALYZE_BUGS,
            },
            description="Debugging agent for error analysis and fix suggestions"
        ),
        
        AgentRole.REFACTOR: PermissionConfig(
            role=AgentRole.REFACTOR,
            allowed_permissions={
                Permission.REFACTOR_CODE,
                Permission.IMPROVE_READABILITY,
                Permission.SUGGEST_PATTERNS,
                Permission.SUGGEST_OPTIMIZATIONS,
                Permission.ANALYZE_CODE_QUALITY,
            },
            description="Refactoring agent for code improvement and optimization"
        ),
        
        AgentRole.PROJECT_INSPECTOR: PermissionConfig(
            role=AgentRole.PROJECT_INSPECTOR,
            allowed_permissions={
                Permission.INSPECT_STRUCTURE,
                Permission.ANALYZE_DEPENDENCIES,
                Permission.ASSESS_QUALITY,
                Permission.ANALYZE_CODE_QUALITY,
                Permission.ANALYZE_PERFORMANCE,
            },
            description="Project inspection agent for structure and quality analysis"
        ),
        
        AgentRole.RESEARCH: PermissionConfig(
            role=AgentRole.RESEARCH,
            allowed_permissions={
                Permission.SEARCH_SIMILAR_PROBLEMS,
                Permission.GATHER_CONTEXT,
                Permission.FIND_REFERENCES,
            },
            description="Research agent for gathering context and finding references"
        ),
        
        AgentRole.MEMORY: PermissionConfig(
            role=AgentRole.MEMORY,
            allowed_permissions={
                Permission.STORE_CONTEXT,
                Permission.RETRIEVE_CONTEXT,
                Permission.UPDATE_CONTEXT,
                Permission.DELETE_CONTEXT,
            },
            description="Memory agent for context storage and retrieval"
        ),
    }
    
    @classmethod
    def get_permissions(cls, role: AgentRole) -> Set[Permission]:
        """Get all allowed permissions for a role"""
        if role not in cls.ROLE_PERMISSIONS:
            return set()
        return cls.ROLE_PERMISSIONS[role].allowed_permissions
    
    @classmethod
    def has_permission(cls, role: AgentRole, permission: Permission) -> bool:
        """Check if a role has a specific permission"""
        return permission in cls.get_permissions(role)
    
    @classmethod
    def get_role_description(cls, role: AgentRole) -> str:
        """Get description of a role"""
        if role not in cls.ROLE_PERMISSIONS:
            return "Unknown role"
        return cls.ROLE_PERMISSIONS[role].description
    
    @classmethod
    def get_all_roles(cls) -> Set[AgentRole]:
        """Get all available roles"""
        return set(cls.ROLE_PERMISSIONS.keys())
    
    @classmethod
    def validate_role(cls, role: AgentRole) -> bool:
        """Validate if a role exists in the registry"""
        return role in cls.ROLE_PERMISSIONS
