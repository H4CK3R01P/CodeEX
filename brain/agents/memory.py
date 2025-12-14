"""
Memory Agent

Responsible for context storage and retrieval.
"""

from typing import Dict, Any, Optional

from ..core.agent_base import AgentBase
from ..core.permissions import AgentRole, Permission
from ..core.enforcement import requires_permission


class MemoryAgent(AgentBase):
    """
    Memory agent for context storage and retrieval.
    
    Responsibilities:
    - Store conversation context
    - Retrieve relevant context
    - Update context as needed
    - Manage context lifecycle
    
    Restrictions:
    - Only stores sanitized data
    - No access to user personal information
    - Limited retention period
    """
    
    def __init__(self, agent_id: str = None):
        super().__init__(role=AgentRole.MEMORY, agent_id=agent_id)
        # In-memory storage for demo (would be replaced with proper storage)
        self._context_store: Dict[str, Any] = {}
    
    @requires_permission(Permission.STORE_CONTEXT)
    def store_context(self, context_id: str, context_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store context data.
        
        Args:
            context_id: Unique identifier for context
            context_data: Context data to store (sanitized)
            
        Returns:
            Storage confirmation
        """
        self._record_operation()
        
        # TODO: Implement persistent storage
        self._context_store[context_id] = context_data
        
        return {
            "context_id": context_id,
            "stored": True,
            "timestamp": self._last_operation_time.isoformat() if self._last_operation_time else None
        }
    
    @requires_permission(Permission.RETRIEVE_CONTEXT)
    def retrieve_context(self, context_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve stored context.
        
        Args:
            context_id: Unique identifier for context
            
        Returns:
            Retrieved context or None if not found
        """
        self._record_operation()
        
        # TODO: Implement persistent retrieval
        return self._context_store.get(context_id)
    
    @requires_permission(Permission.UPDATE_CONTEXT)
    def update_context(self, context_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update existing context.
        
        Args:
            context_id: Unique identifier for context
            updates: Updates to apply
            
        Returns:
            Update confirmation
        """
        self._record_operation()
        
        # TODO: Implement persistent update
        if context_id in self._context_store:
            self._context_store[context_id].update(updates)
            return {"context_id": context_id, "updated": True}
        else:
            return {"context_id": context_id, "updated": False, "error": "Context not found"}
    
    @requires_permission(Permission.DELETE_CONTEXT)
    def delete_context(self, context_id: str) -> Dict[str, Any]:
        """
        Delete stored context.
        
        Args:
            context_id: Unique identifier for context
            
        Returns:
            Deletion confirmation
        """
        self._record_operation()
        
        # TODO: Implement persistent deletion
        if context_id in self._context_store:
            del self._context_store[context_id]
            return {"context_id": context_id, "deleted": True}
        else:
            return {"context_id": context_id, "deleted": False, "error": "Context not found"}
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process memory request.
        
        Args:
            input_data: Sanitized input with operation type
            
        Returns:
            Memory operation result
        """
        operation = input_data.get("operation")
        context_id = input_data.get("context_id")
        
        if operation == "store":
            return self.store_context(context_id, input_data.get("context_data"))
        elif operation == "retrieve":
            context = self.retrieve_context(context_id)
            return {"context": context} if context else {"error": "Context not found"}
        elif operation == "update":
            return self.update_context(context_id, input_data.get("updates"))
        elif operation == "delete":
            return self.delete_context(context_id)
        else:
            return {"error": f"Unknown operation: {operation}"}
