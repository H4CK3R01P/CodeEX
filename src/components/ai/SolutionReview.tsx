/**
 * SolutionReview Component
 * 
 * Displays AI-powered code review on submission result screen.
 * 
 * RULES:
 * - AI is optional - failures don't block user flow
 * - Never changes grades or verdicts
 * - Only provides feedback and suggestions
 * - Shows after submission is graded
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, Loader2, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAIReview } from '@/hooks/useAIWithFlags';

interface SolutionReviewProps {
  problemId: string;
  code: string;
  language: 'python' | 'javascript' | 'cpp' | 'java';
  submissionId?: string;
  autoLoad?: boolean;
  className?: string;
}

export function SolutionReview({
  problemId,
  code,
  language,
  submissionId,
  autoLoad = false,
  className,
}: SolutionReviewProps) {
  const { review, isLoading, data, error, enabled, remaining, limitReached, reset } =
    useAIReview();

  React.useEffect(() => {
    if (autoLoad && enabled && !limitReached && !data && !error) {
      handleReview();
    }
  }, [autoLoad, enabled, limitReached]); // eslint-disable-line react-hooks/exhaustive-deps

  // If AI review is not enabled, don't render
  if (!enabled) {
    return null;
  }

  const handleReview = async () => {
    try {
      await review({
        problemId,
        code,
        language,
        reviewType: 'comprehensive',
        submissionId,
      });
    } catch (err) {
      console.error('[SolutionReview] Failed to review solution:', err);
    }
  };

  const handleRetry = () => {
    reset();
    handleReview();
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'needs_improvement':
        return 'text-orange-600';
      case 'incorrect':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className={className} data-testid="solution-review">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <CardTitle>AI Code Review</CardTitle>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {remaining} reviews left today
          </div>
        </div>
        <CardDescription>
          Get AI-powered feedback on your code quality, performance, and style
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12" data-testid="review-loading">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-purple-500" />
              <p className="text-sm text-muted-foreground">
                Analyzing your solution...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive" data-testid="review-error">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error.message || 'Failed to review solution'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRetry}
                data-testid="review-retry-button"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Review Content */}
        {data && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            data-testid="review-content"
          >
            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Overall Score</h3>
                    <p className={`text-lg capitalize ${getVerdictColor(data.review.verdict)}`}>
                      {data.review.verdict.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold ${getScoreColor(data.review.overallScore)}`}>
                      {data.review.overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">/ 100</div>
                  </div>
                </div>
                <Progress value={data.review.overallScore} className="h-2" />
              </CardContent>
            </Card>

            {/* Review Tabs */}
            <Tabs defaultValue="summary" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="correctness">Correctness</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                {/* Strengths */}
                {data.review.strengths.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {data.review.strengths.map((strength, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-green-500">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Improvements */}
                {data.review.improvements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="w-4 h-4 text-orange-500" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {data.review.improvements.map((improvement, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-orange-500">→</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Next Steps */}
                {data.review.nextSteps.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {data.review.nextSteps.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="font-semibold text-purple-500">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Correctness Tab */}
              <TabsContent value="correctness" className="space-y-4">
                {data.review.correctness ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Correctness Analysis</CardTitle>
                        <Badge variant={data.review.correctness.isCorrect ? 'default' : 'destructive'}>
                          {data.review.correctness.isCorrect ? 'Correct' : 'Has Issues'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {data.review.correctness.issues.length > 0 ? (
                        data.review.correctness.issues.map((issue, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded border-l-4 ${
                              issue.severity === 'critical'
                                ? 'bg-red-50 border-red-500 dark:bg-red-950/20'
                                : issue.severity === 'major'
                                ? 'bg-orange-50 border-orange-500 dark:bg-orange-950/20'
                                : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="capitalize">
                                {issue.type.replace('_', ' ')}
                              </Badge>
                              <Badge variant="secondary" className="uppercase text-xs">
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">{issue.description}</p>
                            {issue.lineNumber && (
                              <p className="text-xs text-muted-foreground mb-2">
                                Line {issue.lineNumber}
                              </p>
                            )}
                            <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded">
                              <p className="text-xs font-semibold mb-1">Suggestion:</p>
                              <p className="text-xs">{issue.suggestion}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          No correctness issues found!
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Correctness analysis not available</p>
                  </div>
                )}
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                {data.review.performance ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Complexity Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Time Complexity</p>
                            <p className="text-lg font-mono font-semibold">
                              {data.review.performance.timeComplexity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Space Complexity</p>
                            <p className="text-lg font-mono font-semibold">
                              {data.review.performance.spaceComplexity}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {data.review.performance.optimizationSuggestions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Optimization Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {data.review.performance.optimizationSuggestions.map((opt, i) => (
                            <div key={i} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium">{opt.description}</p>
                                <Badge variant="outline" className="capitalize">
                                  {opt.impact} Impact
                                </Badge>
                              </div>
                              {opt.exampleCode && (
                                <pre className="mt-2 p-2 bg-gray-900 text-gray-100 rounded overflow-x-auto text-xs">
                                  <code>{opt.exampleCode}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Performance analysis not available</p>
                  </div>
                )}
              </TabsContent>

              {/* Style Tab */}
              <TabsContent value="style" className="space-y-4">
                {data.review.style ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Readability Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">
                            {data.review.style.readabilityScore}/100
                          </span>
                        </div>
                        <Progress value={data.review.style.readabilityScore} className="h-2" />
                      </CardContent>
                    </Card>

                    {data.review.style.issues.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Style Issues</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {data.review.style.issues.map((issue, i) => (
                            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="capitalize">
                                  {issue.type}
                                </Badge>
                                {issue.lineNumber && (
                                  <span className="text-xs text-muted-foreground">
                                    Line {issue.lineNumber}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mb-2">{issue.description}</p>
                              <div className="p-2 bg-white dark:bg-gray-950 rounded">
                                <p className="text-xs font-semibold mb-1">Suggestion:</p>
                                <p className="text-xs">{issue.suggestion}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Style analysis not available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Empty State */}
        {!data && !isLoading && !error && (
          <div className="text-center py-8" data-testid="review-empty-state">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50 text-purple-500" />
            <p className="text-sm text-muted-foreground mb-4">
              Get AI-powered feedback on your code
            </p>
            <Button
              onClick={handleReview}
              disabled={limitReached}
              data-testid="request-review-button"
            >
              {limitReached ? (
                'Daily Limit Reached'
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Request Code Review
                </>
              )}
            </Button>
          </div>
        )}

        {/* Limit Reached */}
        {limitReached && !data && (
          <Alert data-testid="review-limit-alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You've reached the daily review limit. Come back tomorrow for more reviews!
            </AlertDescription>
          </Alert>
        )}

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          AI reviews are for educational purposes only and do not affect your submission grade.
        </div>
      </CardContent>
    </Card>
  );
}
