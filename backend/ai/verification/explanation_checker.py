"""Explanation Checker

Verifies that AI-generated explanations match the actual solution logic.
Detects hallucinations and incorrect explanations.
"""

import re
import ast
from typing import Dict, Any, List, Optional, Set
from dataclasses import dataclass
from enum import Enum


class ExplanationVerdict(str, Enum):
    """Explanation verification verdict"""
    ACCURATE = "ACCURATE"              # Explanation matches code
    PARTIALLY_ACCURATE = "PARTIALLY_ACCURATE"  # Some inaccuracies
    INACCURATE = "INACCURATE"          # Explanation doesn't match
    HALLUCINATION = "HALLUCINATION"    # Mentions non-existent features
    INCOMPLETE = "INCOMPLETE"          # Missing key information


@dataclass
class ExplanationIssue:
    """Issue found in explanation"""
    severity: str  # "critical", "major", "minor"
    issue_type: str
    description: str
    line_reference: Optional[int] = None


@dataclass
class ExplanationCheckResult:
    """Result of explanation verification"""
    verdict: ExplanationVerdict
    accuracy_score: float  # 0.0 to 1.0
    issues: List[ExplanationIssue]
    matched_concepts: List[str]
    missing_concepts: List[str]
    hallucinated_concepts: List[str]
    
    @property
    def is_acceptable(self) -> bool:
        """Check if explanation is acceptable"""
        return self.verdict in [ExplanationVerdict.ACCURATE, ExplanationVerdict.PARTIALLY_ACCURATE] and \
               self.accuracy_score >= 0.7


