"""CodeEX AI Orchestrator

Main orchestration layer that integrates:
- Domain configuration
- Agent permissions
- Brain client
- Verification pipelines
- Database storage

FLOW:
  API Request
    ↓
  Load Domain Config
    ↓
  Check Permissions
    ↓
  Call CodeEX_brain
    ↓
  Verify Output
    ↓
  Save to DB
    ↓
  Return Safe Response

CRITICAL: Verification failures → regenerate or abort
"""

import logging
import time
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

# Domain configuration
try:
    from backend.ai.domains import load_domain, DomainConfig
except ImportError:
    load_domain = None
    DomainConfig = None

# Agent permissions
try:
    from backend.ai.agents import (
        PermissionEnforcer,
        RoleValidator,
        AgentRole,
        Permission
    )
except ImportError:
    PermissionEnforcer = None
    RoleValidator = None
    AgentRole = None
    Permission = None

# Brain client
try:
    from backend.ai.brain_client import (
        CodeEXBrainClient,
        BrainAgent,
        BrainResponse,
        BrainAPIError
    )
except ImportError:
    CodeEXBrainClient = None
    BrainAgent = None
    BrainResponse = None
    BrainAPIError = None

# Verification pipelines
try:
    from backend.ai.verification import (
        VerificationPipeline,
        SolutionValidator,
        ExplanationChecker
    )
except ImportError:
    VerificationPipeline = None
    SolutionValidator = None
    ExplanationChecker = None


class RequestType(str, Enum):
    """Type of AI request"""
    PLANNING = "planning"
    TEACHING = "teaching"
    HINT = "hint"
    SOLUTION = "solution"
    DEBUGGING = "debugging"
    REFACTORING = "refactoring"
    INSPECTION = "inspection"
    RESEARCH = "research"
    MEMORY = "memory"


class OrchestrationStatus(str, Enum):
    """Status of orchestration"""
    SUCCESS = "SUCCESS"
    FAILED_PERMISSION = "FAILED_PERMISSION"
    FAILED_VERIFICATION = "FAILED_VERIFICATION"
    FAILED_API = "FAILED_API"
    FAILED_RETRY_EXHAUSTED = "FAILED_RETRY_EXHAUSTED"
    ABORTED = "ABORTED"


@dataclass
class OrchestrationRequest:
    """Request to AI orchestrator"""
    request_type: RequestType
    agent: str  # Agent name (e.g., "TEACHER_AGENT")
    problem_context: Dict[str, Any]
    domain: str = "competitive_programming"
    user_context: Optional[Dict[str, Any]] = None
    verification_config: Optional[Dict[str, Any]] = None
    retry_config: Optional[Dict[str, Any]] = None


@dataclass
class OrchestrationResult:
    """Result of AI orchestration"""
    status: OrchestrationStatus
    output: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Pipeline results
    permission_check: Optional[Dict[str, Any]] = None
    brain_response: Optional[Dict[str, Any]] = None
    verification_result: Optional[Dict[str, Any]] = None
    
    # Tracking
    request_id: str = ""
    total_time_ms: int = 0
    retry_count: int = 0
    
    # Error info
    error_message: Optional[str] = None
    rejection_reason: Optional[str] = None


