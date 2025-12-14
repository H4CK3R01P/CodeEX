/**
 * Type definitions for CodeEX AI Backend API (v1)
 * 
 * These types match the backend brain agent system.
 * NO AI logic exists in frontend - all intelligence is backend-driven.
 */

// ============================================================================
// Base Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Question Generation (Planner Agent)
// ============================================================================

export interface GenerateQuestionRequest {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problemType?: 'algorithm' | 'data_structure' | 'system_design' | 'debugging';
  constraints?: {
    timeLimit?: number; // milliseconds
    memoryLimit?: number; // KB
  };
}

export interface GeneratedQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  constraints: {
    timeLimit: number;
    memoryLimit: number;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }[];
  starterCode?: {
    python?: string;
    javascript?: string;
    cpp?: string;
    java?: string;
  };
}

export interface GenerateQuestionResponse {
  question: GeneratedQuestion;
  metadata: {
    generatedAt: string;
    agentId: string;
    processingTime: number;
  };
}

// ============================================================================
// Hint Generation (Hint Agent)
// ============================================================================

export interface GenerateHintRequest {
  problemId: string;
  userCode?: string;
  hintLevel: 'algorithm' | 'syntax' | 'edge_case' | 'optimization';
  previousHints?: string[];
  context?: {
    attemptsCount?: number;
    lastError?: string;
  };
}

export interface GeneratedHint {
  id: string;
  hintType: 'algorithm' | 'syntax' | 'edge_case' | 'optimization';
  content: string;
  level: number; // Progressive hint levels (1 = subtle, 5 = explicit)
  relatedConcepts: string[];
  shouldRevealMore: boolean;
}

export interface GenerateHintResponse {
  hint: GeneratedHint;
  remainingHints: number;
  metadata: {
    generatedAt: string;
    agentId: string;
    processingTime: number;
  };
}

// ============================================================================
// Explanation Generation (Teacher Agent)
// ============================================================================

export interface GenerateExplanationRequest {
  type: 'concept' | 'algorithm' | 'complexity' | 'error' | 'approach';
  subject: string; // e.g., "dynamic programming", "binary search"
  context?: {
    userCode?: string;
    problemId?: string;
    difficulty?: string;
  };
  detailLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface GeneratedExplanation {
  id: string;
  type: 'concept' | 'algorithm' | 'complexity' | 'error' | 'approach';
  subject: string;
  explanation: {
    summary: string;
    details: string[];
    examples: {
      description: string;
      code?: string;
      visualization?: string;
    }[];
    keyTakeaways: string[];
  };
  relatedTopics: string[];
  recommendedResources?: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'practice';
  }[];
}

export interface GenerateExplanationResponse {
  explanation: GeneratedExplanation;
  metadata: {
    generatedAt: string;
    agentId: string;
    processingTime: number;
  };
}

// ============================================================================
// Solution Review (Debugging + Refactor Agents)
// ============================================================================

export interface ReviewSolutionRequest {
  problemId: string;
  code: string;
  language: 'python' | 'javascript' | 'cpp' | 'java';
  reviewType: 'correctness' | 'performance' | 'style' | 'comprehensive';
  submissionId?: string; // If reviewing after submission
}

export interface SolutionReview {
  id: string;
  reviewType: 'correctness' | 'performance' | 'style' | 'comprehensive';
  overallScore: number; // 0-100
  verdict: 'excellent' | 'good' | 'needs_improvement' | 'incorrect';
  
  correctness?: {
    isCorrect: boolean;
    issues: {
      type: 'logic_error' | 'edge_case' | 'algorithm_choice';
      severity: 'critical' | 'major' | 'minor';
      description: string;
      lineNumber?: number;
      suggestion: string;
    }[];
  };
  
  performance?: {
    timeComplexity: string;
    spaceComplexity: string;
    optimizationSuggestions: {
      description: string;
      impact: 'high' | 'medium' | 'low';
      exampleCode?: string;
    }[];
  };
  
  style?: {
    readabilityScore: number; // 0-100
    issues: {
      type: 'naming' | 'structure' | 'comments' | 'formatting';
      description: string;
      lineNumber?: number;
      suggestion: string;
    }[];
  };
  
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

export interface ReviewSolutionResponse {
  review: SolutionReview;
  metadata: {
    generatedAt: string;
    agentIds: string[]; // Multiple agents may contribute
    processingTime: number;
  };
}

// ============================================================================
// AI Service Status
// ============================================================================

export interface AIServiceStatus {
  available: boolean;
  agents: {
    planner: boolean;
    teacher: boolean;
    hint: boolean;
    coding: boolean;
    debugging: boolean;
    refactor: boolean;
  };
  rateLimits?: {
    requestsRemaining: number;
    resetAt: string;
  };
  version: string;
}

// ============================================================================
// Loading States
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AIRequestState<T> {
  state: LoadingState;
  data: T | null;
  error: ApiError | null;
  timestamp: number | null;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

export function isGenerateQuestionResponse(data: unknown): data is GenerateQuestionResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'question' in data &&
    'metadata' in data
  );
}

export function isGenerateHintResponse(data: unknown): data is GenerateHintResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'hint' in data &&
    'metadata' in data
  );
}

export function isGenerateExplanationResponse(data: unknown): data is GenerateExplanationResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'explanation' in data &&
    'metadata' in data
  );
}

export function isReviewSolutionResponse(data: unknown): data is ReviewSolutionResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'review' in data &&
    'metadata' in data
  );
}
