"""CodeEX Brain Agent Roles and Permissions

Defines strict role scoping and permission enforcement for subagents.
"""

from .permission_enforcer import (
    PermissionEnforcer,
    PermissionViolation,
    AgentRole,
    Permission
)
from .role_validator import RoleValidator, ValidationResult

__all__ = [
    'PermissionEnforcer',
    'PermissionViolation',
    'AgentRole',
    'Permission',
    'RoleValidator',
    'ValidationResult',
]
