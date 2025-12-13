"""
Auto-Grader

AI-assisted feedback generation system.
Verdict determination is external (frozen judge).
"""

from typing import Optional
from datetime import datetime
from dataclasses import dataclass

from models import VerdictReport, Verdict
from .failure_classifier import FailureClassifier, Classification
from .signal_extractor import SignalExtractor
from .feedback_generator import FeedbackGenerator, BaseFeedback


@dataclass
class EnhancedVerdictReport:
    """Verdict report with feedback (verdict unchanged)"""
    verdict_report: VerdictReport
    classification: Classification
    signals: dict
    base_feedback: BaseFeedback
    ai_feedback: Optional[dict] = None
    feedback_generated_at: datetime = None
    
    def __post_init__(self):
        if self.feedback_generated_at is None:
            self.feedback_generated_at = datetime.utcnow()


class AutoGrader:
    """
    AI-assisted feedback generator.
    
    Verdict determination is EXTERNAL (frozen judge).
    This class only adds educational feedback.
    """
    
    def __init__(self, ai_enabled: bool = False):
        """
        Initialize auto-grader.
        
        Args:
            ai_enabled: Enable AI-enhanced feedback (feature flag)
        """
        self.classifier = FailureClassifier()
        self.extractor = SignalExtractor()
        self.feedback_generator = FeedbackGenerator()
        self.ai_enabled = ai_enabled
        # AI plugin system can be added here in future
    
    def generate_feedback(
        self,
        verdict_report: VerdictReport
    ) -> EnhancedVerdictReport:
        """
        Generate feedback for a grading result.
        
        IMPORTANT: Verdict is IMMUTABLE. This only adds feedback.
        
        Args:
            verdict_report: Immutable verdict from judge
            
        Returns:
            Enhanced report with feedback (verdict unchanged)
        """
        # Step 1: Classify failure
        classification = self.classifier.classify(verdict_report)
        
        # Step 2: Extract signals
        signals = self.extractor.extract(verdict_report)
        
        # Step 3: Generate base feedback
        base_feedback = self.feedback_generator.generate(
            classification=classification,
            signals=signals,
            verdict_report=verdict_report
        )
        
        # Step 4: AI feedback (optional, future)
        ai_feedback = None
        if self.ai_enabled and self._should_use_ai(verdict_report):
            # TODO: Implement AI plugin system
            # ai_feedback = self.ai_plugin.enhance(verdict_report, base_feedback)
            pass
        
        # Step 5: Build enhanced report
        return EnhancedVerdictReport(
            verdict_report=verdict_report,
            classification=classification,
            signals=signals,
            base_feedback=base_feedback,
            ai_feedback=ai_feedback
        )
    
    def _should_use_ai(self, verdict_report: VerdictReport) -> bool:
        """Decide if AI enhancement is needed"""
        # Only use AI for failures (not AC)
        return verdict_report.final_verdict != Verdict.AC
