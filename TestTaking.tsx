import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertCircle,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface Question {
  id: number;
  type: 'mcq' | 'numerical';
  question: string;
  options?: string[];
  correctAnswer: string;
  section: string;
}

interface TestTakingProps {
  test: any;
  onSubmit: (answers: any) => void;
}

// AI-generated questions based on test configuration
function generateQuestions(test: any): Question[] {
  const questions: Question[] = [];
  const subject = test.subject || 'physics';
  const difficulty = test.difficulty || 'Medium';
  const numQuestions = test.questions || 30;

  // Generate a mix of MCQ and numerical questions
  for (let i = 0; i < numQuestions; i++) {
    const isMCQ = i % 5 !== 4; // 4 out of 5 are MCQ, 1 is numerical
    
    if (isMCQ) {
      questions.push({
        id: i + 1,
        type: 'mcq',
        question: getQuestionText(subject, difficulty, i + 1, 'mcq'),
        options: getOptions(subject, i + 1),
        correctAnswer: 'A', // Mock correct answer
        section: subject,
      });
    } else {
      questions.push({
        id: i + 1,
        type: 'numerical',
        question: getQuestionText(subject, difficulty, i + 1, 'numerical'),
        correctAnswer: '42', // Mock correct answer
        section: subject,
      });
    }
  }

  return questions;
}

function getQuestionText(subject: string, difficulty: string, num: number, type: string): string {
  const questionTemplates: any = {
    physics: {
      mcq: [
        `A particle of mass 2 kg is moving with velocity 10 m/s. What is its kinetic energy?`,
        `The dimension of Planck's constant is same as that of:`,
        `A ball is thrown vertically upward with velocity 20 m/s. What is the maximum height reached?`,
        `In Young's double slit experiment, if the distance between slits is doubled, the fringe width:`,
      ],
      numerical: [
        `Calculate the equivalent resistance (in Ω) when three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel.`,
        `A wire of length 10m and resistance 20Ω is stretched to double its length. Find the new resistance (in Ω).`,
      ],
    },
    mathematics: {
      mcq: [
        `If f(x) = x² + 2x + 1, then f'(x) equals:`,
        `The number of ways to arrange 5 different books on a shelf is:`,
        `If sin θ = 3/5 and θ is in second quadrant, then cos θ equals:`,
      ],
      numerical: [
        `Find the value of ∫₀² (x² + 1) dx.`,
        `If the sum of first n natural numbers is 465, find the value of n.`,
      ],
    },
    chemistry: {
      mcq: [
        `Which of the following has the highest electron affinity?`,
        `The IUPAC name of CH₃-CH(CH₃)-CH₂-OH is:`,
        `In SN2 reaction, the intermediate formed is:`,
      ],
      numerical: [
        `Calculate the pH of 0.01 M HCl solution.`,
        `What is the oxidation state of Cr in K₂Cr₂O₇?`,
      ],
    },
  };

  const subjectQuestions = questionTemplates[subject] || questionTemplates.physics;
  const typeQuestions = subjectQuestions[type] || subjectQuestions.mcq;
  
  return `Q${num}. ${typeQuestions[num % typeQuestions.length]}`;
}

function getOptions(subject: string, num: number): string[] {
  const optionTemplates: any = {
    physics: [
      ['100 J', '200 J', '50 J', '150 J'],
      ['Energy × Time', 'Force × Distance', 'Momentum × Distance', 'Power × Time'],
      ['10 m', '20 m', '30 m', '40 m'],
      ['Remains same', 'Becomes half', 'Becomes double', 'Becomes one-fourth'],
    ],
    mathematics: [
      ['2x + 2', 'x + 2', '2x', 'x² + 2'],
      ['120', '60', '24', '5'],
      ['-4/5', '4/5', '-3/5', '3/5'],
    ],
    chemistry: [
      ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'],
      ['2-methylpropan-1-ol', '2-methylpropanol', 'Isobutanol', 'Both A and C'],
      ['Carbocation', 'Carbanion', 'Transition state', 'Free radical'],
    ],
  };

  const subjectOptions = optionTemplates[subject] || optionTemplates.physics;
  return subjectOptions[num % subjectOptions.length];
}

