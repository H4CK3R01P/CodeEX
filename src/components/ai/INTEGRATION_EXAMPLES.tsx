/**
 * Integration Examples for AI Components
 * 
 * Shows how to integrate AI components into existing pages.
 * Copy these patterns to your actual page components.
 */

import React, { useState } from 'react';
import { HintPanel, ExplanationPanel, SolutionReview, QuestionGenerator } from './index';

// ============================================================================
// Example 1: Problem Detail Page with Hints
// ============================================================================

export function ProblemDetailPageExample() {
  const [code, setCode] = useState('');
  const problemId = 'two-sum';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Existing Problem UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Problem Description */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Two Sum</h1>
          <p className="text-muted-foreground mb-4">
            Given an array of integers nums and an integer target, return indices
            of the two numbers such that they add up to target.
          </p>
          {/* More problem details... */}
        </div>

        {/* Right: Code Editor */}
        <div>
          <textarea
            className="w-full h-96 p-4 font-mono text-sm border rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
          />
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      </div>

      {/* AI Hint Panel - Appears below problem */}
      <HintPanel 
        problemId={problemId}
        userCode={code}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}

// ============================================================================
// Example 2: Submission Result with Review and Explanation
// ============================================================================

interface Submission {
  id: string;
  code: string;
  language: 'python' | 'javascript' | 'cpp' | 'java';
  verdict: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';
  testResults: Array<{ passed: boolean; input: string; output: string }>;
}

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  algorithmTags: string[];
}

