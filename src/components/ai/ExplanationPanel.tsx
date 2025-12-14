/**
 * ExplanationPanel Component
 * 
 * Displays AI-powered explanations after solution is accepted.
 * Helps users understand concepts, algorithms, and approaches.
 * 
 * RULES:
 * - AI is optional - failures don't block user flow
 * - Only shows after solution is accepted
 * - Educational content only, never grades
 * - Graceful error handling with retry
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, AlertCircle, Loader2, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIExplanation } from '@/hooks/useAIWithFlags';

interface ExplanationPanelProps {
  problemId: string;
  subject: string;
  difficulty?: string;
  autoLoad?: boolean;
  className?: string;
}

export function ExplanationPanel({
  problemId,
  subject,
  difficulty,
  autoLoad = false,
  className,
}: ExplanationPanelProps) {
  const { generate, isLoading, data, error, enabled, remaining, limitReached, reset } =
    useAIExplanation();

  // Auto-load explanation if enabled
  useEffect(() => {
    if (autoLoad && enabled && !limitReached && !data && !error) {
      handleLoadExplanation();
    }
  }, [autoLoad, enabled, limitReached]); // eslint-disable-line react-hooks/exhaustive-deps

  // If AI explanations are not enabled, don't render
  if (!enabled) {
    return null;
  }

  const handleLoadExplanation = async () => {
    try {
      await generate({
        type: 'algorithm',
        subject,
        detailLevel: 'intermediate',
        context: {
          problemId,
          difficulty,
        },
      });
    } catch (err) {
      console.error('[ExplanationPanel] Failed to generate explanation:', err);
    }
  };

  const handleRetry = () => {
    reset();
    handleLoadExplanation();
  };

  return (
    <Card className={className} data-testid="explanation-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <CardTitle>AI Explanation</CardTitle>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {remaining} explanations left today
          </div>
        </div>
        <CardDescription>
          Understand the concepts and approach behind the solution
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12" data-testid="explanation-loading">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-500" />
              <p className="text-sm text-muted-foreground">
                Generating explanation...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive" data-testid="explanation-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error.message || 'Failed to generate explanation'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRetry}
                data-testid="explanation-retry-button"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Explanation Content */}
        {data && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            data-testid="explanation-content"
          >
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{data.explanation.subject}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {data.explanation.explanation.summary}
                      </p>
                    </div>

                    {data.explanation.explanation.details.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Key Points</h4>
                        <ul className="space-y-2">
                          {data.explanation.explanation.details.map((detail, i) => (
                            <li key={i} className="flex gap-2 text-sm">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {data.explanation.explanation.keyTakeaways.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Key Takeaways</h4>
                        <div className="space-y-2">
                          {data.explanation.explanation.keyTakeaways.map((takeaway, i) => (
                            <div
                              key={i}
                              className="flex gap-2 items-start p-2 bg-blue-50 dark:bg-blue-950/20 rounded"
                            >
                              <span className="text-green-500 text-lg">✓</span>
                              <span className="text-sm">{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Examples Tab */}
              <TabsContent value="examples" className="space-y-4">
                {data.explanation.explanation.examples.length > 0 ? (
                  data.explanation.explanation.examples.map((example, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle className="text-sm">Example {i + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{example.description}</p>
                        {example.code && (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
                            <code>{example.code}</code>
                          </pre>
                        )}
                        {example.visualization && (
                          <div className="text-xs text-muted-foreground italic">
                            {example.visualization}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No examples available</p>
                  </div>
                )}
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-4">
                {/* Related Topics */}
                {data.explanation.relatedTopics.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Related Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {data.explanation.relatedTopics.map((topic, i) => (
                          <Badge key={i} variant="outline">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommended Resources */}
                {data.explanation.recommendedResources && 
                 data.explanation.recommendedResources.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recommended Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {data.explanation.recommendedResources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="capitalize">
                              {resource.type}
                            </Badge>
                            <span className="text-sm">{resource.title}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {(!data.explanation.relatedTopics.length &&
                  (!data.explanation.recommendedResources ||
                    !data.explanation.recommendedResources.length)) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No additional resources available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Empty State - Show Load Button */}
        {!data && !isLoading && !error && (
          <div className="text-center py-8" data-testid="explanation-empty-state">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50 text-blue-500" />
            <p className="text-sm text-muted-foreground mb-4">
              Get a detailed explanation of the algorithm and approach
            </p>
            <Button
              onClick={handleLoadExplanation}
              disabled={limitReached}
              data-testid="load-explanation-button"
            >
              {limitReached ? (
                'Daily Limit Reached'
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Load Explanation
                </>
              )}
            </Button>
          </div>
        )}

        {/* Limit Reached */}
        {limitReached && !data && (
          <Alert data-testid="explanation-limit-alert">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've reached the daily explanation limit. Come back tomorrow for more!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
