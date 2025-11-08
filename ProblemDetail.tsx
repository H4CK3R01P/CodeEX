import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Share2, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Trophy,
  Code,
  BookOpen,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CodeEditor } from '../CodeEditor';
import { CodingProblem, TestCase } from '../../utils/codingProblems';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface ProblemDetailProps {
  problem: CodingProblem;
  onBack: () => void;
  domainId: string;
}

interface SubmissionResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compilation_error';
  testCasesPassed: number;
  totalTestCases: number;
  runtime: string;
  memory: string;
  error?: string;
  failedTestCase?: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
  };
}

interface Submission {
  id: string;
  timestamp: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
}

export function ProblemDetail({ problem, onBack, domainId }: ProblemDetailProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showHints, setShowHints] = useState<boolean[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  useEffect(() => {
    setShowHints(new Array(problem.hints.length).fill(false));
    loadSubmissions();
  }, [problem.id]);

  const loadSubmissions = async () => {
    // Load previous submissions from backend
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b9684b04/submissions/${problem.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleRun = async (code: string, language: string) => {
    setIsRunning(true);
    setConsoleOutput('Running code...\n');
    setActiveTab('console');

    try {
      // Use only visible test cases for "Run"
      const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b9684b04/execute-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            code,
            language,
            problemId: problem.id,
            testCases: visibleTestCases,
          }),
        }
      );

      const result = await response.json();
      
      if (result.error) {
        setConsoleOutput(`Error: ${result.error}\n`);
      } else {
        let output = `=== Test Results ===\n\n`;
        result.results.forEach((testResult: any, idx: number) => {
          const testCase = visibleTestCases[idx];
          const status = testResult.passed ? '✓ PASSED' : '✗ FAILED';
          output += `Test Case ${idx + 1}: ${status}\n`;
          output += `Input: ${testCase.input}\n`;
          output += `Expected: ${testCase.expectedOutput}\n`;
          output += `Got: ${testResult.output}\n`;
          if (testResult.runtime) {
            output += `Runtime: ${testResult.runtime}ms\n`;
          }
          output += `\n`;
        });
        
        const passed = result.results.filter((r: any) => r.passed).length;
        output += `\nPassed: ${passed}/${visibleTestCases.length} test cases\n`;
        
        setConsoleOutput(output);
      }
    } catch (error) {
      setConsoleOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async (code: string, language: string) => {
    setIsRunning(true);
    setConsoleOutput('Submitting solution...\n');
    setActiveTab('result');

    try {
      // Use ALL test cases for "Submit"
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b9684b04/submit-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            code,
            language,
            problemId: problem.id,
            testCases: problem.testCases,
          }),
        }
      );

      const result = await response.json();
      
      if (result.error) {
        toast.error('Submission failed: ' + result.error);
        setSubmissionResult({
          status: 'compilation_error',
          testCasesPassed: 0,
          totalTestCases: problem.testCases.length,
          runtime: '0ms',
          memory: '0MB',
          error: result.error,
        });
      } else {
        const passed = result.results.filter((r: any) => r.passed).length;
        const status = passed === problem.testCases.length ? 'accepted' : 'wrong_answer';
        
        setSubmissionResult({
          status,
          testCasesPassed: passed,
          totalTestCases: problem.testCases.length,
          runtime: result.avgRuntime || '0ms',
          memory: result.memory || '0MB',
          failedTestCase: status === 'wrong_answer' ? {
            input: result.failedCase?.input || '',
            expectedOutput: result.failedCase?.expected || '',
            actualOutput: result.failedCase?.actual || '',
          } : undefined,
        });

        if (status === 'accepted') {
          toast.success('Accepted! 🎉 All test cases passed!');
        } else {
          toast.error(`Wrong Answer: ${passed}/${problem.testCases.length} test cases passed`);
        }

        // Reload submissions
        await loadSubmissions();
      }
    } catch (error) {
      toast.error('Submission failed');
      console.error('Submission error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleHint = (index: number) => {
    const newShowHints = [...showHints];
    newShowHints[index] = !newShowHints[index];
    setShowHints(newShowHints);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'wrong_answer':
        return 'text-red-600 bg-red-50';
      case 'time_limit':
        return 'text-orange-600 bg-orange-50';
      case 'runtime_error':
      case 'compilation_error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl">{problem.title}</h1>
                <Badge className={`${getDifficultyColor(problem.difficulty)} border`}>
                  {problem.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {problem.acceptanceRate}% Acceptance
                </span>
                <span>•</span>
                <span>{problem.submissions.toLocaleString()} Submissions</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {problem.likes.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={liked ? 'text-blue-600' : ''}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              className={bookmarked ? 'text-yellow-600' : ''}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-3">
          {problem.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Companies */}
        {problem.companies.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Asked by:</span>
            {problem.companies.map((company) => (
              <Badge key={company} variant="outline" className="text-xs">
                {company}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-12 px-4">
              <TabsTrigger value="description" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="editorial" className="gap-2">
                <Code className="h-4 w-4" />
                Editorial
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2">
                <Trophy className="h-4 w-4" />
                Submissions
              </TabsTrigger>
              <TabsTrigger value="discuss" className="gap-2">
                <Users className="h-4 w-4" />
                Discuss
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="description" className="mt-0">
                  {/* Problem Description */}
                  <div className="space-y-6">
                    <div>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{problem.description}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Examples */}
                    <div>
                      <h3 className="font-semibold mb-4">Examples</h3>
                      <div className="space-y-4">
                        {problem.examples.map((example, idx) => (
                          <Card key={idx}>
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Input:</span>
                                  <pre className="mt-1 p-2 bg-muted rounded text-sm overflow-x-auto">
                                    {example.input}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Output:</span>
                                  <pre className="mt-1 p-2 bg-muted rounded text-sm overflow-x-auto">
                                    {example.output}
                                  </pre>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="text-sm font-medium">Explanation:</span>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {example.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Constraints */}
                    <div>
                      <h3 className="font-semibold mb-4">Constraints</h3>
                      <ul className="space-y-2">
                        {problem.constraints.map((constraint, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <code className="text-sm">{constraint.text}</code>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hints */}
                    {problem.hints.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-4">Hints</h3>
                          <div className="space-y-2">
                            {problem.hints.map((hint, idx) => (
                              <div key={idx} className="border rounded-lg">
                                <button
                                  onClick={() => toggleHint(idx)}
                                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                  <span className="text-sm font-medium">Hint {idx + 1}</span>
                                  {showHints[idx] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                                {showHints[idx] && (
                                  <div className="px-4 pb-3 text-sm text-muted-foreground">
                                    {hint}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="editorial" className="mt-0">
                  {problem.editorial ? (
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: problem.editorial.replace(/\n/g, '<br>') }} />
                      
                      {problem.timeComplexity && (
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                          <p><strong>Time Complexity:</strong> {problem.timeComplexity}</p>
                          {problem.spaceComplexity && (
                            <p className="mt-2"><strong>Space Complexity:</strong> {problem.spaceComplexity}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Editorial will be available after you solve the problem</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="submissions" className="mt-0">
                  <div className="space-y-2">
                    {submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <Card key={submission.id}>
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(submission.status)}>
                                  {submission.status === 'accepted' ? (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {submission.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {submission.language}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{submission.runtime}</span>
                                <span>{submission.memory}</span>
                                <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No submissions yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="discuss" className="mt-0">
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Discussion forum coming soon</p>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-12 px-4">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="result">Result</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 mt-0 p-4">
              <CodeEditor
                defaultCode={problem.codeTemplates[0]?.code || ''}
                language={selectedLanguage}
                onRun={handleRun}
                onSubmit={handleSubmit}
                height="calc(100vh - 200px)"
              />
            </TabsContent>

            <TabsContent value="console" className="flex-1 mt-0 p-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Console Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {consoleOutput || 'Run your code to see output here...'}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="result" className="flex-1 mt-0 p-4">
              {submissionResult ? (
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {submissionResult.status === 'accepted' ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        {submissionResult.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}
                      </CardTitle>
                      <Badge className={getStatusColor(submissionResult.status)}>
                        {submissionResult.testCasesPassed} / {submissionResult.totalTestCases} test cases passed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Runtime</div>
                          <div className="font-semibold">{submissionResult.runtime}</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Memory</div>
                          <div className="font-semibold">{submissionResult.memory}</div>
                        </div>
                      </div>

                      {submissionResult.failedTestCase && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Failed Test Case:</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Input:</span>
                              <pre className="mt-1 p-2 bg-muted rounded text-sm">
                                {submissionResult.failedTestCase.input}
                              </pre>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Expected:</span>
                              <pre className="mt-1 p-2 bg-green-50 rounded text-sm">
                                {submissionResult.failedTestCase.expectedOutput}
                              </pre>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Your Output:</span>
                              <pre className="mt-1 p-2 bg-red-50 rounded text-sm">
                                {submissionResult.failedTestCase.actualOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {submissionResult.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-sm text-red-800 mb-2">Error:</h4>
                          <pre className="text-sm text-red-700 whitespace-pre-wrap">
                            {submissionResult.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Submit your code to see results</p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
