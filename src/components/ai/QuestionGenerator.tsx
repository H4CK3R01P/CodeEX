/**
 * QuestionGenerator Component
 * 
 * Admin-only AI-powered question generation tool.
 * 
 * RULES:
 * - Admin access only
 * - AI is optional - failures don't block admin workflow
 * - Generated questions must be reviewed before publishing
 * - Graceful error handling
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, AlertCircle, Loader2, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAIQuestionGenerator } from '@/hooks/useAIWithFlags';

interface QuestionGeneratorProps {
  onQuestionGenerated?: (question: any) => void;
  className?: string;
}

export function QuestionGenerator({ onQuestionGenerated, className }: QuestionGeneratorProps) {
  const { generate, isLoading, data, error, enabled, reset } = useAIQuestionGenerator();
  
  const [topic, setTopic] = useState('arrays');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [problemType, setProblemType] = useState('algorithm');
  const [copied, setCopied] = useState(false);

  // If question generation is not enabled, show access denied
  if (!enabled) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Question generation is not enabled. Please contact your administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleGenerate = async () => {
    try {
      const response = await generate({
        topic,
        difficulty,
        problemType: problemType as any,
        constraints: {
          timeLimit: 2000,
          memoryLimit: 256000,
        },
      });

      if (response && onQuestionGenerated) {
        onQuestionGenerated(response.question);
      }
    } catch (err) {
      console.error('[QuestionGenerator] Failed to generate question:', err);
    }
  };

  const handleRetry = () => {
    reset();
    handleGenerate();
  };

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data.question, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={className} data-testid="question-generator">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          <CardTitle>AI Question Generator</CardTitle>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Beta
          </Badge>
          <Badge variant="outline" className="ml-auto">Admin Only</Badge>
        </div>
        <CardDescription>
          Generate coding problems using AI. Review before publishing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Generation Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., arrays, graphs, dynamic programming"
              disabled={isLoading}
              data-testid="topic-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value: any) => setDifficulty(value)}
              disabled={isLoading}
            >
              <SelectTrigger id="difficulty" data-testid="difficulty-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="problemType">Problem Type</Label>
            <Select
              value={problemType}
              onValueChange={setProblemType}
              disabled={isLoading}
            >
              <SelectTrigger id="problemType" data-testid="problem-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algorithm">Algorithm</SelectItem>
                <SelectItem value="data_structure">Data Structure</SelectItem>
                <SelectItem value="system_design">System Design</SelectItem>
                <SelectItem value="debugging">Debugging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !topic}
          className="w-full"
          data-testid="generate-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Question...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Question
            </>
          )}
        </Button>

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive" data-testid="generator-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error.message || 'Failed to generate question'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRetry}
                data-testid="generator-retry-button"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Generated Question */}
        {data && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            data-testid="generated-question"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{data.question.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">
                        {data.question.difficulty}
                      </Badge>
                      {data.question.topics.map((topic, i) => (
                        <Badge key={i} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    data-testid="copy-button"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy JSON
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Description</h4>
                  <p className="text-sm whitespace-pre-wrap">{data.question.description}</p>
                </div>

                {/* Constraints */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Constraints</h4>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time:</span>{' '}
                      <span className="font-mono">{data.question.constraints.timeLimit}ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Memory:</span>{' '}
                      <span className="font-mono">{data.question.constraints.memoryLimit}KB</span>
                    </div>
                  </div>
                </div>

                {/* Test Cases */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Test Cases ({data.question.testCases.length})</h4>
                  <div className="space-y-2">
                    {data.question.testCases.slice(0, 2).map((tc, i) => (
                      <div key={i} className="p-2 bg-white dark:bg-gray-900 rounded text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Test {i + 1}</Badge>
                          {tc.isHidden && <Badge variant="secondary">Hidden</Badge>}
                        </div>
                        <div className="font-mono text-xs">
                          <div><span className="text-muted-foreground">Input:</span> {tc.input}</div>
                          <div><span className="text-muted-foreground">Output:</span> {tc.expectedOutput}</div>
                        </div>
                      </div>
                    ))}
                    {data.question.testCases.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        + {data.question.testCases.length - 2} more test cases
                      </p>
                    )}
                  </div>
                </div>

                {/* Starter Code */}
                {data.question.starterCode && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Starter Code</h4>
                    <div className="space-y-2">
                      {Object.entries(data.question.starterCode).map(([lang, code]) => (
                        <div key={lang}>
                          <Badge variant="outline" className="mb-1 capitalize">{lang}</Badge>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-xs">
                            <code>{code as string}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-3 border-t text-xs text-muted-foreground">
                  Generated by {data.metadata.agentId} in {data.metadata.processingTime}ms
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Review Required:</strong> AI-generated questions must be reviewed and
                tested before publishing. Verify correctness, clarity, and test cases.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Empty State */}
        {!data && !isLoading && !error && (
          <div className="text-center py-8 text-muted-foreground" data-testid="generator-empty-state">
            <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-purple-500" />
            <p className="text-sm">
              Configure parameters above and generate a new coding problem
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
