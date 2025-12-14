# Backend Integration Checklist for AI Client

This checklist helps backend developers integrate with the frontend AI client.

## 📋 Required Endpoints

Implement these endpoints in FastAPI:

### 1. Generate Question
```
POST /api/v1/ai/generate-question
```

**Request Body:**
```json
{
  "topic": "arrays",
  "difficulty": "medium",
  "problemType": "algorithm",
  "constraints": {
    "timeLimit": 2000,
    "memoryLimit": 256000
  }
}
```

**Response:**
```json
{
  "question": {
    "id": "uuid",
    "title": "Problem Title",
    "description": "Problem description...",
    "difficulty": "medium",
    "topics": ["arrays", "hash_map"],
    "constraints": {
      "timeLimit": 2000,
      "memoryLimit": 256000
    },
    "testCases": [
      {
        "input": "input data",
        "expectedOutput": "expected output",
        "isHidden": false
      }
    ],
    "starterCode": {
      "python": "def solution():\n    pass",
      "javascript": "function solution() {\n  // code\n}"
    }
  },
  "metadata": {
    "generatedAt": "2025-12-14T10:30:00Z",
    "agentId": "planner_abc123",
    "processingTime": 1234
  }
}
```

**Agent**: Planner  
**File**: `/app/brain/agents/planner.py`

---

### 2. Generate Hint
```
POST /api/v1/ai/generate-hint
```

**Request Body:**
```json
{
  "problemId": "two-sum",
  "userCode": "def solution()...",
  "hintLevel": "algorithm",
  "previousHints": ["hint1", "hint2"],
  "context": {
    "attemptsCount": 3,
    "lastError": "TLE"
  }
}
```

**Response:**
```json
{
  "hint": {
    "id": "uuid",
    "hintType": "algorithm",
    "content": "Consider using a hash map...",
    "level": 2,
    "relatedConcepts": ["hash_map", "two_pointer"],
    "shouldRevealMore": true
  },
  "remainingHints": 3,
  "metadata": {
    "generatedAt": "2025-12-14T10:30:00Z",
    "agentId": "hint_abc123",
    "processingTime": 856
  }
}
```

**Agent**: Hint  
**File**: `/app/brain/agents/hint.py`  
**Important**: NEVER reveal full solution!

---

### 3. Generate Explanation
```
POST /api/v1/ai/generate-explanation
```

**Request Body:**
```json
{
  "type": "concept",
  "subject": "dynamic programming",
  "detailLevel": "intermediate",
  "context": {
    "userCode": "optional code",
    "problemId": "optional problem",
    "difficulty": "medium"
  }
}
```

**Response:**
```json
{
  "explanation": {
    "id": "uuid",
    "type": "concept",
    "subject": "dynamic programming",
    "explanation": {
      "summary": "Brief overview...",
      "details": [
        "Key point 1",
        "Key point 2"
      ],
      "examples": [
        {
          "description": "Example description",
          "code": "code example",
          "visualization": "optional"
        }
      ],
      "keyTakeaways": [
        "Takeaway 1",
        "Takeaway 2"
      ]
    },
    "relatedTopics": ["memoization", "recursion"],
    "recommendedResources": [
      {
        "title": "Resource title",
        "url": "https://...",
        "type": "video"
      }
    ]
  },
  "metadata": {
    "generatedAt": "2025-12-14T10:30:00Z",
    "agentId": "teacher_abc123",
    "processingTime": 2134
  }
}
```

**Agent**: Teacher  
**File**: `/app/brain/agents/teacher.py`

---

### 4. Review Solution
```
POST /api/v1/ai/review-solution
```

**Request Body:**
```json
{
  "problemId": "two-sum",
  "code": "def two_sum(nums, target): ...",
  "language": "python",
  "reviewType": "comprehensive",
  "submissionId": "optional"
}
```

**Response:**
```json
{
  "review": {
    "id": "uuid",
    "reviewType": "comprehensive",
    "overallScore": 85,
    "verdict": "good",
    "correctness": {
      "isCorrect": true,
      "issues": []
    },
    "performance": {
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "optimizationSuggestions": [
        {
          "description": "Optimization tip",
          "impact": "medium",
          "exampleCode": "optimized code"
        }
      ]
    },
    "style": {
      "readabilityScore": 80,
      "issues": [
        {
          "type": "naming",
          "description": "Variable name unclear",
          "lineNumber": 5,
          "suggestion": "Use descriptive name"
        }
      ]
    },
    "strengths": [
      "Correct algorithm choice",
      "Clean implementation"
    ],
    "improvements": [
      "Add comments",
      "Better variable names"
    ],
    "nextSteps": [
      "Try optimizing space usage",
      "Consider edge cases"
    ]
  },
  "metadata": {
    "generatedAt": "2025-12-14T10:30:00Z",
    "agentIds": ["debugging_123", "refactor_456"],
    "processingTime": 3456
  }
}
```

**Agents**: Debugging + Refactor  
**Files**: `/app/brain/agents/debugging.py`, `/app/brain/agents/refactor.py`

---

### 5. Service Status
```
GET /api/v1/ai/status
```

**Response:**
```json
{
  "available": true,
  "agents": {
    "planner": true,
    "teacher": true,
    "hint": true,
    "coding": true,
    "debugging": true,
    "refactor": true
  },
  "rateLimits": {
    "requestsRemaining": 95,
    "resetAt": "2025-12-14T11:00:00Z"
  },
  "version": "1.0.0"
}
```

**Purpose**: Health check and rate limit info