class CodeEXOrchestrator:
    """
    Main orchestrator for CodeEX AI system.
    
    Coordinates:
    - Domain configuration
    - Permission checking
    - Brain API calls
    - Output verification
    - Database storage
    - Error handling
    """
    
    # Retry configuration
    DEFAULT_MAX_RETRIES = 3
    DEFAULT_RETRY_DELAY_MS = 1000
    
    def __init__(
        self,
        brain_client: Optional[Any] = None,
        permission_enforcer: Optional[Any] = None,
        role_validator: Optional[Any] = None,
        verification_pipeline: Optional[Any] = None,
        db_client: Optional[Any] = None
    ):
        """
        Initialize orchestrator.
        
        Args:
            brain_client: CodeEX Brain client
            permission_enforcer: Permission enforcement system
            role_validator: Role validation system
            verification_pipeline: Verification pipeline
            db_client: Database client for storage
        """
        # Initialize components
        self.brain_client = brain_client or (
            CodeEXBrainClient() if CodeEXBrainClient else None
        )
        self.permission_enforcer = permission_enforcer or (
            PermissionEnforcer() if PermissionEnforcer else None
        )
        self.role_validator = role_validator or (
            RoleValidator() if RoleValidator else None
        )
        self.verification_pipeline = verification_pipeline or (
            VerificationPipeline() if VerificationPipeline else None
        )
        self.db_client = db_client
        
        # Setup logging
        self.logger = logging.getLogger(__name__)
        
        # Validate components
        if not self.brain_client:
            self.logger.warning("Brain client not initialized")
        if not self.permission_enforcer:
            self.logger.warning("Permission enforcer not initialized")
    
    async def process_request(
        self,
        request: OrchestrationRequest
    ) -> OrchestrationResult:
        """
        Process AI request through complete pipeline.
        
        Args:
            request: Orchestration request
            
        Returns:
            OrchestrationResult with verified output or error
        """
        start_time = time.time()
        request_id = self._generate_request_id()
        
        self.logger.info(
            f"Processing request {request_id}: "
            f"type={request.request_type}, agent={request.agent}"
        )
        
        try:
            # Step 1: Load domain configuration
            domain_config = self._load_domain_config(request.domain)
            
            # Step 2: Check permissions
            permission_result = self._check_permissions(request, domain_config)
            if not permission_result['allowed']:
                return OrchestrationResult(
                    status=OrchestrationStatus.FAILED_PERMISSION,
                    permission_check=permission_result,
                    request_id=request_id,
                    total_time_ms=int((time.time() - start_time) * 1000),
                    error_message="Permission denied",
                    rejection_reason=permission_result.get('reason')
                )
            
            # Step 3: Call Brain with retry logic
            brain_response, retry_count = await self._call_brain_with_retry(
                request, domain_config
            )
            
            if not brain_response:
                return OrchestrationResult(
                    status=OrchestrationStatus.FAILED_RETRY_EXHAUSTED,
                    permission_check=permission_result,
                    request_id=request_id,
                    total_time_ms=int((time.time() - start_time) * 1000),
                    retry_count=retry_count,
                    error_message="Failed to get valid response from Brain"
                )
            
            # Step 4: Verify output
            verification_result = await self._verify_output(
                request, brain_response, domain_config
            )
            
            if not verification_result['is_valid']:
                return OrchestrationResult(
                    status=OrchestrationStatus.FAILED_VERIFICATION,
                    permission_check=permission_result,
                    brain_response=self._sanitize_brain_response(brain_response),
                    verification_result=verification_result,
                    request_id=request_id,
                    total_time_ms=int((time.time() - start_time) * 1000),
                    retry_count=retry_count,
                    error_message="Output verification failed",
                    rejection_reason=verification_result.get('rejection_reason')
                )
            
            # Step 5: Save to database
            if self.db_client:
                await self._save_to_database(
                    request, brain_response, verification_result
                )
            
            # Step 6: Return safe response
            total_time = int((time.time() - start_time) * 1000)
            
            return OrchestrationResult(
                status=OrchestrationStatus.SUCCESS,
                output=brain_response.raw_output,
                metadata={
                    'agent': request.agent,
                    'domain': request.domain,
                    'verification_passed': True,
                    'retry_count': retry_count
                },
                permission_check=permission_result,
                brain_response=self._sanitize_brain_response(brain_response),
                verification_result=verification_result,
                request_id=request_id,
                total_time_ms=total_time,
                retry_count=retry_count
            )
        
        except Exception as e:
            self.logger.error(f"Orchestration error: {e}", exc_info=True)
            
            return OrchestrationResult(
                status=OrchestrationStatus.ABORTED,
                request_id=request_id,
                total_time_ms=int((time.time() - start_time) * 1000),
                error_message=str(e)
            )
    
    def _load_domain_config(self, domain_id: str) -> Optional[Any]:
        """Load domain configuration"""
        try:
            if load_domain:
                return load_domain(domain_id)
        except Exception as e:
            self.logger.warning(f"Failed to load domain config: {e}")
        
        return None
    
    def _check_permissions(
        self,
        request: OrchestrationRequest,
        domain_config: Optional[Any]
    ) -> Dict[str, Any]:
        """Check if agent has permission for requested action"""
        
        if not self.permission_enforcer:
            # No enforcer - allow by default (unsafe)
            self.logger.warning("Permission enforcer not available - allowing by default")
            return {'allowed': True, 'reason': 'No enforcer'}
        
        try:
            # Map request type to agent role
            agent_role = self._get_agent_role(request.agent)
            
            # Map request type to permission
            permission = self._get_required_permission(request.request_type)
            
            # Build context
            context = request.user_context or {}
            
            # Check permission
            allowed = self.permission_enforcer.check_permission(
                agent_role=agent_role,
                permission=permission,
                context=context
            )
            
            if not allowed:
                reason = f"{agent_role.value} does not have {permission.value}"
            else:
                reason = None
            
            return {
                'allowed': allowed,
                'agent_role': agent_role.value,
                'permission': permission.value,
                'reason': reason
            }
        
        except Exception as e:
            self.logger.error(f"Permission check error: {e}")
            return {
                'allowed': False,
                'reason': f"Permission check failed: {e}"
            }
    
    async def _call_brain_with_retry(
        self,
        request: OrchestrationRequest,
        domain_config: Optional[Any]
    ) -> tuple[Optional[Any], int]:
        """Call Brain API with retry logic"""
        
        retry_config = request.retry_config or {}
        max_retries = retry_config.get('max_retries', self.DEFAULT_MAX_RETRIES)
        retry_delay = retry_config.get('delay_ms', self.DEFAULT_RETRY_DELAY_MS)
        
        for attempt in range(max_retries):
            try:
                # Call Brain
                response = await self._call_brain(request, domain_config)
                
                if response:
                    return response, attempt
                
            except BrainAPIError as e:
                self.logger.warning(
                    f"Brain API call failed (attempt {attempt + 1}/{max_retries}): {e}"
                )
            
            except Exception as e:
                self.logger.error(f"Unexpected error calling Brain: {e}")
            
            # Retry delay
            if attempt < max_retries - 1:
                await self._async_sleep(retry_delay / 1000)
        
        return None, max_retries
    
    async def _call_brain(
        self,
        request: OrchestrationRequest,
        domain_config: Optional[Any]
    ) -> Optional[Any]:
        """Call Brain API"""
        
        if not self.brain_client:
            raise Exception("Brain client not initialized")
        
        # Prepare domain config dict
        domain_config_dict = None
        if domain_config:
            domain_config_dict = {
                'domain_id': domain_config.domain_id,
                'domain_name': domain_config.domain_name,
                'ai_assistant': domain_config.ai_assistant
            }
        
        # Map agent string to BrainAgent enum
        agent = self._get_brain_agent(request.agent)
        
        # Call appropriate method
        return self.brain_client.call_agent(
            agent=agent,
            problem_context=request.problem_context,
            domain_config=domain_config_dict,
            user_context=request.user_context
        )
    
    async def _verify_output(
        self,
        request: OrchestrationRequest,
        brain_response: Any,
        domain_config: Optional[Any]
    ) -> Dict[str, Any]:
        """Verify Brain output"""
        
        # Step 1: Role validation
        role_validation = self._validate_agent_role(request, brain_response)
        
        if not role_validation['is_valid']:
            return {
                'is_valid': False,
                'rejection_reason': 'Role validation failed',
                'role_validation': role_validation
            }
        
        # Step 2: Content verification (if applicable)
        content_verification = await self._verify_content(
            request, brain_response, domain_config
        )
        
        if not content_verification.get('is_valid', True):
            return {
                'is_valid': False,
                'rejection_reason': 'Content verification failed',
                'role_validation': role_validation,
                'content_verification': content_verification
            }
        
        # All checks passed
        return {
            'is_valid': True,
            'role_validation': role_validation,
            'content_verification': content_verification
        }
    
    def _validate_agent_role(
        self,
        request: OrchestrationRequest,
        brain_response: Any
    ) -> Dict[str, Any]:
        """Validate output against agent role"""
        
        if not self.role_validator:
            return {'is_valid': True, 'reason': 'No validator'}
        
        try:
            agent_role = self._get_agent_role(request.agent)
            
            result = self.role_validator.validate_output(
                agent_role=agent_role,
                output_text=brain_response.raw_output,
                context=request.user_context
            )
            
            return {
                'is_valid': result.is_valid,
                'issues': [
                    {
                        'severity': issue.severity,
                        'description': issue.description
                    }
                    for issue in result.issues
                ],
                'checked_validations': [v.value for v in result.checked_validations]
            }
        
        except Exception as e:
            self.logger.error(f"Role validation error: {e}")
            return {
                'is_valid': False,
                'reason': f"Validation failed: {e}"
            }
    
    async def _verify_content(
        self,
        request: OrchestrationRequest,
        brain_response: Any,
        domain_config: Optional[Any]
    ) -> Dict[str, Any]:
        """Verify content based on request type"""
        
        # For solution generation, verify code
        if request.request_type == RequestType.SOLUTION:
            return await self._verify_solution(request, brain_response)
        
        # For hints, verify doesn't reveal solution
        elif request.request_type == RequestType.HINT:
            return self._verify_hint(request, brain_response)
        
        # Other types - basic validation
        return {'is_valid': True}
    
    async def _verify_solution(
        self,
        request: OrchestrationRequest,
        brain_response: Any
    ) -> Dict[str, Any]:
        """Verify generated solution"""
        
        if not self.verification_pipeline:
            return {'is_valid': True, 'reason': 'No verification pipeline'}
        
        try:
            # Get test cases from problem context
            test_cases = request.problem_context.get('test_cases', [])
            language = request.problem_context.get('language', 'python')
            
            # Run verification
            result = await self.verification_pipeline.verify_solution_async(
                source_code=brain_response.raw_output,
                language=language,
                test_cases=test_cases
            )
            
            return {
                'is_valid': result.is_acceptable,
                'passed_stages': result.passed_stages,
                'total_stages': result.total_stages,
                'rejection_reason': result.rejection_reason,
                'stage_results': {
                    stage.value: {
                        'passed': stage_result.passed,
                        'error': stage_result.error
                    }
                    for stage, stage_result in result.stage_results.items()
                }
            }
        
        except Exception as e:
            self.logger.error(f"Solution verification error: {e}")
            return {
                'is_valid': False,
                'reason': f"Verification failed: {e}"
            }
    
    def _verify_hint(
        self,
        request: OrchestrationRequest,
        brain_response: Any
    ) -> Dict[str, Any]:
        """Verify hint doesn't reveal solution"""
        
        # Already covered by role validation
        # Additional checks can be added here
        return {'is_valid': True}
    
    async def _save_to_database(
        self,
        request: OrchestrationRequest,
        brain_response: Any,
        verification_result: Dict[str, Any]
    ):
        """Save request and response to database"""
        
        if not self.db_client:
            return
        
        try:
            record = {
                'timestamp': datetime.utcnow(),
                'request_type': request.request_type.value,
                'agent': request.agent,
                'domain': request.domain,
                'output': brain_response.raw_output,
                'verification_passed': verification_result['is_valid'],
                'metadata': brain_response.metadata
            }
            
            await self.db_client.save_ai_interaction(record)
        
        except Exception as e:
            self.logger.error(f"Database save error: {e}")
    
    def _get_agent_role(self, agent_name: str):
        """Map agent name to AgentRole enum"""
        if not AgentRole:
            return None
        
        # Simple mapping
        mapping = {
            'PLANNER_AGENT': AgentRole.PLANNER,
            'TEACHER_AGENT': AgentRole.TEACHER,
            'HINT_AGENT': AgentRole.HINT,
            'CODING_AGENT': AgentRole.CODING,
            'DEBUGGING_AGENT': AgentRole.DEBUGGING,
            'REFACTOR_AGENT': AgentRole.REFACTOR,
            'PROJECT_INSPECTOR_AGENT': AgentRole.PROJECT_INSPECTOR,
            'RESEARCH_AGENT': AgentRole.RESEARCH,
            'MEMORY_AGENT': AgentRole.MEMORY
        }
        
        return mapping.get(agent_name, AgentRole.TEACHER)
    
    def _get_brain_agent(self, agent_name: str):
        """Map agent name to BrainAgent enum"""
        if not BrainAgent:
            return None
        
        # Simple mapping
        mapping = {
            'PLANNER_AGENT': BrainAgent.PLANNER,
            'TEACHER_AGENT': BrainAgent.TEACHER,
            'HINT_AGENT': BrainAgent.HINT,
            'CODING_AGENT': BrainAgent.CODING,
            'DEBUGGING_AGENT': BrainAgent.DEBUGGING,
            'REFACTOR_AGENT': BrainAgent.REFACTOR,
            'PROJECT_INSPECTOR_AGENT': BrainAgent.PROJECT_INSPECTOR,
            'RESEARCH_AGENT': BrainAgent.RESEARCH,
            'MEMORY_AGENT': BrainAgent.MEMORY
        }
        
        return mapping.get(agent_name, BrainAgent.TEACHER)
    
    def _get_required_permission(self, request_type: RequestType):
        """Map request type to required permission"""
        if not Permission:
            return None
        
        mapping = {
            RequestType.PLANNING: Permission.PROVIDE_ALGORITHM_HINT,
            RequestType.TEACHING: Permission.EXPLAIN_CONCEPT,
            RequestType.HINT: Permission.PROVIDE_ALGORITHM_HINT,
            RequestType.SOLUTION: Permission.GENERATE_FULL_SOLUTION,
            RequestType.DEBUGGING: Permission.ANALYZE_BUGS,
            RequestType.REFACTORING: Permission.ANALYZE_CODE_QUALITY,
            RequestType.INSPECTION: Permission.ANALYZE_CODE_QUALITY,
            RequestType.RESEARCH: Permission.SEARCH_SIMILAR_PROBLEMS,
            RequestType.MEMORY: Permission.STORE_CONTEXT
        }
        
        return mapping.get(request_type, Permission.EXPLAIN_CONCEPT)
    
    def _sanitize_brain_response(self, response: Any) -> Dict[str, Any]:
        """Convert Brain response to dict for storage"""
        if not response:
            return {}
        
        return {
            'agent': response.agent.value if hasattr(response, 'agent') else None,
            'request_id': response.request_id if hasattr(response, 'request_id') else None,
            'has_output': bool(response.raw_output) if hasattr(response, 'raw_output') else False
        }
    
    def _generate_request_id(self) -> str:
        """Generate unique request ID"""
        import uuid
        return f"req_{uuid.uuid4().hex[:12]}"
    
    async def _async_sleep(self, seconds: float):
        """Async sleep"""
        import asyncio
        await asyncio.sleep(seconds)


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

