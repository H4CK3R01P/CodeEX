import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Play,
  FileText,
  CheckCircle,
  AlertCircle,
  Coins,
  BarChart3,
  Users,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
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

interface TestItem {
  id: string;
  title: string;
  type: string;
  duration: string;
  questions: number;
  marks: number;
  coins: number;
  subject: string;
  difficulty: string;
  syllabus: string;
  description: string;
  tqs: number;
  alignedToExam: string;
  chapters?: string[];
  correctMarks?: string;
  incorrectMarks?: string;
  isCustom?: boolean;
  attempted?: boolean;
}

interface TestDetailProps {
  test: TestItem;
  onBack: () => void;
  onStart?: () => void;
}

type TabType = 'about' | 'progress' | 'learning' | 'practice' | 'more';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  instructor: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

interface PracticeItem {
  id: string;
  title: string;
  questions: number;
  difficulty: string;
}

interface SimilarTest {
  id: string;
  title: string;
  type: string;
  questions: number;
  duration: string;
  coins: number;
}

const mockVideos: Video[] = [
  { id: 'v1', title: 'Complete Syllabus Overview', duration: '45:30', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Dr. Rajesh Kumar' },
  { id: 'v2', title: 'Important Topics to Focus', duration: '52:15', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Prof. Anjali Mehta' },
  { id: 'v3', title: 'Quick Revision Techniques', duration: '38:45', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Dr. Vikram Singh' },
  { id: 'v4', title: 'Problem Solving Strategies', duration: '41:20', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Prof. Sunita Rao' },
];

const mockBooks: Book[] = [
  { id: 'b1', title: 'Complete Study Guide', author: 'Embibe Publications', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300' },
  { id: 'b2', title: 'Practice Question Bank', author: 'Expert Series', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300' },
  { id: 'b3', title: 'Formula Handbook', author: 'Quick Reference', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300' },
];

const mockPractice: PracticeItem[] = [
  { id: 'p1', title: 'Chapter-wise Practice Test', questions: 50, difficulty: 'Medium' },
  { id: 'p2', title: 'Topic-based Mock Questions', questions: 40, difficulty: 'Hard' },
  { id: 'p3', title: 'Adaptive Practice Series', questions: 60, difficulty: 'Mixed' },
  { id: 'p4', title: 'Previous Year Problems', questions: 45, difficulty: 'Hard' },
];

const mockSimilarTests: SimilarTest[] = [
  { id: 'st1', title: 'Similar Full Length Test 1', type: 'Full Test', questions: 90, duration: '180 mins', coins: 150 },
  { id: 'st2', title: 'Similar Full Length Test 2', type: 'Full Test', questions: 90, duration: '180 mins', coins: 150 },
  { id: 'st3', title: 'Related Chapter Test', type: 'Chapter Test', questions: 40, duration: '90 mins', coins: 80 },
  { id: 'st4', title: 'Advanced Level Practice', type: 'Full Test', questions: 90, duration: '180 mins', coins: 200 },
];

const analysisData = [
  { subject: 'Physics', attempted: 28, correct: 22, incorrect: 6 },
  { subject: 'Chemistry', attempted: 27, correct: 20, incorrect: 7 },
  { subject: 'Mathematics', attempted: 29, correct: 24, incorrect: 5 },
];

const accuracyData = [
  { name: 'Correct', value: 66, color: '#10b981' },
  { name: 'Incorrect', value: 18, color: '#ef4444' },
  { name: 'Unattempted', value: 6, color: '#94a3b8' },
];

export function TestDetail({ test, onBack, onStart }: TestDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const tabs = [
    { id: 'about', label: 'About this Test', icon: FileText },
    { id: 'progress', label: 'About Your Progress on this Syllabus', icon: TrendingUp },
    { id: 'learning', label: 'Recommended Learning to ace this Test', icon: Play },
    { id: 'practice', label: 'Recommended Practice to ace this Test', icon: Target },
    { id: 'more', label: 'More Tests on this Syllabus', icon: BookOpen },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const renderRightContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-4">
            {/* Test Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-2">{test.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {test.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-600">Test Quality Score</span>
                    </div>
                    <div className="text-xl text-indigo-600">{test.tqs}/100</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-600">Aligned to Real Exams</span>
                    </div>
                    <div className="text-xl text-green-600">{test.alignedToExam}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-gray-900">{test.duration}</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Target className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-gray-900">{test.questions}</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-gray-900">{test.marks}</div>
                    <div className="text-xs text-gray-600">Total Marks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Analysis Graph */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Test Analysis
                </h4>
                
                {/* Bar Chart */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="correct" fill="#10b981" name="Correct" />
                      <Bar dataKey="incorrect" fill="#ef4444" name="Incorrect" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={accuracyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {accuracyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
                  <div>
                    <div className="text-xl text-green-600">73%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xl text-indigo-600">93%</div>
                    <div className="text-xs text-gray-600">Attempt Rate</div>
                  </div>
                  <div>
                    <div className="text-xl text-yellow-600">2.5 min</div>
                    <div className="text-xs text-gray-600">Avg. Time/Q</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-900">Sincerity Score</h4>
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-center">
                  <div className="text-4xl text-indigo-600 mb-2">82/100</div>
                  <Progress value={82} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">Excellent progress on this syllabus!</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-900">Attempt Quality</h4>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Accuracy</span>
                      <span className="text-gray-900">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Speed</span>
                      <span className="text-gray-900">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Consistency</span>
                      <span className="text-gray-900">71%</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Time Management</span>
                      <span className="text-gray-900">79%</span>
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="text-gray-900 mb-4">Syllabus Coverage</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Physics Topics Covered</span>
                      <span className="text-gray-900">12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Chemistry Topics Covered</span>
                      <span className="text-gray-900">14/16</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Mathematics Topics Covered</span>
                      <span className="text-gray-900">13/14</span>
                    </div>
                    <Progress value={92.8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'learning':
        return (
          <div className="space-y-4">
            {/* Videos */}
            <div>
              <h4 className="text-gray-900 mb-3">Recommended Videos</h4>
              <div className="space-y-3">
                {mockVideos.map((video) => (
                  <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-20 flex-shrink-0 relative overflow-hidden rounded-lg bg-gray-200">
                          <ImageWithFallback
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-4 h-4 text-gray-900 ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {video.title}
                          </h5>
                          <p className="text-xs text-gray-600 mb-2">{video.instructor}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* eBooks */}
            <div>
              <h4 className="text-gray-900 mb-3 mt-6">Recommended eBooks</h4>
              <div className="grid grid-cols-3 gap-3">
                {mockBooks.map((book) => (
                  <Card key={book.id} className="group cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-3">
                      <div className="aspect-[3/4] mb-2 overflow-hidden rounded-lg bg-gray-100">
                        <ImageWithFallback
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h5 className="text-xs text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                        {book.title}
                      </h5>
                      <p className="text-xs text-gray-600">{book.author}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-3">
            <h4 className="text-gray-900 mb-3">Recommended Practice Tests</h4>
            {mockPractice.map((practice) => (
              <Card key={practice.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="text-sm text-gray-900 mb-2">{practice.title}</h5>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {practice.questions} Questions
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(practice.difficulty)}`}>
                          {practice.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'more':
        return (
          <div className="space-y-3">
            <h4 className="text-gray-900 mb-3">Similar Tests on this Syllabus</h4>
            {mockSimilarTests.map((similarTest) => (
              <Card key={similarTest.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="text-sm text-gray-900 mb-2">{similarTest.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {similarTest.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {similarTest.questions}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {similarTest.duration}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-600">
                        <Coins className="w-3 h-3" />
                        {similarTest.coins}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-4">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-96 bg-white border-r overflow-y-auto">
          <div className="p-6">
            {/* Test Info */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-3">{test.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {test.type}
                </Badge>
                <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                  <Coins className="w-3 h-3 mr-1" />
                  {test.coins} Coins
                </Badge>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm text-indigo-900 mb-2">Syllabus Covered:</h4>
                <p className="text-sm text-indigo-800">{test.description}</p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={onStart}
              >
                <Play className="w-4 h-4 mr-2" />
                {test.attempted ? 'View Test Feedback' : 'Start Test'}
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Navigation Tabs */}
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-left">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {renderRightContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
