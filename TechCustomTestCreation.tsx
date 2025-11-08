import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Slider } from '../ui/slider';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Code,
  Play,
  Send,
  FileText,
  Clock,
  Award,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { UserData } from '../../App';
import { getDomainConfig, getDomainSubjects } from '../../utils/domainConfig';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';

interface TechCustomTestCreationProps {
  onBack: () => void;
  onTestCreated: (test: any) => void;
  userData: UserData;
  domainId: string;
}

interface TestConfiguration {
  testName: string;
  selectedTopics: string[];
  answerFormat: 'mcq' | 'code-run' | 'code-submit';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  correctMarks: number;
  incorrectMarks: number;
}

export function TechCustomTestCreation({ 
  onBack, 
  onTestCreated, 
  userData,
  domainId 
}: TechCustomTestCreationProps) {
  const [step, setStep] = useState(1);
  const domainConfig = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  
  const [config, setConfig] = useState<TestConfiguration>({
    testName: '',
    selectedTopics: [],
    answerFormat: 'code-run',
    difficulty: 'medium',
    duration: 60,
    correctMarks: 10,
    incorrectMarks: 0,
  });

  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([subjects[0]?.id || '']);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleTopic = (topicId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topicId)
        ? prev.selectedTopics.filter(id => id !== topicId)
        : [...prev.selectedTopics, topicId]
    }));
  };

  const handleNext = () => {
    if (step === 1 && config.selectedTopics.length === 0) {
      toast.error('Please select at least one topic');
      return;
    }
    if (step === 3 && !config.testName.trim()) {
      toast.error('Please enter a test name');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCreateTest();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleCreateTest = () => {
    const test = {
      id: `test-${Date.now()}`,
      name: config.testName,
      domain: domainId,
      topics: config.selectedTopics,
      answerFormat: config.answerFormat,
      difficulty: config.difficulty,
      duration: config.duration,
      correctMarks: config.correctMarks,
      incorrectMarks: config.incorrectMarks,
      totalQuestions: config.selectedTopics.length * 5, // 5 questions per topic
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    toast.success('Custom test created successfully! 🎉');
    onTestCreated(test);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-500 hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'hard':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getAnswerFormatIcon = (format: string) => {
    switch (format) {
      case 'mcq':
        return <FileText className="h-5 w-5" />;
      case 'code-run':
        return <Play className="h-5 w-5" />;
      case 'code-submit':
        return <Send className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <Code className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Select Topics
        </h2>
        <p className="text-gray-400">
          Choose multiple topics for your custom test
        </p>
      </div>

      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Available Topics ({config.selectedTopics.length} selected)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 cursor-pointer border border-gray-700"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <div>
                        <p>{subject.name}</p>
                        <p className="text-sm text-gray-400">
                          {subject.chapters.length} modules
                        </p>
                      </div>
                    </div>
                    <Badge className={subject.color}>
                      {expandedSubjects.includes(subject.id) ? '−' : '+'}
                    </Badge>
                  </div>

                  {expandedSubjects.includes(subject.id) && (
                    <div className="ml-6 space-y-2 border-l-2 border-purple-500/30 pl-4">
                      {subject.chapters.map((chapter) => (
                        <div key={chapter.id} className="space-y-2">
                          <p className="text-sm text-purple-400">{chapter.name}</p>
                          <div className="space-y-1">
                            {chapter.topics.map((topic, idx) => {
                              const topicId = `${subject.id}-${chapter.id}-${idx}`;
                              const isSelected = config.selectedTopics.includes(topicId);
                              
                              return (
                                <div
                                  key={topicId}
                                  className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 cursor-pointer ${
                                    isSelected ? 'bg-purple-900/30 border border-purple-500/50' : ''
                                  }`}
                                  onClick={() => toggleTopic(topicId)}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleTopic(topicId)}
                                  />
                                  <Label className="cursor-pointer flex-1 text-sm">
                                    {topic}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {config.selectedTopics.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-400 mb-2">Selected Topics:</p>
            <div className="flex flex-wrap gap-2">
              {config.selectedTopics.map((topicId, idx) => (
                <Badge key={topicId} className="bg-purple-500/20 border-purple-500/50">
                  Topic {idx + 1}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
          Answer Format
        </h2>
        <p className="text-gray-400">
          Choose how students will answer the questions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* MCQ Option */}
        <Card
          className={`cursor-pointer transition-all border-2 ${
            config.answerFormat === 'mcq'
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/50'
          }`}
          onClick={() => setConfig(prev => ({ ...prev, answerFormat: 'mcq' }))}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-lg">Multiple Choice Questions</p>
                <p className="text-sm text-gray-400 font-normal">
                  Students select from predefined options
                </p>
              </div>
              {config.answerFormat === 'mcq' && (
                <Check className="h-6 w-6 text-purple-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                Fast to grade
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                Auto-evaluation
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                Best for theory
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Code Run + Submit */}
        <Card
          className={`cursor-pointer transition-all border-2 ${
            config.answerFormat === 'code-run'
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/50'
          }`}
          onClick={() => setConfig(prev => ({ ...prev, answerFormat: 'code-run' }))}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Play className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-lg">Run + Test Cases + Submit</p>
                <p className="text-sm text-gray-400 font-normal">
                  Full code editor with run, test, and submit options
                </p>
              </div>
              {config.answerFormat === 'code-run' && (
                <Check className="h-6 w-6 text-purple-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                Full IDE experience
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                Test cases validation
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                Best for coding
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                Like LeetCode
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Direct Submit */}
        <Card
          className={`cursor-pointer transition-all border-2 ${
            config.answerFormat === 'code-submit'
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/50'
          }`}
          onClick={() => setConfig(prev => ({ ...prev, answerFormat: 'code-submit' }))}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Send className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-lg">Direct Submit</p>
                <p className="text-sm text-gray-400 font-normal">
                  Code editor with submit button only (no test run)
                </p>
              </div>
              {config.answerFormat === 'code-submit' && (
                <Check className="h-6 w-6 text-purple-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30">
                Simple interface
              </Badge>
              <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30">
                Quick submission
              </Badge>
              <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30">
                Timed tests
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-purple-400" />
            Format Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-400 space-y-2">
          {config.answerFormat === 'mcq' && (
            <>
              <p>✓ Students will see 4 options per question</p>
              <p>✓ Instant feedback on submission</p>
              <p>✓ Auto-graded with correct/incorrect marks</p>
            </>
          )}
          {config.answerFormat === 'code-run' && (
            <>
              <p>✓ Full code editor with syntax highlighting</p>
              <p>✓ Run button to test code with sample cases</p>
              <p>✓ Submit button to validate against all test cases</p>
              <p>✓ Real-time compilation and execution</p>
            </>
          )}
          {config.answerFormat === 'code-submit' && (
            <>
              <p>✓ Simplified code editor interface</p>
              <p>✓ Submit button only - no run/test option</p>
              <p>✓ Faster for timed competitive tests</p>
              <p>✓ Evaluated after test completion</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-4">
          <Award className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Test Configuration
        </h2>
        <p className="text-gray-400">
          Configure test settings and scoring
        </p>
      </div>

      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-cyan-500/30">
        <CardContent className="pt-6 space-y-6">
          {/* Test Name */}
          <div className="space-y-2">
            <Label htmlFor="testName" className="text-purple-400">
              Test Name *
            </Label>
            <Input
              id="testName"
              placeholder="e.g., React Hooks Mastery Test"
              value={config.testName}
              onChange={(e) => setConfig(prev => ({ ...prev, testName: e.target.value }))}
              className="bg-gray-900/50 border-gray-700 focus:border-purple-500"
            />
          </div>

          <Separator className="bg-gray-700" />

          {/* Difficulty Level */}
          <div className="space-y-3">
            <Label className="text-purple-400">Difficulty Level *</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={config.difficulty === diff ? 'default' : 'outline'}
                  className={config.difficulty === diff ? getDifficultyColor(diff) : 'border-gray-700'}
                  onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-purple-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (minutes) *
              </Label>
              <Badge className="bg-cyan-500/20 border-cyan-500/50">
                {config.duration} min ({Math.floor(config.duration / 60)}h {config.duration % 60}m)
              </Badge>
            </div>
            <Slider
              value={[config.duration]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, duration: value }))}
              min={15}
              max={240}
              step={15}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>15 min</span>
              <span>1h</span>
              <span>2h</span>
              <span>4h (max)</span>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Correct Answer Marks */}
          <div className="space-y-3">
            <Label className="text-purple-400">Marks for Correct Answer *</Label>
            <RadioGroup
              value={config.correctMarks.toString()}
              onValueChange={(value) => setConfig(prev => ({ ...prev, correctMarks: parseInt(value) }))}
              className="grid grid-cols-4 gap-3"
            >
              {[5, 10, 15, 20].map((marks) => (
                <div key={marks} className="relative">
                  <RadioGroupItem value={marks.toString()} id={`correct-${marks}`} className="peer sr-only" />
                  <Label
                    htmlFor={`correct-${marks}`}
                    className="flex items-center justify-center p-3 rounded-lg border-2 border-gray-700 bg-gray-900/50 cursor-pointer peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-900/20 hover:border-green-500/50"
                  >
                    <span className="text-lg">+{marks}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator className="bg-gray-700" />

          {/* Incorrect Answer Marks */}
          <div className="space-y-3">
            <Label className="text-purple-400">Marks for Incorrect Answer *</Label>
            <RadioGroup
              value={config.incorrectMarks.toString()}
              onValueChange={(value) => setConfig(prev => ({ ...prev, incorrectMarks: parseInt(value) }))}
              className="grid grid-cols-5 gap-3"
            >
              {[0, -1, -2, -3, -5].map((marks) => (
                <div key={marks} className="relative">
                  <RadioGroupItem value={marks.toString()} id={`incorrect-${marks}`} className="peer sr-only" />
                  <Label
                    htmlFor={`incorrect-${marks}`}
                    className="flex items-center justify-center p-3 rounded-lg border-2 border-gray-700 bg-gray-900/50 cursor-pointer peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-900/20 hover:border-red-500/50"
                  >
                    <span className="text-lg">{marks === 0 ? '0' : marks}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-sm">Test Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Topics Selected:</span>
            <Badge className="bg-purple-500/20">{config.selectedTopics.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Answer Format:</span>
            <Badge className="bg-purple-500/20">
              {config.answerFormat === 'mcq' ? 'MCQ' : 
               config.answerFormat === 'code-run' ? 'Run + Submit' : 'Direct Submit'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Questions:</span>
            <Badge className="bg-purple-500/20">{config.selectedTopics.length * 5}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Marks:</span>
            <Badge className="bg-purple-500/20">
              {config.selectedTopics.length * 5 * config.correctMarks}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    s <= step
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    s < step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Select Topics</span>
            <span>Answer Format</span>
            <span>Configuration</span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90"
          >
            {step === 3 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Create Test
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
