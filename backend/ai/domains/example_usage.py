"""
Example Usage of Domain Configurations

Demonstrates how to load and use domain configs in CodeEX.
"""

from backend.ai.domains import (
    load_domain,
    load_all_domains,
    get_available_domains,
    DomainConfig
)


def example_1_load_single_domain():
    """Example 1: Load a single domain configuration"""
    print("=" * 60)
    print("EXAMPLE 1: Load Single Domain")
    print("=" * 60)
    
    # Load competitive programming domain
    cp_config = load_domain('competitive_programming')
    
    print(f"Domain Name: {cp_config.domain_name}")
    print(f"Domain ID: {cp_config.domain_id}")
    print(f"Version: {cp_config.version}")
    print(f"Description: {cp_config.description[:100]}...")
    print()
    
    # Access difficulty levels
    print("Difficulty Levels:")
    for level, config in cp_config.difficulty_levels.items():
        print(f"  - {config['label']}: {config['hints_allowed']} hints allowed")
    print()


def example_2_check_constraints():
    """Example 2: Check execution constraints"""
    print("=" * 60)
    print("EXAMPLE 2: Check Execution Constraints")
    print("=" * 60)
    
    config = load_domain('dsa')
    
    # Get time and memory limits
    time_limit = config.constraints['time_limit']
    memory_limit = config.constraints['memory_limit']
    
    print(f"Time Limit: {time_limit['default_ms']}ms")
    print(f"  - Min: {time_limit['min_ms']}ms")
    print(f"  - Max: {time_limit['max_ms']}ms")
    print(f"  - Strict: {time_limit['strict_enforcement']}")
    print()
    
    print(f"Memory Limit: {memory_limit['default_kb']}KB")
    print(f"  - Min: {memory_limit['min_kb']}KB")
    print(f"  - Max: {memory_limit['max_kb']}KB")
    print()


def example_3_language_config():
    """Example 3: Get language-specific configuration"""
    print("=" * 60)
    print("EXAMPLE 3: Language Configuration")
    print("=" * 60)
    
    config = load_domain('web_development')
    
    print("Allowed Languages:")
    for lang_dict in config.allowed_languages:
        lang_name = list(lang_dict.keys())[0]
        lang_config = lang_dict[lang_name]
        
        print(f"\n  {lang_name.upper()}:")
        print(f"    Version: {lang_config.get('version', 'N/A')}")
        if 'time_limit_multiplier' in lang_config:
            print(f"    Time Multiplier: {lang_config['time_limit_multiplier']}x")
    print()


def example_4_verdict_rules():
    """Example 4: Understand verdict rules"""
    print("=" * 60)
    print("EXAMPLE 4: Verdict Rules")
    print("=" * 60)
    
    config = load_domain('competitive_programming')
    
    accuracy = config.accuracy_rules
    
    print("Verdict Priority (highest to lowest):")
    for i, verdict in enumerate(accuracy['verdict_priority'], 1):
        print(f"  {i}. {verdict}")
    print()
    
    print("Partial Credit:")
    print(f"  Enabled: {accuracy['partial_credit']['enabled']}")
    print()
    
    print("Scoring:")
    scoring = accuracy['scoring']
    print(f"  AC Points: {scoring['ac_points']}")
    print(f"  WA Penalty: {scoring['wa_penalty']}")
    print()


def example_5_ai_behavior():
    """Example 5: AI assistant behavior configuration"""
    print("=" * 60)
    print("EXAMPLE 5: AI Assistant Behavior")
    print("=" * 60)
    
    dsa = load_domain('dsa')
    cp = load_domain('competitive_programming')
    
    print("DSA (Learning-focused):")
    print(f"  Hint Strategy: {dsa.ai_assistant['hint_strategy']}")
    print(f"  Max Hints: {dsa.ai_assistant['max_hints_per_problem']}")
    print(f"  Auto-reveal: {dsa.ai_assistant['reveal_solution_after_attempts']}")
    print(f"  Style: {dsa.ai_assistant['explanation_style']}")
    print()
    
    print("Competitive Programming (Contest-focused):")
    print(f"  Hint Strategy: {cp.ai_assistant['hint_strategy']}")
    print(f"  Max Hints: {cp.ai_assistant['max_hints_per_problem']}")
    print(f"  Auto-reveal: {cp.ai_assistant['reveal_solution_after_attempts']}")
    print(f"  Style: {cp.ai_assistant['explanation_style']}")
    print()


