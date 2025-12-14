"""
Hint Agent

Responsible for providing partial guidance without revealing full solutions.
"""

from typing import Dict, Any

from ..core.agent_base import AgentBase
from ..core.permissions import AgentRole, Permission
from ..core.enforcement import requires_permission


class HintAgent(AgentBase):
    """
    Hint agent providing partial guidance without full solutions.
    
    Responsibilities:
    - Provide algorithm hints
    - Suggest syntax improvements
    - Highlight edge cases
    - Guide without revealing answers
    
    Restrictions:
    - CANNOT generate full solutions
    - CANNOT provide complete code
    - Only partial guidance allowed
    """
    
    def __init__(self, agent_id: str = None):
        super().__init__(role=AgentRole.HINT, agent_id=agent_id)
    
    @requires_permission(Permission.PROVIDE_ALGORITHM_HINT)
    def provide_algorithm_hint(self, problem: Dict[str, Any]) -> Dict[str, Any]:
        """
        Provide a hint about which algorithm to use.
        
        Args:
            problem: Sanitized problem data
            
        Returns:
            Algorithm hint without full solution
        """
        self._record_operation()
        
        # TODO: Implement LLM-based algorithm hint
        return {
            "hint": "[To be implemented]",
            "hint_type": "algorithm",
            "difficulty": "medium"
        }
    
    @requires_permission(Permission.PROVIDE_SYNTAX_HINT)
    def provide_syntax_hint(self, code: str, language: str) -> Dict[str, Any]:
        """
        Provide syntax hints for code.
        
        Args:
            code: User's code (sanitized)
            language: Programming language
            
        Returns:
            Syntax hints
        """
        self._record_operation()
        
        # TODO: Implement syntax hint generation
        return {
            "hint": "[To be implemented]",
            "hint_type": "syntax",
            "language": language
        }
    
    @requires_permission(Permission.PROVIDE_EDGE_CASE_HINT)
    def provide_edge_case_hint(self, problem: Dict[str, Any]) -> Dict[str, Any]:
        """
        Hint about edge cases to consider.
        
        Args:
            problem: Sanitized problem data
            
        Returns:
            Edge case hints
        """
        self._record_operation()
        
        # TODO: Implement edge case hint generation
        return {
            "hint": "[To be implemented]",
            "hint_type": "edge_case",
            "cases_to_consider": []
        }
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process hint request.
        
        Args:
            input_data: Sanitized input with hint type
            
        Returns:
            Hint result
        """
        hint_type = input_data.get("hint_type")
        
        if hint_type == "algorithm":
            return self.provide_algorithm_hint(input_data.get("problem"))
        elif hint_type == "syntax":
            return self.provide_syntax_hint(
                input_data.get("code"),
                input_data.get("language")
            )
        elif hint_type == "edge_case":
            return self.provide_edge_case_hint(input_data.get("problem"))
        else:
            return {"error": f"Unknown hint type: {hint_type}"}
