import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Lightbulb,
  Trophy,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserData } from '../../App';
import { getDomainTerminology } from '../../utils/domainConfig';

interface Question {
  id: string;
  type: 'mcq' | 'subjective' | 'numerical' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation: string;
  difficulty: string;
  topic: string;
  hint?: string;
}

interface QuestionPracticeProps {
  practiceId: string;
  practiceTitle: string;
  totalQuestions: number;
  duration: string;
  subject: string;
  onBack: () => void;
  userData: UserData;
}

// Generate domain-specific questions
function generateQuestions(
  practiceId: string,
  subject: string,
  totalQuestions: number,
  domainId: string
): Question[] {
  const terminology = getDomainTerminology(domainId);
  const isExam = domainId.includes('jee') || domainId.includes('neet');
  
  const questions: Question[] = [];
  
  for (let i = 0; i < totalQuestions; i++) {
    const questionTypes: Question['type'][] = isExam 
      ? ['mcq', 'mcq', 'mcq', 'numerical', 'true-false'] 
      : ['mcq', 'subjective'];
    const type = questionTypes[i % questionTypes.length];
    
    if (type === 'mcq') {
      questions.push({
        id: `q${i + 1}`,
        type: 'mcq',
        question: isExam 
          ? `A particle moving with velocity v is acted upon by three forces shown by the vector triangle PQR. The velocity of the particle will:` 
          : `What is the time complexity of the following code snippet?\n\n\`\`\`python\nfor i in range(n):\n    for j in range(n):\n        print(i, j)\n\`\`\``,
        options: isExam
          ? [
              'Remain constant',
              'Change in magnitude only',
              'Change in direction only',
              'Change both in magnitude and direction'
            ]
          : [
              'O(n)',
              'O(n²)',
              'O(log n)',
              'O(n log n)'
            ],
        correctAnswer: isExam ? 'Change in direction only' : 'O(n²)',
        explanation: isExam
          ? 'Since the three forces form a closed triangle (PQR), their resultant is zero. According to Newton\'s first law, when no net force acts on a body, it continues in its state of motion. However, the direction can change while maintaining constant speed if the forces are balanced in a specific way. The net force being zero means the magnitude remains constant, but the particle can change direction.'
          : 'The code has two nested loops, both running n times. The outer loop runs n times, and for each iteration of the outer loop, the inner loop also runs n times. Therefore, the total number of operations is n × n = n². This gives us O(n²) time complexity.',
        difficulty: i < 3 ? 'Easy' : i < 6 ? 'Medium' : 'Hard',
        topic: subject,
        hint: isExam 
          ? 'Think about what happens when forces form a closed vector triangle' 
          : 'Count how many times the print statement executes'
      });
    } else if (type === 'numerical') {
      questions.push({
        id: `q${i + 1}`,
        type: 'numerical',
        question: `Calculate the acceleration of a block of mass 5 kg when a force of 20 N is applied horizontally. (Answer in m/s²)`,
        correctAnswer: '4',
        explanation: 'Using Newton\'s second law: F = ma\n\nGiven:\n- Force (F) = 20 N\n- Mass (m) = 5 kg\n\nCalculation:\na = F/m\na = 20/5\na = 4 m/s²\n\nTherefore, the acceleration is 4 m/s².',
        difficulty: i < 3 ? 'Easy' : i < 6 ? 'Medium' : 'Hard',
        topic: subject,
        hint: 'Use F = ma formula'
      });
    } else if (type === 'true-false') {
      questions.push({
        id: `q${i + 1}`,
        type: 'true-false',
        question: 'The SI unit of force is Newton, which is equivalent to kg⋅m/s².',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'This statement is TRUE. The Newton (N) is indeed the SI unit of force. From Newton\'s second law (F = ma), we can derive:\n\n1 Newton = 1 kg × 1 m/s²\n\nTherefore, 1 N = 1 kg⋅m/s²\n\nThis relationship is fundamental in physics and helps in understanding the connection between force, mass, and acceleration.',
        difficulty: 'Easy',
        topic: subject,
      });
    } else {
      questions.push({
        id: `q${i + 1}`,
        type: 'subjective',
        question: isExam
          ? 'Explain the principle of conservation of energy with a real-world example.'
          : 'Explain the difference between var, let, and const in JavaScript.',
        correctAnswer: isExam
          ? 'The principle of conservation of energy states that energy cannot be created or destroyed, only converted from one form to another. Example: A pendulum converts potential energy to kinetic energy and back.'
          : 'var has function scope, let has block scope, and const has block scope but cannot be reassigned.',
        explanation: isExam
          ? 'The principle of conservation of energy is one of the fundamental laws of physics. It states that the total energy in an isolated system remains constant over time.\n\nKey Points:\n1. Energy can transform from one form to another\n2. Total energy remains constant\n3. No energy is lost or gained\n\nExample - Pendulum:\n- At the highest point: Maximum potential energy, zero kinetic energy\n- At the lowest point: Zero potential energy, maximum kinetic energy\n- Throughout the motion, PE + KE = constant\n\nThis principle applies to all physical systems and is crucial in solving physics problems.'
          : 'In JavaScript, there are three ways to declare variables:\n\n1. var (ES5):\n   - Function-scoped\n   - Can be redeclared\n   - Hoisted to the top\n   - Example: var x = 10;\n\n2. let (ES6):\n   - Block-scoped\n   - Cannot be redeclared in same scope\n   - Not hoisted\n   - Example: let y = 20;\n\n3. const (ES6):\n   - Block-scoped\n   - Cannot be reassigned\n   - Must be initialized\n   - Example: const z = 30;\n\nBest practice: Use const by default, let when you need to reassign, avoid var.',
        difficulty: i < 3 ? 'Easy' : i < 6 ? 'Medium' : 'Hard',
        topic: subject,
        hint: isExam ? 'Think about energy transformation in everyday objects' : 'Consider scope and mutability'
      });
    }
  }
  
  return questions;
}

