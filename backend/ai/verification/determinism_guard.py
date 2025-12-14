"""Determinism Guard

Re-runs AI generation multiple times to detect inconsistencies.
Rejects outputs that vary significantly between runs.
"""

import asyncio
from typing import List, Dict, Any, Optional, Callable, Awaitable
from dataclasses import dataclass
from enum import Enum
import hashlib
import difflib


class ConsistencyLevel(str, Enum):
    """Level of consistency in AI outputs"""
    IDENTICAL = "IDENTICAL"              # Outputs are exactly the same
    HIGHLY_CONSISTENT = "HIGHLY_CONSISTENT"  # Minor differences
    MODERATELY_CONSISTENT = "MODERATELY_CONSISTENT"  # Some variation
    INCONSISTENT = "INCONSISTENT"        # Significant differences
    HIGHLY_INCONSISTENT = "HIGHLY_INCONSISTENT"  # Completely different


@dataclass
class ConsistencyResult:
    """Result of determinism check"""
    consistency_level: ConsistencyLevel
    similarity_score: float  # 0.0 to 1.0
    outputs: List[str]
    unique_count: int
    differences: List[str]
    is_acceptable: bool
    
    @property
    def should_reject(self) -> bool:
        """Check if output should be rejected due to inconsistency"""
        return self.consistency_level in [
            ConsistencyLevel.INCONSISTENT,
            ConsistencyLevel.HIGHLY_INCONSISTENT
        ]


