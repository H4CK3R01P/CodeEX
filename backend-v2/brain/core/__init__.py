"""
CodeEX_brain Core Components

Permission system, enforcement, and base classes.
"""

from .permissions import Permission, PermissionLevel, AgentRole, PermissionRegistry
from .agent_base import AgentBase
from .enforcement import requires_permission
from .violations import ViolationHandler, PermissionViolation

__all__ = [
    "Permission",
    "PermissionLevel",
    "AgentRole",
    "PermissionRegistry",
    "AgentBase",
    "requires_permission",
    "ViolationHandler",
    "PermissionViolation",
]