export function SubmissionResultPageExample() {
  const submission: Submission = {
    id: 'sub_12345',
    code: 'def two_sum(nums, target):\n    # solution...',
    language: 'python',
    verdict: 'AC',
    testResults: [
      { passed: true, input: '[2,7,11,15], 9', output: '[0,1]' },
      { passed: true, input: '[3,2,4], 6', output: '[1,2]' },
    ],
  };

  const problem: Problem = {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    algorithmTags: ['hash-table', 'array'],
  };

  const isAccepted = submission.verdict === 'AC';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Existing Verdict UI */}
      <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Accepted!
        </h2>
        <p className="text-muted-foreground mt-2">
          All test cases passed
        </p>
      </div>

      {/* Test Results */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Test Results</h3>
        <div className="space-y-2">
          {submission.testResults.map((result, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={result.passed ? 'text-green-500' : 'text-red-500'}>
                {result.passed ? '✓' : '✗'}
              </span>
              <span className="text-sm">Test Case {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Code Review - Always available */}
      <SolutionReview
        problemId={problem.id}
        code={submission.code}
        language={submission.language}
        submissionId={submission.id}
        autoLoad={false} // User clicks to load
      />

      {/* AI Explanation - Only if accepted */}
      {isAccepted && (
        <ExplanationPanel
          problemId={problem.id}
          subject={problem.algorithmTags[0]} // Use first tag
          difficulty={problem.difficulty}
          autoLoad={true} // Auto-load on AC
        />
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Admin Dashboard with Question Generator
// ============================================================================

export function AdminDashboardExample() {
  const [generatedQuestion, setGeneratedQuestion] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleQuestionGenerated = (question: any) => {
    console.log('Question generated:', question);
    setGeneratedQuestion(question);
  };

  const handleSaveQuestion = async () => {
    setIsSaving(true);
    try {
      // Save to database
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedQuestion),
      });

      if (response.ok) {
        alert('Question saved successfully!');
        setGeneratedQuestion(null);
      }
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQuestion = (field: string, value: any) => {
    setGeneratedQuestion((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Question</h1>
        <span className="text-sm text-muted-foreground">Admin Panel</span>
      </div>

      {/* AI Question Generator */}
      <QuestionGenerator onQuestionGenerated={handleQuestionGenerated} />

      {/* Manual Edit Form (if question generated) */}
      {generatedQuestion && (
        <div className="space-y-4">
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Review & Edit</h2>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={generatedQuestion.title}
                onChange={(e) => handleEditQuestion('title', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={generatedQuestion.description}
                onChange={(e) => handleEditQuestion('description', e.target.value)}
                className="w-full p-2 border rounded h-32"
              />
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={generatedQuestion.difficulty}
                onChange={(e) => handleEditQuestion('difficulty', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Test Cases */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Test Cases ({generatedQuestion.testCases.length})
              </label>
              <div className="space-y-2">
                {generatedQuestion.testCases.map((tc: any, i: number) => (
                  <div key={i} className="p-3 border rounded">
                    <div className="font-mono text-sm">
                      <div>Input: {tc.input}</div>
                      <div>Output: {tc.expectedOutput}</div>
                      <div>Hidden: {tc.isHidden ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveQuestion}
              disabled={isSaving}
              className="px-6 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 4: Conditional Rendering Based on Feature Flags
// ============================================================================

import { useAIFlags } from '@/config/aiFlags';

export function ConditionalAIFeaturesExample() {
  const { isEnabled, isFeatureEnabled } = useAIFlags();
  const [showReview, setShowReview] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Submissions</h1>

      {/* Show AI status indicator */}
      {isEnabled && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">AI Features Available</h3>
          <ul className="text-sm space-y-1">
            <li>✓ Hints: {isFeatureEnabled('hints') ? 'Enabled' : 'Disabled'}</li>
            <li>✓ Explanations: {isFeatureEnabled('explanations') ? 'Enabled' : 'Disabled'}</li>
            <li>✓ Code Review: {isFeatureEnabled('solutionReview') ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </div>
      )}

      {/* Submission list */}
      <div className="space-y-4">
        {/* Example submission */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Two Sum</h3>
              <p className="text-sm text-muted-foreground">Submitted 2 hours ago</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded">AC</span>
              
              {/* Conditional AI Review Button */}
              {isFeatureEnabled('solutionReview') && (
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                >
                  {showReview ? 'Hide' : 'Show'} AI Review
                </button>
              )}
            </div>
          </div>

          {/* Conditional AI Review Panel */}
          {showReview && isFeatureEnabled('solutionReview') && (
            <div className="mt-4">
              <SolutionReview
                problemId="two-sum"
                code="def two_sum(nums, target):\n    # code..."
                language="python"
                autoLoad={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Error Boundary for AI Components
// ============================================================================

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AIErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AIErrorBoundary] AI component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            AI feature temporarily unavailable. Your main functionality is not affected.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ProtectedAIComponentsExample() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Problem Detail</h1>

      {/* Main problem UI - always works */}
      <div>
        <p>Problem description...</p>
        <textarea placeholder="Write code..." />
        <button>Submit</button>
      </div>

      {/* AI features wrapped in error boundary */}
      <AIErrorBoundary
        fallback={
          <div className="text-center py-4 text-muted-foreground">
            AI hints are temporarily unavailable
          </div>
        }
      >
        <HintPanel problemId="two-sum" />
      </AIErrorBoundary>
    </div>
  );
}

// ============================================================================
// Example 6: Analytics Tracking
// ============================================================================

export function AIAnalyticsExample() {
  const trackAIUsage = (feature: string, action: string, metadata?: any) => {
    // Send to analytics service
    console.log('[Analytics] AI Usage:', {
      feature,
      action,
      timestamp: new Date().toISOString(),
      metadata,
    });

    // Example: Google Analytics
    // gtag('event', 'ai_usage', {
    //   feature,
    //   action,
    //   ...metadata
    // });
  };

  const handleHintGenerated = () => {
    trackAIUsage('hints', 'generated', {
      problemId: 'two-sum',
      hintLevel: 'algorithm',
    });
  };

  const handleReviewRequested = () => {
    trackAIUsage('review', 'requested', {
      problemId: 'two-sum',
      language: 'python',
    });
  };

  return (
    <div>
      {/* Track AI feature usage */}
      <HintPanel 
        problemId="two-sum"
        // Add tracking to component if needed
      />
    </div>
  );
}
