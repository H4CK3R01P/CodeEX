"""
CodeEX Auto-Grader

AI-assisted feedback generation system.
Verdict determination is external (frozen judge).
"""

from .auto_grader import AutoGrader
from .failure_classifier import FailureClassifier, FailureCategory, Classification
from .signal_extractor import SignalExtractor
from .feedback_generator import FeedbackGenerator, BaseFeedback
from .verdict_engine import VerdictEngine

__all__ = [
    "AutoGrader",
    "FailureClassifier",
    "FailureCategory",
    "Classification",
    "SignalExtractor",
    "FeedbackGenerator",
    "BaseFeedback",
    "VerdictEngine",
]
