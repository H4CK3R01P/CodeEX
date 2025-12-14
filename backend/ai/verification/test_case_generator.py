"""Test Case Generator

Generates edge cases to thoroughly test AI-generated solutions.
Covers corner cases that AI might miss.
"""

import random
from typing import List, Dict, Any, Optional, Callable
from dataclasses import dataclass
from enum import Enum


class TestCaseType(str, Enum):
    """Type of test case"""
    BASIC = "BASIC"                # Simple test case
    EDGE_CASE = "EDGE_CASE"        # Edge case (empty, single element, etc.)
    LARGE_INPUT = "LARGE_INPUT"    # Maximum size input
    BOUNDARY = "BOUNDARY"          # Boundary values
    CORNER_CASE = "CORNER_CASE"    # Unusual combinations
    STRESS_TEST = "STRESS_TEST"    # Performance test


@dataclass
class GeneratedTestCase:
    """Generated test case"""
    testcase_id: str
    test_type: TestCaseType
    input_data: str
    expected_output: Optional[str] = None
    description: str = ""
    time_limit_ms: int = 2000
    memory_limit_kb: int = 262144
    
    def to_testcase(self):
        """Convert to TestCase model if available"""
        try:
            from models import TestCase
            return TestCase(
                testcase_id=self.testcase_id,
                problem_id="generated",
                input_data=self.input_data,
                expected_output=self.expected_output or "",
                time_limit_ms=self.time_limit_ms,
                memory_limit_kb=self.memory_limit_kb
            )
        except ImportError:
            return self