class DeterminismGuard:
    """Guards against non-deterministic AI outputs"""
    
    # Thresholds for consistency
    IDENTICAL_THRESHOLD = 1.0
    HIGH_CONSISTENCY_THRESHOLD = 0.95
    MODERATE_CONSISTENCY_THRESHOLD = 0.80
    INCONSISTENT_THRESHOLD = 0.60
    
    def __init__(
        self,
        num_runs: int = 3,
        min_acceptable_similarity: float = 0.85
    ):
        """
        Initialize determinism guard.
        
        Args:
            num_runs: Number of times to run generation
            min_acceptable_similarity: Minimum similarity to accept (0.0-1.0)
        """
        self.num_runs = num_runs
        self.min_acceptable_similarity = min_acceptable_similarity
    
    def _normalize_output(self, output: str) -> str:
        """Normalize output for comparison"""
        # Remove extra whitespace
        normalized = ' '.join(output.split())
        # Convert to lowercase for case-insensitive comparison
        normalized = normalized.lower()
        return normalized
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        # Normalize texts
        norm1 = self._normalize_output(text1)
        norm2 = self._normalize_output(text2)
        
        # Use SequenceMatcher for similarity
        matcher = difflib.SequenceMatcher(None, norm1, norm2)
        return matcher.ratio()
    
    def _get_differences(self, outputs: List[str]) -> List[str]:
        """Get differences between outputs"""
        if len(outputs) < 2:
            return []
        
        differences = []
        base_output = outputs[0]
        
        for i, output in enumerate(outputs[1:], 1):
            diff = list(difflib.unified_diff(
                base_output.splitlines(),
                output.splitlines(),
                fromfile=f'run_0',
                tofile=f'run_{i}',
                lineterm=''
            ))
            
            if diff:
                differences.append('\n'.join(diff[:20]))  # Limit to 20 lines
        
        return differences
    
    def _calculate_pairwise_similarity(self, outputs: List[str]) -> float:
        """Calculate average pairwise similarity"""
        if len(outputs) < 2:
            return 1.0
        
        similarities = []
        for i in range(len(outputs)):
            for j in range(i + 1, len(outputs)):
                sim = self._calculate_similarity(outputs[i], outputs[j])
                similarities.append(sim)
        
        return sum(similarities) / len(similarities) if similarities else 0.0
    
    def _determine_consistency_level(self, similarity: float) -> ConsistencyLevel:
        """Determine consistency level from similarity score"""
        if similarity >= self.IDENTICAL_THRESHOLD:
            return ConsistencyLevel.IDENTICAL
        elif similarity >= self.HIGH_CONSISTENCY_THRESHOLD:
            return ConsistencyLevel.HIGHLY_CONSISTENT
        elif similarity >= self.MODERATE_CONSISTENCY_THRESHOLD:
            return ConsistencyLevel.MODERATELY_CONSISTENT
        elif similarity >= self.INCONSISTENT_THRESHOLD:
            return ConsistencyLevel.INCONSISTENT
        else:
            return ConsistencyLevel.HIGHLY_INCONSISTENT
    
    async def check_async(
        self,
        generator_func: Callable[[], Awaitable[str]],
        **kwargs
    ) -> ConsistencyResult:
        """Check determinism asynchronously"""
        
        # Run generation multiple times
        outputs = []
        for i in range(self.num_runs):
            try:
                output = await generator_func(**kwargs)
                outputs.append(output)
            except Exception as e:
                # If generation fails, mark as inconsistent
                return ConsistencyResult(
                    consistency_level=ConsistencyLevel.HIGHLY_INCONSISTENT,
                    similarity_score=0.0,
                    outputs=outputs,
                    unique_count=len(set(outputs)),
                    differences=[f"Generation failed: {str(e)}"],
                    is_acceptable=False
                )
        
        # Calculate similarity
        similarity = self._calculate_pairwise_similarity(outputs)
        
        # Count unique outputs
        unique_count = len(set(outputs))
        
        # Get differences
        differences = self._get_differences(outputs)
        
        # Determine consistency level
        consistency_level = self._determine_consistency_level(similarity)
        
        # Check if acceptable
        is_acceptable = similarity >= self.min_acceptable_similarity
        
        return ConsistencyResult(
            consistency_level=consistency_level,
            similarity_score=similarity,
            outputs=outputs,
            unique_count=unique_count,
            differences=differences,
            is_acceptable=is_acceptable
        )
    
    def check(
        self,
        generator_func: Callable[[], str],
        **kwargs
    ) -> ConsistencyResult:
        """Check determinism synchronously"""
        
        # Run generation multiple times
        outputs = []
        for i in range(self.num_runs):
            try:
                output = generator_func(**kwargs)
                outputs.append(output)
            except Exception as e:
                return ConsistencyResult(
                    consistency_level=ConsistencyLevel.HIGHLY_INCONSISTENT,
                    similarity_score=0.0,
                    outputs=outputs,
                    unique_count=len(set(outputs)),
                    differences=[f"Generation failed: {str(e)}"],
                    is_acceptable=False
                )
        
        # Calculate similarity
        similarity = self._calculate_pairwise_similarity(outputs)
        
        # Count unique outputs
        unique_count = len(set(outputs))
        
        # Get differences
        differences = self._get_differences(outputs)
        
        # Determine consistency level
        consistency_level = self._determine_consistency_level(similarity)
        
        # Check if acceptable
        is_acceptable = similarity >= self.min_acceptable_similarity
        
        return ConsistencyResult(
            consistency_level=consistency_level,
            similarity_score=similarity,
            outputs=outputs,
            unique_count=unique_count,
            differences=differences,
            is_acceptable=is_acceptable
        )
    
    def check_code_determinism(
        self,
        code_outputs: List[str],
        ignore_whitespace: bool = True,
        ignore_comments: bool = True
    ) -> ConsistencyResult:
        """Check determinism specifically for code outputs"""
        
        # Preprocess code outputs
        processed_outputs = []
        for code in code_outputs:
            processed = code
            
            if ignore_whitespace:
                # Normalize whitespace
                processed = ' '.join(processed.split())
            
            if ignore_comments:
                # Remove Python comments
                lines = []
                for line in processed.split('\n'):
                    # Remove inline comments
                    if '#' in line:
                        line = line[:line.index('#')]
                    if line.strip():
                        lines.append(line)
                processed = '\n'.join(lines)
            
            processed_outputs.append(processed)
        
        # Calculate similarity on processed outputs
        similarity = self._calculate_pairwise_similarity(processed_outputs)
        unique_count = len(set(processed_outputs))
        differences = self._get_differences(code_outputs)  # Use original for diff
        consistency_level = self._determine_consistency_level(similarity)
        is_acceptable = similarity >= self.min_acceptable_similarity
        
        return ConsistencyResult(
            consistency_level=consistency_level,
            similarity_score=similarity,
            outputs=code_outputs,
            unique_count=unique_count,
            differences=differences,
            is_acceptable=is_acceptable
        )
