# CodeEX AI Client

Clean service layer for consuming the CodeEX AI backend.

## 📋 Overview

This API client provides a type-safe, easy-to-use interface for all AI-powered features in CodeEX. All AI logic lives in the backend - the frontend simply calls APIs and displays results.

## 🎯 Core Principles

- ✅ **NO AI logic in frontend** - All intelligence is backend-driven
- ✅ **NO direct Emergent calls** - Only backend API calls
- ✅ **Type-safe** - Full TypeScript support with validation
- ✅ **State management** - Built-in loading/error/success states
- ✅ **Error handling** - Comprehensive error types and retry logic
- ✅ **React-ready** - Custom hooks for easy integration

## 📁 Files

```
src/api/
├── types.ts          # TypeScript type definitions
├── aiClient.ts       # Main AI client implementation
└── README.md         # This file

src/hooks/
└── useAI.ts          # React hooks for AI features
```

## 🚀 Quick Start

### Basic Usage (Direct Client)

```typescript
import { ai } from '@/api/aiClient';

// Generate a hint
try {
  const response = await ai.generateHint({
    problemId: 'two-sum',
    hintLevel: 'algorithm',
    previousHints: [],
  });
  
  console.log(response.hint.content);
} catch (error) {
  console.error('Failed to generate hint:', error);
}
```

### React Hook Usage (Recommended)

```typescript
import { useGenerateHint } from '@/hooks/useAI';

function HintButton({ problemId }: { problemId: string }) {
  const { generate, isLoading, data, error } = useGenerateHint();

  const handleGetHint = async () => {
    try {
      await generate({
        problemId,
        hintLevel: 'algorithm',
      });
    } catch (err) {
      // Error is already in state
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleGetHint} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Get Hint'}
      </button>
      
      {error && <p className="error">{error.message}</p>}
      
      {data && (
        <div className="hint">
          <h3>Hint Level {data.hint.level}</h3>
          <p>{data.hint.content}</p>
        </div>
      )}
    </div>
  );
}
```

## 📚 API Methods

### 1. Generate Question

Create a new coding problem with AI.

```typescript
import { ai } from '@/api/aiClient';
import type { GenerateQuestionRequest } from '@/api/types';

const request: GenerateQuestionRequest = {
  topic: 'arrays',
  difficulty: 'medium',
  problemType: 'algorithm',
  constraints: {
    timeLimit: 2000,    // 2 seconds
    memoryLimit: 256000 // 256 MB
  }
};

const response = await ai.generateQuestion(request);

console.log(response.question.title);
console.log(response.question.description);
console.log(response.question.testCases);
```

**Using Hook:**

```typescript
import { useGenerateQuestion } from '@/hooks/useAI';

function QuestionGenerator() {
  const { generate, isLoading, data, error } = useGenerateQuestion();
  
  // ... implementation
}
```

### 2. Generate Hint

Get a progressive hint without revealing the solution.

```typescript
import { ai } from '@/api/aiClient';

const response = await ai.generateHint({
  problemId: 'two-sum',
  hintLevel: 'algorithm',     // 'algorithm' | 'syntax' | 'edge_case' | 'optimization'
  userCode: 'def two_sum(nums, target): ...',
  previousHints: ['hint1', 'hint2'],
  context: {
    attemptsCount: 3,
    lastError: 'Time Limit Exceeded'
  }
});

console.log(response.hint.content);
console.log(response.hint.level);           // Progressive level 1-5
console.log(response.remainingHints);       // How many hints left
```

**Using Hook:**

```typescript
import { useGenerateHint } from '@/hooks/useAI';

function HintSystem({ problemId }: { problemId: string }) {
  const { generate, isLoading, data } = useGenerateHint();
  
  const getHint = async (level: 'algorithm' | 'syntax' | 'edge_case') => {
    await generate({
      problemId,
      hintLevel: level,
    });
  };
  
  return (
    <div>
      <button onClick={() => getHint('algorithm')}>
        Algorithm Hint
      </button>
      {data && <p>{data.hint.content}</p>}
    </div>
  );
}
```

### 3. Generate Explanation

Get educational content about concepts, algorithms, or errors.

