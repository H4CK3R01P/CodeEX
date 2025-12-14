/**
 * CodeEX AI Client
 * 
 * Clean service layer for consuming CodeEX AI backend.
 * 
 * RULES:
 * - NO AI logic in frontend
 * - NO direct Emergent calls
 * - ONLY backend API calls
 * - Handles loading, error, and success states
 * - Typed request/response with validation
 */

import {
  type ApiResponse,
  type ApiError,
  type GenerateQuestionRequest,
  type GenerateQuestionResponse,
  type GenerateHintRequest,
  type GenerateHintResponse,
  type GenerateExplanationRequest,
  type GenerateExplanationResponse,
  type ReviewSolutionRequest,
  type ReviewSolutionResponse,
  type AIServiceStatus,
  type LoadingState,
  type AIRequestState,
  isApiError,
  isGenerateQuestionResponse,
  isGenerateHintResponse,
  isGenerateExplanationResponse,
  isReviewSolutionResponse,
} from './types';

// ============================================================================
// Configuration
// ============================================================================

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1/ai';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

// ============================================================================
// Error Classes
// ============================================================================

export class AIClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AIClientError';
  }
}

export class AITimeoutError extends AIClientError {
  constructor(endpoint: string) {
    super(
      `Request to ${endpoint} timed out`,
      'TIMEOUT',
      { endpoint }
    );
    this.name = 'AITimeoutError';
  }
}

export class AINetworkError extends AIClientError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'AINetworkError';
  }
}

export class AIValidationError extends AIClientError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'AIValidationError';
  }
}

// ============================================================================
// Request Configuration
// ============================================================================

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// ============================================================================
// AI Client Class
// ============================================================================

class AIClient {
  private baseUrl: string;

  constructor(baseUrl: string = AI_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Internal method to make HTTP requests with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = DEFAULT_TIMEOUT,
      retries = MAX_RETRIES,
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          const error: ApiError = {
            code: data.code || `HTTP_${response.status}`,
            message: data.error || data.message || response.statusText,
            details: data.details,
          };

          return {
            success: false,
            error: error.message,
          };
        }

        return {
          success: true,
          data: data as T,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
          clearTimeout(timeoutId);
          throw new AITimeoutError(endpoint);
        }

        // Exponential backoff for retries
        if (attempt < retries) {
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    clearTimeout(timeoutId);
    throw new AINetworkError(lastError?.message || 'Request failed after retries');
  }

  /**
   * Validate response using type guard
   */
  private validateResponse<T>(
    data: unknown,
    guard: (data: unknown) => data is T,
    errorMessage: string
  ): T {
    if (!guard(data)) {
      throw new AIValidationError(errorMessage, { received: data });
    }
    return data;
  }

  // ==========================================================================
  // Public API Methods
  // ==========================================================================

  /**
   * Generate a coding question using AI (Planner Agent)
   * 
   * @param request - Question generation parameters
   * @returns Generated question with test cases
   */
  async generateQuestion(
    request: GenerateQuestionRequest
  ): Promise<GenerateQuestionResponse> {
    const response = await this.makeRequest<GenerateQuestionResponse>(
      '/generate-question',
      {
        method: 'POST',
        body: request,
      }
    );

    if (!response.success || !response.data) {
      throw new AIClientError(
        response.error || 'Failed to generate question',
        'GENERATION_FAILED'
      );
    }

    return this.validateResponse(
      response.data,
      isGenerateQuestionResponse,
      'Invalid question response format'
    );
  }

  /**
   * Generate a progressive hint using AI (Hint Agent)
   * 
   * @param request - Hint generation parameters
   * @returns Generated hint (never reveals full solution)
   */
  async generateHint(
    request: GenerateHintRequest
  ): Promise<GenerateHintResponse> {
    const response = await this.makeRequest<GenerateHintResponse>(
      '/generate-hint',
      {
        method: 'POST',
        body: request,
      }
    );

    if (!response.success || !response.data) {
      throw new AIClientError(
        response.error || 'Failed to generate hint',
        'GENERATION_FAILED'
      );
    }

    return this.validateResponse(
      response.data,
      isGenerateHintResponse,
      'Invalid hint response format'
    );
  }