class ExplanationChecker:
    """Checks AI-generated explanations against actual code"""
    
    # Algorithm keywords to detect
    ALGORITHM_KEYWORDS = {
        'sorting': ['sort', 'sorted', 'quicksort', 'mergesort', 'heapsort', 'bubble sort'],
        'searching': ['binary search', 'linear search', 'search'],
        'dynamic_programming': ['dp', 'dynamic programming', 'memoization', 'tabulation'],
        'greedy': ['greedy', 'optimal substructure'],
        'backtracking': ['backtrack', 'recursion', 'recursive'],
        'graph': ['dfs', 'bfs', 'depth-first', 'breadth-first', 'graph', 'tree'],
        'sliding_window': ['sliding window', 'two pointer', 'two-pointer'],
        'hash_map': ['hash', 'hashmap', 'dictionary', 'map', 'dict'],
        'stack': ['stack', 'lifo'],
        'queue': ['queue', 'fifo'],
    }
    
    def __init__(self):
        """Initialize explanation checker"""
        pass
    
    def _extract_code_features(self, source_code: str, language: str) -> Set[str]:
        """Extract features from source code"""
        features = set()
        
        if language == 'python':
            features.update(self._extract_python_features(source_code))
        elif language == 'cpp':
            features.update(self._extract_cpp_features(source_code))
        
        return features
    
    def _extract_python_features(self, source_code: str) -> Set[str]:
        """Extract features from Python code"""
        features = set()
        
        try:
            tree = ast.parse(source_code)
            
            # Check for loops
            for node in ast.walk(tree):
                if isinstance(node, ast.For):
                    features.add('for_loop')
                elif isinstance(node, ast.While):
                    features.add('while_loop')
                elif isinstance(node, ast.If):
                    features.add('conditional')
                elif isinstance(node, ast.FunctionDef):
                    if node.name in ['__init__', '__str__']:
                        features.add('class_method')
                    else:
                        features.add('function')
                elif isinstance(node, ast.ClassDef):
                    features.add('class')
                elif isinstance(node, ast.ListComp):
                    features.add('list_comprehension')
                elif isinstance(node, ast.DictComp):
                    features.add('dict_comprehension')
                elif isinstance(node, ast.Lambda):
                    features.add('lambda')
                elif isinstance(node, ast.Try):
                    features.add('exception_handling')
        
        except SyntaxError:
            pass
        
        # Check for built-in functions
        if 'sorted(' in source_code or '.sort(' in source_code:
            features.add('sorting')
        if 'map(' in source_code:
            features.add('map_function')
        if 'filter(' in source_code:
            features.add('filter_function')
        if 'reduce(' in source_code:
            features.add('reduce_function')
        if 'enumerate(' in source_code:
            features.add('enumerate')
        if 'zip(' in source_code:
            features.add('zip')
        
        # Data structures
        if 'set(' in source_code or '{' in source_code:
            features.add('set')
        if 'dict(' in source_code or 'defaultdict' in source_code:
            features.add('dictionary')
        if 'list(' in source_code or '[' in source_code:
            features.add('list')
        if 'deque' in source_code:
            features.add('deque')
        if 'heapq' in source_code:
            features.add('heap')
        
        return features
    
    def _extract_cpp_features(self, source_code: str) -> Set[str]:
        """Extract features from C++ code"""
        features = set()
        
        # Check for loops
        if 'for(' in source_code or 'for (' in source_code:
            features.add('for_loop')
        if 'while(' in source_code or 'while (' in source_code:
            features.add('while_loop')
        if 'if(' in source_code or 'if (' in source_code:
            features.add('conditional')
        
        # Data structures
        if 'vector<' in source_code:
            features.add('vector')
        if 'map<' in source_code or 'unordered_map<' in source_code:
            features.add('map')
        if 'set<' in source_code or 'unordered_set<' in source_code:
            features.add('set')
        if 'queue<' in source_code:
            features.add('queue')
        if 'stack<' in source_code:
            features.add('stack')
        if 'priority_queue<' in source_code:
            features.add('priority_queue')
        
        # Algorithms
        if 'sort(' in source_code:
            features.add('sorting')
        if 'binary_search(' in source_code or 'lower_bound(' in source_code:
            features.add('binary_search')
        
        return features
    
    def _extract_explanation_claims(self, explanation: str) -> Set[str]:
        """Extract claims from explanation text"""
        claims = set()
        explanation_lower = explanation.lower()
        
        # Check for algorithm mentions
        for algo_type, keywords in self.ALGORITHM_KEYWORDS.items():
            for keyword in keywords:
                if keyword in explanation_lower:
                    claims.add(algo_type)
        
        # Check for specific features
        if 'loop' in explanation_lower or 'iterate' in explanation_lower:
            claims.add('loop')
        if 'recursive' in explanation_lower or 'recursion' in explanation_lower:
            claims.add('recursion')
        if 'sort' in explanation_lower:
            claims.add('sorting')
        if 'hash' in explanation_lower or 'dictionary' in explanation_lower:
            claims.add('hash_map')
        if 'array' in explanation_lower or 'list' in explanation_lower:
            claims.add('array')
        if 'condition' in explanation_lower or 'if' in explanation_lower:
            claims.add('conditional')
        
        return claims
    
    def _check_complexity_claims(self, explanation: str, source_code: str) -> List[ExplanationIssue]:
        """Verify time/space complexity claims"""
        issues = []
        
        # Extract complexity claims
        time_complexity = re.findall(r'O\(([^)]+)\)', explanation)
        
        if time_complexity:
            claimed_complexity = time_complexity[0]
            
            # Basic heuristics
            nested_loops = source_code.count('for') >= 2 or source_code.count('while') >= 2
            single_loop = (source_code.count('for') == 1 or source_code.count('while') == 1) and not nested_loops
            has_sort = 'sort' in source_code.lower()
            
            # Check if claimed complexity matches code structure
            if 'n^2' in claimed_complexity or 'n²' in claimed_complexity:
                if not nested_loops:
                    issues.append(ExplanationIssue(
                        severity="major",
                        issue_type="complexity_mismatch",
                        description="Claims O(n²) but no nested loops detected"
                    ))
            
            elif 'n log n' in claimed_complexity or 'nlogn' in claimed_complexity:
                if not has_sort and not ('log' in source_code.lower()):
                    issues.append(ExplanationIssue(
                        severity="major",
                        issue_type="complexity_mismatch",
                        description="Claims O(n log n) but no sorting or logarithmic operations detected"
                    ))
            
            elif claimed_complexity == 'n':
                if nested_loops:
                    issues.append(ExplanationIssue(
                        severity="major",
                        issue_type="complexity_mismatch",
                        description="Claims O(n) but nested loops detected"
                    ))
        
        return issues
    
    def check(
        self,
        source_code: str,
        explanation: str,
        language: str,
        algorithm_type: Optional[str] = None
    ) -> ExplanationCheckResult:
        """Check if explanation matches the code"""
        
        # Extract features from code
        code_features = self._extract_code_features(source_code, language)
        
        # Extract claims from explanation
        explanation_claims = self._extract_explanation_claims(explanation)
        
        # Find matches and mismatches
        matched = explanation_claims.intersection(code_features)
        hallucinated = explanation_claims - code_features
        missing = code_features - explanation_claims
        
        issues = []
        
        # Check for hallucinations
        for hallucination in hallucinated:
            issues.append(ExplanationIssue(
                severity="critical",
                issue_type="hallucination",
                description=f"Mentions '{hallucination}' which is not in the code"
            ))
        
        # Check for missing important concepts
        important_features = {'sorting', 'recursion', 'dynamic_programming', 'graph'}
        missing_important = missing.intersection(important_features)
        for missing_concept in missing_important:
            issues.append(ExplanationIssue(
                severity="major",
                issue_type="incomplete",
                description=f"Doesn't mention '{missing_concept}' which is used in code"
            ))
        
        # Check complexity claims
        complexity_issues = self._check_complexity_claims(explanation, source_code)
        issues.extend(complexity_issues)
        
        # Calculate accuracy score
        if len(explanation_claims) > 0:
            accuracy = len(matched) / len(explanation_claims)
        else:
            accuracy = 0.0
        
        # Penalize for hallucinations and critical issues
        critical_count = sum(1 for issue in issues if issue.severity == "critical")
        accuracy = max(0.0, accuracy - (critical_count * 0.2))
        
        # Determine verdict
        if len(issues) == 0 and accuracy >= 0.9:
            verdict = ExplanationVerdict.ACCURATE
        elif critical_count > 0:
            if 'hallucination' in [i.issue_type for i in issues]:
                verdict = ExplanationVerdict.HALLUCINATION
            else:
                verdict = ExplanationVerdict.INACCURATE
        elif accuracy >= 0.7:
            verdict = ExplanationVerdict.PARTIALLY_ACCURATE
        elif len(missing_important) > 0:
            verdict = ExplanationVerdict.INCOMPLETE
        else:
            verdict = ExplanationVerdict.INACCURATE
        
        return ExplanationCheckResult(
            verdict=verdict,
            accuracy_score=accuracy,
            issues=issues,
            matched_concepts=list(matched),
            missing_concepts=list(missing),
            hallucinated_concepts=list(hallucinated)
        )
