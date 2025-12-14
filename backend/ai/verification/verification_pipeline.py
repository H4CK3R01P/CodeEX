"""Verification Pipeline

Orchestrates all verification checks to ensure AI output quality.
REJECTS bad outputs - never trusts AI directly.
"""

import asyncio
import time
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from enum import Enum

from .solution_validator import SolutionValidator, ValidationResult, ValidationStatus
from .test_case_generator import TestCaseGenerator, GeneratedTestCase
from .explanation_checker import ExplanationChecker, ExplanationCheckResult, ExplanationVerdict
from .determinism_guard import DeterminismGuard, ConsistencyResult, ConsistencyLevel


class PipelineStage(str, Enum):
    """Verification pipeline stages"""
    DETERMINISM_CHECK = "DETERMINISM_CHECK"
    SOLUTION_VALIDATION = "SOLUTION_VALIDATION"
    EDGE_CASE_GENERATION = "EDGE_CASE_GENERATION"
    EXPLANATION_CHECK = "EXPLANATION_CHECK"


class PipelineStatus(str, Enum):
    """Overall pipeline status"""
    PASSED = "PASSED"              # All checks passed
    FAILED = "FAILED"              # One or more critical checks failed
    PARTIAL = "PARTIAL"            # Some checks passed
    ERROR = "ERROR"                # Pipeline execution error


@dataclass
class StageResult:
    """Result of a single pipeline stage"""
    stage: PipelineStage
    passed: bool
    result: Any
    duration_ms: int
    error: Optional[str] = None


@dataclass
class PipelineResult:
    """Complete verification pipeline result"""
    status: PipelineStatus
    passed_stages: int
    total_stages: int
    stage_results: Dict[PipelineStage, StageResult] = field(default_factory=dict)
    total_duration_ms: int = 0
    rejection_reason: Optional[str] = None
    
    @property
    def is_acceptable(self) -> bool:
        """Check if output passed all critical checks"""
        return self.status == PipelineStatus.PASSED
    
    def get_failure_reasons(self) -> List[str]:
        """Get all failure reasons"""
        reasons = []
        for stage, result in self.stage_results.items():
            if not result.passed and result.error:
                reasons.append(f"{stage.value}: {result.error}")
        if self.rejection_reason:
            reasons.append(f"Overall: {self.rejection_reason}")
        return reasons


