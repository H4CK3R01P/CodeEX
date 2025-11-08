import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface TestResultsProps {
  test: any;
  results: any;
  onBack: () => void;
}

export function TestResults({ test, results, onBack }: TestResultsProps) {
  // Mock results data - in a real app this would come from the backend
  const score = 245;
  const totalMarks = test.marks;
  const percentage = ((score / totalMarks) * 100).toFixed(1);
  const answered = test.questions - 8;
  const correct = 66;
  const incorrect = 18;
  const unattempted = 6;

  const performanceData = [
    { name: 'Correct', value: correct, color: '#10b981' },
    { name: 'Incorrect', value: incorrect, color: '#ef4444' },
    { name: 'Unattempted', value: unattempted, color: '#94a3b8' },
  ];

  const subjectWiseData = [
    { subject: test.subject || 'Physics', attempted: 28, correct: 22, incorrect: 6 },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Score Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4">
                  <div>
                    <div className="text-3xl">{percentage}%</div>
                  </div>
                </div>
                <h2 className="text-gray-900 mb-2">Test Completed!</h2>
                <p className="text-gray-600 mb-4">{test.title}</p>
                
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Score</span>
                    </div>
                    <div className="text-2xl text-green-600">{score}/{totalMarks}</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm text-gray-600">Accuracy</span>
                    </div>
                    <div className="text-2xl text-indigo-600">
                      {correct > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0}%
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Rank</span>
                    </div>
                    <div className="text-2xl text-purple-600">Top 15%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Performance Overview
                </h3>
                
                <div className="flex items-center justify-center mb-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Correct Answers</span>
                    <span className="text-sm text-gray-900">{correct} questions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Incorrect Answers</span>
                    <span className="text-sm text-gray-900">{incorrect} questions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unattempted</span>
                    <span className="text-sm text-gray-900">{unattempted} questions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Time Analysis
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Total Time Taken</span>
                      <span className="text-gray-900">{test.duration}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Avg. Time per Question</span>
                      <span className="text-gray-900">2.5 mins</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 mb-1">Time Management</p>
                        <p className="text-xs text-blue-700">
                          You managed your time well! Try to solve questions faster to have more time for review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject-wise Analysis */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4">Subject-wise Performance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subjectWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="correct" fill="#10b981" name="Correct" />
                    <Bar dataKey="incorrect" fill="#ef4444" name="Incorrect" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h4 className="text-sm text-indigo-900 mb-2">Strong Areas</h4>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• {test.chapters?.[0] || 'Core concepts'}</li>
                      <li>• Problem-solving techniques</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="text-sm text-orange-900 mb-2">Areas to Improve</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• {test.chapters?.[1] || 'Advanced topics'}</li>
                      <li>• Time management in complex problems</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" onClick={onBack}>
              Back to Tests
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              View Detailed Solutions
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Retake Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
