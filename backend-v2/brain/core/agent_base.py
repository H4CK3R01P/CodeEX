"""
Agent Base Class

Base class for all CodeEX_brain agents with role enforcement.
"""

import uuid
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, Set
from datetime import datetime

from .permissions import AgentRole, Permission, PermissionRegistry


class AgentBase(ABC):
    """
    Base class for all CodeEX_brain agents.
    
    All agents must:
    1. Inherit from this class
    2. Define their role
    3. Use @requires_permission decorator for protected operations
    4. Never access database or testcases directly
    5. Only operate on sanitized inputs from CodeEX_brain
    """
    
    def __init__(self, role: AgentRole, agent_id: Optional[str] = None):
        """
        Initialize agent with role.
        
        Args:
            role: Agent role (defines permissions)
            agent_id: Optional unique identifier (auto-generated if not provided)
        """
        # Validate role
        if not PermissionRegistry.validate_role(role):
            raise ValueError(f"Invalid role: {role}")
        
        self.role = role
        self.agent_id = agent_id or f"{role.value}_{uuid.uuid4().hex[:8]}"
        self.created_at = datetime.utcnow()
        self._operation_count = 0
        self._last_operation_time: Optional[datetime] = None
    
    @property
    def permissions(self) -> Set[Permission]:
        """Get all permissions granted to this agent"""
        return PermissionRegistry.get_permissions(self.role)
    
    def has_permission(self, permission: Permission) -> bool:
        """Check if agent has a specific permission"""
        return PermissionRegistry.has_permission(self.role, permission)
    
    def get_role_description(self) -> str:
        """Get description of this agent's role"""
        return PermissionRegistry.get_role_description(self.role)
    
    def _record_operation(self) -> None:
        """Internal: Record that an operation was performed"""
        self._operation_count += 1
        self._last_operation_time = datetime.utcnow()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        return {
            "agent_id": self.agent_id,
            "role": self.role.value,
            "created_at": self.created_at.isoformat(),
            "operation_count": self._operation_count,
            "last_operation": self._last_operation_time.isoformat() if self._last_operation_time else None,
            "permissions": [p.value for p in self.permissions]
        }
    
    @abstractmethod
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main processing method for the agent.
        
        Must be implemented by all concrete agents.
        
        Args:
            input_data: Sanitized input from CodeEX_brain
            
        Returns:
            Processing result
        """
        pass
    
    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}(role={self.role.value}, id={self.agent_id})>"
