import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Target, Award, TrendingUp, Coins, Plus } from 'lucide-react';
import { UserData } from '../../App';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay@8.6.0';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { TestDetail } from './TestDetail';
import { CustomTestCreation } from './CustomTestCreation';
import { TechCustomTestCreation } from './TechCustomTestCreation';
import { TestInstructions } from './TestInstructions';
import { TestTaking } from './TestTaking';
import { TestFeedback } from './TestFeedback';
import { TestResults } from './TestResults';
import { getDomainConfig, getDomainSubjects, getDomainTerminology } from '../../utils/domainConfig';
import { generateDomainTests, getSubjectDisplayName } from '../../utils/domainContentGenerator';

interface TestProps {
  userData: UserData;
}

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

interface TestSection {
  id: string;
  title: string;
  subjectIds: string[];
  tests: TestItem[];
}

// Domain images
const domainImages = {
  exam: {
    default: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=800',
    news: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
    ebook: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    announcement: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
  },
  coding: {
    default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    contest: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800',
    update: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    announcement: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  }
};

// Generate domain-specific news/announcements
function generateDomainNews(domainId: string) {
  const config = getDomainConfig(domainId);
  const isExam = config.category === 'exam';
  const terminology = getDomainTerminology(domainId);
  
  return [
    {
      id: 1,
      title: `New ${config.name} ${terminology.test} Series Available`,
      type: 'Breaking News',
      image: domainImages[config.category].default,
      date: 'November 8, 2025',
      description: `Complete ${terminology.test.toLowerCase()} series for ${config.name} is now available with detailed solutions`,
    },
    {
      id: 2,
      title: isExam ? 'Reference Materials Updated' : 'Learning Resources Updated',
      type: isExam ? 'eBook Release' : 'Resource Update',
      image: domainImages[config.category].ebook || domainImages[config.category].update,
      date: 'November 7, 2025',
      description: `All study materials updated with latest ${terminology.topic.toLowerCase()}s and practice ${terminology.question.toLowerCase()}s`,
    },
    {
      id: 3,
      title: isExam ? 'Previous Years Papers with Solutions' : 'Contest Archives Available',
      type: 'New Content',
      image: domainImages[config.category].news,
      date: 'November 6, 2025',
      description: isExam 
        ? 'Last 10 years papers now available with detailed solutions'
        : 'Past contest problems with editorial explanations',
    },
    {
      id: 4,
      title: `Weekly ${terminology.test} Schedule Announced`,
      type: 'Announcement',
      image: domainImages[config.category].announcement,
      date: 'November 5, 2025',
      description: `New weekly ${terminology.test.toLowerCase()} schedule for systematic preparation and progress tracking`,
    },
  ];
}

type ViewMode = 'list' | 'create' | 'detail' | 'instructions' | 'taking' | 'feedback' | 'results';

