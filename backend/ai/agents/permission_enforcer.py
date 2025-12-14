"""Permission Enforcement System

Enforces strict role boundaries for CodeEX Brain agents.
Blocks unauthorized actions and logs violations.
"""

import yaml
import logging
from pathlib import Path
from typing import Dict, List, Set, Optional, Any
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class AgentRole(str, Enum):
    """Agent role identifiers"""
    PLANNER = "PLANNER_AGENT"
    TEACHER = "TEACHER_AGENT"
    HINT = "HINT_AGENT"
    CODING = "CODING_AGENT"
    DEBUGGING = "DEBUGGING_AGENT"
    REFACTOR = "REFACTOR_AGENT"
    PROJECT_INSPECTOR = "PROJECT_INSPECTOR_AGENT"
    RESEARCH = "RESEARCH_AGENT"
    MEMORY = "MEMORY_AGENT"


class Permission(str, Enum):
    """Permission identifiers"""
    # Code Generation
    GENERATE_FULL_SOLUTION = "GENERATE_FULL_SOLUTION"
    GENERATE_PARTIAL_SOLUTION = "GENERATE_PARTIAL_SOLUTION"
    GENERATE_BOILERPLATE = "GENERATE_BOILERPLATE"
    
    # Hints
    PROVIDE_ALGORITHM_HINT = "PROVIDE_ALGORITHM_HINT"
    PROVIDE_SYNTAX_HINT = "PROVIDE_SYNTAX_HINT"
    PROVIDE_EDGE_CASE_HINT = "PROVIDE_EDGE_CASE_HINT"
    
    # Education
    EXPLAIN_CONCEPT = "EXPLAIN_CONCEPT"
    EXPLAIN_ALGORITHM = "EXPLAIN_ALGORITHM"
    EXPLAIN_COMPLEXITY = "EXPLAIN_COMPLEXITY"
    
    # Analysis
    ANALYZE_CODE_QUALITY = "ANALYZE_CODE_QUALITY"
    ANALYZE_BUGS = "ANALYZE_BUGS"
    ANALYZE_PERFORMANCE = "ANALYZE_PERFORMANCE"
    
    # Memory
    STORE_CONTEXT = "STORE_CONTEXT"
    RETRIEVE_CONTEXT = "RETRIEVE_CONTEXT"
    DELETE_CONTEXT = "DELETE_CONTEXT"
    
    # Research
    SEARCH_SIMILAR_PROBLEMS = "SEARCH_SIMILAR_PROBLEMS"
    GATHER_CONTEXT = "GATHER_CONTEXT"


class ViolationSeverity(str, Enum):
    """Violation severity levels"""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


@dataclass
class PermissionViolation:
    """Record of a permission violation"""
    timestamp: datetime
    agent_role: AgentRole
    attempted_action: str
    required_permission: Permission
    severity: ViolationSeverity
    blocked_reason: str
    context: Optional[Dict[str, Any]] = None