async def process_teacher_request(
    concept: str,
    domain: str = "dsa",
    detail_level: str = "moderate"
) -> OrchestrationResult:
    """
    Convenience function for teacher requests.
    
    Usage:
        result = await process_teacher_request("Binary Search", "dsa")
        if result.status == OrchestrationStatus.SUCCESS:
            print(result.output)
    """
    orchestrator = CodeEXOrchestrator()
    
    request = OrchestrationRequest(
        request_type=RequestType.TEACHING,
        agent="TEACHER_AGENT",
        problem_context={
            'concept': concept,
            'detail_level': detail_level
        },
        domain=domain
    )
    
    return await orchestrator.process_request(request)


async def process_hint_request(
    problem_description: str,
    user_code: Optional[str] = None,
    hint_level: int = 1,
    attempt_count: int = 1,
    domain: str = "competitive_programming"
) -> OrchestrationResult:
    """Convenience function for hint requests"""
    orchestrator = CodeEXOrchestrator()
    
    request = OrchestrationRequest(
        request_type=RequestType.HINT,
        agent="HINT_AGENT",
        problem_context={
            'problem_description': problem_description,
            'user_code': user_code,
            'hint_level': hint_level
        },
        domain=domain,
        user_context={
            'attempt_count': attempt_count
        }
    )
    
    return await orchestrator.process_request(request)


async def process_solution_request(
    problem_description: str,
    language: str,
    test_cases: List[Any],
    user_consent: bool,
    attempt_count: int,
    domain: str = "competitive_programming"
) -> OrchestrationResult:
    """Convenience function for solution generation"""
    orchestrator = CodeEXOrchestrator()
    
    request = OrchestrationRequest(
        request_type=RequestType.SOLUTION,
        agent="CODING_AGENT",
        problem_context={
            'problem_description': problem_description,
            'language': language,
            'test_cases': test_cases
        },
        domain=domain,
        user_context={
            'user_consent': user_consent,
            'attempt_count': attempt_count,
            'in_contest': False
        }
    )
    
    return await orchestrator.process_request(request)


if __name__ == "__main__":
    import asyncio
    
    print("=" * 60)
    print("CodeEX AI Orchestrator")
    print("=" * 60)
    print()
    print("Main orchestration layer for CodeEX AI system.")
    print()
    print("Features:")
    print("  ✓ Domain configuration loading")
    print("  ✓ Permission checking")
    print("  ✓ Brain API calls with retry")
    print("  ✓ Output verification")
    print("  ✓ Database storage")
    print("  ✓ Error handling")
    print()
    print("See README_ORCHESTRATOR.md for usage examples")
