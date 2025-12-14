"""Role Validator

Validates agent outputs against their role constraints.
"""

import re
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum

from .permission_enforcer import AgentRole, PermissionEnforcer


class ValidationType(str, Enum):
    """Type of validation check"""
    CODE_GENERATION = "CODE_GENERATION"
    FULL_SOLUTION = "FULL_SOLUTION"
    HINT_LEVEL = "HINT_LEVEL"
    EXPLANATION_SCOPE = "EXPLANATION_SCOPE"
    DATA_ACCESS = "DATA_ACCESS"


@dataclass
class ValidationIssue:
    """Validation issue found in output"""
    validation_type: ValidationType
    severity: str
    description: str
    agent_role: AgentRole


@dataclass
class ValidationResult:
    """Result of output validation"""
    is_valid: bool
    issues: List[ValidationIssue]
    agent_role: AgentRole
    checked_validations: List[ValidationType]
    
    @property
    def has_critical_issues(self) -> bool:
        """Check if there are critical issues"""
        return any(issue.severity == 'CRITICAL' for issue in self.issues)


class RoleValidator:
    """Validates agent outputs against role constraints"""
    
    # Patterns indicating full code solutions
    CODE_PATTERNS = [
        r'def\s+\w+\s*\([^)]*\)\s*:',  # Python function
        r'class\s+\w+',  # Class definition
        r'for\s+\w+\s+in\s+',  # For loop
        r'while\s+.+:',  # While loop
        r'if\s+.+:',  # If statement with code
    ]
    
    # Patterns indicating solution logic
    SOLUTION_PATTERNS = [
        r'return\s+\w+',
        r'print\(',
        r'\[.*for.*in.*\]',  # List comprehension
    ]
    
    def __init__(self):
        """Initialize role validator"""
        self.enforcer = PermissionEnforcer()
    
    def validate_output(
        self,
        agent_role: AgentRole,
        output_text: str,
        output_type: str = 'text',
        context: Optional[Dict[str, Any]] = None
    ) -> ValidationResult:
        """Validate agent output against role constraints"""
        
        issues = []
        checked_validations = []
        
        # Check based on agent role
        if agent_role == AgentRole.HINT:
            issues.extend(self._validate_hint_output(output_text))
            checked_validations.append(ValidationType.FULL_SOLUTION)
            checked_validations.append(ValidationType.CODE_GENERATION)
        
        elif agent_role == AgentRole.TEACHER:
            issues.extend(self._validate_teacher_output(output_text))
            checked_validations.append(ValidationType.EXPLANATION_SCOPE)
        
        elif agent_role == AgentRole.PLANNER:
            issues.extend(self._validate_planner_output(output_text))
            checked_validations.append(ValidationType.CODE_GENERATION)
        
        elif agent_role == AgentRole.CODING:
            issues.extend(self._validate_coding_output(output_text, context))
            checked_validations.append(ValidationType.FULL_SOLUTION)
        
        # Check universal restrictions
        issues.extend(self._validate_universal_restrictions(output_text, agent_role))
        checked_validations.append(ValidationType.DATA_ACCESS)
        
        is_valid = len([i for i in issues if i.severity in ['CRITICAL', 'HIGH']]) == 0
        
        return ValidationResult(
            is_valid=is_valid,
            issues=issues,
            agent_role=agent_role,
            checked_validations=checked_validations
        )
    
    def _validate_hint_output(self, output: str) -> List[ValidationIssue]:
        """Validate HINT_AGENT output"""
        issues = []
        
        # Check for code patterns
        for pattern in self.CODE_PATTERNS:
            if re.search(pattern, output):
                issues.append(ValidationIssue(
                    validation_type=ValidationType.CODE_GENERATION,
                    severity='CRITICAL',
                    description='HINT_AGENT provided code (forbidden)',
                    agent_role=AgentRole.HINT
                ))
                break
        
        # Check for solution patterns
        solution_count = 0
        for pattern in self.SOLUTION_PATTERNS:
            if re.search(pattern, output):
                solution_count += 1
        
        if solution_count >= 2:
            issues.append(ValidationIssue(
                validation_type=ValidationType.FULL_SOLUTION,
                severity='CRITICAL',
                description='HINT_AGENT provided full solution (forbidden)',
                agent_role=AgentRole.HINT
            ))
        
        # Check for overly detailed hints
        if len(output) > 1000 and solution_count > 0:
            issues.append(ValidationIssue(
                validation_type=ValidationType.HINT_LEVEL,
                severity='HIGH',
                description='Hint is too detailed (may reveal solution)',
                agent_role=AgentRole.HINT
            ))
        
        return issues
    
    def _validate_teacher_output(self, output: str) -> List[ValidationIssue]:
        """Validate TEACHER_AGENT output"""
        issues = []
        
        # Check if solving specific problem
        problem_solving_keywords = [
            'for this problem',
            'in this question',
            'to solve this',
            'the solution is'
        ]
        
        for keyword in problem_solving_keywords:
            if keyword.lower() in output.lower():
                issues.append(ValidationIssue(
                    validation_type=ValidationType.EXPLANATION_SCOPE,
                    severity='HIGH',
                    description='TEACHER_AGENT solving specific problem (should teach concepts)',
                    agent_role=AgentRole.TEACHER
                ))
                break
        
        return issues
    
    def _validate_planner_output(self, output: str) -> List[ValidationIssue]:
        """Validate PLANNER_AGENT output"""
        issues = []
        
        # Check for actual code
        code_count = 0
        for pattern in self.CODE_PATTERNS:
            if re.search(pattern, output):
                code_count += 1
        
        if code_count >= 1:
            issues.append(ValidationIssue(
                validation_type=ValidationType.CODE_GENERATION,
                severity='CRITICAL',
                description='PLANNER_AGENT provided implementation code (forbidden)',
                agent_role=AgentRole.PLANNER
            ))
        
        return issues
    
    def _validate_coding_output(self, output: str, context: Optional[Dict]) -> List[ValidationIssue]:
        """Validate CODING_AGENT output"""
        issues = []
        
        # Check authorization for full solution
        if context:
            if not context.get('authorized', False):
                # Check if output contains full solution
                has_code = any(re.search(p, output) for p in self.CODE_PATTERNS)
                if has_code:
                    issues.append(ValidationIssue(
                        validation_type=ValidationType.FULL_SOLUTION,
                        severity='CRITICAL',
                        description='CODING_AGENT generated solution without authorization',
                        agent_role=AgentRole.CODING
                    ))
        
        return issues
    
    def _validate_universal_restrictions(self, output: str, agent_role: AgentRole) -> List[ValidationIssue]:
        """Validate universal restrictions"""
        issues = []
        
        # Check for sensitive data patterns
        sensitive_patterns = [
            r'password\s*=',
            r'api_key\s*=',
            r'secret\s*=',
            r'token\s*=',
        ]
        
        for pattern in sensitive_patterns:
            if re.search(pattern, output, re.IGNORECASE):
                issues.append(ValidationIssue(
                    validation_type=ValidationType.DATA_ACCESS,
                    severity='CRITICAL',
                    description='Output contains sensitive data',
                    agent_role=agent_role
                ))
                break
        
        return issues
