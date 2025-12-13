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
  Eye,
  Smartphone,
  Monitor,
  Server,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { CodeEditor } from '../CodeEditor';
import { CodingProblem, TestCase } from '../../utils/codingProblems';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { getDomainConfig } from '../../utils/domainConfig';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { api } from '../../utils/apiClient';
import { motion, AnimatePresence } from 'motion/react';

interface EnhancedProblemDetailProps {
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
    explanation?: string;
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

export function EnhancedProblemDetail({ problem, onBack, domainId }: EnhancedProblemDetailProps) {
  const domainConfig = getDomainConfig(domainId);
  const isCodingDomain = domainConfig.category === 'coding';
  const isFrontend = domainId === 'frontend';
  const isBackend = domainId === 'backend';
  const isMobile = domainId === 'mobile-dev';

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
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(isFrontend);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setShowHints(new Array(problem.hints.length).fill(false));
    loadSubmissions();
  }, [problem.id]);

  const loadSubmissions = async () => {
    try {
      setIsRunning(true);
      const response = await api.getSubmissions(problem.id);
      
      if (response.success && response.data?.submissions) {
        setSubmissions(response.data.submissions);
      } else {
        // Fallback to empty array if no submissions
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
      toast.error('Failed to load submissions');
    } finally {
      setIsRunning(false);
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
        const { results, status, avgRuntime, memory, failedCase, submissionId } = response.data;
        
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
            explanation: 'Check your logic for this test case'
          } : undefined,
        };
        
        setSubmissionResult(result);
        
        if (status === 'accepted') {
          toast.success('🎉 Solution Accepted!');
        } else {
          toast.error('Solution not accepted');
        }
        
        // Reload submissions
        loadSubmissions();
      }
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const updateFrontendPreview = (code: string, language: string) => {
    if (language === 'html' || language === 'javascript') {
      setPreviewHtml(code);
      setShowPreview(true);
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
        return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950';
      case 'compilation_error':
        return 'text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const renderPreviewPanel = () => {
    if (!isFrontend || !showPreview) return null;

    return (
      <Card className="h-full border-l-4 border-l-cyan-500 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" />
              Live Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`bg-white rounded-lg overflow-hidden ${
            previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
          }`}>
            <iframe
              srcDoc={previewHtml}
              title="Preview"
              className={`w-full ${previewMode === 'mobile' ? 'h-[600px]' : 'h-[500px]'} border-0`}
              sandbox="allow-scripts"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-border bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-purple-500/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    {problem.title}
                  </h1>
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    {problem.points} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    {problem.submissions} submissions
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {problem.acceptance}% acceptance
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={liked ? 'text-blue-500' : ''}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBookmarked(!bookmarked)}
                className={bookmarked ? 'text-yellow-500' : ''}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isFrontend ? (
          // Frontend: Side-by-side editor and preview
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                {/* Problem Description */}
                <div className="border-b border-border bg-gray-900/30 p-4">
                  <ScrollArea className="h-48">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300">{problem.description}</p>
                      
                      {problem.examples.map((example, idx) => (
                        <div key={idx} className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <p className="text-sm text-purple-400 mb-2">Example {idx + 1}:</p>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-400">Input:</span> <code className="text-green-400">{example.input}</code></p>
                            <p><span className="text-gray-400">Output:</span> <code className="text-blue-400">{example.output}</code></p>
                            {example.explanation && (
                              <p className="text-gray-400 text-xs mt-2">{example.explanation}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Code Editor */}
                <div className="flex-1">
                  <CodeEditor
                    defaultCode={problem.starterCode || ''}
                    language={selectedLanguage}
                    onRun={handleRunCode}
                    onSubmit={handleSubmit}
                    showSubmit={true}
                    height="calc(100vh - 180px)"
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              {renderPreviewPanel()}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          // LeetCode-style: Horizontal split - Problem on left, Editor+Console on right
          <ResizablePanelGroup direction="horizontal">
            {/* Left Panel: Problem Description */}
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="mx-4 mt-4 bg-gray-800/50">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="hints">Hints</TabsTrigger>
                  <TabsTrigger value="editorial">Editorial</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 px-4">
                  <TabsContent value="description" className="mt-4">
                    <Card className="border-l-4 border-l-purple-500 bg-gray-900/30">
                      <CardHeader>
                        <CardTitle>Problem Description</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300">{problem.description}</p>
                        
                        {problem.constraints && (
                          <div>
                            <h3 className="text-lg mb-2 text-purple-400">Constraints</h3>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                              {problem.constraints.map((constraint, idx) => (
                                <li key={idx}>{constraint.text}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h3 className="text-lg mb-2 text-purple-400">Examples</h3>
                          {problem.examples.map((example, idx) => (
                            <div key={idx} className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                              <p className="text-sm text-purple-400 mb-2">Example {idx + 1}:</p>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-gray-400">Input:</span> <code className="text-green-400">{example.input}</code></p>
                                <p><span className="text-gray-400">Output:</span> <code className="text-blue-400">{example.output}</code></p>
                                {example.explanation && (
                                  <p className="text-gray-400 text-xs mt-2 bg-gray-900/50 p-2 rounded">
                                    <span className="text-cyan-400">Explanation:</span> {example.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {problem.topics && problem.topics.length > 0 && (
                          <div>
                            <h3 className="text-lg mb-2 text-purple-400">Topics</h3>
                            <div className="flex flex-wrap gap-2">
                              {problem.topics.map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="bg-purple-500/10 border-purple-500/30">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="hints" className="mt-4 space-y-4">
                    {problem.hints.map((hint, idx) => (
                      <Card key={idx} className="bg-gray-900/30 border-orange-500/30">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="h-5 w-5 text-orange-400" />
                              <CardTitle>Hint {idx + 1}</CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleHint(idx)}
                            >
                              {showHints[idx] ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                          </div>
                        </CardHeader>
                        {showHints[idx] && (
                          <CardContent>
                            <p className="text-gray-300">{hint}</p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="submissions" className="mt-4">
                    <Card className="bg-gray-900/30">
                      <CardHeader>
                        <CardTitle>Your Submissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {submissions.length === 0 ? (
                          <p className="text-gray-400 text-center py-8">No submissions yet</p>
                        ) : (
                          <div className="space-y-2">
                            {submissions.map((sub) => (
                              <div
                                key={sub.id}
                                className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-between"
                              >
                                <div>
                                  <Badge className={getStatusColor(sub.status)}>
                                    {sub.status}
                                  </Badge>
                                  <p className="text-sm text-gray-400 mt-1">{sub.timestamp}</p>
                                </div>
                                <div className="text-right text-sm text-gray-400">
                                  <p>{sub.language}</p>
                                  <p>{sub.runtime} | {sub.memory}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="editorial" className="mt-4">
                    <Card className="bg-gray-900/30 border-green-500/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-green-400" />
                          Editorial
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="prose prose-invert max-w-none">
                        <p className="text-gray-300">
                          The editorial will be available after you solve the problem or after the contest ends.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle />

            {/* Right Panel: Code Editor + Console (Vertical Split) */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <ResizablePanelGroup direction="vertical">
                {/* Top: Code Editor */}
                <ResizablePanel defaultSize={60} minSize={30}>
                  <div className="h-full w-full">
                    <CodeEditor
                      defaultCode={problem.starterCode || ''}
                      language={selectedLanguage}
                      onRun={handleRunCode}
                      onSubmit={handleSubmit}
                      showSubmit={true}
                      onChange={(code) => setCurrentCode(code)}
                      height="100%"
                    />
                  </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* Bottom: Test Cases + Console + Result */}
                <ResizablePanel defaultSize={40} minSize={20}>
                  <Tabs 
                    value={submissionResult ? 'testResult' : 'testcase'} 
                    onValueChange={setActiveTab} 
                    className="h-full flex flex-col"
                  >
                    <TabsList className="mx-4 mt-2 bg-gray-800/50">
                      <TabsTrigger value="testcase">Testcase</TabsTrigger>
                      <TabsTrigger value="testResult">Test Result</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-hidden px-4 pb-4">
                      <TabsContent value="testcase" className="h-full mt-4">
                        <Card className="h-full bg-gray-900/30 border border-gray-800">
                          <CardContent className="p-4 h-full">
                            <ScrollArea className="h-full">
                              {problem.examples.map((example, idx) => (
                                <div key={idx} className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <p className="text-sm text-purple-400 mb-2 font-semibold">Case {idx + 1}</p>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-400">nums = </span>
                                      <code className="text-green-400">{example.input}</code>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Output = </span>
                                      <code className="text-blue-400">{example.output}</code>
                                    </div>
                                    {example.explanation && (
                                      <div className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-700">
                                        <span className="text-cyan-400">Explanation:</span> {example.explanation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {problem.testCases && problem.testCases.length > 0 && (
                                <>
                                  {problem.testCases.slice(0, 3).map((testCase, idx) => (
                                    <div key={`test-${idx}`} className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                      <p className="text-sm text-purple-400 mb-2 font-semibold">Case {problem.examples.length + idx + 1}</p>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="text-gray-400">Input = </span>
                                          <code className="text-green-400">{testCase.input}</code>
                                        </div>
                                        <div>
                                          <span className="text-gray-400">Expected = </span>
                                          <code className="text-blue-400">{testCase.expectedOutput}</code>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="testResult" className="h-full mt-4">
                        {submissionResult ? (
                          <Card className={`h-full ${
                            submissionResult.status === 'accepted' 
                              ? 'border-green-500/50 bg-green-900/10' 
                              : 'border-red-500/50 bg-red-900/10'
                          }`}>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                {submissionResult.status === 'accepted' ? (
                                  <>
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="text-green-500">Accepted</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    <span className="text-red-500">
                                      {submissionResult.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-2 bg-gray-800/50 rounded">
                                  <p className="text-xs text-gray-400">Test Cases</p>
                                  <p className="text-sm font-semibold">
                                    {submissionResult.testCasesPassed}/{submissionResult.totalTestCases}
                                  </p>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded">
                                  <p className="text-xs text-gray-400">Runtime</p>
                                  <p className="text-sm font-semibold">{submissionResult.runtime}</p>
                                </div>
                                <div className="p-2 bg-gray-800/50 rounded">
                                  <p className="text-xs text-gray-400">Memory</p>
                                  <p className="text-sm font-semibold">{submissionResult.memory}</p>
                                </div>
                              </div>

                              {submissionResult.error && (
                                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                  <p className="text-sm text-red-400">{submissionResult.error}</p>
                                </div>
                              )}

                              {submissionResult.failedTestCase && (
                                <ScrollArea className="h-48">
                                  <div className="space-y-2">
                                    <h4 className="text-sm text-red-400 font-semibold">Failed Test Case:</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="p-2 bg-gray-800/50 rounded">
                                        <p className="text-gray-400 text-xs mb-1">Input:</p>
                                        <code className="text-green-400 text-xs">{submissionResult.failedTestCase.input}</code>
                                      </div>
                                      <div className="p-2 bg-gray-800/50 rounded">
                                        <p className="text-gray-400 text-xs mb-1">Expected:</p>
                                        <code className="text-blue-400 text-xs">{submissionResult.failedTestCase.expectedOutput}</code>
                                      </div>
                                      <div className="p-2 bg-gray-800/50 rounded">
                                        <p className="text-gray-400 text-xs mb-1">Your Output:</p>
                                        <code className="text-red-400 text-xs">{submissionResult.failedTestCase.actualOutput}</code>
                                      </div>
                                    </div>
                                  </div>
                                </ScrollArea>
                              )}

                              {consoleOutput && (
                                <div className="mt-3">
                                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Console Output:</h4>
                                  <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                                      {consoleOutput}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="h-full bg-gray-900/30 border border-gray-800">
                            <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                              <Code className="h-12 w-12 text-gray-600 mb-3" />
                              <p className="text-gray-400">Run your code to see test results</p>
                              <p className="text-xs text-gray-500 mt-2">Click "Run" to test against sample cases</p>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}