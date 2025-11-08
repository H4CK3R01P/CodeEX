import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  ArrowLeft,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Flame,
  Star,
  ChevronRight,
  Circle,
  Activity,
  FileText,
  Filter,
  Bookmark,
  ChevronDown,
  ChevronUp,
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from 'recharts';
import { generateMockTestResults } from '../../utils/mockTestData';
import { UserData } from '../../App';

interface TestFeedbackProps {
  test: any;
  userData: UserData;
  onComplete: () => void;
  onSkip: () => void;
}

export function TestFeedback({ test, userData, onComplete, onSkip }: TestFeedbackProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [questionFilter, setQuestionFilter] = useState({
    subject: 'All',
    status: 'All',
    difficulty: 'All',
  });
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  
  // Get mock results data with domain-specific configuration
  const mockResults = generateMockTestResults(test, userData.domain);
  
  const COLORS = ['#10b981', '#ef4444', '#94a3b8', '#3b82f6', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      {/* Animated Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onSkip}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                <Flame className="w-3 h-3 mr-1" />
                {mockResults.achievements.streakDays} Day Streak
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
                <Trophy className="w-3 h-3 mr-1" />
                +{mockResults.achievements.coinsEarned} Coins
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        
        {/* Score Hero Section */}
        <div className="mb-8">
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Score Display */}
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-white/90 text-sm">Test Completed</span>
                  </div>
                  <h1 className="text-4xl mb-2">{test.title}</h1>
                  <p className="text-white/80 mb-6">{test.subject} • {test.questions} Questions</p>
                  
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                      <div className="text-center">
                        <div className="text-5xl">{mockResults.percentage}%</div>
                        <div className="text-sm text-white/80 mt-1">Score</div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                      <Trophy className="w-8 h-8 text-yellow-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-2xl">{mockResults.score}</div>
                      <div className="text-xs text-white/70">Marks</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-2xl">#{mockResults.rank}</div>
                      <div className="text-xs text-white/70">Rank</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-2xl">{mockResults.timeSpent}m</div>
                      <div className="text-xs text-white/70">Time</div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Stats */}
                <div className="space-y-4">
                  {/* Performance Breakdown */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <h3 className="text-white mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Performance Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-white/90 mb-1">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Correct
                          </span>
                          <span>{mockResults.correctAnswers}</span>
                        </div>
                        <Progress value={(mockResults.correctAnswers / mockResults.totalQuestions) * 100} className="h-2 bg-white/20" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-white/90 mb-1">
                          <span className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-400" />
                            Incorrect
                          </span>
                          <span>{mockResults.incorrectAnswers}</span>
                        </div>
                        <Progress value={(mockResults.incorrectAnswers / mockResults.totalQuestions) * 100} className="h-2 bg-white/20" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-white/90 mb-1">
                          <span className="flex items-center gap-2">
                            <Circle className="w-4 h-4 text-gray-400" />
                            Unattempted
                          </span>
                          <span>{mockResults.unattempted}</span>
                        </div>
                        <Progress value={(mockResults.unattempted / mockResults.totalQuestions) * 100} className="h-2 bg-white/20" />
                      </div>
                    </div>
                  </div>

                  {/* AI Prediction Preview */}
                  <div className="bg-gradient-to-br from-yellow-400/90 to-orange-400/90 backdrop-blur-sm rounded-xl p-5 border border-yellow-300/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-5 h-5 text-yellow-900" />
                          <h3 className="text-yellow-900">AI Prediction</h3>
                        </div>
                        <p className="text-sm text-yellow-900/80">Potential Score</p>
                      </div>
                      <Badge className="bg-yellow-900 text-yellow-50">
                        {mockResults.predictions.confidenceLevel}% Confidence
                      </Badge>
                    </div>
                    <div className="flex items-end gap-3">
                      <div>
                        <div className="text-3xl text-yellow-900">{mockResults.predictions.predictedScore}</div>
                        <div className="text-xs text-yellow-900/70">Predicted Score</div>
                      </div>
                      <div className="flex items-center gap-1 text-green-700 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{mockResults.predictions.improvement} marks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-2">
              <FileText className="w-4 h-4" />
              Question wise
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Subject Analysis
            </TabsTrigger>
            <TabsTrigger value="chapters" className="gap-2">
              <Target className="w-4 h-4" />
              Chapter-wise
            </TabsTrigger>
            <TabsTrigger value="predictions" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="behavior" className="gap-2">
              <Zap className="w-4 h-4" />
              Behavior & Strategy
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Performance Distribution */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Performance Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Correct', value: mockResults.correctAnswers },
                          { name: 'Incorrect', value: mockResults.incorrectAnswers },
                          { name: 'Unattempted', value: mockResults.unattempted },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Your Skills Radar */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Your Skills Profile
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={mockResults.skillRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time Distribution */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Time Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={mockResults.timeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="section" />
                      <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="time" name="Actual Time" fill="#3b82f6" />
                      <Bar dataKey="ideal" name="Ideal Time" fill="#94a3b8" opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  {/* Speed Breakdown */}
                  <div className="mt-6 space-y-3">
                    {mockResults.questionwiseSpeed.map((speed, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${
                        idx === 0 ? 'bg-green-50 border-green-200' :
                        idx === 1 ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">{speed.range}</span>
                          <span className={`${
                            idx === 0 ? 'text-green-600' :
                            idx === 1 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{speed.count} questions</span>
                        </div>
                        <Progress value={speed.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mistake Analysis */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Mistake Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={mockResults.mistakeBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        dataKey="count"
                      >
                        {mockResults.mistakeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Recommendations */}
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm text-gray-900">Quick Fixes:</h4>
                    {mockResults.mistakeBreakdown.slice(0, 2).map((mistake, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                          <span className="text-gray-900">{mistake.type}:</span> Practice more {
                            mistake.type === 'Conceptual Error' ? 'concept-based questions' :
                            mistake.type === 'Calculation Error' ? 'mental math and calculations' :
                            'time-bound mock tests'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Performance Trend */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Your Progress Journey
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockResults.historicalScores}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[180, 280]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">
                      You've improved by <span className="font-semibold">{mockResults.achievements.avgImprovement}% per test</span> over your last 4 attempts! 🎉
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question wise Analysis Tab */}
          <TabsContent value="questions" className="space-y-6">
            {/* Filter Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Filters:</span>
                  </div>
                  
                  {/* Subject Filter */}
                  <select
                    value={questionFilter.subject}
                    onChange={(e) => setQuestionFilter({ ...questionFilter, subject: e.target.value })}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-white"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={questionFilter.status}
                    onChange={(e) => setQuestionFilter({ ...questionFilter, status: e.target.value })}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                    <option value="unattempted">Unattempted</option>
                  </select>

                  {/* Difficulty Filter */}
                  <select
                    value={questionFilter.difficulty}
                    onChange={(e) => setQuestionFilter({ ...questionFilter, difficulty: e.target.value })}
                    className="px-3 py-1.5 border rounded-lg text-sm bg-white"
                  >
                    <option value="All">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  {/* Reset Filters */}
                  {(questionFilter.subject !== 'All' || questionFilter.status !== 'All' || questionFilter.difficulty !== 'All') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuestionFilter({ subject: 'All', status: 'All', difficulty: 'All' })}
                      className="text-sm"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl text-gray-900">{mockResults.correctAnswers}</div>
                      <div className="text-sm text-gray-600">Correct</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl text-gray-900">{mockResults.incorrectAnswers}</div>
                      <div className="text-sm text-gray-600">Incorrect</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl text-gray-900">{mockResults.unattempted}</div>
                      <div className="text-sm text-gray-600">Unattempted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl text-gray-900">
                        {mockResults.questionAnalysis.filter((q: any) => q.bookmarked).length}
                      </div>
                      <div className="text-sm text-gray-600">Bookmarked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {mockResults.questionAnalysis
                .filter((q: any) => {
                  if (questionFilter.subject !== 'All' && q.subject !== questionFilter.subject) return false;
                  if (questionFilter.status !== 'All' && q.status !== questionFilter.status) return false;
                  if (questionFilter.difficulty !== 'All' && q.difficulty !== questionFilter.difficulty) return false;
                  return true;
                })
                .map((question: any) => (
                  <Card 
                    key={question.id}
                    className={`transition-all ${
                      question.status === 'correct' ? 'border-green-200 bg-green-50/30' :
                      question.status === 'incorrect' ? 'border-red-200 bg-red-50/30' :
                      'border-gray-200 bg-gray-50/30'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Question Number */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              question.status === 'correct' ? 'bg-green-500 text-white' :
                              question.status === 'incorrect' ? 'bg-red-500 text-white' :
                              'bg-gray-400 text-white'
                            }`}>
                              {question.questionNumber}
                            </div>

                            {/* Subject & Topic */}
                            <div>
                              <div className="text-sm text-gray-900">{question.subject} • {question.topic}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {question.difficulty}
                                </Badge>
                                <span className="text-xs text-gray-600">{question.marks} marks</span>
                                {question.bookmarked && (
                                  <Bookmark className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Question Preview */}
                          <p className="text-sm text-gray-700 ml-11">{question.questionText}</p>
                        </div>

                        <div className="flex items-start gap-3 ml-4">
                          {/* Time & Marks */}
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-3 h-3" />
                              {question.timeSpent}m
                            </div>
                            <div className={`text-sm ${
                              question.marksObtained > 0 ? 'text-green-600' :
                              question.marksObtained < 0 ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {question.marksObtained > 0 ? '+' : ''}{question.marksObtained}
                            </div>
                          </div>

                          {/* Expand Icon */}
                          {expandedQuestion === question.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedQuestion === question.id && (
                        <div className="mt-4 pt-4 border-t ml-11 space-y-3">
                          {/* Answers */}
                          <div className="grid grid-cols-2 gap-4">
                            {question.status !== 'unattempted' && (
                              <div>
                                <div className="text-xs text-gray-600 mb-1">Your Answer</div>
                                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                                  question.status === 'correct' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {question.status === 'correct' ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                  Option {question.yourAnswer}
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Correct Answer</div>
                              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700">
                                <Target className="w-4 h-4" />
                                Option {question.correctAnswer}
                              </div>
                            </div>
                          </div>

                          {/* Explanation */}
                          <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-900">Explanation</span>
                            </div>
                            <p className="text-sm text-gray-700">{question.explanation}</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              View Full Solution
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Practice Similar
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              {question.bookmarked ? (
                                <>
                                  <Bookmark className="w-3 h-3 mr-1 fill-yellow-600 text-yellow-600" />
                                  Bookmarked
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3 h-3 mr-1" />
                                  Bookmark
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* No Results */}
            {mockResults.questionAnalysis.filter((q: any) => {
              if (questionFilter.subject !== 'All' && q.subject !== questionFilter.subject) return false;
              if (questionFilter.status !== 'All' && q.status !== questionFilter.status) return false;
              if (questionFilter.difficulty !== 'All' && q.difficulty !== questionFilter.difficulty) return false;
              return true;
            }).length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No questions match your filters</p>
                  <Button
                    variant="link"
                    onClick={() => setQuestionFilter({ subject: 'All', status: 'All', difficulty: 'All' })}
                    className="mt-2"
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Subject Analysis Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {mockResults.subjectScores.map((subject, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${
                    idx === 0 ? 'from-blue-400 to-blue-600' :
                    idx === 1 ? 'from-green-400 to-green-600' :
                    'from-orange-400 to-orange-600'
                  }`} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900">{subject.subject}</h3>
                      <div className="text-2xl text-gray-900">{subject.score}%</div>
                    </div>

                    <div className="mb-4">
                      <Progress value={subject.score} className="h-3" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-green-600">{subject.correct}</div>
                        <div className="text-xs text-gray-600">Correct</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="text-red-600">{subject.incorrect}</div>
                        <div className="text-xs text-gray-600">Wrong</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-gray-600">{subject.unattempted}</div>
                        <div className="text-xs text-gray-600">Skipped</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Top Skill</span>
                        </div>
                        <span className="text-sm text-green-700">{subject.topSkill}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">Needs Work</span>
                        </div>
                        <span className="text-sm text-red-700">{subject.weakArea}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Avg Time</span>
                        </div>
                        <span className="text-sm text-blue-700">{subject.avgTime} min/q</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice {subject.weakArea}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chapter-wise Analysis Tab */}
          <TabsContent value="chapters" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-6">Detailed Chapter Analysis</h3>
                <div className="space-y-4">
                  {mockResults.chapterAnalysis.map((chapter, idx) => (
                    <div key={idx} className="group hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            chapter.accuracy >= 80 ? 'bg-green-100 text-green-600' :
                            chapter.accuracy >= 60 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {chapter.accuracy}%
                          </div>
                          <div>
                            <h4 className="text-gray-900">{chapter.chapter}</h4>
                            <p className="text-sm text-gray-600">{chapter.attempted} questions attempted</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="text-sm text-green-600">{chapter.correct}/{chapter.attempted}</div>
                          <div className="text-xs text-gray-500">Correct</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="text-sm text-blue-600">{chapter.accuracy}%</div>
                          <div className="text-xs text-gray-500">Accuracy</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="text-sm text-purple-600">{chapter.avgTime}m</div>
                          <div className="text-xs text-gray-500">Avg Time</div>
                        </div>
                      </div>

                      <Progress value={chapter.accuracy} className="mt-3 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Score Prediction */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">AI Score Prediction</h3>
                      <p className="text-sm text-gray-600">{mockResults.predictions.confidenceLevel}% Confidence Level</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Current Score</div>
                        <div className="text-3xl text-gray-900">{mockResults.predictions.currentScore}</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg border-2 border-green-400 text-white">
                        <div className="text-sm text-white/90 mb-1">Predicted Score</div>
                        <div className="text-3xl">{mockResults.predictions.predictedScore}</div>
                      </div>
                    </div>

                    <div className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="text-2xl text-green-700">+{mockResults.predictions.improvement} marks</div>
                          <div className="text-sm text-green-600">Potential Improvement</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-700">
                        With {mockResults.predictions.studyHoursNeeded} hours of focused study
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Expected Rank</span>
                        <Badge className="bg-indigo-600">
                          Top {Math.round((mockResults.predictions.estimatedRank / mockResults.totalStudents) * 100)}%
                        </Badge>
                      </div>
                      <div className="text-2xl text-indigo-600">#{mockResults.predictions.estimatedRank}</div>
                      <Progress value={100 - ((mockResults.predictions.estimatedRank / mockResults.totalStudents) * 100)} className="mt-3 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Recommendations */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    Personalized Study Plan
                  </h3>

                  <div className="space-y-4">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Your Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mockResults.predictions.strengths.map((strength, idx) => (
                          <Badge key={idx} className="bg-green-100 text-green-700 border-green-300">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Keep practicing to maintain excellence in these areas
                      </p>
                    </div>

                    {/* Weaknesses with Action Plan */}
                    <div>
                      <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        Focus Areas
                      </h4>
                      <div className="space-y-3">
                        {mockResults.predictions.weaknesses.map((weakness, idx) => (
                          <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-900">{weakness}</span>
                              <Badge variant="outline" className="text-xs">
                                {3 + idx} hours
                              </Badge>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Start Learning Path
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Study Goal */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h4 className="text-gray-900">This Week's Goal</h4>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Complete 50 practice questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Watch 3 concept videos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span>Take 2 mock tests</span>
                        </div>
                      </div>
                      <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600">
                        Start Study Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavior & Strategy Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sincerity Score */}
              <Card className="border-2 border-indigo-200">
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    Sincerity Score
                  </h3>
                  
                  <div className="relative mb-6">
                    <div className="w-40 h-40 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { value: mockResults.behavior.sincerityScore },
                              { value: 100 - mockResults.behavior.sincerityScore }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            <Cell fill="#6366f1" />
                            <Cell fill="#e5e7eb" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl text-indigo-600">{mockResults.behavior.sincerityScore}</div>
                          <div className="text-xs text-gray-600">out of 100</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl text-green-600">{mockResults.behavior.focusLevel}%</div>
                      <div className="text-xs text-gray-600">Focus Level</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl text-blue-600">{mockResults.behavior.stressLevel}%</div>
                      <div className="text-xs text-gray-600">Stress Level</div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    mockResults.behavior.sincerityScore >= 80 ? 'bg-green-50 border-green-200' :
                    mockResults.behavior.sincerityScore >= 60 ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  } border-2`}>
                    <p className="text-sm text-gray-700">
                      {mockResults.behavior.sincerityScore >= 80 
                        ? '🎉 Excellent! Your test-taking behavior shows high sincerity and focus.'
                        : mockResults.behavior.sincerityScore >= 60
                        ? '👍 Good effort! Work on maintaining consistency throughout the test.'
                        : '⚠️ Your sincerity score needs improvement. Focus on better time management and attempt strategies.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Behavior Analysis */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-6">Behavioral Insights</h3>
                  
                  {/* Positive Actions */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="text-gray-900">What You Did Well</h4>
                    </div>
                    <div className="space-y-2">
                      {mockResults.behavior.positiveActions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negative Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="text-gray-900">Areas to Improve</h4>
                    </div>
                    <div className="space-y-3">
                      {mockResults.behavior.negativeActions.map((action, idx) => (
                        <div key={idx}>
                          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{action}</span>
                          </div>
                          <div className="ml-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-blue-700">
                                <span className="font-medium">Tip:</span> {
                                  action.includes('Rushed') 
                                    ? 'Practice time management by setting mini-goals for each section. Allocate specific time per question.'
                                    : 'Always review your marked questions. Studies show reviewing can improve scores by 15-20%.'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategy Recommendations */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Recommended Test-Taking Strategies
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <Clock className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="text-gray-900 mb-2">Time Management</h4>
                    <p className="text-sm text-gray-600">
                      Allocate 2 minutes per question. If stuck, mark for review and move on.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <Target className="w-8 h-8 text-green-600 mb-3" />
                    <h4 className="text-gray-900 mb-2">Accuracy First</h4>
                    <p className="text-sm text-gray-600">
                      Focus on questions you're confident about first. Accuracy &gt; Speed.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <Eye className="w-8 h-8 text-purple-600 mb-3" />
                    <h4 className="text-gray-900 mb-2">Review System</h4>
                    <p className="text-sm text-gray-600">
                      Always keep 10-15 minutes for reviewing flagged questions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Coins & Rewards */}
              <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      Coins Earned
                    </h3>
                    <div className="text-4xl text-yellow-600">
                      +{mockResults.achievements.coinsEarned}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">Test Completion</div>
                          <div className="text-xs text-gray-600">Base reward</div>
                        </div>
                      </div>
                      <div className="text-yellow-600">+50</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">High Accuracy</div>
                          <div className="text-xs text-gray-600">Above 75% accuracy</div>
                        </div>
                      </div>
                      <div className="text-yellow-600">+35</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Flame className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">Streak Bonus</div>
                          <div className="text-xs text-gray-600">{mockResults.achievements.streakDays} day streak</div>
                        </div>
                      </div>
                      <div className="text-yellow-600">+40</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-white">
                    <div className="text-sm mb-2">Total Coins Balance</div>
                    <div className="text-3xl">1,847 Coins</div>
                    <Button className="w-full mt-3 bg-white text-yellow-600 hover:bg-gray-50">
                      Redeem Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Badges Unlocked
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {mockResults.achievements.badgesUnlocked.map((badge, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-sm text-gray-900">{badge}</div>
                        <div className="text-xs text-gray-600 mt-1">Just unlocked!</div>
                      </div>
                    ))}
                  </div>

                  {/* Locked Badges */}
                  <h4 className="text-sm text-gray-700 mb-3">Next Milestones</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">Perfect Score</div>
                          <div className="text-xs text-gray-600">Score 100% in a test</div>
                        </div>
                      </div>
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Flame className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">30-Day Warrior</div>
                          <div className="text-xs text-gray-600">Maintain 30-day streak</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">{mockResults.achievements.streakDays}/30</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Overview */}
            <Card className="border-2 border-indigo-200">
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-6">Your Journey Stats</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl">
                      {mockResults.achievements.totalTests}
                    </div>
                    <div className="text-sm text-gray-900">Tests Taken</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl">
                      {mockResults.achievements.avgImprovement}%
                    </div>
                    <div className="text-sm text-gray-900">Avg Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl">
                      {mockResults.achievements.streakDays}
                    </div>
                    <div className="text-sm text-gray-900">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl">
                      2
                    </div>
                    <div className="text-sm text-gray-900">Badges Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Action Bar */}
        <Card className="mt-8 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900">Ready to Improve?</h3>
                  <p className="text-sm text-gray-600">Start your personalized study plan now</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onComplete}>
                  View Solutions
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