export function TestTaking({ test, onSubmit }: TestTakingProps) {
  const [questions] = useState<Question[]>(() => generateQuestions(test));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  
  // Parse duration to get minutes
  const durationMatch = test.duration.match(/\d+/);
  const totalMinutes = durationMatch ? parseInt(durationMatch[0]) : 60;
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60); // in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setVisited(new Set([...visited, nextQ]));
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQ = currentQuestion - 1;
      setCurrentQuestion(prevQ);
      setVisited(new Set([...visited, prevQ]));
    }
  };

  const handleSaveAndNext = () => {
    handleNext();
  };

  const handleMarkForReview = () => {
    setMarkedForReview(new Set([...markedForReview, currentQuestion]));
    handleNext();
  };

  const handleClearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion];
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onSubmit({
      answers,
      markedForReview: Array.from(markedForReview),
      timeSpent: (totalMinutes * 60) - timeLeft,
    });
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined && markedForReview.has(index)) {
      return 'answered-marked';
    }
    if (answers[index] !== undefined) {
      return 'answered';
    }
    if (markedForReview.has(index)) {
      return 'marked';
    }
    if (visited.has(index)) {
      return 'not-answered';
    }
    return 'not-visited';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-600 text-white';
      case 'not-answered': return 'bg-red-600 text-white';
      case 'marked': return 'bg-purple-600 text-white';
      case 'answered-marked': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const notAnsweredCount = visited.size - answeredCount;
  const markedCount = markedForReview.size;
  const notVisitedCount = questions.length - visited.size;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900">{test.title}</h3>
            <p className="text-xs text-gray-600">{test.alignedToExam} Pattern</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-6">
              <Badge className="bg-indigo-600">
                Section: {currentQ.section.charAt(0).toUpperCase() + currentQ.section.slice(1)}
              </Badge>
            </div>

            {/* Question */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Q{currentQ.id}</Badge>
                    <div className="flex-1">
                      <p className="text-gray-900 leading-relaxed">{currentQ.question}</p>
                    </div>
                  </div>
                </div>

                {currentQ.type === 'mcq' && currentQ.options ? (
                  <div className="space-y-3">
                    {currentQ.options.map((option, idx) => {
                      const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D
                      const isSelected = answers[currentQuestion] === optionLabel;
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(optionLabel)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm text-gray-700">
                              <span className="text-gray-900 mr-2">({optionLabel})</span>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">
                      Enter your answer (rounded to nearest integer):
                    </label>
                    <Input
                      type="number"
                      value={answers[currentQuestion] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      placeholder="Enter numerical answer"
                      className="max-w-xs"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentQuestion === questions.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearResponse}
                  disabled={!answers[currentQuestion]}
                >
                  Clear Response
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Mark for Review & Next
                </Button>
                <Button
                  onClick={handleSaveAndNext}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Save & Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Palette */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h4 className="text-gray-900 mb-4">Question Palette</h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-600" />
                <span className="text-gray-700">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-600" />
                <span className="text-gray-700">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-200" />
                <span className="text-gray-700">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-600" />
                <span className="text-gray-700">Marked</span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Answered:</span>
                <span className="text-gray-900">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Not Answered:</span>
                <span className="text-gray-900">{notAnsweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marked:</span>
                <span className="text-gray-900">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Not Visited:</span>
                <span className="text-gray-900">{notVisitedCount}</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const status = getQuestionStatus(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setVisited(new Set([...visited, idx]));
                    }}
                    className={`w-full aspect-square rounded flex items-center justify-center text-sm transition-all ${
                      getStatusColor(status)
                    } ${
                      currentQuestion === idx
                        ? 'ring-2 ring-offset-2 ring-indigo-600'
                        : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Submit Test
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="space-y-3 pt-3">
                      <p>Are you sure you want to submit the test? You won't be able to change your answers after submission.</p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <div className="text-sm space-y-1">
                            <p className="text-yellow-900">Summary:</p>
                            <p className="text-yellow-800">• Answered: {answeredCount}</p>
                            <p className="text-yellow-800">• Not Answered: {notAnsweredCount}</p>
                            <p className="text-yellow-800">• Not Visited: {notVisitedCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Test</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    Yes, Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
