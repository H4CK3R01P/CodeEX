"""
CodeEX_brain - AI Agent Orchestration System

Master controller with role-based permission enforcement for AI agents.
"""

from .controller import CodeEXBrain
from .core.permissions import Permission, PermissionLevel, AgentRole
from .core.agent_base import AgentBase
from .core.violations import ViolationHandler, PermissionViolation

__all__ = [
    "CodeEXBrain",
    "Permission",
    "PermissionLevel",
    "AgentRole",
    "AgentBase",
    "ViolationHandler",
    "PermissionViolation",
]

__version__ = "1.0.0"
