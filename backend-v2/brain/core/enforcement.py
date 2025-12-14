"""
Permission Enforcement

Decorator-based permission checking for agent methods.
"""

import functools
from typing import Callable, Any

from .permissions import Permission, PermissionRegistry
from .violations import get_violation_handler


class PermissionDeniedError(Exception):
    """Raised when an agent attempts an unauthorized operation"""
    pass


def requires_permission(permission: Permission):
    """
    Decorator to enforce permission checking on agent methods.
    
    Usage:
        @requires_permission(Permission.GENERATE_FULL_SOLUTION)
        def generate_solution(self, problem):
            # This will only execute if the agent has permission
            ...
    
    Args:
        permission: Required permission to execute the method
        
    Raises:
        PermissionDeniedError: If the agent lacks the required permission
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(self, *args, **kwargs) -> Any:
            # Check if agent has required permission
            if not hasattr(self, 'role'):
                raise AttributeError(
                    f"Agent {self.__class__.__name__} must have a 'role' attribute"
                )
            
            agent_role = self.role
            has_permission = PermissionRegistry.has_permission(agent_role, permission)
            
            if not has_permission:
                # Log violation
                agent_id = getattr(self, 'agent_id', None)
                violation_handler = get_violation_handler()
                violation_handler.handle_violation(
                    role=agent_role,
                    permission=permission,
                    method_name=func.__name__,
                    agent_id=agent_id,
                    context={
                        "args_count": len(args),
                        "kwargs_keys": list(kwargs.keys())
                    }
                )
                
                # Raise permission denied error
                raise PermissionDeniedError(
                    f"Agent with role '{agent_role.value}' does not have permission "
                    f"'{permission.value}' required for method '{func.__name__}'"
                )
            
            # Execute the method if permission granted
            return func(self, *args, **kwargs)
        
        # Store permission requirement as metadata
        wrapper._required_permission = permission
        return wrapper
    
    return decorator


def get_required_permission(method: Callable) -> Permission | None:
    """Get the required permission for a method (if decorator was used)"""
    return getattr(method, '_required_permission', None)