class PermissionEnforcer:
    """Enforces agent permissions and logs violations"""
    
    def __init__(self, config_dir: Optional[str] = None):
        """
        Initialize permission enforcer.
        
        Args:
            config_dir: Directory containing roles.yaml and permissions.yaml
        """
        if config_dir:
            self.config_dir = Path(config_dir)
        else:
            self.config_dir = Path(__file__).parent
        
        # Load configurations
        self.roles_config = self._load_yaml('roles.yaml')
        self.permissions_config = self._load_yaml('permissions.yaml')
        
        # Build permission matrix
        self.permission_matrix = self._build_permission_matrix()
        
        # Violation log
        self.violations: List[PermissionViolation] = []
        
        # Setup logging
        self.logger = logging.getLogger(__name__)
    
    def _load_yaml(self, filename: str) -> Dict:
        """Load YAML configuration file"""
        filepath = self.config_dir / filename
        with open(filepath, 'r') as f:
            return yaml.safe_load(f)
    
    def _build_permission_matrix(self) -> Dict[Permission, Set[AgentRole]]:
        """Build permission to allowed agents mapping"""
        matrix = {}
        
        perm_config = self.permissions_config.get('permission_categories', {})
        
        for category, permissions in perm_config.items():
            for perm_name, perm_data in permissions.items():
                try:
                    permission = Permission[perm_name]
                    allowed = set()
                    
                    for agent_str in perm_data.get('allowed_agents', []):
                        try:
                            allowed.add(AgentRole[agent_str])
                        except KeyError:
                            pass
                    
                    matrix[permission] = allowed
                except KeyError:
                    pass
        
        return matrix
    
    def check_permission(
        self,
        agent_role: AgentRole,
        permission: Permission,
        context: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Check if agent has permission for action"""
        
        # Check permission matrix
        allowed_agents = self.permission_matrix.get(permission, set())
        
        if agent_role in allowed_agents:
            # Check if authorization required
            if self._requires_authorization(permission, context):
                return self._check_authorization(permission, context)
            return True
        
        return False
    
    def _requires_authorization(self, permission: Permission, context: Optional[Dict]) -> bool:
        """Check if permission requires additional authorization"""
        # Check permission config for authorization requirement
        perm_config = self.permissions_config.get('permission_categories', {})
        
        for category, permissions in perm_config.items():
            perm_name = permission.name
            if perm_name in permissions:
                return permissions[perm_name].get('requires_authorization', False)
        
        return False
    
    def _check_authorization(self, permission: Permission, context: Optional[Dict]) -> bool:
        """Check authorization criteria"""
        if not context:
            return False
        
        # Check authorization criteria from config
        auth_criteria = self.permissions_config.get('enforcement', {}).get(
            'authorization_gates', {}
        ).get('authorization_criteria', {})
        
        # Example checks
        if permission == Permission.GENERATE_FULL_SOLUTION:
            # Require user consent
            if not context.get('user_consent', False):
                return False
            
            # Require multiple attempts
            attempt_count = context.get('attempt_count', 0)
            if attempt_count < 3:
                return False
            
            # Not in contest mode
            if context.get('in_contest', False):
                return False
            
            return True
        
        elif permission == Permission.DELETE_CONTEXT:
            # Require explicit authorization
            return context.get('explicit_authorization', False)
        
        return True
    
    def enforce(
        self,
        agent_role: AgentRole,
        permission: Permission,
        action_name: str,
        context: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Enforce permission and log violations"""
        
        has_permission = self.check_permission(agent_role, permission, context)
        
        if not has_permission:
            # Log violation
            severity = self._get_violation_severity(permission)
            
            violation = PermissionViolation(
                timestamp=datetime.utcnow(),
                agent_role=agent_role,
                attempted_action=action_name,
                required_permission=permission,
                severity=severity,
                blocked_reason=self._get_blocked_reason(agent_role, permission),
                context=context
            )
            
            self.violations.append(violation)
            
            # Handle based on severity
            self._handle_violation(violation)
        
        return has_permission
    
    def _get_violation_severity(self, permission: Permission) -> ViolationSeverity:
        """Get severity level for permission violation"""
        perm_config = self.permissions_config.get('permission_categories', {})
        
        for category, permissions in perm_config.items():
            perm_name = permission.name
            if perm_name in permissions:
                risk_level = permissions[perm_name].get('risk_level', 'MEDIUM')
                return ViolationSeverity[risk_level] if risk_level in ViolationSeverity.__members__ else ViolationSeverity.MEDIUM
        
        return ViolationSeverity.MEDIUM
    
    def _get_blocked_reason(self, agent_role: AgentRole, permission: Permission) -> str:
        """Get reason for blocking action"""
        return f"{agent_role.value} does not have permission: {permission.value}"
    
    def _handle_violation(self, violation: PermissionViolation):
        """Handle permission violation based on severity"""
        
        enforcement_config = self.permissions_config.get('enforcement', {}).get(
            'violation_handling', {}
        ).get('severity_levels', {})
        
        severity_config = enforcement_config.get(violation.severity.value, {})
        
        # Log violation
        if severity_config.get('log', True):
            self.logger.warning(
                f"Permission Violation: {violation.agent_role.value} attempted "
                f"{violation.attempted_action} (requires {violation.required_permission.value}) "
                f"- Severity: {violation.severity.value}"
            )
        
        # Alert if needed
        if severity_config.get('alert', False):
            self._send_alert(violation)
    
    def _send_alert(self, violation: PermissionViolation):
        """Send security alert for violation"""
        # In production, integrate with alerting system
        self.logger.error(
            f"SECURITY ALERT: {violation.severity.value} violation by "
            f"{violation.agent_role.value}: {violation.attempted_action}"
        )
    
    def get_allowed_actions(self, agent_role: AgentRole) -> List[str]:
        """Get list of allowed actions for an agent"""
        role_config = self.roles_config.get(agent_role.value, {})
        return role_config.get('allowed_actions', [])
    
    def get_forbidden_actions(self, agent_role: AgentRole) -> List[Dict[str, str]]:
        """Get list of forbidden actions for an agent"""
        forbidden = self.permissions_config.get('forbidden_actions', {})
        agent_forbidden = forbidden.get(agent_role.value, {})
        return agent_forbidden.get('strictly_forbidden', [])
    
    def get_violation_report(self) -> Dict[str, Any]:
        """Get violation report"""
        total = len(self.violations)
        by_agent = {}
        by_severity = {}
        
        for violation in self.violations:
            # Count by agent
            agent = violation.agent_role.value
            by_agent[agent] = by_agent.get(agent, 0) + 1
            
            # Count by severity
            severity = violation.severity.value
            by_severity[severity] = by_severity.get(severity, 0) + 1
        
        return {
            'total_violations': total,
            'by_agent': by_agent,
            'by_severity': by_severity,
            'recent_violations': [
                {
                    'timestamp': v.timestamp.isoformat(),
                    'agent': v.agent_role.value,
                    'action': v.attempted_action,
                    'severity': v.severity.value
                }
                for v in self.violations[-10:]  # Last 10
            ]
        }
