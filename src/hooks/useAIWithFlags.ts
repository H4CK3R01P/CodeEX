/**
 * AI Hooks with Feature Flag Support
 * 
 * Wraps the base AI hooks with feature flag checks and usage tracking.
 * Ensures AI is optional and failures don't block user flow.
 */

import { useCallback } from 'react';
import {
  useGenerateQuestion as useBaseGenerateQuestion,
  useGenerateHint as useBaseGenerateHint,
  useGenerateExplanation as useBaseGenerateExplanation,
  useReviewSolution as useBaseReviewSolution,
} from './useAI';
import {
  areHintsEnabled,
  areExplanationsEnabled,
  isSolutionReviewEnabled,
  isQuestionGenerationEnabled,
  aiUsage,
} from '@/config/aiFlags';
import type {
  GenerateQuestionRequest,
  GenerateHintRequest,
  GenerateExplanationRequest,
  ReviewSolutionRequest,
} from '@/api/types';

// ============================================================================
// useAIHint - Hint generation with feature flags
// ============================================================================

export function useAIHint(problemId: string) {
  const base = useBaseGenerateHint();
  const enabled = areHintsEnabled();
  const remaining = aiUsage.getRemainingHints(problemId);

  const generate = useCallback(
    async (request: GenerateHintRequest) => {
      // Check if feature is enabled
      if (!enabled) {
        throw new Error('Hint feature is not enabled');
      }

      // Check usage limit
      if (remaining <= 0) {
        throw new Error('You have reached the hint limit for this problem');
      }

      // Track usage
      if (!aiUsage.trackHint(problemId)) {
        throw new Error('Failed to track hint usage');
      }

      // Call base hook
      return base.generate(request);
    },
    [base, enabled, problemId, remaining]
  );

  return {
    ...base,
    generate,
    enabled,
    remaining,
    limitReached: remaining <= 0,
  };
}

// ============================================================================
// useAIExplanation - Explanation with feature flags
// ============================================================================

export function useAIExplanation() {
  const base = useBaseGenerateExplanation();
  const enabled = areExplanationsEnabled();
  const remaining = aiUsage.getRemainingExplanations();

  const generate = useCallback(
    async (request: GenerateExplanationRequest) => {
      // Check if feature is enabled
      if (!enabled) {
        throw new Error('Explanation feature is not enabled');
      }

      // Check usage limit
      if (remaining <= 0) {
        throw new Error('You have reached the explanation limit for today');
      }

      // Track usage
      if (!aiUsage.trackExplanation()) {
        throw new Error('Failed to track explanation usage');
      }

      // Call base hook
      return base.generate(request);
    },
    [base, enabled, remaining]
  );

  return {
    ...base,
    generate,
    enabled,
    remaining,
    limitReached: remaining <= 0,
  };
}

// ============================================================================
// useAIReview - Solution review with feature flags
// ============================================================================

export function useAIReview() {
  const base = useBaseReviewSolution();
  const enabled = isSolutionReviewEnabled();
  const remaining = aiUsage.getRemainingReviews();

  const review = useCallback(
    async (request: ReviewSolutionRequest) => {
      // Check if feature is enabled
      if (!enabled) {
        throw new Error('Solution review feature is not enabled');
      }

      // Check usage limit
      if (remaining <= 0) {
        throw new Error('You have reached the review limit for today');
      }

      // Track usage
      if (!aiUsage.trackReview()) {
        throw new Error('Failed to track review usage');
      }

      // Call base hook
      return base.review(request);
    },
    [base, enabled, remaining]
  );

  return {
    ...base,
    review,
    enabled,
    remaining,
    limitReached: remaining <= 0,
  };
}

// ============================================================================
// useAIQuestionGenerator - Question generation (admin only)
// ============================================================================

export function useAIQuestionGenerator() {
  const base = useBaseGenerateQuestion();
  const enabled = isQuestionGenerationEnabled();

  const generate = useCallback(
    async (request: GenerateQuestionRequest) => {
      // Check if feature is enabled
      if (!enabled) {
        throw new Error('Question generation is not enabled');
      }

      // Call base hook
      return base.generate(request);
    },
    [base, enabled]
  );

  return {
    ...base,
    generate,
    enabled,
  };
}

// ============================================================================
// useAISafely - Generic wrapper with error boundaries
// ============================================================================

/**
 * Safely execute an AI operation with graceful error handling
 * 
 * This ensures AI failures never block the user flow:
 * - Catches all errors
 * - Provides user-friendly messages
 * - Logs errors for debugging
 * - Returns null on failure (not throwing)
 */
export function useAISafely<T>(
  operation: () => Promise<T>,
  fallback: T | null = null
) {
  const execute = useCallback(async (): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      // Log error for debugging
      console.warn('[AI] Operation failed gracefully:', error);
      
      // Return fallback instead of throwing
      return fallback;
    }
  }, [operation, fallback]);

  return { execute };
}
