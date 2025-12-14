/**
 * HintPanel Component
 * 
 * Displays AI-powered hints for coding problems.
 * 
 * RULES:
 * - AI is optional - failures don't block user flow
 * - Never reveals full solution
 * - Shows loading and error states gracefully
 * - Allows retry on failure
 * - Respects usage limits
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, AlertCircle, Loader2, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIHint } from '@/hooks/useAIWithFlags';
import type { GeneratedHint } from '@/api/types';

interface HintPanelProps {
  problemId: string;
  userCode?: string;
  className?: string;
}

export function HintPanel({ problemId, userCode, className }: HintPanelProps) {
  const { generate, isLoading, data, error, enabled, remaining, limitReached, reset } =
    useAIHint(problemId);
  
  const [hintHistory, setHintHistory] = useState<GeneratedHint[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'algorithm' | 'syntax' | 'edge_case'>('algorithm');

  // If AI hints are not enabled, don't render anything
  if (!enabled) {
    return null;
  }

  const handleGetHint = async () => {
    try {
      const response = await generate({
        problemId,
        userCode,
        hintLevel: selectedLevel,
        previousHints: hintHistory.map(h => h.content),
      });

      if (response) {
        setHintHistory(prev => [...prev, response.hint]);
      }
    } catch (err) {
      // Error is already in state, handled below
      console.error('[HintPanel] Failed to generate hint:', err);
    }
  };

  const handleRetry = () => {
    reset();
    handleGetHint();
  };

  return (
    <Card className={className} data-testid="hint-panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <CardTitle>AI Hints</CardTitle>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {remaining} / {remaining + hintHistory.length} hints left
          </div>
        </div>
        <CardDescription>
          Get progressive hints without revealing the solution
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Hint Level Selector */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedLevel === 'algorithm' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('algorithm')}
            disabled={isLoading || limitReached}
            data-testid="hint-level-algorithm"
          >
            Algorithm
          </Button>
          <Button
            size="sm"
            variant={selectedLevel === 'syntax' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('syntax')}
            disabled={isLoading || limitReached}
            data-testid="hint-level-syntax"
          >
            Syntax
          </Button>
          <Button
            size="sm"
            variant={selectedLevel === 'edge_case' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('edge_case')}
            disabled={isLoading || limitReached}
            data-testid="hint-level-edge-case"
          >
            Edge Cases
          </Button>
        </div>

        {/* Get Hint Button */}
        <Button
          onClick={handleGetHint}
          disabled={isLoading || limitReached}
          className="w-full"
          data-testid="get-hint-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Hint...
            </>
          ) : limitReached ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Hint Limit Reached
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 mr-2" />
              Get {selectedLevel} Hint
            </>
          )}
        </Button>

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive" data-testid="hint-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error.message || 'Failed to generate hint'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRetry}
                data-testid="hint-retry-button"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Hint History */}
        <AnimatePresence mode="popLayout">
          {hintHistory.length > 0 && (
            <div className="space-y-3" data-testid="hint-history">
              {hintHistory.map((hint, index) => (
                <motion.div
                  key={hint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  data-testid={`hint-${index}`}
                >
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {hint.hintType.replace('_', ' ')}
                          </Badge>
                          <Badge variant="secondary">Level {hint.level}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Hint #{index + 1}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{hint.content}</p>
                      
                      {hint.relatedConcepts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {hint.relatedConcepts.map((concept, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {hint.shouldRevealMore && (
                        <div className="mt-3 text-xs text-muted-foreground italic">
                          💡 More detailed hints are available if you need them
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Limit Reached Message */}
        {limitReached && hintHistory.length === 0 && (
          <Alert data-testid="hint-limit-alert">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You've reached the hint limit for this problem. Try solving it with
              the hints you've received, or come back later!
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {hintHistory.length === 0 && !error && !limitReached && (
          <div className="text-center py-8 text-muted-foreground" data-testid="hint-empty-state">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Stuck? Get a hint to help you move forward
            </p>
            <p className="text-xs mt-1">
              Hints are designed to guide you without revealing the solution
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
