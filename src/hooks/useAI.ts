/**
 * React Hooks for AI Client
 * 
 * Provides easy-to-use hooks for AI features in React components.
 * Handles loading states, error handling, and caching automatically.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ai,
  createInitialState,
  setLoading,
  setSuccess,
  setError,
  type AIClientError,
} from '../api/aiClient';
import type {
  GenerateQuestionRequest,
  GenerateQuestionResponse,
  GenerateHintRequest,
  GenerateHintResponse,
  GenerateExplanationRequest,
  GenerateExplanationResponse,
  ReviewSolutionRequest,
  ReviewSolutionResponse,
  AIServiceStatus,
  AIRequestState,
} from '../api/types';

// ============================================================================
// useGenerateQuestion Hook
// ============================================================================

export function useGenerateQuestion() {
  const [state, setState] = useState<AIRequestState<GenerateQuestionResponse>>(
    createInitialState()
  );

  const generate = useCallback(async (request: GenerateQuestionRequest) => {
    setState(setLoading);

    try {
      const response = await ai.generateQuestion(request);
      setState(setSuccess(response));
      return response;
    } catch (error) {
      setState(setError(error as Error));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    ...state,
    generate,
    reset,
    isLoading: state.state === 'loading',
    isSuccess: state.state === 'success',
    isError: state.state === 'error',
  };
}

// ============================================================================
// useGenerateHint Hook
// ============================================================================

export function useGenerateHint() {
  const [state, setState] = useState<AIRequestState<GenerateHintResponse>>(
    createInitialState()
  );

  const generate = useCallback(async (request: GenerateHintRequest) => {
    setState(setLoading);

    try {
      const response = await ai.generateHint(request);
      setState(setSuccess(response));
      return response;
    } catch (error) {
      setState(setError(error as Error));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    ...state,
    generate,
    reset,
    isLoading: state.state === 'loading',
    isSuccess: state.state === 'success',
    isError: state.state === 'error',
  };
}

// ============================================================================
// useGenerateExplanation Hook
// ============================================================================

export function useGenerateExplanation() {
  const [state, setState] = useState<AIRequestState<GenerateExplanationResponse>>(
    createInitialState()
  );

  const generate = useCallback(async (request: GenerateExplanationRequest) => {
    setState(setLoading);

    try {
      const response = await ai.generateExplanation(request);
      setState(setSuccess(response));
      return response;
    } catch (error) {
      setState(setError(error as Error));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    ...state,
    generate,
    reset,
    isLoading: state.state === 'loading',
    isSuccess: state.state === 'success',
    isError: state.state === 'error',
  };
}

// ============================================================================
// useReviewSolution Hook
// ============================================================================

export function useReviewSolution() {
  const [state, setState] = useState<AIRequestState<ReviewSolutionResponse>>(
    createInitialState()
  );

  const review = useCallback(async (request: ReviewSolutionRequest) => {
    setState(setLoading);

    try {
      const response = await ai.reviewSolution(request);
      setState(setSuccess(response));
      return response;
    } catch (error) {
      setState(setError(error as Error));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    ...state,
    review,
    reset,
    isLoading: state.state === 'loading',
    isSuccess: state.state === 'success',
    isError: state.state === 'error',
  };
}

// ============================================================================
// useAIStatus Hook
// ============================================================================

export function useAIStatus(autoCheck: boolean = true) {
  const [state, setState] = useState<AIRequestState<AIServiceStatus>>(
    createInitialState()
  );
  const mounted = useRef(true);

  const checkStatus = useCallback(async () => {
    setState(setLoading);

    try {
      const response = await ai.checkStatus();
      if (mounted.current) {
        setState(setSuccess(response));
      }
      return response;
    } catch (error) {
      if (mounted.current) {
        setState(setError(error as Error));
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    if (autoCheck) {
      checkStatus();
    }

    return () => {
      mounted.current = false;
    };
  }, [autoCheck, checkStatus]);

  return {
    ...state,
    checkStatus,
    isLoading: state.state === 'loading',
    isSuccess: state.state === 'success',
    isError: state.state === 'error',
    isAvailable: state.data?.available ?? false,
  };
}

// ============================================================================
// useAIWithCache Hook (For expensive operations)
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useAIWithCache<TRequest, TResponse>(
  operation: (request: TRequest) => Promise<TResponse>,
  getCacheKey: (request: TRequest) => string
) {
  const [state, setState] = useState<AIRequestState<TResponse>>(
    createInitialState()
  );

  const execute = useCallback(
    async (request: TRequest, forceRefresh: boolean = false) => {
      const cacheKey = getCacheKey(request);

      // Check cache first
      if (!forceRefresh) {
        const cached = cache.get(cacheKey) as CacheEntry<TResponse> | undefined;
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setState(setSuccess(cached.data));
          return cached.data;
        }
      }

      setState(setLoading);

      try {
        const response = await operation(request);
        
        // Update cache
        cache.set(cacheKey, {
          data: response,
          timestamp: Date.now(),
        });

        setState(setSuccess(response));
        return response;
      } catch (error) {
        setState(setError(error as Error));
        throw error;
      }
    },
    [operation, getCacheKey]
  );

  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearCache,
    isLoading: state.state === 'loading',
    isSuccess: state.state === 'success',
    isError: state.state === 'error',
  };
}

// ============================================================================
// useAIBatch Hook (For multiple parallel requests)
// ============================================================================

export function useAIBatch<TRequest, TResponse>(
  operation: (request: TRequest) => Promise<TResponse>
) {
  const [state, setState] = useState<{
    loading: boolean;
    results: (TResponse | null)[];
    errors: (Error | null)[];
    completed: number;
    total: number;
  }>({
    loading: false,
    results: [],
    errors: [],
    completed: 0,
    total: 0,
  });

  const executeBatch = useCallback(
    async (requests: TRequest[]) => {
      setState({
        loading: true,
        results: new Array(requests.length).fill(null),
        errors: new Array(requests.length).fill(null),
        completed: 0,
        total: requests.length,
      });

      const promises = requests.map(async (request, index) => {
        try {
          const result = await operation(request);
          setState(prev => ({
            ...prev,
            results: prev.results.map((r, i) => (i === index ? result : r)),
            completed: prev.completed + 1,
          }));
          return result;
        } catch (error) {
          setState(prev => ({
            ...prev,
            errors: prev.errors.map((e, i) => (i === index ? error as Error : e)),
            completed: prev.completed + 1,
          }));
          return null;
        }
      });

      const results = await Promise.all(promises);

      setState(prev => ({
        ...prev,
        loading: false,
      }));

      return results;
    },
    [operation]
  );

  return {
    ...state,
    executeBatch,
    progress: state.total > 0 ? (state.completed / state.total) * 100 : 0,
    isComplete: state.completed === state.total && state.total > 0,
  };
}