class TestCaseGenerator:
    """Generates diverse test cases for validation"""
    
    def __init__(self, seed: Optional[int] = None):
        """
        Initialize test case generator.
        
        Args:
            seed: Random seed for reproducibility
        """
        if seed:
            random.seed(seed)
    
    def generate_array_tests(
        self,
        min_size: int = 0,
        max_size: int = 1000,
        min_value: int = -1000,
        max_value: int = 1000,
        count: int = 5
    ) -> List[GeneratedTestCase]:
        """Generate test cases for array problems"""
        test_cases = []
        
        # Edge case: Empty array
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_empty",
            test_type=TestCaseType.EDGE_CASE,
            input_data="0\n",
            description="Empty array"
        ))
        
        # Edge case: Single element
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_single",
            test_type=TestCaseType.EDGE_CASE,
            input_data=f"1\n{random.randint(min_value, max_value)}\n",
            description="Single element array"
        ))
        
        # Edge case: All same elements
        size = random.randint(5, 20)
        value = random.randint(min_value, max_value)
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_duplicate",
            test_type=TestCaseType.EDGE_CASE,
            input_data=f"{size}\n" + " ".join([str(value)] * size) + "\n",
            description="All duplicate elements"
        ))
        
        # Boundary: Maximum size
        large_array = [random.randint(min_value, max_value) for _ in range(max_size)]
        test_cases.append(GeneratedTestCase(
            testcase_id="boundary_large",
            test_type=TestCaseType.LARGE_INPUT,
            input_data=f"{max_size}\n" + " ".join(map(str, large_array)) + "\n",
            description=f"Maximum size ({max_size} elements)"
        ))
        
        # Random test cases
        for i in range(count):
            size = random.randint(min_size, min(100, max_size))
            array = [random.randint(min_value, max_value) for _ in range(size)]
            test_cases.append(GeneratedTestCase(
                testcase_id=f"random_{i}",
                test_type=TestCaseType.BASIC,
                input_data=f"{size}\n" + " ".join(map(str, array)) + "\n",
                description=f"Random test case {i+1}"
            ))
        
        return test_cases
    
    def generate_string_tests(
        self,
        min_length: int = 0,
        max_length: int = 1000,
        charset: str = "abcdefghijklmnopqrstuvwxyz",
        count: int = 5
    ) -> List[GeneratedTestCase]:
        """Generate test cases for string problems"""
        test_cases = []
        
        # Edge case: Empty string
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_empty_string",
            test_type=TestCaseType.EDGE_CASE,
            input_data="\n",
            description="Empty string"
        ))
        
        # Edge case: Single character
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_single_char",
            test_type=TestCaseType.EDGE_CASE,
            input_data=random.choice(charset) + "\n",
            description="Single character"
        ))
        
        # Edge case: All same character
        length = random.randint(5, 20)
        char = random.choice(charset)
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_repeated_char",
            test_type=TestCaseType.EDGE_CASE,
            input_data=char * length + "\n",
            description="All same character"
        ))
        
        # Boundary: Maximum length
        large_string = ''.join(random.choices(charset, k=max_length))
        test_cases.append(GeneratedTestCase(
            testcase_id="boundary_long_string",
            test_type=TestCaseType.LARGE_INPUT,
            input_data=large_string + "\n",
            description=f"Maximum length ({max_length} characters)"
        ))
        
        # Random test cases
        for i in range(count):
            length = random.randint(min_length, min(100, max_length))
            string = ''.join(random.choices(charset, k=length))
            test_cases.append(GeneratedTestCase(
                testcase_id=f"random_string_{i}",
                test_type=TestCaseType.BASIC,
                input_data=string + "\n",
                description=f"Random string test {i+1}"
            ))
        
        return test_cases
    
    def generate_numeric_tests(
        self,
        min_value: int = -10**9,
        max_value: int = 10**9,
        count: int = 5
    ) -> List[GeneratedTestCase]:
        """Generate test cases for numeric problems"""
        test_cases = []
        
        # Edge case: Zero
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_zero",
            test_type=TestCaseType.EDGE_CASE,
            input_data="0\n",
            description="Zero value"
        ))
        
        # Edge case: One
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_one",
            test_type=TestCaseType.EDGE_CASE,
            input_data="1\n",
            description="One value"
        ))
        
        # Boundary: Minimum value
        test_cases.append(GeneratedTestCase(
            testcase_id="boundary_min",
            test_type=TestCaseType.BOUNDARY,
            input_data=f"{min_value}\n",
            description=f"Minimum value ({min_value})"
        ))
        
        # Boundary: Maximum value
        test_cases.append(GeneratedTestCase(
            testcase_id="boundary_max",
            test_type=TestCaseType.BOUNDARY,
            input_data=f"{max_value}\n",
            description=f"Maximum value ({max_value})"
        ))
        
        # Edge case: Negative value
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_negative",
            test_type=TestCaseType.EDGE_CASE,
            input_data=f"{random.randint(min_value, -1)}\n",
            description="Negative value"
        ))
        
        # Random test cases
        for i in range(count):
            value = random.randint(min_value, max_value)
            test_cases.append(GeneratedTestCase(
                testcase_id=f"random_num_{i}",
                test_type=TestCaseType.BASIC,
                input_data=f"{value}\n",
                description=f"Random numeric test {i+1}"
            ))
        
        return test_cases
    
    def generate_graph_tests(
        self,
        max_nodes: int = 100,
        max_edges: int = 1000,
        count: int = 3
    ) -> List[GeneratedTestCase]:
        """Generate test cases for graph problems"""
        test_cases = []
        
        # Edge case: Single node
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_single_node",
            test_type=TestCaseType.EDGE_CASE,
            input_data="1 0\n",
            description="Single node, no edges"
        ))
        
        # Edge case: Disconnected graph
        nodes = 5
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_disconnected",
            test_type=TestCaseType.EDGE_CASE,
            input_data=f"{nodes} 0\n",
            description="Multiple nodes, no edges"
        ))
        
        # Edge case: Complete graph (small)
        nodes = 5
        edges = []
        for i in range(1, nodes + 1):
            for j in range(i + 1, nodes + 1):
                edges.append(f"{i} {j}")
        test_cases.append(GeneratedTestCase(
            testcase_id="edge_complete_graph",
            test_type=TestCaseType.EDGE_CASE,
            input_data=f"{nodes} {len(edges)}\n" + "\n".join(edges) + "\n",
            description="Complete graph"
        ))
        
        # Boundary: Large graph
        nodes = max_nodes
        edges_count = min(max_edges, nodes * (nodes - 1) // 2)
        edges = []
        for _ in range(edges_count):
            u = random.randint(1, nodes)
            v = random.randint(1, nodes)
            if u != v:
                edges.append(f"{u} {v}")
        test_cases.append(GeneratedTestCase(
            testcase_id="boundary_large_graph",
            test_type=TestCaseType.LARGE_INPUT,
            input_data=f"{nodes} {len(edges)}\n" + "\n".join(edges) + "\n",
            description=f"Large graph ({nodes} nodes, {len(edges)} edges)"
        ))
        
        return test_cases
    
    def generate_custom(
        self,
        generator_func: Callable[[], str],
        count: int = 5,
        test_type: TestCaseType = TestCaseType.BASIC
    ) -> List[GeneratedTestCase]:
        """Generate custom test cases using provided function"""
        test_cases = []
        
        for i in range(count):
            input_data = generator_func()
            test_cases.append(GeneratedTestCase(
                testcase_id=f"custom_{i}",
                test_type=test_type,
                input_data=input_data,
                description=f"Custom test case {i+1}"
            ))
        
        return test_cases
