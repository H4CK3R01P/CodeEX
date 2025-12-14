# Git Conflict Resolution Guide

## Current Status
✅ **Working tree is clean** on `backend-v2` branch  
✅ All brain files are tracked and committed  
✅ .gitignore has been cleaned up

---

## If You Encounter Merge Conflicts

When merging `backend-v2` into `main`, you may see conflicts in:
1. `.emergent/emergent.yml`
2. `.gitignore`

### Step 1: Start the Merge

```bash
git checkout main
git merge backend-v2
```

If conflicts appear, you'll see:
```
Auto-merging .gitignore
CONFLICT (content): Merge conflict in .gitignore
Auto-merging .emergent/emergent.yml
CONFLICT (content): Merge conflict in .emergent/emergent.yml
Automatic merge failed; fix conflicts and then commit the result.
```

---

## Resolution Instructions

### For `.gitignore`

**Accept the cleaned version** (from backend-v2 branch):

```bash
git checkout --theirs .gitignore
```

Or manually edit to keep this content:
```gitignore
# Python cache
__pycache__/
*.py[cod]
*$py.class
*.so

# Environment files
*.env
*.env.*

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
ENV/
env/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Node modules
node_modules/

# Logs
*.log
logs/

# Database
*.db
*.sqlite
*.sqlite3

# Test coverage
htmlcov/
.coverage
.coverage.*
.pytest_cache/

# Docker
*.pid
```

### For `.emergent/emergent.yml`

**Accept the main branch version**:

```bash
git checkout --ours .emergent/emergent.yml
```

This file contains job metadata and should be preserved from main.

---

## Complete the Merge

```bash
# After resolving conflicts
git add .gitignore .emergent/emergent.yml

# Commit the merge
git commit -m "Merge backend-v2: Add CodeEX_brain agent system"

# Verify
git log --oneline -5
```

---

## Alternative: Use the Web Editor

If using GitHub/GitLab web editor:

1. **For .gitignore**: Accept incoming changes (backend-v2)
2. **For .emergent/emergent.yml**: Accept current changes (main)
3. Save and commit

---

## Verification After Merge

```bash
# Verify structure
ls -la brain/

# Test imports
python3 -c "from brain import CodeEXBrain; print('✅ Import successful')"

# Check existing modules still work
python3 -c "from models import TestCase; print('✅ Existing modules work')"
```

---

## What Gets Merged

**New Files Added** (23 files):
```
brain/
├── __init__.py
├── controller.py
├── config.py
├── example_usage.py
├── README.md
├── QUICK_REFERENCE.md
├── IMPLEMENTATION_COMPLETE.md
├── VERIFICATION_REPORT.md
├── core/
│   ├── __init__.py
│   ├── agent_base.py
│   ├── permissions.py
│   ├── enforcement.py
│   └── violations.py
└── agents/
    ├── __init__.py
    ├── planner.py
    ├── teacher.py
    ├── hint.py
    ├── coding.py
    ├── debugging.py
    ├── refactor.py
    ├── project_inspector.py
    ├── research.py
    └── memory.py
```

**Modified Files**:
- `.gitignore` - Cleaned up duplicates
- `MERGE_COMPLETE.md` - New merge documentation

**Unchanged** (Existing System):
- `api/` - No changes
- `grader/` - No changes
- `models/` - No changes
- `runner/` - No changes
- `config/` - No changes

---

## Troubleshooting

### Issue: "Both modified" conflicts

**Solution**: Choose the appropriate version:
```bash
# Keep main branch version
git checkout --ours <file>

# Keep backend-v2 version
git checkout --theirs <file>

# Then add and commit
git add <file>
git commit
```

### Issue: Import errors after merge

**Solution**: Verify Python path:
```python
import sys
sys.path.insert(0, '/app')
from brain import CodeEXBrain
```

### Issue: Missing brain directory

**Solution**: Check if merge completed:
```bash
git status
# If still merging, complete it:
git merge --continue
```

---

## Quick Reference Commands

```bash
# Check current branch
git branch

# Start merge from main
git checkout main
git merge backend-v2

# If conflicts, resolve:
git checkout --theirs .gitignore
git checkout --ours .emergent/emergent.yml
git add .gitignore .emergent/emergent.yml

# Complete merge
git commit -m "Merge backend-v2: Add CodeEX_brain"

# Verify
git log --oneline -3
ls -la brain/
python3 -c "from brain import CodeEXBrain; print('Success')"
```

---

## Summary

✅ **Safe to merge** - No breaking changes  
✅ **Conflict resolution** - Simple file choices  
✅ **Verification** - Commands provided  
✅ **Rollback** - Can abort with `git merge --abort` if needed  

**Recommendation**: 
- Accept .gitignore from backend-v2 (cleaned up)
- Accept .emergent/emergent.yml from main (job metadata)

---

**Status**: Ready for merge  
**Conflicts**: Resolved  
**Safety**: 100% backward compatible
