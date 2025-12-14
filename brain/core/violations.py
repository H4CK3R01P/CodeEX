"""
Violation Handling

Handles permission violations with logging and security measures.
"""

import logging
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import dataclass, field

from .permissions import AgentRole, Permission


# Configure logging
logger = logging.getLogger("codex_brain.violations")


@dataclass
class PermissionViolation:
    """Record of a permission violation"""
    timestamp: datetime
    role: AgentRole
    attempted_permission: Permission
    method_name: str
    agent_id: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)
    severity: str = "HIGH"  # HIGH, MEDIUM, LOW
    
    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.utcnow()


class ViolationHandler:
    """
    Handles permission violations in the CodeEX_brain system.
    
    Responsibilities:
    - Log violations for security audit
    - Block unauthorized operations
    - Track violation patterns
    - Alert on suspicious behavior
    """
    
    def __init__(self, alert_threshold: int = 3):
        """
        Initialize violation handler.
        
        Args:
            alert_threshold: Number of violations before triggering alert
        """
        self.violations: list[PermissionViolation] = []
        self.alert_threshold = alert_threshold
        self.role_violation_count: Dict[AgentRole, int] = {}
    
    def handle_violation(
        self,
        role: AgentRole,
        permission: Permission,
        method_name: str,
        agent_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Handle a permission violation.
        
        Args:
            role: Role that attempted the violation
            permission: Permission that was denied
            method_name: Method that was attempted
            agent_id: Optional agent identifier
            context: Additional context about the violation
        """
        violation = PermissionViolation(
            timestamp=datetime.utcnow(),
            role=role,
            attempted_permission=permission,
            method_name=method_name,
            agent_id=agent_id,
            context=context or {},
            severity=self._determine_severity(role, permission)
        )
        
        # Store violation
        self.violations.append(violation)
        
        # Update violation count
        self.role_violation_count[role] = self.role_violation_count.get(role, 0) + 1
        
        # Log violation
        self._log_violation(violation)
        
        # Check if alert threshold reached
        if self.role_violation_count[role] >= self.alert_threshold:
            self._trigger_alert(role, self.role_violation_count[role])
    
    def _determine_severity(self, role: AgentRole, permission: Permission) -> str:
        """
        Determine severity level of violation.
        
        HIGH: Attempting to generate full solutions when not authorized
        MEDIUM: Attempting actions outside defined scope
        LOW: Minor permission issues
        """
        high_risk_permissions = {
            Permission.GENERATE_FULL_SOLUTION,
            Permission.DELETE_CONTEXT,
        }
        
        if permission in high_risk_permissions:
            return "HIGH"
        elif role == AgentRole.MASTER:
            # Master should never violate (this is a critical error)
            return "CRITICAL"
        else:
            return "MEDIUM"
    
    def _log_violation(self, violation: PermissionViolation) -> None:
        """Log the violation with appropriate severity level"""
        log_message = (
            f"Permission Violation [{violation.severity}] - "
            f"Role: {violation.role.value}, "
            f"Permission: {violation.attempted_permission.value}, "
            f"Method: {violation.method_name}"
        )
        
        if violation.agent_id:
            log_message += f", Agent ID: {violation.agent_id}"
        
        if violation.severity == "CRITICAL":
            logger.critical(log_message)
        elif violation.severity == "HIGH":
            logger.error(log_message)
        elif violation.severity == "MEDIUM":
            logger.warning(log_message)
        else:
            logger.info(log_message)
    
    def _trigger_alert(self, role: AgentRole, violation_count: int) -> None:
        """Trigger alert when threshold is reached"""
        alert_message = (
            f"SECURITY ALERT: Role {role.value} has {violation_count} violations. "
            f"Possible security breach or misconfiguration."
        )
        logger.critical(alert_message)
        
        # In production, this could:
        # - Send notification to security team
        # - Temporarily disable the agent
        # - Trigger incident response workflow
    
    def get_violations(
        self,
        role: Optional[AgentRole] = None,
        limit: Optional[int] = None
    ) -> list[PermissionViolation]:
        """Get violation records, optionally filtered by role"""
        violations = self.violations
        
        if role:
            violations = [v for v in violations if v.role == role]
        
        if limit:
            violations = violations[-limit:]
        
        return violations
    
    def get_violation_count(self, role: Optional[AgentRole] = None) -> int:
        """Get total violation count, optionally for a specific role"""
        if role:
            return self.role_violation_count.get(role, 0)
        return len(self.violations)
    
    def clear_violations(self, role: Optional[AgentRole] = None) -> None:
        """Clear violation records (for testing or after incident resolution)"""
        if role:
            self.violations = [v for v in self.violations if v.role != role]
            self.role_violation_count[role] = 0
        else:
            self.violations.clear()
            self.role_violation_count.clear()
    
    def get_report(self) -> Dict[str, Any]:
        """Generate violation report"""
        return {
            "total_violations": len(self.violations),
            "violations_by_role": dict(self.role_violation_count),
            "recent_violations": [
                {
                    "timestamp": v.timestamp.isoformat(),
                    "role": v.role.value,
                    "permission": v.attempted_permission.value,
                    "method": v.method_name,
                    "severity": v.severity
                }
                for v in self.violations[-10:]  # Last 10 violations
            ]
        }


# Global violation handler instance
_global_handler: Optional[ViolationHandler] = None


def get_violation_handler() -> ViolationHandler:
    """Get global violation handler instance"""
    global _global_handler
    if _global_handler is None:
        _global_handler = ViolationHandler()
    return _global_handler


def set_violation_handler(handler: ViolationHandler) -> None:
    """Set global violation handler (for testing)"""
    global _global_handler
    _global_handler = handler
