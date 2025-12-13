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
  ChevronUp,
  Play,
  Send,
  Loader2,
  Lightbulb,
  Zap
} from 'lucide-react';
import { CodeEditor } from '../CodeEditor';
import { CodingProblem } from '../../utils/codingProblems';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { api } from '../../utils/apiClient';
import { motion, AnimatePresence } from 'motion/react';
import { HintDialog } from './HintDialog';
import { SubmissionViewer } from './SubmissionViewer';

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
  code?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
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
  const [selectedHint, setSelectedHint] = useState<{ hint: string; number: number } | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showSubmissionViewer, setShowSubmissionViewer] = useState(false);

  useEffect(() => {
    setShowHints(new Array(problem.hints.length).fill(false));
    loadSubmissions();
  }, [problem.id]);

  const loadSubmissions = async () => {
    try {
      const response = await api.getSubmissions(problem.id);
      
      if (response.success && response.data?.submissions) {
        // Add mock code and complexity data to submissions
        const enhancedSubmissions = response.data.submissions.map((sub: Submission, idx: number) => ({
          ...sub,
          code: sub.code || `// ${sub.language} solution\n\nfunction solution() {\n  // Your code here\n  // This is submission ${idx + 1}\n  return result;\n}`,
          timeComplexity: sub.timeComplexity || ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'][idx % 4],
          spaceComplexity: sub.spaceComplexity || ['O(1)', 'O(n)', 'O(log n)', 'O(n)'][idx % 4],
        }));
        setSubmissions(enhancedSubmissions);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput('');
    setSubmissionResult(null);
    
    try {
      toast.info('Running code...');

      const response = await api.executeCode({
        code: currentCode || problem.starterCode,
        language: selectedLanguage,
        problemId: problem.id,
        testCases: problem.testCases,
      });

      if (response.success && response.data) {
        const results = response.data.results;
        const passed = results.filter((r: any) => r.passed).length;
        const total = results.length;
        
        setConsoleOutput(`Test Results: ${passed}/${total} passed\n\n${
          results.map((r: any, i: number) => 
            `Test Case ${i + 1}: ${r.passed ? '✓ Passed' : '✗ Failed'}${
              r.passed ? '' : `\n  Output: ${r.output}`
            }`
          ).join('\n')
        }`);
        
        if (passed === total) {
          toast.success('All test cases passed!');
        } else {
          toast.warning(`${passed}/${total} test cases passed`);
        }
      }
    } catch (error) {
      toast.error('Failed to run code');
      setConsoleOutput('Error: Failed to execute code. Please try again.');
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setSubmissionResult(null);
    
    try {
      toast.info('Submitting your solution...');

      const response = await api.submitCode({
        code: currentCode || problem.starterCode,
        language: selectedLanguage,
        problemId: problem.id,
        testCases: problem.testCases,
      });

      if (response.success && response.data) {
        const { results, status, avgRuntime, memory, failedCase } = response.data;
        
        const passed = results.filter((r: any) => r.passed).length;
        const total = results.length;
        
        const result: SubmissionResult = {
          status: status,
          testCasesPassed: passed,
          totalTestCases: total,
          runtime: avgRuntime,
          memory: memory,
          failedTestCase: failedCase ? {
            input: failedCase.input,
            expectedOutput: failedCase.expected,
            actualOutput: failedCase.actual,
          } : undefined,
        };
        
        setSubmissionResult(result);
        
        if (status === 'accepted') {
          toast.success('🎉 Solution Accepted!');
        } else {
          toast.error('Solution not accepted');
        }
        
        loadSubmissions();
      }
    } catch (error) {
      toast.error('Submission failed. Please try again.');
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
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800';
      case 'Hard':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
      case 'wrong_answer':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
      case 'time_limit':
        return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950';
      case 'runtime_error':
      case 'compilation_error':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
      default:
        return 'text-muted-foreground bg-muted';
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
            <TabsList className="w-full justify-start border-b border-border/50 rounded-none h-12 px-4 bg-card/50">
              <TabsTrigger value="description" className="gap-2 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400">
                <BookOpen className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="editorial" className="gap-2 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400">
                <Code className="h-4 w-4" />
                Editorial
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2 data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-400">
                <Trophy className="h-4 w-4" />
                Submissions
              </TabsTrigger>
              <TabsTrigger value="discuss" className="gap-2 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-400">
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
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{problem.description}</p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Examples */}
                    <div>
                      <h3 className="text-foreground font-semibold mb-4">Examples</h3>
                      <div className="space-y-4">
                        {problem.examples.map((example, idx) => (
                          <Card key={idx} className="bg-card/50 border-blue-500/30">
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium text-blue-400">Input:</span>
                                  <pre className="mt-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm overflow-x-auto text-foreground">
                                    {example.input}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-purple-400">Output:</span>
                                  <pre className="mt-1 p-3 bg-purple-500/10 border border-purple-500/20 rounded text-sm overflow-x-auto text-foreground">
                                    {example.output}
                                  </pre>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="text-sm font-medium text-emerald-400">Explanation:</span>
                                    <p className="mt-1 text-sm text-foreground p-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
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

                    <Separator className="bg-border/50" />

                    {/* Constraints */}
                    <div>
                      <h3 className="text-foreground font-semibold mb-4">Constraints</h3>
                      <ul className="space-y-2">
                        {problem.constraints.map((constraint, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-orange-400">•</span>
                            <code className="text-sm text-foreground">{constraint.text}</code>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hints */}
                    {problem.hints.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            Hints
                          </h3>
                          <div className="space-y-2">
                            {problem.hints.map((hint, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                onClick={() => setSelectedHint({ hint, number: idx + 1 })}
                                className="w-full justify-between border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 text-foreground"
                              >
                                <span className="flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                                  Hint {idx + 1}
                                </span>
                                <ChevronDown className="h-4 w-4 text-yellow-400" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="editorial" className="mt-0">
                  {problem.editorial ? (
                    <div className="space-y-6">
                      {/* Editorial Header */}
                      <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border-purple-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                              <BookOpen className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-foreground font-semibold">Official Editorial</h3>
                              <p className="text-sm text-muted-foreground">Expert solution explanation</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Editorial Content */}
                      <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                          <CardTitle className="text-foreground">Solution Approach</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none">
                            <div 
                              className="text-foreground leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: problem.editorial.replace(/\n/g, '<br>') }} 
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Complexity Analysis */}
                      {problem.timeComplexity && (
                        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
                          <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-orange-400" />
                              Complexity Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                  </div>
                                  <span className="text-foreground font-medium">Time Complexity</span>
                                </div>
                                <code className="text-lg text-orange-300 bg-orange-500/20 px-4 py-2 rounded-lg border border-orange-500/30">
                                  {problem.timeComplexity}
                                </code>
                              </div>
                              
                              {problem.spaceComplexity && (
                                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                      <Zap className="w-4 h-4 text-red-400" />
                                    </div>
                                    <span className="text-foreground font-medium">Space Complexity</span>
                                  </div>
                                  <code className="text-lg text-red-300 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30">
                                    {problem.spaceComplexity}
                                  </code>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Key Insights */}
                      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                        <CardHeader>
                          <CardTitle className="text-foreground flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-blue-400" />
                            Key Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-foreground">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>Understanding the problem constraints is crucial for choosing the right approach</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>Consider edge cases and boundary conditions in your solution</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>Optimize for both time and space complexity when possible</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="inline-flex p-4 bg-purple-500/10 rounded-full mb-4 border border-purple-500/20">
                          <AlertCircle className="h-12 w-12 text-purple-400" />
                        </div>
                        <p className="text-foreground font-medium mb-2">Editorial Locked</p>
                        <p className="text-sm text-muted-foreground">
                          Editorial will be available after you solve the problem
                        </p>
                      </motion.div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="submissions" className="mt-0">
                  <div className="space-y-2">
                    {submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <Card 
                          key={submission.id}
                          className="cursor-pointer hover:bg-card/80 transition-all border-border/50 hover:border-purple-500/30"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowSubmissionViewer(true);
                          }}
                        >
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className={`${getStatusColor(submission.status)} border`}>
                                  {submission.status === 'accepted' ? (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {submission.status}
                                </Badge>
                                <span className="text-sm text-foreground">
                                  {submission.language}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {submission.runtime}
                                </span>
                                <span>{submission.memory}</span>
                                <span>{new Date(submission.timestamp).toLocaleDateString()}</span>
                                <ChevronDown className="w-4 h-4 text-purple-400" />
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
                onRun={handleRunCode}
                onSubmit={handleSubmit}
                onChange={(code, lang) => {
                  setCurrentCode(code);
                  setSelectedLanguage(lang);
                }}
                isRunning={isRunning}
                isSubmitting={isRunning}
                height="calc(100vh - 180px)"
                showSubmit={true}
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

      {/* Hint Dialog */}
      {selectedHint && (
        <HintDialog
          hint={selectedHint.hint}
          hintNumber={selectedHint.number}
          problemTitle={problem.title}
          open={!!selectedHint}
          onClose={() => setSelectedHint(null)}
        />
      )}

      {/* Submission Viewer */}
      {showSubmissionViewer && selectedSubmission && (
        <SubmissionViewer
          submission={selectedSubmission}
          allSubmissions={submissions}
          problemId={problem.id}
          open={showSubmissionViewer}
          onClose={() => {
            setShowSubmissionViewer(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </div>
  );
}