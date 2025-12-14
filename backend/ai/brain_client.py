"""CodeEX Brain AI Client

Interfaces with Emergent CodeEX_brain for AI-powered assistance.

IMPORTANT:
- This client makes RAW API calls to AI
- ALL outputs are UNTRUSTED
- Verification MUST happen elsewhere
- NO business logic here
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
from enum import Enum
import requests


class BrainAgent(str, Enum):
    """CodeEX Brain subagent identifiers"""
    PLANNER = "PLANNER_AGENT"
    TEACHER = "TEACHER_AGENT"
    HINT = "HINT_AGENT"
    CODING = "CODING_AGENT"
    DEBUGGING = "DEBUGGING_AGENT"
    REFACTOR = "REFACTOR_AGENT"
    PROJECT_INSPECTOR = "PROJECT_INSPECTOR_AGENT"
    RESEARCH = "RESEARCH_AGENT"
    MEMORY = "MEMORY_AGENT"


@dataclass
class BrainRequest:
    """Request to CodeEX Brain"""
    agent: BrainAgent
    problem_context: Dict[str, Any]
    domain_config: Optional[Dict[str, Any]] = None
    user_context: Optional[Dict[str, Any]] = None
    additional_params: Optional[Dict[str, Any]] = None


@dataclass
class BrainResponse:
    """Raw response from CodeEX Brain (UNTRUSTED)"""
    agent: BrainAgent
    raw_output: str
    metadata: Dict[str, Any]
    request_id: str
    
    # WARNING flags
    is_verified: bool = False  # Always False from client
    requires_verification: bool = True  # Always True


class CodeEXBrainClient:
    """
    Client for CodeEX Brain AI system.
    
    ⚠️ SECURITY WARNING:
    - All AI outputs are UNTRUSTED
    - MUST be verified before use
    - This client does NO validation
    - This client has NO business logic
    """
    
    def __init__(
        self,
        api_endpoint: Optional[str] = None,
        api_key: Optional[str] = None,
        timeout: int = 30
    ):
        """
        Initialize CodeEX Brain client.
        
        Args:
            api_endpoint: Brain API endpoint (defaults to env var)
            api_key: API key for authentication (defaults to env var)
            timeout: Request timeout in seconds
        """
        self.api_endpoint = api_endpoint or os.getenv(
            'CODEX_BRAIN_ENDPOINT',
            'https://api.emergent.ai/codex-brain'  # Example endpoint
        )
        self.api_key = api_key or os.getenv('CODEX_BRAIN_API_KEY')
        self.timeout = timeout
        
        # Setup logging
        self.logger = logging.getLogger(__name__)
        
        if not self.api_key:
            self.logger.warning(
                "No API key provided. CodeEX Brain calls will fail. "
                "Set CODEX_BRAIN_API_KEY environment variable."
            )
    
    def _build_headers(self) -> Dict[str, str]:
        """Build request headers"""
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'CodeEX-Backend/1.0'
        }
    
    def _build_request_payload(self, request: BrainRequest) -> Dict[str, Any]:
        """Build request payload for Brain API"""
        payload = {
            'agent': request.agent.value,
            'problem_context': request.problem_context,
        }
        
        if request.domain_config:
            payload['domain_config'] = request.domain_config
        
        if request.user_context:
            payload['user_context'] = request.user_context
        
        if request.additional_params:
            payload.update(request.additional_params)
        
        return payload
    
    def call_agent(
        self,
        agent: BrainAgent,
        problem_context: Dict[str, Any],
        domain_config: Optional[Dict[str, Any]] = None,
        user_context: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> BrainResponse:
        """
        Call a CodeEX Brain subagent.
        
        ⚠️ WARNING: Output is UNTRUSTED and requires verification!
        
        Args:
            agent: Which subagent to call
            problem_context: Problem information
            domain_config: Domain-specific configuration
            user_context: User context (attempts, preferences, etc.)
            **kwargs: Additional parameters
            
        Returns:
            BrainResponse with UNTRUSTED raw output
            
        Raises:
            BrainAPIError: If API call fails
        """
        request = BrainRequest(
            agent=agent,
            problem_context=problem_context,
            domain_config=domain_config,
            user_context=user_context,
            additional_params=kwargs
        )
        
        return self._make_request(request)
    
    def _make_request(self, request: BrainRequest) -> BrainResponse:
        """Make HTTP request to Brain API"""
        
        # Build request
        url = f"{self.api_endpoint}/v1/generate"
        headers = self._build_headers()
        payload = self._build_request_payload(request)
        
        self.logger.info(
            f"Calling CodeEX Brain: agent={request.agent.value}"
        )
        
        try:
            # Make API call
            response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=self.timeout
            )
            
            # Check response
            response.raise_for_status()
            
            # Parse response
            data = response.json()
            
            return BrainResponse(
                agent=request.agent,
                raw_output=data.get('output', ''),
                metadata=data.get('metadata', {}),
                request_id=data.get('request_id', ''),
                is_verified=False,  # NEVER verified from client
                requires_verification=True  # ALWAYS requires verification
            )
        
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Brain API call failed: {e}")
            raise BrainAPIError(f"Failed to call Brain API: {e}") from e
        
        except json.JSONDecodeError as e:
            self.logger.error(f"Failed to parse Brain response: {e}")
            raise BrainAPIError(f"Invalid response from Brain API: {e}") from e
    
    # ========================================================================
    # CONVENIENCE METHODS FOR EACH AGENT
    # ========================================================================
    
    def call_planner(
        self,
        problem_description: str,
        constraints: Optional[List[str]] = None,
        domain: str = "competitive_programming",
        **kwargs
    ) -> BrainResponse:
        """
        Call PLANNER_AGENT for problem breakdown.
        
        ⚠️ Output is UNTRUSTED
        """
        problem_context = {
            'problem_description': problem_description,
            'constraints': constraints or [],
            'type': 'planning_request'
        }
        
        return self.call_agent(
            agent=BrainAgent.PLANNER,
            problem_context=problem_context,
            domain_config={'domain': domain},
            **kwargs
        )
    
    def call_teacher(
        self,
        concept: str,
        detail_level: str = "moderate",
        include_examples: bool = True,
        domain: str = "dsa",
        **kwargs
    ) -> BrainResponse:
        """
        Call TEACHER_AGENT for concept explanation.
        
        ⚠️ Output is UNTRUSTED
        """
        problem_context = {
            'concept': concept,
            'detail_level': detail_level,
            'include_examples': include_examples,
            'type': 'teaching_request'
        }
        
        return self.call_agent(
            agent=BrainAgent.TEACHER,
            problem_context=problem_context,
            domain_config={'domain': domain},
            **kwargs
        )
    
    def call_hint(
        self,
        problem_description: str,
        user_code: Optional[str] = None,
        hint_level: int = 1,
        attempt_count: int = 1,
        domain: str = "competitive_programming",
        **kwargs
    ) -> BrainResponse:
        """
        Call HINT_AGENT for progressive hints.
        
        ⚠️ Output is UNTRUSTED
        ⚠️ MUST verify hint doesn't reveal solution
        """
        problem_context = {
            'problem_description': problem_description,
            'user_code': user_code,
            'hint_level': hint_level,
            'type': 'hint_request'
        }
        
        user_context = {
            'attempt_count': attempt_count,
            'requested_hint_level': hint_level
        }
        
        return self.call_agent(
            agent=BrainAgent.HINT,
            problem_context=problem_context,
            domain_config={'domain': domain},
            user_context=user_context,
            **kwargs
        )
    
    def call_coding(
        self,
        problem_description: str,
        language: str,
        user_consent: bool,
        attempt_count: int,
        in_contest: bool = False,
        domain: str = "competitive_programming",
        **kwargs
    ) -> BrainResponse:
        """
        Call CODING_AGENT for solution generation.
        
        ⚠️ Output is UNTRUSTED
        ⚠️ REQUIRES AUTHORIZATION CHECK before calling
        ⚠️ MUST verify solution before showing to user
        """
        problem_context = {
            'problem_description': problem_description,
            'language': language,
            'type': 'solution_generation'
        }
        
        user_context = {
            'user_consent': user_consent,
            'attempt_count': attempt_count,
            'in_contest': in_contest
        }
        
        return self.call_agent(
            agent=BrainAgent.CODING,
            problem_context=problem_context,
            domain_config={'domain': domain},
            user_context=user_context,
            **kwargs
        )
    
    def call_debugging(
        self,
        user_code: str,
        error_message: str,
        language: str,
        test_case_failed: Optional[str] = None,
        domain: str = "competitive_programming",
        **kwargs
    ) -> BrainResponse:
        """
        Call DEBUGGING_AGENT for bug analysis.
        
        ⚠️ Output is UNTRUSTED
        ⚠️ MUST verify fix doesn't rewrite entire solution
        """
        problem_context = {
            'user_code': user_code,
            'error_message': error_message,
            'language': language,
            'test_case_failed': test_case_failed,
            'type': 'debugging_request'
        }
        
        return self.call_agent(
            agent=BrainAgent.DEBUGGING,
            problem_context=problem_context,
            domain_config={'domain': domain},
            **kwargs
        )
    
    def call_refactor(
        self,
        user_code: str,
        language: str,
        focus_areas: Optional[List[str]] = None,
        domain: str = "competitive_programming",
        **kwargs
    ) -> BrainResponse:
        """
        Call REFACTOR_AGENT for code improvement.
        
        ⚠️ Output is UNTRUSTED
        ⚠️ User code must be WORKING before refactoring
        """
        problem_context = {
            'user_code': user_code,
            'language': language,
            'focus_areas': focus_areas or ['readability', 'performance'],
            'type': 'refactoring_request'
        }
        
        return self.call_agent(
            agent=BrainAgent.REFACTOR,
            problem_context=problem_context,
            domain_config={'domain': domain},
            **kwargs
        )
    
    def call_project_inspector(
        self,
        project_structure: Dict[str, Any],
        analysis_type: str = "quality",
        domain: str = "web_development",
        **kwargs
    ) -> BrainResponse:
        """
        Call PROJECT_INSPECTOR_AGENT for codebase analysis.
        
        ⚠️ Output is UNTRUSTED
        """
        problem_context = {
            'project_structure': project_structure,
            'analysis_type': analysis_type,
            'type': 'inspection_request'
        }
        
        return self.call_agent(
            agent=BrainAgent.PROJECT_INSPECTOR,
            problem_context=problem_context,
            domain_config={'domain': domain},
            **kwargs
        )
    
    def call_research(
        self,
        query: str,
        search_type: str = "similar_problems",
        domain: str = "competitive_programming",
        **kwargs
    ) -> BrainResponse:
        """
        Call RESEARCH_AGENT for context gathering.
        
        ⚠️ Output is UNTRUSTED
        """
        problem_context = {
            'query': query,
            'search_type': search_type,
            'type': 'research_request'
        }
        
        return self.call_agent(
            agent=BrainAgent.RESEARCH,
            problem_context=problem_context,
            domain_config={'domain': domain},
            **kwargs
        )
    
    def call_memory(
        self,
        operation: str,  # 'store', 'retrieve', 'update', 'delete'
        data: Optional[Dict[str, Any]] = None,
        query: Optional[Dict[str, Any]] = None,
        authorization: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> BrainResponse:
        """
        Call MEMORY_AGENT for context management.
        
        ⚠️ Output is UNTRUSTED
        ⚠️ Delete operations require authorization
        """
        problem_context = {
            'operation': operation,
            'data': data,
            'query': query,
            'type': 'memory_request'
        }
        
        user_context = {
            'authorization': authorization or {}
        }
        
        return self.call_agent(
            agent=BrainAgent.MEMORY,
            problem_context=problem_context,
            user_context=user_context,
            **kwargs
        )


class BrainAPIError(Exception):
    """Exception raised for Brain API errors"""
    pass


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def load_domain_config(domain_id: str) -> Dict[str, Any]:
    """
    Load domain configuration for Brain API call.
    
    Args:
        domain_id: Domain identifier (e.g., 'competitive_programming')
        
    Returns:
        Domain configuration dictionary
    """
    try:
        from backend.ai.domains import load_domain
        
        config = load_domain(domain_id)
        
        # Extract relevant fields for Brain API
        return {
            'domain_id': config.domain_id,
            'domain_name': config.domain_name,
            'difficulty_levels': config.difficulty_levels,
            'explanation_depth': config.explanation_depth,
            'ai_assistant': config.ai_assistant,
        }
    
    except Exception as e:
        logging.warning(f"Failed to load domain config: {e}")
        return {'domain_id': domain_id}


def create_problem_context(
    problem_id: str,
    problem_title: str,
    problem_description: str,
    difficulty: str,
    constraints: Optional[List[str]] = None,
    examples: Optional[List[Dict]] = None
) -> Dict[str, Any]:
    """
    Create standardized problem context for Brain API.
    
    Args:
        problem_id: Unique problem identifier
        problem_title: Problem title
        problem_description: Full problem description
        difficulty: Difficulty level (easy, medium, hard)
        constraints: List of constraints
        examples: List of example inputs/outputs
        
    Returns:
        Problem context dictionary
    """
    return {
        'problem_id': problem_id,
        'title': problem_title,
        'description': problem_description,
        'difficulty': difficulty,
        'constraints': constraints or [],
        'examples': examples or [],
    }


# ============================================================================
# EXAMPLE USAGE (for documentation)
# ============================================================================

def example_call_teacher():
    """
    Example: Call TEACHER_AGENT to explain a concept.
    
    ⚠️ This is a SKELETON - actual implementation depends on Emergent API
    """
    # Initialize client
    client = CodeEXBrainClient()
    
    # Call TEACHER_AGENT
    response = client.call_teacher(
        concept="Binary Search Algorithm",
        detail_level="detailed",
        include_examples=True,
        domain="dsa"
    )
    
    # ⚠️ WARNING: response.raw_output is UNTRUSTED
    # Must be verified before use
    print(f"Agent: {response.agent}")
    print(f"Output (UNTRUSTED): {response.raw_output[:100]}...")
    print(f"Requires verification: {response.requires_verification}")
    
    # Next step: Send to verification pipeline
    # from backend.ai.verification import VerificationPipeline
    # pipeline = VerificationPipeline()
    # verified = pipeline.verify_explanation(response.raw_output, ...)


def example_call_hint():
    """
    Example: Call HINT_AGENT for progressive hint.
    """
    client = CodeEXBrainClient()
    
    # Load domain config
    domain_config = load_domain_config('competitive_programming')
    
    # Call HINT_AGENT
    response = client.call_hint(
        problem_description="Given an array, find two numbers that sum to target",
        user_code="# User's attempted solution",
        hint_level=1,  # Start with gentle hint
        attempt_count=2,
        domain="competitive_programming"
    )
    
    # ⚠️ Output is UNTRUSTED - must verify it doesn't reveal solution
    print(f"Hint (UNTRUSTED): {response.raw_output}")
    
    # Next step: Validate hint doesn't contain code
    # from backend.ai.agents import RoleValidator, AgentRole
    # validator = RoleValidator()
    # result = validator.validate_output(
    #     agent_role=AgentRole.HINT,
    #     output_text=response.raw_output
    # )


def example_call_coding_with_authorization():
    """
    Example: Call CODING_AGENT (requires authorization check).
    """
    client = CodeEXBrainClient()
    
    # ⚠️ IMPORTANT: Check authorization BEFORE calling
    # from backend.ai.agents import PermissionEnforcer, AgentRole, Permission
    # enforcer = PermissionEnforcer()
    # 
    # context = {
    #     'user_consent': True,
    #     'attempt_count': 3,  # User tried 3 times
    #     'in_contest': False
    # }
    # 
    # if not enforcer.check_permission(
    #     AgentRole.CODING,
    #     Permission.GENERATE_FULL_SOLUTION,
    #     context
    # ):
    #     raise PermissionError("Not authorized to generate solution")
    
    # If authorized, call CODING_AGENT
    response = client.call_coding(
        problem_description="Implement two-sum problem",
        language="python",
        user_consent=True,
        attempt_count=3,
        in_contest=False,
        domain="competitive_programming"
    )
    
    # ⚠️ Output is UNTRUSTED - must verify before showing to user
    print(f"Solution (UNTRUSTED): {response.raw_output}")
    
    # Next step: Verify solution
    # from backend.ai.verification import VerificationPipeline
    # pipeline = VerificationPipeline()
    # verified = pipeline.verify_solution(
    #     source_code=response.raw_output,
    #     language="python",
    #     test_cases=test_cases
    # )


if __name__ == "__main__":
    # Run examples (will fail without API key)
    print("=" * 60)
    print("CodeEX Brain Client Examples")
    print("=" * 60)
    print()
    print("⚠️ WARNING: All AI outputs are UNTRUSTED")
    print("⚠️ MUST be verified before use")
    print()
    
    # Note: These examples show the API, but won't run without
    # valid API endpoint and key
    print("Example 1: Call TEACHER_AGENT")
    print("-" * 60)
    print("See example_call_teacher() function")
    print()
    
    print("Example 2: Call HINT_AGENT")
    print("-" * 60)
    print("See example_call_hint() function")
    print()
    
    print("Example 3: Call CODING_AGENT (with authorization)")
    print("-" * 60)
    print("See example_call_coding_with_authorization() function")
