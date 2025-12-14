# CodeEX AI Domain Configuration Layer

**Version:** 1.0.0  
**Type:** Pure Configuration (No AI Calls)  
**Status:** ✅ Complete

---

## 📋 Overview

This directory contains **domain-specific configuration files** for CodeEX AI. Each domain defines rules, constraints, and behavior for different types of problems.

### What This Is:
- ✅ Pure YAML configuration files
- ✅ Domain-specific rules and constraints
- ✅ Python loader for accessing configs
- ✅ No AI agent integration (yet)
- ✅ No frontend integration (yet)

### What This Is NOT:
- ❌ Not an AI agent
- ❌ No LLM calls
- ❌ No database integration
- ❌ No API endpoints

---

## 📁 Structure

```
backend/ai/domains/
├── README.md                          # This file
├── __init__.py                        # Domain config loader
├── competitive_programming.yaml       # CP domain config
├── dsa.yaml                          # DSA learning domain
├── web_development.yaml              # Web dev domain
├── system_design.yaml                # System design domain
└── aptitude.yaml                     # Aptitude & reasoning
```

---

## 🎯 Available Domains

### 1. Competitive Programming (`competitive_programming.yaml`)
**Focus:** Contest-style algorithmic challenges  
**Languages:** Python, C++, Java  
**Verdict Priority:** CE > RE > TLE > MLE > WA > AC  
**Partial Credit:** Disabled  
**Features:** Strict time limits, leaderboards, contest mode

### 2. Data Structures & Algorithms (`dsa.yaml`)
**Focus:** Educational learning with comprehensive explanations  
**Languages:** Python, C++, Java  
**Verdict Priority:** CE > RE > TLE > MLE > WA > AC  
**Partial Credit:** Enabled (per test case)  
**Features:** Visualizations, step-by-step execution, learning paths

### 3. Web Development (`web_development.yaml`)
**Focus:** Frontend, backend, and full-stack challenges  
**Languages:** HTML, CSS, JavaScript, TypeScript, Python, Node  
**Verdict Priority:** CE > RE > TLE > VE > AE > WA > AC  
**Partial Credit:** Enabled (per feature)  
**Features:** Live preview, browser console, responsive design testing

### 4. System Design (`system_design.yaml`)
**Focus:** Architecture, scalability, distributed systems  
**Languages:** Python, Java, Go, JavaScript, Diagrams  
**Verdict Priority:** IE > IC > IS > NF > PA > AC  
**Partial Credit:** Enabled (per section)  
**Features:** Diagram editor, capacity calculator, cost estimator

### 5. Aptitude & Reasoning (`aptitude.yaml`)
**Focus:** Quantitative aptitude, logical reasoning, puzzles  
**Languages:** Python, Mathematical notation, Text answers  
**Verdict Priority:** CE > RE > FE > WA > AC  
**Partial Credit:** Enabled (methodology credit)  
**Features:** Formula sheet, calculator, negative marking

---

## 📝 Configuration Schema

Each domain YAML file includes:

### Required Fields:
```yaml
domain_name: "Domain Name"
domain_id: "domain_id"
version: "1.0.0"
last_updated: "2024-12-14"

difficulty_levels:
  easy/medium/hard:
    label: "Easy"
    score_range: [0, 33]
    time_multiplier: 1.0
    hints_allowed: 3
    test_cases_shown: 2
    explanation_depth: "detailed"

allowed_languages:
  - python:
      version: "3.11+"
      time_limit_multiplier: 2.0
      starter_template: "..."

constraints:
  time_limit:
    default_ms: 2000
    strict_enforcement: true
  memory_limit:
    default_kb: 262144
  code_size:
    max_bytes: 100000
  test_cases:
    min_count: 5
    hidden_percentage: 0.7

expected_output_format:
  type: "strict"  # or "flexible"
  rules:
    - whitespace_handling: "strict"
    - case_sensitive: true

accuracy_rules:
  verdict_priority:
    - "CE" "RE" "TLE" "MLE" "WA" "AC"
  partial_credit:
    enabled: false
  scoring:
    ac_points: 100
  comparison:
    method: "exact_match"

explanation_depth:
  minimal:
    include_algorithm_name: true
    include_complexity: true
  detailed:
    include_code_walkthrough: true
    include_edge_cases: true
```

### Optional Fields:
- `topic_categories`: List of topics for the domain
- `ai_assistant`: AI behavior configuration
- `features`: Feature flags
- `contest_mode`, `learning_path`, `testing`, etc.

---

## 🔧 Usage

### Python API