```typescript
import { ai } from '@/api/aiClient';

const response = await ai.generateExplanation({
  type: 'concept',              // 'concept' | 'algorithm' | 'complexity' | 'error' | 'approach'
  subject: 'dynamic programming',
  detailLevel: 'beginner',      // 'beginner' | 'intermediate' | 'advanced'
  context: {
    problemId: 'fibonacci',
    difficulty: 'medium'
  }
});

console.log(response.explanation.summary);
console.log(response.explanation.details);
console.log(response.explanation.examples);
console.log(response.explanation.keyTakeaways);
```

**Using Hook:**

```typescript
import { useGenerateExplanation } from '@/hooks/useAI';

function ConceptExplainer({ concept }: { concept: string }) {
  const { generate, isLoading, data } = useGenerateExplanation();
  
  useEffect(() => {
    generate({
      type: 'concept',
      subject: concept,
      detailLevel: 'intermediate'
    });
  }, [concept]);
  
  if (isLoading) return <div>Loading explanation...</div>;
  if (!data) return null;
  
  return (
    <div>
      <h2>{data.explanation.subject}</h2>
      <p>{data.explanation.summary}</p>
      {data.explanation.examples.map((ex, i) => (
        <div key={i}>
          <p>{ex.description}</p>
          <code>{ex.code}</code>
        </div>
      ))}
    </div>
  );
}
```

### 4. Review Solution

Get comprehensive code review with suggestions.

```typescript
import { ai } from '@/api/aiClient';

const response = await ai.reviewSolution({
  problemId: 'two-sum',
  code: 'def two_sum(nums, target): ...',
  language: 'python',
  reviewType: 'comprehensive',  // 'correctness' | 'performance' | 'style' | 'comprehensive'
  submissionId: 'sub_12345'     // Optional
});

console.log(response.review.verdict);          // 'excellent' | 'good' | 'needs_improvement' | 'incorrect'
console.log(response.review.overallScore);     // 0-100
console.log(response.review.correctness);
console.log(response.review.performance);
console.log(response.review.style);
console.log(response.review.improvements);
```

**Using Hook:**

```typescript
import { useReviewSolution } from '@/hooks/useAI';

function CodeReviewer({ code, problemId }: Props) {
  const { review, isLoading, data } = useReviewSolution();
  
  const handleReview = async () => {
    await review({
      problemId,
      code,
      language: 'python',
      reviewType: 'comprehensive'
    });
  };
  
  return (
    <div>
      <button onClick={handleReview} disabled={isLoading}>
        Review My Code
      </button>
      
      {data && (
        <div className="review">
          <h3>Overall Score: {data.review.overallScore}/100</h3>
          <p>Verdict: {data.review.verdict}</p>
          
          <h4>Strengths:</h4>
          <ul>
            {data.review.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          
          <h4>Improvements:</h4>
          <ul>
            {data.review.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### 5. Check Service Status

Verify AI service availability.

```typescript
import { ai } from '@/api/aiClient';

const status = await ai.checkStatus();

console.log(status.available);      // Overall availability
console.log(status.agents);         // Per-agent status
console.log(status.rateLimits);     // Rate limit info
console.log(status.version);        // API version
```

**Using Hook:**

```typescript
import { useAIStatus } from '@/hooks/useAI';

function AIStatusIndicator() {
  const { isAvailable, data, isLoading } = useAIStatus(true); // Auto-check on mount
  
  if (isLoading) return <div>Checking AI status...</div>;
  
  return (
    <div>
      <span className={isAvailable ? 'online' : 'offline'}>
        AI {isAvailable ? 'Available' : 'Unavailable'}
      </span>
      
      {data && (
        <div>
          <p>Version: {data.version}</p>
          <p>Requests remaining: {data.rateLimits?.requestsRemaining}</p>
        </div>
      )}
    </div>
  );
}
```

## 🔧 Advanced Usage

### Caching Expensive Operations

```typescript
import { useAIWithCache } from '@/hooks/useAI';
import { ai } from '@/api/aiClient';

function CachedExplanation({ concept }: { concept: string }) {
  const { execute, isLoading, data } = useAIWithCache(
    ai.generateExplanation,
    (req) => `explanation:${req.subject}:${req.detailLevel}`
  );
  
  useEffect(() => {
    execute({
      type: 'concept',
      subject: concept,
      detailLevel: 'intermediate'
    });
  }, [concept]);
  
  // Subsequent calls with same concept will use cache (5 min TTL)
}
```

### Batch Operations

```typescript
import { useAIBatch } from '@/hooks/useAI';
import { ai } from '@/api/aiClient';