def example_6_explanation_depth():
    """Example 6: Explanation depth configuration"""
    print("=" * 60)
    print("EXAMPLE 6: Explanation Depth")
    print("=" * 60)
    
    config = load_domain('dsa')
    
    print("Comprehensive Explanation Includes:")
    comprehensive = config.explanation_depth['comprehensive']
    for key, value in comprehensive.items():
        status = "✅" if value else "❌"
        formatted_key = key.replace('_', ' ').title()
        print(f"  {status} {formatted_key}")
    print()


def example_7_iterate_all_domains():
    """Example 7: Iterate through all domains"""
    print("=" * 60)
    print("EXAMPLE 7: All Available Domains")
    print("=" * 60)
    
    all_domains = load_all_domains()
    
    for domain_id, config in all_domains.items():
        print(f"\n{config.domain_name} ({domain_id}):")
        print(f"  Version: {config.version}")
        print(f"  Difficulty Levels: {len(config.difficulty_levels)}")
        print(f"  Languages: {len(config.allowed_languages)}")
        
        # Show one key feature
        if config.ai_assistant:
            print(f"  AI Strategy: {config.ai_assistant.get('hint_strategy', 'N/A')}")
    print()


def example_8_use_in_grading():
    """Example 8: How to use config in grading logic"""
    print("=" * 60)
    print("EXAMPLE 8: Using Config in Grading")
    print("=" * 60)
    
    # Simulated grading scenario
    domain_id = 'competitive_programming'
    difficulty = 'medium'
    language = 'python'
    
    config = load_domain(domain_id)
    
    # Get difficulty-specific settings
    diff_config = config.difficulty_levels[difficulty]
    time_multiplier = diff_config['time_multiplier']
    
    # Get language-specific multiplier
    lang_multiplier = 1.0
    for lang_dict in config.allowed_languages:
        if 'python' in lang_dict:
            lang_multiplier = lang_dict['python']['time_limit_multiplier']
            break
    
    # Calculate actual time limit
    base_time_limit = config.constraints['time_limit']['default_ms']
    actual_time_limit = base_time_limit * time_multiplier * lang_multiplier
    
    print(f"Domain: {config.domain_name}")
    print(f"Difficulty: {difficulty}")
    print(f"Language: {language}")
    print()
    print(f"Base Time Limit: {base_time_limit}ms")
    print(f"Difficulty Multiplier: {time_multiplier}x")
    print(f"Language Multiplier: {lang_multiplier}x")
    print(f"Actual Time Limit: {actual_time_limit}ms")
    print()


def example_9_check_features():
    """Example 9: Check enabled features"""
    print("=" * 60)
    print("EXAMPLE 9: Feature Flags")
    print("=" * 60)
    
    config = load_domain('web_development')
    
    print(f"Domain: {config.domain_name}")
    print("\nEnabled Features:")
    for feature, enabled in config.features.items():
        if enabled:
            print(f"  ✅ {feature.replace('_', ' ').title()}")
    print()


def example_10_custom_usage():
    """Example 10: Custom integration example"""
    print("=" * 60)
    print("EXAMPLE 10: Custom Integration")
    print("=" * 60)
    
    # Simulating AI hint generation
    config = load_domain('dsa')
    difficulty = 'beginner'
    
    diff_config = config.difficulty_levels[difficulty]
    hints_allowed = diff_config['hints_allowed']
    explanation_depth = diff_config['explanation_depth']
    
    print(f"User requesting hint for {difficulty} level problem")
    print(f"Hints remaining: {hints_allowed}")
    print(f"Using explanation depth: {explanation_depth}")
    
    # Get what to include in explanation
    depth_config = config.explanation_depth[explanation_depth]
    
    print("\nGenerating hint with:")
    if depth_config['include_algorithm_name']:
        print("  ✅ Algorithm name")
    if depth_config['include_approach']:
        print("  ✅ Approach description")
    if depth_config['include_code_walkthrough']:
        print("  ✅ Code walkthrough")
    if depth_config.get('include_visualizations'):
        print("  ✅ Visualizations")
    print()


if __name__ == "__main__":
    # Run all examples
    examples = [
        example_1_load_single_domain,
        example_2_check_constraints,
        example_3_language_config,
        example_4_verdict_rules,
        example_5_ai_behavior,
        example_6_explanation_depth,
        example_7_iterate_all_domains,
        example_8_use_in_grading,
        example_9_check_features,
        example_10_custom_usage,
    ]
    
    for example in examples:
        example()
        print("\n")