```python
from backend.ai.domains import (
    load_domain,
    load_all_domains,
    get_available_domains
)

# Load single domain
cp_config = load_domain('competitive_programming')
print(cp_config.domain_name)  # "Competitive Programming"
print(cp_config.constraints['time_limit']['default_ms'])  # 2000

# Load all domains
all_domains = load_all_domains()
for domain_id, config in all_domains.items():
    print(f"{domain_id}: {config.domain_name}")

# Get available domain IDs
available = get_available_domains()
print(available)  # ['competitive_programming', 'dsa', ...]
```

### Accessing Configuration

```python
config = load_domain('dsa')

# Difficulty levels
easy = config.difficulty_levels['easy']
print(easy['hints_allowed'])  # 5

# Languages
for lang in config.allowed_languages:
    lang_name = list(lang.keys())[0]
    lang_config = lang[lang_name]
    print(f"{lang_name}: {lang_config['version']}")

# Constraints
time_limit = config.constraints['time_limit']['default_ms']
memory_limit = config.constraints['memory_limit']['default_kb']

# Explanation depth
detailed = config.explanation_depth['detailed']
if detailed['include_visualizations']:
    print("Visualizations enabled")
```

---

## 🎨 Customization

### Adding a New Domain

1. Create `new_domain.yaml` in this directory
2. Follow the schema (copy existing domain as template)
3. Include all required fields
4. Test loading:

```python
from backend.ai.domains import load_domain

config = load_domain('new_domain')
print(config.domain_name)
```

### Modifying Existing Domain

1. Edit the YAML file directly
2. No code changes needed
3. Changes take effect on next load
4. Validate with loader:

```python
try:
    config = load_domain('competitive_programming')
    print("✅ Config valid")
except Exception as e:
    print(f"❌ Config error: {e}")
```

---

## 🔍 Validation

The `DomainConfigLoader` validates:
- ✅ Required fields present
- ✅ YAML syntax correct
- ✅ File exists
- ❌ Does NOT validate field values (yet)

### Test All Configs

```python
from backend.ai.domains import DomainConfigLoader

loader = DomainConfigLoader()
domains = loader.load_all_domains()

print(f"✅ Loaded {len(domains)} domains:")
for domain_id, config in domains.items():
    print(f"  - {domain_id}: {config.domain_name} v{config.version}")
```

---

## 📊 Configuration Examples

### Strict Output Matching (Competitive Programming)
```yaml
expected_output_format:
  type: "strict"
  rules:
    - whitespace_handling: "strict"
    - case_sensitive: true
    - trailing_newline: "optional"
  comparison:
    method: "exact_match"
```

### Flexible Output (DSA Learning)
```yaml
expected_output_format:
  type: "flexible"
  rules:
    - whitespace_handling: "trim"
    - case_sensitive: true
    - trailing_newline: "ignore"
  comparison:
    method: "token_based"
```

### Partial Credit (System Design)
```yaml
accuracy_rules:
  partial_credit:
    enabled: true
    per_section: true
    pass_threshold: 0.65
  scoring:
    architecture_weight: 0.25
    scalability_weight: 0.20
```

---

## 🚀 Future Enhancements

### Planned Features:
- [ ] JSON Schema validation
- [ ] Config inheritance (base + override)
- [ ] Environment-specific configs (dev/prod)
- [ ] Config versioning and migrations
- [ ] Hot-reloading of configs
- [ ] Config validation CLI tool
- [ ] Config diff tool

### NOT Planned (Out of Scope):
- ❌ AI agent integration (separate layer)
- ❌ Database storage (configs are files)
- ❌ API endpoints (configs are internal)
- ❌ Frontend access (use API layer)

---

## 🔐 Best Practices

1. **Never hardcode values** - Use config files
2. **Version your configs** - Track changes
3. **Test after changes** - Validate loading
4. **Document custom fields** - Add comments
5. **Keep configs DRY** - Consider inheritance (future)

---

## 📞 Integration Points

### With CodeEX Brain (Future):
```python
from backend.ai.domains import load_domain
from brain import CodeEXBrain

config = load_domain('competitive_programming')
brain = CodeEXBrain(domain_config=config)

# Brain uses config for:
# - Hint generation depth
# - Explanation verbosity
# - Time/memory constraints
# - Language-specific behavior
```

### With Grader (Current):
```python
from backend.ai.domains import load_domain
from grader import VerdictEngine

config = load_domain('dsa')

# Use config for:
# - Verdict priority
# - Partial credit rules
# - Output comparison method
# - Time/memory limits
```

---

## ✅ Status

- ✅ Domain configs created (5 domains)
- ✅ Python loader implemented
- ✅ Documentation complete
- ⏳ NOT integrated with Brain (pending)
- ⏳ NOT connected to frontend (pending)
- ⏳ NOT used by grader (pending)

**Next Steps:**
1. Integrate with CodeEX Brain agents
2. Use configs in verdict engine
3. Expose via API endpoints
4. Connect to frontend domain selection

---

*End of Domain Configuration Documentation*