export function QuestionPractice({
  practiceId,
  practiceTitle,
  totalQuestions,
  duration,
  subject,
  onBack,
  userData,
}: QuestionPracticeProps) {
  const domainId = userData.domain || 'competitive-programming';
  const [questions] = useState<Question[]>(() => 
    generateQuestions(practiceId, subject, totalQuestions, domainId)
  );
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(parseInt(duration) * 60); // Convert to seconds
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isSubmitted = submittedQuestions.has(currentQuestion.id);
  const userAnswer = userAnswers[currentQuestion.id] || '';
  
  // Check if answer is correct
  const isCorrect = isSubmitted && 
    userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
  
  const isWrong = isSubmitted && 
    userAnswer.trim().toLowerCase() !== currentQuestion.correctAnswer.trim().toLowerCase();

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
    setShowExplanation(false);
    setShowHint(false);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    setSubmittedQuestions((prev) => new Set(prev).add(currentQuestion.id));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(submittedQuestions.has(questions[currentQuestionIndex - 1].id));
      setShowHint(false);
    }
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const answer = userAnswers[q.id] || '';
      if (answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });
    return correct;
  };

  const answeredCount = Object.keys(userAnswers).filter(key => userAnswers[key].trim()).length;
  const progress = (answeredCount / questions.length) * 100;

  if (isCompleted) {
    const score = getScore();
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-purple-200 shadow-2xl">
              <CardHeader className="text-center bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500 text-white rounded-t-lg">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <CardTitle className="text-3xl">Practice Completed! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
                    {score}/{questions.length}
                  </div>
                  <p className="text-xl text-gray-700 mb-2">
                    You scored {percentage.toFixed(1)}%
                  </p>
                  <p className="text-gray-600">
                    {percentage >= 80 ? 'Excellent work! 🌟' : percentage >= 60 ? 'Good job! Keep practicing 👍' : 'Keep learning and try again! 💪'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">{score}</div>
                      <div className="text-sm text-green-600">Correct</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-700">{questions.length - score}</div>
                      <div className="text-sm text-red-600">Incorrect</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">{percentage.toFixed(0)}%</div>
                      <div className="text-sm text-blue-600">Accuracy</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsCompleted(false);
                      setCurrentQuestionIndex(0);
                      setShowExplanation(true);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Review Answers with Explanations
                  </Button>
                  <Button
                    onClick={() => {
                      setUserAnswers({});
                      setSubmittedQuestions(new Set());
                      setCurrentQuestionIndex(0);
                      setIsCompleted(false);
                      setTimeRemaining(parseInt(duration) * 60);
                    }}
                    variant="outline"
                    className="w-full border-purple-300 hover:bg-purple-50"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={onBack}
                    variant="ghost"
                    className="w-full"
                  >
                    Back to Practice List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-mono font-bold text-blue-900">{formatTime(timeRemaining)}</span>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2">
                {answeredCount}/{questions.length} Answered
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">{practiceTitle}</span>
              <span className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-5xl mx-auto p-4 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-orange-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-100 text-purple-700">
                        {currentQuestion.type.toUpperCase()}
                      </Badge>
                      <Badge 
                        className={
                          currentQuestion.difficulty === 'Easy' 
                            ? 'bg-green-100 text-green-700'
                            : currentQuestion.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }
                      >
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline">{currentQuestion.topic}</Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 whitespace-pre-wrap">
                      {currentQuestion.question}
                    </CardTitle>
                  </div>
                  {isSubmitted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-4"
                    >
                      {isCorrect ? (
                        <div className="bg-green-100 p-3 rounded-full">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                      ) : (
                        <div className="bg-red-100 p-3 rounded-full">
                          <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Answer Input */}
                <div>
                  {currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false' ? (
                    <RadioGroup
                      value={userAnswer}
                      onValueChange={handleAnswerChange}
                      disabled={isSubmitted}
                      className="space-y-3"
                    >
                      {currentQuestion.options?.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 border-2 rounded-lg p-4 transition-all ${
                            isSubmitted
                              ? option === currentQuestion.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : option === userAnswer
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 bg-gray-50'
                              : userAnswer === option
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer'
                          }`}
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label
                            htmlFor={`option-${index}`}
                            className={`flex-1 cursor-pointer ${
                              isSubmitted && option === currentQuestion.correctAnswer
                                ? 'text-green-700 font-medium'
                                : isSubmitted && option === userAnswer
                                ? 'text-red-700'
                                : 'text-gray-900'
                            }`}
                          >
                            {option}
                            {isSubmitted && option === currentQuestion.correctAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 inline ml-2" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div>
                      <Label htmlFor="answer" className="text-gray-700 mb-2 block">
                        Your Answer:
                      </Label>
                      <Textarea
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        disabled={isSubmitted}
                        placeholder="Type your answer here..."
                        className={`min-h-32 ${
                          isSubmitted
                            ? isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-purple-200 focus:border-purple-500'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Hint */}
                {!isSubmitted && currentQuestion.hint && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </Button>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded"
                      >
                        <p className="text-orange-800 flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span>{currentQuestion.hint}</span>
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Explanation (shown after submission) */}
                {showExplanation && isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-6 rounded-lg border-l-4 ${
                      isCorrect
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                          {isCorrect ? 'Correct! Well done! 🎉' : 'Incorrect Answer'}
                        </h4>
                        {!isCorrect && (
                          <p className="text-red-700 mb-3">
                            <span className="font-medium">Correct Answer:</span>{' '}
                            <span className="bg-red-100 px-2 py-1 rounded">{currentQuestion.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      <h5 className="font-medium mb-2">Explanation:</h5>
                      <p className="whitespace-pre-wrap leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {!isSubmitted ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700"
                      >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Question Navigator */}
        <Card className="mt-6 shadow-lg bg-slate-800">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-white mb-3">Question Navigator</h4>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => {
                const answered = userAnswers[q.id]?.trim();
                const submitted = submittedQuestions.has(q.id);
                const correct = submitted && userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setShowExplanation(submitted);
                    }}
                    className={`aspect-square rounded-lg border-2 font-medium text-sm transition-all ${
                      index === currentQuestionIndex
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg scale-110'
                        : submitted
                        ? correct
                          ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'
                          : 'border-red-500 bg-red-100 text-red-700 hover:bg-red-200'
                        : answered
                        ? 'border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-red-500 bg-red-100 rounded"></div>
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 bg-blue-100 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
