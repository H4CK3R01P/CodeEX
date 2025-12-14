"""
CodeEX_brain Master Controller

Orchestrates all agents with input sanitization and verification.
"""

import logging
from typing import Dict, Any, Optional
from datetime import datetime
import time

from .core.permissions import AgentRole, Permission
from .core.agent_base import AgentBase
from .core.violations import ViolationHandler
from .agents import (
    PlannerAgent,
    TeacherAgent,
    HintAgent,
    CodingAgent,
    DebuggingAgent,
    RefactorAgent,
    ProjectInspectorAgent,
    ResearchAgent,
    MemoryAgent,
)
from .observability import log_ai_request, get_metrics_instance


logger = logging.getLogger("codex_brain.controller")


class CodeEXBrain:
    """
    Master controller for CodeEX_brain agent system.
    
    This is the ONLY entry point for all agent interactions.
    
    Responsibilities:
    - Initialize and manage all agents
    - Sanitize inputs before passing to agents
    - Verify agent outputs
    - Enforce security policies
    - Monitor agent behavior
    - Handle authorization for sensitive operations
    
    Key Principles:
    - Agents NEVER communicate directly
    - All data passes through CodeEX_brain
    - Input sanitization is mandatory
    - Output verification is required
    - Violations are logged and blocked
    """
    
    def __init__(self, violation_handler: Optional[ViolationHandler] = None):
        """
        Initialize CodeEX_brain with all agents.
        
        Args:
            violation_handler: Optional custom violation handler
        """
        self.role = AgentRole.MASTER
        self.created_at = datetime.utcnow()
        
        # Initialize violation handler
        self.violation_handler = violation_handler or ViolationHandler()
        
        # Initialize all agents
        self.agents: Dict[AgentRole, AgentBase] = {
            AgentRole.PLANNER: PlannerAgent(),
            AgentRole.TEACHER: TeacherAgent(),
            AgentRole.HINT: HintAgent(),
            AgentRole.CODING: CodingAgent(),
            AgentRole.DEBUGGING: DebuggingAgent(),
            AgentRole.REFACTOR: RefactorAgent(),
            AgentRole.PROJECT_INSPECTOR: ProjectInspectorAgent(),
            AgentRole.RESEARCH: ResearchAgent(),
            AgentRole.MEMORY: MemoryAgent(),
        }
        
        logger.info(f"CodeEX_brain initialized with {len(self.agents)} agents")
    
    def sanitize_input(self, raw_input: Any) -> Dict[str, Any]:
        """
        Sanitize input data before passing to agents.
        
        This is a CRITICAL security function.
        
        Args:
            raw_input: Raw input from external sources
            
        Returns:
            Sanitized input safe for agent processing
        """
        # TODO: Implement comprehensive input sanitization
        # - Remove sensitive data (passwords, tokens, personal info)
        # - Validate data structure
        # - Remove direct database references
        # - Strip test case solutions
        # - Limit data size
        
        if not isinstance(raw_input, dict):
            raw_input = {"data": raw_input}
        
        sanitized = {
            "timestamp": datetime.utcnow().isoformat(),
            "data": raw_input,
            "sanitized": True
        }
        
        return sanitized
    
    def verify_output(self, agent_role: AgentRole, output: Any) -> Dict[str, Any]:
        """
        Verify agent output before returning to caller.
        
        This ensures agents don't leak sensitive information.
        
        Args:
            agent_role: Role of the agent that produced output
            output: Output from agent
            
        Returns:
            Verified output safe to return
        """
        # TODO: Implement output verification
        # - Check for sensitive data leaks
        # - Verify output matches expected schema
        # - Remove any unauthorized information
        # - Validate against agent permissions
        
        verified = {
            "agent": agent_role.value,
            "output": output,
            "verified": True,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return verified
    
    def execute_agent(
        self,
        agent_role: AgentRole,
        input_data: Dict[str, Any],
        authorized_operations: Optional[set] = None,
        user_id: Optional[str] = None,
        domain: str = "general",
        endpoint: str = "/api/agent",
        operation: str = "process"
    ) -> Dict[str, Any]:
        """
        Execute an agent with sanitized input and observability.
        
        This is the primary method for agent interaction.
        
        Args:
            agent_role: Which agent to execute
            input_data: Input data (will be sanitized)
            authorized_operations: Set of explicitly authorized operations
            user_id: User identifier (for observability, will be hashed)
            domain: AI domain for metrics
            endpoint: API endpoint for tracking
            operation: Operation name for logging
            
        Returns:
            Verified agent output
            
        Raises:
            ValueError: If agent role is invalid
        """
        # Validate agent exists
        if agent_role not in self.agents:
            raise ValueError(f"Unknown agent role: {agent_role}")
        
        # Get agent
        agent = self.agents[agent_role]
        agent_name = agent_role.value
        
        # Get metrics instance
        metrics = get_metrics_instance()
        
        # Start observability tracking
        start_time = time.time()
        success = True
        failure_reason = None
        
        try:
            # Use structured logging context
            with log_ai_request(
                user_id=user_id,
                domain=domain,
                agent_name=agent_name,
                endpoint=endpoint,
                operation=operation,
                # Additional context (will be sanitized)
                agent_role=agent_name
            ) as request_id:
                
                # Sanitize input
                sanitized_input = self.sanitize_input(input_data)
                
                # Add authorization context if provided
                if authorized_operations:
                    sanitized_input["authorized_operations"] = authorized_operations
                
                # Execute agent
                logger.info(f"Executing agent: {agent_name}")
                output = agent.process(sanitized_input)
                
                # Verify output
                verified_output = self.verify_output(agent_role, output)
                
                logger.info(f"Agent {agent_name} completed successfully")
                return verified_output
                
        except Exception as e:
            success = False
            failure_reason = f"{type(e).__name__}: {str(e)}"
            
            logger.error(f"Agent {agent_name} failed: {str(e)}")
            return {
                "error": str(e),
                "agent": agent_name,
                "failed": True
            }
            
        finally:
            # Record metrics (non-blocking, thread-safe)
            latency_ms = (time.time() - start_time) * 1000
            
            try:
                metrics.record_request(
                    agent_name=agent_name,
                    domain=domain,
                    endpoint=endpoint,
                    latency_ms=latency_ms,
                    success=success,
                    failure_reason=failure_reason
                )
            except Exception as metrics_error:
                # Never crash on metrics error
                logger.error(f"Failed to record metrics: {metrics_error}")
    
    def authorize_full_solution(
        self,
        problem: Dict[str, Any],
        reason: str
    ) -> Dict[str, Any]:
        """
        Authorize and generate a full solution.
        
        This is a controlled operation that should only be used when:
        - User has attempted multiple times
        - Educational context is appropriate
        - Proper logging is in place
        
        Args:
            problem: Problem to solve
            reason: Reason for authorization (for audit)
            
        Returns:
            Full solution (if authorized)
        """
        logger.warning(
            f"Full solution authorization requested. Reason: {reason}"
        )
        
        # TODO: Add authorization logic
        # - Check user attempt count
        # - Verify educational context
        # - Log authorization decision
        
        return self.execute_agent(
            AgentRole.CODING,
            {
                "operation": "full_solution",
                "problem": problem,
                "authorized": True
            },
            authorized_operations={Permission.GENERATE_FULL_SOLUTION}
        )
    
    def get_hint(self, problem: Dict[str, Any], hint_type: str = "algorithm") -> Dict[str, Any]:
        """Get a hint for a problem"""
        return self.execute_agent(
            AgentRole.HINT,
            {
                "hint_type": hint_type,
                "problem": problem
            }
        )
    
    def explain_concept(self, concept: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Get explanation for a concept"""
        return self.execute_agent(
            AgentRole.TEACHER,
            {
                "operation": "explain_concept",
                "concept": concept,
                "context": context
            }
        )
    
    def debug_code(
        self,
        code: str,
        error_data: Dict[str, Any],
        language: str
    ) -> Dict[str, Any]:
        """Debug code with error analysis"""
        return self.execute_agent(
            AgentRole.DEBUGGING,
            {
                "operation": "suggest_fix",
                "code": code,
                "error_data": error_data,
                "language": language
            }
        )
    
    def plan_solution(self, problem: Dict[str, Any]) -> Dict[str, Any]:
        """Create solution plan"""
        return self.execute_agent(
            AgentRole.PLANNER,
            {
                "operation": "suggest_approach",
                "problem": problem
            }
        )
    
    def get_agent_stats(self, agent_role: Optional[AgentRole] = None) -> Dict[str, Any]:
        """Get statistics for agents"""
        if agent_role:
            if agent_role not in self.agents:
                return {"error": f"Unknown agent: {agent_role}"}
            return self.agents[agent_role].get_stats()
        else:
            return {
                "agents": {
                    role.value: agent.get_stats()
                    for role, agent in self.agents.items()
                }
            }
    
    def get_violation_report(self) -> Dict[str, Any]:
        """Get violation report from handler"""
        return self.violation_handler.get_report()
    
    def health_check(self) -> Dict[str, Any]:
        """Check health of all agents"""
        return {
            "status": "healthy",
            "agents_count": len(self.agents),
            "agents": [role.value for role in self.agents.keys()],
            "violations": self.violation_handler.get_violation_count(),
            "uptime_seconds": (datetime.utcnow() - self.created_at).total_seconds()
        }
