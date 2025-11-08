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
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PracticeTest {
  id: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: string;
  subject: string;
  chapter: string;
  isImportant?: boolean;
  isShort?: boolean;
  concepts: number;
  description: string;
}

interface PracticeDetailProps {
  test: PracticeTest;
  onBack: () => void;
}

type TabType = 'topics' | 'progress' | 'points' | 'books' | 'learning' | 'tests';

interface Topic {
  id: string;
  name: string;
  questions: number;
  completed: boolean;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  instructor: string;
}

interface ChapterTest {
  id: string;
  chapterName: string;
  testNumber: string;
  time: string;
  tqs: number;
  totalMarks: number;
  totalQuestions: number;
}

const mockTopics: Topic[] = [
  { id: 't1', name: 'Basic Concepts and Fundamentals', questions: 15, completed: true },
  { id: 't2', name: 'Advanced Problem Solving', questions: 20, completed: false },
  { id: 't3', name: 'Application Based Questions', questions: 18, completed: false },
  { id: 't4', name: 'Numerical and Calculation', questions: 12, completed: false },
  { id: 't5', name: 'Conceptual Understanding', questions: 16, completed: true },
];

const mockBooks: Book[] = [
  { id: 'b1', title: 'NCERT Physics Class 12', author: 'NCERT', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300' },
  { id: 'b2', title: 'HC Verma Concepts of Physics', author: 'H.C. Verma', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300' },
  { id: 'b3', title: 'DC Pandey Physics', author: 'DC Pandey', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300' },
  { id: 'b4', title: 'Cengage Physics', author: 'Cengage', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300' },
];

const mockVideos: Video[] = [
  { id: 'v1', title: 'Introduction to Core Concepts', duration: '45:30', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Dr. Rajesh Kumar' },
  { id: 'v2', title: 'Problem Solving Techniques', duration: '52:15', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Prof. Anjali Mehta' },
  { id: 'v3', title: 'Quick Revision and Shortcuts', duration: '38:45', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Dr. Vikram Singh' },
  { id: 'v4', title: 'Common Mistakes to Avoid', duration: '41:20', thumbnail: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400', instructor: 'Prof. Sunita Rao' },
];

const mockChapterTests: ChapterTest[] = [
  { id: 'ct1', chapterName: 'Complete Chapter Practice', testNumber: 'Test 1', time: '60 mins', tqs: 85, totalMarks: 120, totalQuestions: 40 },
  { id: 'ct2', chapterName: 'Advanced Level Questions', testNumber: 'Test 2', time: '75 mins', tqs: 90, totalMarks: 150, totalQuestions: 50 },
  { id: 'ct3', chapterName: 'Mixed Difficulty Practice', testNumber: 'Test 3', time: '45 mins', tqs: 80, totalMarks: 100, totalQuestions: 35 },
  { id: 'ct4', chapterName: 'Quick Revision Test', testNumber: 'Test 4', time: '30 mins', tqs: 75, totalMarks: 75, totalQuestions: 25 },
  { id: 'ct5', chapterName: 'Full Chapter Mock Test', testNumber: 'Test 5', time: '90 mins', tqs: 92, totalMarks: 180, totalQuestions: 60 },
];

const pointsToRemember = [
  'Always start with fundamental concepts before attempting complex problems',
  'Practice time management - allocate specific time for each question',
  'Review incorrect answers and understand the reasoning behind correct solutions',
  'Focus on understanding the application of formulas rather than just memorizing them',
  'Maintain a separate notebook for important formulas and quick revision',
  'Attempt mock tests regularly to track your progress and identify weak areas',
  'Use visual aids and diagrams to better understand complex concepts',
  'Take short breaks during long practice sessions to maintain focus',
];

export function PracticeDetail({ test, onBack }: PracticeDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('topics');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const tabs = [
    { id: 'topics', label: 'Topics for Practice', icon: Target },
    { id: 'progress', label: 'About Your Progress on this Chapter', icon: TrendingUp },
    { id: 'points', label: 'Points to Remember', icon: AlertCircle },
    { id: 'books', label: 'Books Available', icon: BookOpen },
    { id: 'learning', label: 'Recommended Learning to ace this Practice', icon: Play },
    { id: 'tests', label: 'Tests on this Chapter', icon: FileText },
  ];

  const renderRightContent = () => {
    switch (activeTab) {
      case 'topics':
        return (
          <div className="space-y-3">
            {mockTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          topic.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {topic.completed ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm text-gray-900 mb-1">{topic.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {topic.questions} Questions
                            </Badge>
                            {topic.completed && (
                              <Badge className="text-xs bg-green-100 text-green-700">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={topic.completed ? 'outline' : 'default'}
                      className={!topic.completed ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                    >
                      {topic.completed ? 'Retry' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <div className="text-4xl text-indigo-600 mb-2">78/100</div>
                  <Progress value={78} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">Keep up the good work!</p>
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
                      <span className="text-gray-900">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Speed</span>
                      <span className="text-gray-900">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Consistency</span>
                      <span className="text-gray-900">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-600">Completed 15 questions today</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Attempted 3 practice tests this week</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-gray-600">Improved accuracy by 12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'points':
        return (
          <Card>
            <CardContent className="p-6">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
                Important Points to Remember
              </h4>
              <ul className="space-y-3">
                {pointsToRemember.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );

      case 'books':
        return (
          <div className="grid grid-cols-2 gap-4">
            {mockBooks.map((book) => (
              <Card key={book.id} className="group cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-gray-100">
                    <ImageWithFallback
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">{book.author}</p>
                  <Button size="sm" className="w-full" variant="outline">
                    Access eBook
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'learning':
        return (
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
                      <h4 className="text-sm text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {video.title}
                      </h4>
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
        );

      case 'tests':
        return (
          <div className="space-y-3">
            {mockChapterTests.map((chapterTest) => (
              <Card key={chapterTest.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900 mb-1">{chapterTest.chapterName}</h4>
                      <p className="text-xs text-gray-600">{chapterTest.testNumber}</p>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Time:</span>
                        <p className="text-gray-900">{chapterTest.time}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">TQS:</span>
                        <p className="text-gray-900">{chapterTest.tqs}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Marks:</span>
                        <p className="text-gray-900">{chapterTest.totalMarks}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Questions:</span>
                        <p className="text-gray-900">{chapterTest.totalQuestions}</p>
                      </div>
                    </div>
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
          Back to Practice
        </Button>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-96 bg-white border-r overflow-y-auto">
          <div className="p-6">
            {/* Chapter Info */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-3">{test.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {test.isImportant && (
                  <Badge variant="destructive" className="text-xs">
                    Important
                  </Badge>
                )}
                <Badge className={`text-xs ${getDifficultyColor(test.difficulty)}`}>
                  {test.difficulty}
                </Badge>
                {test.isShort ? (
                  <Badge variant="outline" className="text-xs">
                    Short Test
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Full Length Test
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{test.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>{test.concepts} Concepts in this chapter</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{test.duration}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{test.description}</p>

              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Practice Now
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