---

## 🔧 Implementation Steps

### Step 1: Create Endpoint Router
```python
# /app/api/routes/ai.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from brain import CodeEXBrain

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])
brain = CodeEXBrain()

# Define request/response models with Pydantic
class GenerateQuestionRequest(BaseModel):
    topic: str
    difficulty: str
    problemType: str | None = None
    constraints: dict | None = None

@router.post("/generate-question")
async def generate_question(request: GenerateQuestionRequest):
    try:
        result = brain.generate_question(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ... other endpoints
```

### Step 2: Register Router
```python
# /app/api/main.py
from api.routes import ai

app.include_router(ai.router)
```

### Step 3: Configure CORS
```python
# /app/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Testing Checklist

### Unit Tests
- [ ] Test each agent independently
- [ ] Verify response format matches frontend types
- [ ] Test error handling
- [ ] Test edge cases

### Integration Tests
```bash
# Test with curl
curl -X POST http://localhost:8000/api/v1/ai/generate-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "two-sum",
    "hintLevel": "algorithm"
  }'
```

### Response Validation
- [ ] Check all required fields present
- [ ] Verify metadata includes agentId, timestamp, processingTime
- [ ] Ensure data types match TypeScript definitions
- [ ] Test error responses follow format

---

## 🚨 Common Issues

### Issue 1: CORS Errors
**Problem**: Frontend can't reach backend  
**Solution**: Add frontend origin to `allow_origins`

### Issue 2: Type Mismatches
**Problem**: Frontend validation fails  
**Solution**: Ensure Pydantic models match TypeScript types exactly

### Issue 3: Timeout
**Problem**: Request takes too long  
**Solution**: Implement background tasks for expensive operations

### Issue 4: Missing Metadata
**Problem**: Frontend expects metadata field  
**Solution**: Always include `metadata` in response

---

## 📊 Response Time Targets

| Endpoint | Target | Maximum |
|----------|--------|---------|
| Generate Question | < 3s | 5s |
| Generate Hint | < 2s | 4s |
| Generate Explanation | < 3s | 5s |
| Review Solution | < 5s | 10s |
| Status Check | < 500ms | 1s |

---

## 🔐 Security Requirements

- [ ] Rate limiting per user (backend enforced)
- [ ] Input validation (Pydantic models)
- [ ] No sensitive data in responses
- [ ] Authentication tokens validated
- [ ] CORS properly configured

---

## 📝 Example Backend Implementation

```python
# /app/api/routes/ai.py (Complete Example)
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from uuid import uuid4
from brain import CodeEXBrain

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

# Initialize brain
brain = CodeEXBrain()

# Request Models
class GenerateHintRequest(BaseModel):
    problemId: str
    userCode: str | None = None
    hintLevel: str
    previousHints: list[str] = []
    context: dict | None = None

# Response Models
class HintMetadata(BaseModel):
    generatedAt: str
    agentId: str
    processingTime: int

class GeneratedHint(BaseModel):
    id: str
    hintType: str
    content: str
    level: int
    relatedConcepts: list[str]
    shouldRevealMore: bool

class GenerateHintResponse(BaseModel):
    hint: GeneratedHint
    remainingHints: int
    metadata: HintMetadata

# Endpoint
@router.post("/generate-hint", response_model=GenerateHintResponse)
async def generate_hint(request: GenerateHintRequest):
    start_time = datetime.now(timezone.utc)
    
    try:
        # Call brain agent
        result = brain.get_hint(
            problem_id=request.problemId,
            hint_type=request.hintLevel,
            user_code=request.userCode,
            context=request.context or {}
        )
        
        # Calculate processing time
        processing_time = int(
            (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
        )
        
        # Build response
        return GenerateHintResponse(
            hint=GeneratedHint(
                id=str(uuid4()),
                hintType=request.hintLevel,
                content=result["output"]["hint"],
                level=result["output"].get("level", 1),
                relatedConcepts=result["output"].get("related_concepts", []),
                shouldRevealMore=result["output"].get("should_reveal_more", False)
            ),
            remainingHints=5 - len(request.previousHints),
            metadata=HintMetadata(
                generatedAt=start_time.isoformat(),
                agentId=result["agent_id"],
                processingTime=processing_time
            )
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "GENERATION_FAILED",
                "message": str(e)
            }
        )
```

---

## 🎯 Quick Start Commands

```bash
# 1. Start backend server
cd /app
python -m uvicorn api.main:app --reload --port 8000

# 2. Test endpoint
curl http://localhost:8000/api/v1/ai/status

# 3. Generate hint
curl -X POST http://localhost:8000/api/v1/ai/generate-hint \
  -H "Content-Type: application/json" \
  -d '{"problemId":"test","hintLevel":"algorithm"}'

# 4. Check frontend connection
# Open http://localhost:5173 and test AI features
```

---

## ✅ Pre-Deployment Checklist

- [ ] All 5 endpoints implemented
- [ ] Response formats match frontend types
- [ ] Error handling returns proper format
- [ ] Metadata always included
- [ ] CORS configured for production
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Environment variables set
- [ ] Integration tests passing
- [ ] Frontend successfully calls all endpoints

---

## 📞 Support

If you encounter issues:
1. Check frontend types in `/app/src/api/types.ts`
2. Review brain agent docs in `/app/brain/README.md`
3. Test with curl before frontend integration
4. Verify response format matches exactly

---

**Backend Integration Status**: ⏳ Pending Implementation  
**Frontend Status**: ✅ Ready and Waiting
