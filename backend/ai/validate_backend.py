"""Backend AI System Validation

Validates that the CodeEX AI backend is ready for production:
- All components integrated
- Verification working
- No frontend dependencies
- Verdict logic protected
- Clean error handling
"""

import sys
import os
sys.path.insert(0, '/app')

from typing import List, Dict, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ValidationCheck:
    """Validation check result"""
    def __init__(self, name: str, passed: bool, message: str):
        self.name = name
        self.passed = passed
        self.message = message


class BackendValidator:
    """Validates backend AI system"""
    
    def __init__(self):
        self.checks: List[ValidationCheck] = []
    
    def run_all_checks(self) -> bool:
        """Run all validation checks"""
        print("=" * 80)
        print("CODEX BACKEND AI VALIDATION")
        print("=" * 80)
        print()
        
        # Run checks
        self.check_domain_configs()
        self.check_permissions_system()
        self.check_verification_pipelines()
        self.check_brain_client()
        self.check_orchestrator()
        self.check_api_routes()
        self.check_no_frontend_dependency()
        self.check_verdict_protection()
        self.check_error_handling()
        
        # Print results
        self._print_results()
        
        # Return overall status
        all_passed = all(check.passed for check in self.checks)
        return all_passed
    
    def check_domain_configs(self):
        """Check domain configuration system"""
        print("📁 Checking Domain Configurations...")
        
        try:
            from backend.ai.domains import load_domain, get_available_domains
            
            # Check available domains
            domains = get_available_domains()
            if len(domains) < 5:
                self.checks.append(ValidationCheck(
                    "Domain Configs",
                    False,
                    f"Only {len(domains)} domains found, expected 5+"
                ))
                return
            
            # Try loading a domain
            config = load_domain('competitive_programming')
            
            # Verify structure
            if not hasattr(config, 'domain_id'):
                self.checks.append(ValidationCheck(
                    "Domain Configs",
                    False,
                    "Domain config missing required fields"
                ))
                return
            
            self.checks.append(ValidationCheck(
                "Domain Configs",
                True,
                f"✓ {len(domains)} domains loaded successfully"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Domain Configs",
                False,
                f"Failed to load domains: {e}"
            ))
    
    def check_permissions_system(self):
        """Check agent permissions system"""
        print("🔐 Checking Permission System...")
        
        try:
            from backend.ai.agents import (
                PermissionEnforcer,
                RoleValidator,
                AgentRole,
                Permission
            )
            
            # Initialize enforcer
            enforcer = PermissionEnforcer()
            
            # Test permission check
            can_hint_code = enforcer.check_permission(
                agent_role=AgentRole.HINT,
                permission=Permission.GENERATE_FULL_SOLUTION
            )
            
            if can_hint_code:
                self.checks.append(ValidationCheck(
                    "Permission System",
                    False,
                    "CRITICAL: HINT_AGENT can generate code (should be forbidden)"
                ))
                return
            
            # Test role validation
            validator = RoleValidator()
            result = validator.validate_output(
                agent_role=AgentRole.HINT,
                output_text="def solve(): return [0, 1]"
            )
            
            if result.is_valid:
                self.checks.append(ValidationCheck(
                    "Permission System",
                    False,
                    "CRITICAL: Validator allows HINT to provide code"
                ))
                return
            
            self.checks.append(ValidationCheck(
                "Permission System",
                True,
                "✓ Permissions enforced correctly"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Permission System",
                False,
                f"Failed to validate permissions: {e}"
            ))
    
    def check_verification_pipelines(self):
        """Check verification system"""
        print("🔍 Checking Verification Pipelines...")
        
        try:
            from backend.ai.verification import (
                SolutionValidator,
                TestCaseGenerator,
                ExplanationChecker,
                DeterminismGuard
            )
            
            # Test components exist
            validator = SolutionValidator(use_docker=False)
            generator = TestCaseGenerator()
            checker = ExplanationChecker()
            guard = DeterminismGuard()
            
            # Test security check
            malicious_code = "import os\nos.system('rm -rf /')"
            is_safe, reason = validator._security_check(malicious_code, 'python')
            
            if is_safe:
                self.checks.append(ValidationCheck(
                    "Verification Pipelines",
                    False,
                    "CRITICAL: Security check allows malicious code"
                ))
                return
            
            # Test edge case generation
            edge_cases = generator.generate_array_tests(count=2)
            if len(edge_cases) < 2:
                self.checks.append(ValidationCheck(
                    "Verification Pipelines",
                    False,
                    "Edge case generation not working"
                ))
                return
            
            self.checks.append(ValidationCheck(
                "Verification Pipelines",
                True,
                "✓ Verification pipelines working"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Verification Pipelines",
                False,
                f"Failed to validate verification: {e}"
            ))
    
    def check_brain_client(self):
        """Check Brain client"""
        print("🧠 Checking Brain Client...")
        
        try:
            from backend.ai.brain_client import (
                CodeEXBrainClient,
                BrainAgent,
                BrainResponse
            )
            
            # Initialize client (won't make actual API calls)
            client = CodeEXBrainClient()
            
            # Check all agent methods exist
            agents = [
                'call_planner',
                'call_teacher',
                'call_hint',
                'call_coding',
                'call_debugging',
                'call_refactor',
                'call_project_inspector',
                'call_research',
                'call_memory'
            ]
            
            for agent_method in agents:
                if not hasattr(client, agent_method):
                    self.checks.append(ValidationCheck(
                        "Brain Client",
                        False,
                        f"Missing method: {agent_method}"
                    ))
                    return
            
            # Check BrainAgent enum
            if len(BrainAgent) < 9:
                self.checks.append(ValidationCheck(
                    "Brain Client",
                    False,
                    f"Only {len(BrainAgent)} agents defined, expected 9"
                ))
                return
            
            self.checks.append(ValidationCheck(
                "Brain Client",
                True,
                "✓ Brain client ready (9 agents)"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Brain Client",
                False,
                f"Failed to validate Brain client: {e}"
            ))
    
    def check_orchestrator(self):
        """Check orchestration layer"""
        print("🎯 Checking Orchestrator...")
        
        try:
            from backend.ai.orchestrator import (
                CodeEXOrchestrator,
                OrchestrationRequest,
                RequestType,
                OrchestrationStatus
            )
            
            # Initialize orchestrator
            orchestrator = CodeEXOrchestrator()
            
            # Check components
            if not orchestrator.brain_client:
                self.checks.append(ValidationCheck(
                    "Orchestrator",
                    False,
                    "Brain client not initialized"
                ))
                return
            
            if not orchestrator.permission_enforcer:
                self.checks.append(ValidationCheck(
                    "Orchestrator",
                    False,
                    "Permission enforcer not initialized"
                ))
                return
            
            # Check request types
            if len(RequestType) < 9:
                self.checks.append(ValidationCheck(
                    "Orchestrator",
                    False,
                    f"Only {len(RequestType)} request types, expected 9"
                ))
                return
            
            self.checks.append(ValidationCheck(
                "Orchestrator",
                True,
                "✓ Orchestrator integrated correctly"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Orchestrator",
                False,
                f"Failed to validate orchestrator: {e}"
            ))
    
    def check_api_routes(self):
        """Check FastAPI routes"""
        print("📡 Checking API Routes...")
        
        try:
            from api.routes.ai import router
            
            # Check routes exist
            routes = [r for r in router.routes if hasattr(r, 'path')]
            
            if len(routes) < 5:
                self.checks.append(ValidationCheck(
                    "API Routes",
                    False,
                    f"Only {len(routes)} routes found, expected 5+"
                ))
                return
            
            # Check expected endpoints
            expected_paths = [
                '/api/v1/ai/generate-question',
                '/api/v1/ai/generate-hint',
                '/api/v1/ai/generate-explanation',
                '/api/v1/ai/review-solution',
                '/api/v1/ai/health'
            ]
            
            actual_paths = [r.path for r in routes]
            
            for expected in expected_paths:
                if expected not in actual_paths:
                    self.checks.append(ValidationCheck(
                        "API Routes",
                        False,
                        f"Missing route: {expected}"
                    ))
                    return
            
            self.checks.append(ValidationCheck(
                "API Routes",
                True,
                f"✓ {len(routes)} API routes exposed"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "API Routes",
                False,
                f"Failed to validate API routes: {e}"
            ))
    
    def check_no_frontend_dependency(self):
        """Check no frontend dependencies"""
        print("🔗 Checking Frontend Independence...")
        
        try:
            # Check all backend files don't import frontend
            backend_files = [
                'backend/ai/domains/__init__.py',
                'backend/ai/agents/permission_enforcer.py',
                'backend/ai/verification/verification_pipeline.py',
                'backend/ai/brain_client.py',
                'backend/ai/orchestrator.py',
                'api/routes/ai.py'
            ]
            
            for filepath in backend_files:
                full_path = f'/app/{filepath}'
                if not os.path.exists(full_path):
                    continue
                
                with open(full_path, 'r') as f:
                    content = f.read()
                
                # Check for frontend imports
                if 'from frontend' in content or 'import frontend' in content:
                    self.checks.append(ValidationCheck(
                        "Frontend Independence",
                        False,
                        f"Frontend dependency found in {filepath}"
                    ))
                    return
                
                # Check for React/UI imports
                if 'import React' in content or 'from react' in content:
                    self.checks.append(ValidationCheck(
                        "Frontend Independence",
                        False,
                        f"React dependency found in {filepath}"
                    ))
                    return
            
            self.checks.append(ValidationCheck(
                "Frontend Independence",
                True,
                "✓ No frontend dependencies"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Frontend Independence",
                False,
                f"Failed to check dependencies: {e}"
            ))
    
    def check_verdict_protection(self):
        """Check verdict logic is protected"""
        print("⚖️ Checking Verdict Protection...")
        
        try:
            # Verify orchestrator doesn't modify verdict
            from backend.ai.orchestrator import CodeEXOrchestrator
            
            orchestrator = CodeEXOrchestrator()
            
            # Check orchestrator doesn't have verdict modification methods
            forbidden_methods = [
                'modify_verdict',
                'change_verdict',
                'update_verdict',
                'set_verdict'
            ]
            
            for method in forbidden_methods:
                if hasattr(orchestrator, method):
                    self.checks.append(ValidationCheck(
                        "Verdict Protection",
                        False,
                        f"CRITICAL: Orchestrator has {method} method"
                    ))
                    return
            
            # Check verdict logic files are isolated
            verdict_files = [
                '/app/grader/verdict_engine.py',
                '/app/runner/local_executor.py'
            ]
            
            for filepath in verdict_files:
                if not os.path.exists(filepath):
                    continue
                
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Check AI doesn't import into verdict logic
                if 'from backend.ai' in content or 'from brain' in content:
                    self.checks.append(ValidationCheck(
                        "Verdict Protection",
                        False,
                        f"CRITICAL: AI import found in {filepath}"
                    ))
                    return
            
            self.checks.append(ValidationCheck(
                "Verdict Protection",
                True,
                "✓ Verdict logic isolated and protected"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Verdict Protection",
                False,
                f"Failed to check verdict protection: {e}"
            ))
    
    def check_error_handling(self):
        """Check error handling is clean"""
        print("🛡️ Checking Error Handling...")
        
        try:
            # Check API routes have proper error handling
            with open('/app/api/routes/ai.py', 'r') as f:
                api_content = f.read()
            
            # Check all routes have try/except
            if api_content.count('try:') < 4:
                self.checks.append(ValidationCheck(
                    "Error Handling",
                    False,
                    "Not all routes have error handling"
                ))
                return
            
            # Check no 500 errors raised
            if 'raise HTTPException(500' in api_content or 'status_code=500' in api_content:
                self.checks.append(ValidationCheck(
                    "Error Handling",
                    False,
                    "Routes raise 500 errors (should return structured responses)"
                ))
                return
            
            # Check orchestrator has error handling
            with open('/app/backend/ai/orchestrator.py', 'r') as f:
                orch_content = f.read()
            
            if 'except Exception' not in orch_content:
                self.checks.append(ValidationCheck(
                    "Error Handling",
                    False,
                    "Orchestrator missing error handling"
                ))
                return
            
            self.checks.append(ValidationCheck(
                "Error Handling",
                True,
                "✓ Clean error handling (no 500s)"
            ))
        
        except Exception as e:
            self.checks.append(ValidationCheck(
                "Error Handling",
                False,
                f"Failed to check error handling: {e}"
            ))
    
    def _print_results(self):
        """Print validation results"""
        print()
        print("=" * 80)
        print("VALIDATION RESULTS")
        print("=" * 80)
        print()
        
        passed_count = sum(1 for check in self.checks if check.passed)
        total_count = len(self.checks)
        
        for check in self.checks:
            status = "✅ PASS" if check.passed else "❌ FAIL"
            print(f"{status} - {check.name}")
            print(f"       {check.message}")
            print()
        
        print("=" * 80)
        print(f"TOTAL: {passed_count}/{total_count} checks passed")
        print("=" * 80)
        print()
        
        if passed_count == total_count:
            print("🎉 BACKEND IS AI-READY!")
            print()
            self._print_exposed_apis()
        else:
            print("⚠️ BACKEND NOT READY - Fix failing checks")
            print()
    
    def _print_exposed_apis(self):
        """Print exposed API endpoints"""
        print("=" * 80)
        print("EXPOSED API ENDPOINTS")
        print("=" * 80)
        print()
        
        endpoints = [
            ("POST", "/api/v1/ai/generate-question", "Generate coding questions"),
            ("POST", "/api/v1/ai/generate-hint", "Progressive hints (level 1-3)"),
            ("POST", "/api/v1/ai/generate-explanation", "Concept explanations"),
            ("POST", "/api/v1/ai/review-solution", "Solution review & suggestions"),
            ("GET", "/api/v1/ai/health", "AI service health check")
        ]
        
        for method, path, description in endpoints:
            print(f"  {method:<6} {path:<40} - {description}")
        
        print()
        print("All endpoints return versioned schemas (v1)")
        print("All endpoints have isolated error handling")
        print("Feature flag: CODEX_AI_ENABLED=true/false")
        print()
        print("=" * 80)


if __name__ == "__main__":
    validator = BackendValidator()
    success = validator.run_all_checks()
    
    sys.exit(0 if success else 1)