function BatchHintGenerator({ problemIds }: { problemIds: string[] }) {
  const { executeBatch, loading, results, progress } = useAIBatch(
    ai.generateHint
  );
  
  const generateAll = async () => {
    const requests = problemIds.map(id => ({
      problemId: id,
      hintLevel: 'algorithm' as const
    }));
    
    await executeBatch(requests);
  };
  
  return (
    <div>
      <button onClick={generateAll} disabled={loading}>
        Generate All Hints
      </button>
      {loading && <progress value={progress} max={100} />}
      {results.map((result, i) => (
        result && <div key={i}>{result.hint.content}</div>
      ))}
    </div>
  );
}
```

## ⚠️ Error Handling

### Error Types

```typescript
import {
  AIClientError,
  AITimeoutError,
  AINetworkError,
  AIValidationError
} from '@/api/aiClient';

try {
  await ai.generateHint(request);
} catch (error) {
  if (error instanceof AITimeoutError) {
    console.log('Request timed out');
  } else if (error instanceof AINetworkError) {
    console.log('Network error occurred');
  } else if (error instanceof AIValidationError) {
    console.log('Invalid response format');
  } else if (error instanceof AIClientError) {
    console.log(`Error: ${error.code} - ${error.message}`);
  }
}
```

### Handling Errors in React

```typescript
function MyComponent() {
  const { generate, error, isError } = useGenerateHint();
  
  return (
    <div>
      {isError && (
        <div className="error">
          <h3>Error</h3>
          <p>{error?.message}</p>
          {error?.code && <code>Code: {error.code}</code>}
        </div>
      )}
    </div>
  );
}
```

## 🔒 Security Notes

1. **No API Keys in Frontend** - All authentication happens on backend
2. **No Direct LLM Calls** - Frontend only calls backend APIs
3. **Rate Limiting** - Handled by backend
4. **Input Validation** - Backend validates all inputs
5. **No Solution Leakage** - Hint agent never reveals full solutions

## 🌐 Environment Configuration

Create a `.env` file:

```env
# AI API Base URL
VITE_AI_API_URL=http://localhost:8000/api/v1/ai

# Or for production
# VITE_AI_API_URL=https://api.codex.com/v1/ai
```

## 📊 Type Safety

All requests and responses are fully typed:

```typescript
import type {
  GenerateQuestionRequest,
  GenerateQuestionResponse,
  GenerateHintRequest,
  GenerateHintResponse,
  // ... etc
} from '@/api/types';

// TypeScript will catch errors at compile time
const request: GenerateQuestionRequest = {
  topic: 'arrays',
  difficulty: 'easy',
  // TypeScript ensures all required fields are present
};
```

## 🧪 Testing

```typescript
import { ai } from '@/api/aiClient';

// Mock for testing
jest.mock('@/api/aiClient', () => ({
  ai: {
    generateHint: jest.fn().mockResolvedValue({
      hint: {
        id: 'hint1',
        content: 'Test hint',
        level: 1,
        // ...
      },
      metadata: { /* ... */ }
    })
  }
}));

// Use in tests
test('generates hint successfully', async () => {
  const response = await ai.generateHint({ /* ... */ });
  expect(response.hint.content).toBe('Test hint');
});
```

## 📖 Best Practices

1. **Always use hooks in React components** - They handle state management
2. **Handle all error states** - Display user-friendly messages
3. **Show loading indicators** - AI operations can take time
4. **Cache when appropriate** - Use `useAIWithCache` for repeated requests
5. **Validate user input** - Before sending to backend
6. **Log errors** - For debugging and monitoring
7. **Test error scenarios** - Network failures, timeouts, etc.

## 🚀 Next Steps

1. Implement backend endpoints (see `/app/brain/`)
2. Configure environment variables
3. Test with real backend
4. Add monitoring and analytics
5. Implement rate limiting on frontend

## 📞 Support

For questions about the AI client:
- Check type definitions in `types.ts`
- Review examples in this README
- Check backend documentation in `/app/brain/README.md`

---

**Status**: ✅ Frontend API client ready
**Backend**: Needs endpoint implementation in `/app/brain/`
**Version**: 1.0.0