  /**
   * Generate educational explanation using AI (Teacher Agent)
   * 
   * @param request - Explanation parameters
   * @returns Educational content with examples
   */
  async generateExplanation(
    request: GenerateExplanationRequest
  ): Promise<GenerateExplanationResponse> {
    const response = await this.makeRequest<GenerateExplanationResponse>(
      '/generate-explanation',
      {
        method: 'POST',
        body: request,
      }
    );

    if (!response.success || !response.data) {
      throw new AIClientError(
        response.error || 'Failed to generate explanation',
        'GENERATION_FAILED'
      );
    }

    return this.validateResponse(
      response.data,
      isGenerateExplanationResponse,
      'Invalid explanation response format'
    );
  }

  /**
   * Review a code solution using AI (Debugging + Refactor Agents)
   * 
   * @param request - Solution review parameters
   * @returns Comprehensive code review with suggestions
   */
  async reviewSolution(
    request: ReviewSolutionRequest
  ): Promise<ReviewSolutionResponse> {
    const response = await this.makeRequest<ReviewSolutionResponse>(
      '/review-solution',
      {
        method: 'POST',
        body: request,
        timeout: 45000, // Longer timeout for comprehensive review
      }
    );

    if (!response.success || !response.data) {
      throw new AIClientError(
        response.error || 'Failed to review solution',
        'REVIEW_FAILED'
      );
    }

    return this.validateResponse(
      response.data,
      isReviewSolutionResponse,
      'Invalid review response format'
    );
  }

  /**
   * Check AI service availability and status
   * 
   * @returns Service status including agent availability
   */
  async checkStatus(): Promise<AIServiceStatus> {
    const response = await this.makeRequest<AIServiceStatus>('/status', {
      timeout: 5000, // Short timeout for health check
    });

    if (!response.success || !response.data) {
      throw new AIClientError(
        'AI service unavailable',
        'SERVICE_UNAVAILABLE'
      );
    }

    return response.data;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const aiClient = new AIClient();

// ============================================================================
// React Hook Helper (State Management)
// ============================================================================

/**
 * Create an initial request state
 */
export function createInitialState<T>(): AIRequestState<T> {
  return {
    state: 'idle',
    data: null,
    error: null,
    timestamp: null,
  };
}

/**
 * Update state to loading
 */
export function setLoading<T>(prevState: AIRequestState<T>): AIRequestState<T> {
  return {
    ...prevState,
    state: 'loading',
    error: null,
  };
}

/**
 * Update state to success
 */
export function setSuccess<T>(data: T): AIRequestState<T> {
  return {
    state: 'success',
    data,
    error: null,
    timestamp: Date.now(),
  };
}

/**
 * Update state to error
 */
export function setError<T>(error: Error): AIRequestState<T> {
  const apiError: ApiError = isApiError(error)
    ? error
    : {
        code: error instanceof AIClientError ? error.code : 'UNKNOWN_ERROR',
        message: error.message,
        details: error instanceof AIClientError ? error.details : undefined,
      };

  return {
    state: 'error',
    data: null,
    error: apiError,
    timestamp: Date.now(),
  };
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const ai = {
  /**
   * Generate a coding question
   */
  generateQuestion: (request: GenerateQuestionRequest) =>
    aiClient.generateQuestion(request),

  /**
   * Generate a progressive hint
   */
  generateHint: (request: GenerateHintRequest) =>
    aiClient.generateHint(request),

  /**
   * Generate educational explanation
   */
  generateExplanation: (request: GenerateExplanationRequest) =>
    aiClient.generateExplanation(request),

  /**
   * Review code solution
   */
  reviewSolution: (request: ReviewSolutionRequest) =>
    aiClient.reviewSolution(request),

  /**
   * Check service status
   */
  checkStatus: () =>
    aiClient.checkStatus(),
};

export default ai;