class VerificationPipeline:
    """Orchestrates verification of AI-generated content"""
    
    def __init__(
        self,
        enable_determinism_check: bool = True,
        enable_solution_validation: bool = True,
        enable_edge_case_generation: bool = True,
        enable_explanation_check: bool = True,
        strict_mode: bool = True
    ):
        """
        Initialize verification pipeline.
        
        Args:
            enable_determinism_check: Check for consistency across runs
            enable_solution_validation: Execute and validate solutions
            enable_edge_case_generation: Generate and test edge cases
            enable_explanation_check: Verify explanations match code
            strict_mode: Reject on any failure (vs. accept partial)
        """
        self.enable_determinism_check = enable_determinism_check
        self.enable_solution_validation = enable_solution_validation
        self.enable_edge_case_generation = enable_edge_case_generation
        self.enable_explanation_check = enable_explanation_check
        self.strict_mode = strict_mode
        
        # Initialize verifiers
        self.solution_validator = SolutionValidator(use_docker=True)
        self.test_case_generator = TestCaseGenerator()
        self.explanation_checker = ExplanationChecker()
        self.determinism_guard = DeterminismGuard(num_runs=3, min_acceptable_similarity=0.85)
    
    async def verify_solution_async(
        self,
        source_code: str,
        language: str,
        test_cases: List[Any],
        explanation: Optional[str] = None,
        ai_generator_func: Optional[Any] = None
    ) -> PipelineResult:
        """Verify AI-generated solution (async)"""
        
        start_time = time.time()
        stage_results = {}
        passed_stages = 0
        total_stages = 0
        
        # Stage 1: Determinism Check
        if self.enable_determinism_check and ai_generator_func:
            total_stages += 1
            stage_start = time.time()
            
            try:
                consistency_result = await self.determinism_guard.check_async(ai_generator_func)
                stage_duration = int((time.time() - stage_start) * 1000)
                
                passed = consistency_result.is_acceptable
                if passed:
                    passed_stages += 1
                
                stage_results[PipelineStage.DETERMINISM_CHECK] = StageResult(
                    stage=PipelineStage.DETERMINISM_CHECK,
                    passed=passed,
                    result=consistency_result,
                    duration_ms=stage_duration,
                    error=None if passed else f"Inconsistent outputs (similarity: {consistency_result.similarity_score:.2f})"
                )
                
                # If inconsistent and strict mode, fail early
                if self.strict_mode and not passed:
                    total_duration = int((time.time() - start_time) * 1000)
                    return PipelineResult(
                        status=PipelineStatus.FAILED,
                        passed_stages=passed_stages,
                        total_stages=total_stages,
                        stage_results=stage_results,
                        total_duration_ms=total_duration,
                        rejection_reason="Determinism check failed - AI outputs are inconsistent"
                    )
            
            except Exception as e:
                stage_duration = int((time.time() - stage_start) * 1000)
                stage_results[PipelineStage.DETERMINISM_CHECK] = StageResult(
                    stage=PipelineStage.DETERMINISM_CHECK,
                    passed=False,
                    result=None,
                    duration_ms=stage_duration,
                    error=f"Error: {str(e)}"
                )
        
        # Stage 2: Solution Validation
        if self.enable_solution_validation:
            total_stages += 1
            stage_start = time.time()
            
            try:
                validation_result = await self.solution_validator.validate_async(
                    source_code=source_code,
                    language=language,
                    test_cases=test_cases
                )
                stage_duration = int((time.time() - stage_start) * 1000)
                
                passed = validation_result.is_valid
                if passed:
                    passed_stages += 1
                
                stage_results[PipelineStage.SOLUTION_VALIDATION] = StageResult(
                    stage=PipelineStage.SOLUTION_VALIDATION,
                    passed=passed,
                    result=validation_result,
                    duration_ms=stage_duration,
                    error=None if passed else f"Validation failed: {validation_result.status.value}"
                )
                
                # If solution invalid and strict mode, fail early
                if self.strict_mode and not passed:
                    total_duration = int((time.time() - start_time) * 1000)
                    return PipelineResult(
                        status=PipelineStatus.FAILED,
                        passed_stages=passed_stages,
                        total_stages=total_stages,
                        stage_results=stage_results,
                        total_duration_ms=total_duration,
                        rejection_reason=f"Solution validation failed: {validation_result.status.value}"
                    )
            
            except Exception as e:
                stage_duration = int((time.time() - stage_start) * 1000)
                stage_results[PipelineStage.SOLUTION_VALIDATION] = StageResult(
                    stage=PipelineStage.SOLUTION_VALIDATION,
                    passed=False,
                    result=None,
                    duration_ms=stage_duration,
                    error=f"Error: {str(e)}"
                )
        
        # Stage 3: Edge Case Generation & Testing
        if self.enable_edge_case_generation:
            total_stages += 1
            stage_start = time.time()
            
            try:
                # Generate edge cases based on problem type
                # For now, generate generic array edge cases
                edge_cases = self.test_case_generator.generate_array_tests(count=3)
                
                # Convert to testcase objects
                edge_testcases = [tc.to_testcase() for tc in edge_cases]
                
                # Validate against edge cases
                edge_validation = await self.solution_validator.validate_async(
                    source_code=source_code,
                    language=language,
                    test_cases=edge_testcases
                )
                
                stage_duration = int((time.time() - stage_start) * 1000)
                
                passed = edge_validation.is_valid
                if passed:
                    passed_stages += 1
                
                stage_results[PipelineStage.EDGE_CASE_GENERATION] = StageResult(
                    stage=PipelineStage.EDGE_CASE_GENERATION,
                    passed=passed,
                    result=edge_validation,
                    duration_ms=stage_duration,
                    error=None if passed else f"Failed edge cases: {edge_validation.passed_tests}/{edge_validation.total_tests}"
                )
            
            except Exception as e:
                stage_duration = int((time.time() - stage_start) * 1000)
                stage_results[PipelineStage.EDGE_CASE_GENERATION] = StageResult(
                    stage=PipelineStage.EDGE_CASE_GENERATION,
                    passed=False,
                    result=None,
                    duration_ms=stage_duration,
                    error=f"Error: {str(e)}"
                )
        
        # Stage 4: Explanation Check
        if self.enable_explanation_check and explanation:
            total_stages += 1
            stage_start = time.time()
            
            try:
                explanation_result = self.explanation_checker.check(
                    source_code=source_code,
                    explanation=explanation,
                    language=language
                )
                
                stage_duration = int((time.time() - stage_start) * 1000)
                
                passed = explanation_result.is_acceptable
                if passed:
                    passed_stages += 1
                
                stage_results[PipelineStage.EXPLANATION_CHECK] = StageResult(
                    stage=PipelineStage.EXPLANATION_CHECK,
                    passed=passed,
                    result=explanation_result,
                    duration_ms=stage_duration,
                    error=None if passed else f"Explanation issues: {explanation_result.verdict.value}"
                )
            
            except Exception as e:
                stage_duration = int((time.time() - stage_start) * 1000)
                stage_results[PipelineStage.EXPLANATION_CHECK] = StageResult(
                    stage=PipelineStage.EXPLANATION_CHECK,
                    passed=False,
                    result=None,
                    duration_ms=stage_duration,
                    error=f"Error: {str(e)}"
                )
        
        # Determine overall status
        total_duration = int((time.time() - start_time) * 1000)
        
        if passed_stages == total_stages:
            status = PipelineStatus.PASSED
            rejection_reason = None
        elif passed_stages == 0:
            status = PipelineStatus.FAILED
            rejection_reason = "All verification stages failed"
        else:
            if self.strict_mode:
                status = PipelineStatus.FAILED
                rejection_reason = f"Only {passed_stages}/{total_stages} stages passed (strict mode)"
            else:
                status = PipelineStatus.PARTIAL
                rejection_reason = None
        
        return PipelineResult(
            status=status,
            passed_stages=passed_stages,
            total_stages=total_stages,
            stage_results=stage_results,
            total_duration_ms=total_duration,
            rejection_reason=rejection_reason
        )
    
    def verify_solution(
        self,
        source_code: str,
        language: str,
        test_cases: List[Any],
        explanation: Optional[str] = None
    ) -> PipelineResult:
        """Verify AI-generated solution (sync)"""
        return asyncio.run(self.verify_solution_async(
            source_code, language, test_cases, explanation
        ))
