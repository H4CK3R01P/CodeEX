/**
 * Example Usage of CodeEX AI Client
 * 
 * This file demonstrates how to use the AI client in React components.
 * Copy and adapt these examples to your actual components.
 */

import React, { useState } from 'react';
import {
  useGenerateQuestion,
  useGenerateHint,
  useGenerateExplanation,
  useReviewSolution,
  useAIStatus,
} from '@/hooks/useAI';
import type {
  GenerateQuestionRequest,
  GenerateHintRequest,
  GenerateExplanationRequest,
  ReviewSolutionRequest,
} from './types';

// ============================================================================
// Example 1: Question Generator Component
// ============================================================================

export function QuestionGeneratorExample() {
  const { generate, isLoading, data, error, reset } = useGenerateQuestion();

  const handleGenerate = async () => {
    const request: GenerateQuestionRequest = {
      topic: 'arrays',
      difficulty: 'medium',
      problemType: 'algorithm',
      constraints: {
        timeLimit: 2000,
        memoryLimit: 256000,
      },
    };

    try {
      await generate(request);
    } catch (err) {
      console.error('Failed to generate question:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Question'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <h3 className="font-bold text-red-700">Error</h3>
          <p className="text-red-600">{error.message}</p>
          {error.code && <code className="text-sm">Code: {error.code}</code>}
        </div>
      )}

      {data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded space-y-3">
          <div>
            <h2 className="text-xl font-bold">{data.question.title}</h2>
            <span className="text-sm text-gray-600">
              Difficulty: {data.question.difficulty}
            </span>
          </div>

          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-700">{data.question.description}</p>
          </div>

          <div>
            <h3 className="font-semibold">Test Cases</h3>
            {data.question.testCases.map((tc, i) => (
              <div key={i} className="p-2 bg-white rounded border mt-2">
                <p>
                  <strong>Input:</strong> {tc.input}
                </p>
                <p>
                  <strong>Output:</strong> {tc.expectedOutput}
                </p>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            Generated in {data.metadata.processingTime}ms by{' '}
            {data.metadata.agentId}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 2: Hint System Component
// ============================================================================

export function HintSystemExample({ problemId }: { problemId: string }) {
  const { generate, isLoading, data, error } = useGenerateHint();
  const [previousHints, setPreviousHints] = useState<string[]>([]);

  const requestHint = async (
    level: 'algorithm' | 'syntax' | 'edge_case' | 'optimization'
  ) => {
    const request: GenerateHintRequest = {
      problemId,
      hintLevel: level,
      previousHints,
    };

    try {
      const response = await generate(request);
      setPreviousHints([...previousHints, response.hint.content]);
    } catch (err) {
      console.error('Failed to generate hint:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Need a Hint?</h2>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => requestHint('algorithm')}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Algorithm Hint
        </button>
        <button
          onClick={() => requestHint('syntax')}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Syntax Hint
        </button>
        <button
          onClick={() => requestHint('edge_case')}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          Edge Case Hint
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Generating hint...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-600">{error.message}</p>
        </div>
      )}

      {data && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-blue-700">Hint Level {data.hint.level}</h3>
            <span className="text-sm text-gray-600">
              {data.remainingHints} hints remaining
            </span>
          </div>

          <p className="text-gray-800">{data.hint.content}</p>

          {data.hint.relatedConcepts.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {data.hint.relatedConcepts.map((concept, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                >
                  {concept}
                </span>
              ))}
            </div>
          )}

          {data.hint.shouldRevealMore && (
            <p className="text-sm text-blue-600 italic">
              💡 More detailed hints are available if needed
            </p>
          )}
        </div>
      )}

      {previousHints.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Previous Hints</h3>
          <div className="space-y-2">
            {previousHints.map((hint, i) => (
              <div key={i} className="p-3 bg-gray-100 rounded text-sm">
                {hint}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Explanation Component
// ============================================================================

export function ConceptExplainerExample({ concept }: { concept: string }) {
  const { generate, isLoading, data, error } = useGenerateExplanation();

  React.useEffect(() => {
    if (concept) {
      const request: GenerateExplanationRequest = {
        type: 'concept',
        subject: concept,
        detailLevel: 'intermediate',
      };

      generate(request).catch(console.error);
    }
  }, [concept, generate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading explanation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-600">Failed to load explanation: {error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{data.explanation.subject}</h1>
        <p className="text-gray-600 mt-2">{data.explanation.summary}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Details</h2>
        <ul className="space-y-2">
          {data.explanation.details.map((detail, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-purple-500">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.explanation.examples.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Examples</h2>
          {data.explanation.examples.map((example, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-50 rounded">
              <p className="font-medium mb-2">{example.description}</p>
              {example.code && (
                <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Key Takeaways</h2>
        <ul className="space-y-2">
          {data.explanation.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-green-500 text-xl">✓</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.explanation.relatedTopics.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Related Topics</h3>
          <div className="flex gap-2 flex-wrap">
            {data.explanation.relatedTopics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 4: Code Review Component
// ============================================================================

export function CodeReviewerExample({
  problemId,
  code,
  language,
}: {
  problemId: string;
  code: string;
  language: 'python' | 'javascript' | 'cpp' | 'java';
}) {
  const { review, isLoading, data, error } = useReviewSolution();

  const handleReview = async () => {
    const request: ReviewSolutionRequest = {
      problemId,
      code,
      language,
      reviewType: 'comprehensive',
    };

    try {
      await review(request);
    } catch (err) {
      console.error('Failed to review solution:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={handleReview}
        disabled={isLoading}
        className="px-6 py-3 bg-green-500 text-white rounded-lg disabled:opacity-50 font-semibold"
      >
        {isLoading ? 'Reviewing...' : 'Review My Code'}
      </button>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-600">{error.message}</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Overall Score</h2>
                <p className="text-gray-600 capitalize">{data.review.verdict}</p>
              </div>
              <div className="text-5xl font-bold text-green-600">
                {data.review.overallScore}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
            </div>
          </div>

          {/* Correctness */}
          {data.review.correctness && (
            <div className="p-4 bg-white border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Correctness</h3>
              <p className="mb-3">
                Status:{' '}
                <span
                  className={
                    data.review.correctness.isCorrect
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {data.review.correctness.isCorrect ? '✓ Correct' : '✗ Issues Found'}
                </span>
              </p>

              {data.review.correctness.issues.length > 0 && (
                <div className="space-y-2">
                  {data.review.correctness.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded ${
                        issue.severity === 'critical'
                          ? 'bg-red-50 border-l-4 border-red-500'
                          : issue.severity === 'major'
                          ? 'bg-orange-50 border-l-4 border-orange-500'
                          : 'bg-yellow-50 border-l-4 border-yellow-500'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{issue.type.replace('_', ' ')}</span>
                        <span className="text-sm uppercase">{issue.severity}</span>
                      </div>
                      <p className="text-sm mt-1">{issue.description}</p>
                      <p className="text-sm mt-2 text-gray-700">
                        <strong>Suggestion:</strong> {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Performance */}
          {data.review.performance && (
            <div className="p-4 bg-white border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Performance</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Time Complexity</p>
                  <p className="text-lg font-mono">{data.review.performance.timeComplexity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Space Complexity</p>
                  <p className="text-lg font-mono">{data.review.performance.spaceComplexity}</p>
                </div>
              </div>

              {data.review.performance.optimizationSuggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Optimization Suggestions</h4>
                  <div className="space-y-2">
                    {data.review.performance.optimizationSuggestions.map((opt, i) => (
                      <div key={i} className="p-3 bg-blue-50 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">{opt.description}</span>
                          <span className="text-sm capitalize">Impact: {opt.impact}</span>
                        </div>
                        {opt.exampleCode && (
                          <pre className="mt-2 p-2 bg-gray-800 text-white text-sm rounded overflow-x-auto">
                            <code>{opt.exampleCode}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-700">Strengths</h3>
              <ul className="space-y-2">
                {data.review.strengths.map((strength, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-orange-700">Improvements</h3>
              <ul className="space-y-2">
                {data.review.improvements.map((improvement, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-orange-500">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-purple-700">Next Steps</h3>
            <ol className="space-y-2">
              {data.review.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-bold text-purple-500">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 5: AI Status Indicator
// ============================================================================

export function AIStatusIndicator() {
  const { isAvailable, data, isLoading, checkStatus } = useAIStatus(true);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg border">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isLoading
              ? 'bg-yellow-400 animate-pulse'
              : isAvailable
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        ></div>
        <div>
          <p className="font-semibold">
            AI Service {isLoading ? 'Checking...' : isAvailable ? 'Online' : 'Offline'}
          </p>
          {data && (
            <p className="text-xs text-gray-600">
              v{data.version} • {data.rateLimits?.requestsRemaining || 0} requests remaining
            </p>
          )}
        </div>
        <button
          onClick={checkStatus}
          className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {data && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-semibold mb-1">Agent Status:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(data.agents).map(([name, available]) => (
              <div key={name} className="flex items-center gap-1">
                <span className={available ? 'text-green-600' : 'text-red-600'}>
                  {available ? '✓' : '✗'}
                </span>
                <span className="capitalize">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