export function Test({ userData }: TestProps) {
  const domainId = userData.domain || 'competitive-programming';
  const config = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  const terminology = getDomainTerminology(domainId);
  const isExam = config.category === 'exam';
  
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [testResults, setTestResults] = useState<any>(null);

  // Generate domain-specific tests
  const allTests = useMemo(() => generateDomainTests(domainId, 30), [domainId]);
  const latestNews = useMemo(() => generateDomainNews(domainId), [domainId]);

  // Organize tests into sections
  const testSections: TestSection[] = useMemo(() => {
    const sections: TestSection[] = [];
    
    // Full-length tests
    sections.push({
      id: 'full-length',
      title: `Full Length ${terminology.test}s`,
      subjectIds: ['all'],
      tests: allTests.filter(t => t.type.includes('Full')),
    });

    // Recommended tests
    sections.push({
      id: 'recommended',
      title: `Recommended ${terminology.test}s`,
      subjectIds: ['all'],
      tests: allTests.filter(t => !t.attempted).slice(0, 6),
    });

    // Subject-wise tests
    subjects.forEach(subject => {
      sections.push({
        id: `subject-${subject.id}`,
        title: `${subject.name} ${terminology.test}s`,
        subjectIds: ['all', subject.id],
        tests: allTests.filter(t => t.subject === subject.name),
      });
    });

    // Chapter-wise tests
    sections.push({
      id: 'chapter-tests',
      title: `${terminology.chapter} ${terminology.test}s`,
      subjectIds: ['all'],
      tests: allTests.filter(t => t.type.includes(terminology.chapter)),
    });

    // By difficulty
    config.difficultyLevels.forEach(difficulty => {
      sections.push({
        id: `difficulty-${difficulty.toLowerCase()}`,
        title: `${difficulty} Level ${terminology.test}s`,
        subjectIds: ['all'],
        tests: allTests.filter(t => t.difficulty === difficulty),
      });
    });

    // Attempted tests
    sections.push({
      id: 'attempted',
      title: `Previously Attempted ${terminology.test}s`,
      subjectIds: ['all'],
      tests: allTests.filter(t => t.attempted),
    });

    return sections;
  }, [allTests, subjects, terminology, config.difficultyLevels]);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const handleTestClick = (test: TestItem) => {
    setSelectedTest(test);
    setViewMode('detail');
  };

  const handleStartTest = (test: TestItem) => {
    setSelectedTest(test);
    setViewMode('instructions');
  };

  const handleBeginTest = () => {
    setViewMode('taking');
  };

  const handleSubmitTest = () => {
    setViewMode('feedback');
  };

  const handleViewResults = () => {
    // Generate mock results
    const results = {
      score: Math.floor(Math.random() * 40) + 60,
      totalMarks: selectedTest?.marks || 100,
      rank: Math.floor(Math.random() * 1000) + 100,
      percentile: Math.floor(Math.random() * 30) + 70,
      timeSpent: selectedTest?.duration || '60 mins',
    };
    setTestResults(results);
    setViewMode('results');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTest(null);
    setTestResults(null);
  };

  const handleTestCreated = (newTest: TestItem) => {
    // Add the new test to the list and view it
    setSelectedTest(newTest);
    setViewMode('detail');
  };

  // Render different views
  if (viewMode === 'create') {
    // Use TechCustomTestCreation for coding domains
    if (config.category === 'coding') {
      return (
        <TechCustomTestCreation 
          onBack={handleBackToList} 
          onTestCreated={handleTestCreated}
          userData={userData}
          domainId={domainId}
        />
      );
    }
    
    // Use regular CustomTestCreation for exam domains
    return (
      <CustomTestCreation 
        onBack={handleBackToList} 
        onTestCreated={handleTestCreated}
        userData={userData} 
      />
    );
  }

  if (viewMode === 'detail' && selectedTest) {
    return (
      <TestDetail
        test={selectedTest}
        onBack={handleBackToList}
        onStartTest={() => setViewMode('instructions')}
        userData={userData}
      />
    );
  }

  if (viewMode === 'instructions' && selectedTest) {
    return (
      <TestInstructions
        test={selectedTest}
        onBack={() => setViewMode('detail')}
        onBegin={handleBeginTest}
        userData={userData}
      />
    );
  }

  if (viewMode === 'taking' && selectedTest) {
    return (
      <TestTaking
        test={selectedTest}
        onSubmit={handleSubmitTest}
        userData={userData}
      />
    );
  }

  if (viewMode === 'feedback' && selectedTest) {
    return (
      <TestFeedback
        test={selectedTest}
        onViewResults={handleViewResults}
        userData={userData}
      />
    );
  }

  if (viewMode === 'results' && testResults) {
    return (
      <TestResults
        results={testResults}
        test={selectedTest!}
        onBackToTests={handleBackToList}
        userData={userData}
      />
    );
  }

  // Main test list view
  const filteredSections = testSections.filter(section =>
    section.subjectIds.includes(selectedSubject) && section.tests.length > 0
  );

  const subjectFilters = [
    { id: 'all', label: `All ${terminology.subject}s` },
    ...subjects.map(s => ({ id: s.id, label: s.name }))
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Latest News/Updates Carousel */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4">Latest Updates</h2>
        <div className="relative px-12">
          <Carousel
            setApi={setCarouselApi}
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {latestNews.map((news) => (
                <CarouselItem key={news.id}>
                  <Card className="overflow-hidden">
                    <div className="relative h-48 lg:h-64">
                      <ImageWithFallback
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <Badge className="mb-2 bg-indigo-500/90 border-white/30">
                          {news.type}
                        </Badge>
                        <h3 className="text-white mb-2">{news.title}</h3>
                        <p className="text-sm text-white/90 mb-2">{news.description}</p>
                        <p className="text-xs text-white/70">{news.date}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
              onClick={() => carouselApi?.scrollPrev()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
              onClick={() => carouselApi?.scrollNext()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {latestNews.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => carouselApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Create Custom Test Button */}
      <div className="mb-6">
        <Button
          onClick={() => setViewMode('create')}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Custom {terminology.test}
        </Button>
      </div>

      {/* Subject Filter Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-6 overflow-x-auto">
          {subjectFilters.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`pb-3 px-1 whitespace-nowrap transition-colors relative ${
                selectedSubject === subject.id
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {subject.label}
              {selectedSubject === subject.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Test Sections */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">{section.title}</h3>
              <Button variant="link" className="text-indigo-600">
                View All →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.tests.slice(0, 6).map((test) => (
                <Card
                  key={test.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTestClick(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{test.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{test.description}</p>
                      </div>
                      {test.attempted && (
                        <Badge className="ml-2 bg-green-100 text-green-700 flex-shrink-0">Attempted</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{test.subject}</Badge>
                      <Badge 
                        className={
                          test.difficulty.includes('Hard') || test.difficulty.includes('Advanced')
                            ? 'bg-red-100 text-red-700'
                            : test.difficulty.includes('Medium') || test.difficulty.includes('Intermediate')
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }
                      >
                        {test.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{test.questions} {terminology.question}s</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{test.marks} marks</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="text-yellow-700">{test.coins} coins</span>
                        </div>
                      </div>
                      {test.tqs && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span>TQS: {test.tqs}%</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTest(test);
                      }}
                    >
                      {test.attempted ? 'Reattempt' : 'Start'} {terminology.test}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No {terminology.test.toLowerCase()}s available</h3>
          <p className="text-gray-600">
            {terminology.test}s for this {terminology.subject.toLowerCase()} are coming soon!
          </p>
        </div>
      )}
    </div>
  );
}
