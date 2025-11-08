import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Target, Award, Code } from 'lucide-react';
import { UserData } from '../../App';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay@8.6.0';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PracticeDetail } from './PracticeDetail';
import { ProblemsLibrary } from './ProblemsLibrary';
import { ContestsHub } from './ContestsHub';
import { getDomainConfig, getDomainSubjects, getDomainTerminology } from '../../utils/domainConfig';
import { generateDomainPractice } from '../../utils/domainContentGenerator';

interface PracticeProps {
  userData: UserData;
}

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

interface PracticeSection {
  id: string;
  title: string;
  subjectIds: string[];
  tests: PracticeTest[];
}

// Domain image mapping
const domainImages = {
  exam: {
    default: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=800',
    physics: 'https://images.unsplash.com/photo-1756829007483-414057ed33cd?w=800',
    chemistry: 'https://images.unsplash.com/photo-1562411403-f583472c8e87?w=800',
    mathematics: 'https://images.unsplash.com/photo-1758685734303-e85757067f28?w=800',
    biology: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800',
    botany: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
    zoology: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800',
  },
  coding: {
    default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    algorithms: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800',
    frontend: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    backend: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
  }
};

// Generate domain-specific practice content
function generateDomainPracticeContent(domainId: string) {
  const config = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  const terminology = getDomainTerminology(domainId);
  const isExam = config.category === 'exam';
  
  // Latest practice sets carousel
  const latestPractice = subjects.slice(0, 4).map((subject, idx) => {
    const chapter = subject.chapters[idx % subject.chapters.length];
    const difficulty = config.difficultyLevels[idx % config.difficultyLevels.length];
    const imageKey = subject.id.split('-')[0] || 'default';
    
    return {
      id: `latest-${subject.id}-${idx}`,
      title: `${chapter.name} - ${isExam ? 'Advanced Problems' : 'Challenge Set'}`,
      subject: subject.name,
      questions: isExam ? 25 + (idx * 5) : 15 + (idx * 3),
      difficulty,
      timeLimit: `${35 + (idx * 10)} mins`,
      image: domainImages[config.category][imageKey] || domainImages[config.category].default,
      attempted: 12 + (idx * 4),
    };
  });

  // Practice sections
  const practiceSections: PracticeSection[] = [];

  // Important/Recommended practice sets
  practiceSections.push({
    id: 'recommended',
    title: isExam ? 'Recommended Practice Sets' : 'Recommended Challenges',
    subjectIds: ['all'],
    tests: subjects.slice(0, 6).map((subject, idx) => {
      const chapter = subject.chapters[idx % subject.chapters.length];
      const topic = chapter.topics[0];
      const difficulty = config.difficultyLevels[idx % config.difficultyLevels.length];
      
      return {
        id: `recommended-${idx}`,
        title: `${topic} - ${terminology.practice}`,
        questions: isExam ? 20 : 10,
        duration: isExam ? '40 mins' : '30 mins',
        difficulty,
        subject: subject.name,
        chapter: chapter.name,
        isImportant: true,
        concepts: 3 + (idx % 3),
        description: `Master ${topic} with ${isExam ? 'carefully selected questions' : 'hands-on challenges'}`,
      };
    }),
  });

  // Quick practice/Short sets
  practiceSections.push({
    id: 'quick',
    title: isExam ? 'Quick Practice Sets (10-15 mins)' : 'Quick Challenges',
    subjectIds: ['all'],
    tests: subjects.slice(0, 6).map((subject, idx) => {
      const chapter = subject.chapters[idx % subject.chapters.length];
      const topic = chapter.topics[idx % chapter.topics.length];
      const difficulty = config.difficultyLevels[0]; // Easy/Beginner
      
      return {
        id: `quick-${idx}`,
        title: `${topic} - Quick ${terminology.practice}`,
        questions: isExam ? 10 : 5,
        duration: '15 mins',
        difficulty,
        subject: subject.name,
        chapter: chapter.name,
        isShort: true,
        concepts: 2,
        description: `Quick practice on ${topic} fundamentals`,
      };
    }),
  });

  // Per-subject practice sections
  subjects.forEach((subject) => {
    // Chapter-wise practice
    practiceSections.push({
      id: `${subject.id}-chapters`,
      title: `${subject.name} - ${terminology.chapter} Practice`,
      subjectIds: ['all', subject.id],
      tests: subject.chapters.map((chapter, idx) => {
        const difficulty = config.difficultyLevels[idx % config.difficultyLevels.length];
        
        return {
          id: `${subject.id}-chapter-${idx}`,
          title: `${chapter.name} - Complete Practice`,
          questions: isExam ? 30 : 20,
          duration: isExam ? '60 mins' : '45 mins',
          difficulty,
          subject: subject.name,
          chapter: chapter.name,
          concepts: chapter.topics.length,
          description: `Comprehensive ${terminology.chapter.toLowerCase()} practice covering: ${chapter.topics.join(', ')}`,
        };
      }),
    });

    // Topic-wise practice
    const topicTests: PracticeTest[] = [];
    subject.chapters.forEach((chapter) => {
      chapter.topics.slice(0, 3).forEach((topic, topicIdx) => {
        const difficulty = config.difficultyLevels[topicIdx % config.difficultyLevels.length];
        
        topicTests.push({
          id: `${subject.id}-${chapter.id}-topic-${topicIdx}`,
          title: `${topic} Practice`,
          questions: isExam ? 15 : 10,
          duration: '30 mins',
          difficulty,
          subject: subject.name,
          chapter: chapter.name,
          concepts: 1,
          description: `Focused practice on ${topic}`,
        });
      });
    });
    
    practiceSections.push({
      id: `${subject.id}-topics`,
      title: `${subject.name} - ${terminology.topic} Practice`,
      subjectIds: ['all', subject.id],
      tests: topicTests.slice(0, 10),
    });

    // Difficulty-based practice
    config.difficultyLevels.forEach((difficulty, diffIdx) => {
      practiceSections.push({
        id: `${subject.id}-${difficulty.toLowerCase()}`,
        title: `${subject.name} - ${difficulty} Level`,
        subjectIds: ['all', subject.id],
        tests: subject.chapters.slice(0, 5).map((chapter, idx) => ({
          id: `${subject.id}-${difficulty}-${idx}`,
          title: `${chapter.name} - ${difficulty} ${terminology.question}s`,
          questions: isExam ? 20 : 15,
          duration: `${30 + diffIdx * 10} mins`,
          difficulty,
          subject: subject.name,
          chapter: chapter.name,
          concepts: 3 + diffIdx,
          description: `${difficulty} level ${terminology.question.toLowerCase()}s from ${chapter.name}`,
        })),
      });
    });
  });

  return { latestPractice, practiceSections, subjects, terminology, config };
}

export function Practice({ userData }: PracticeProps) {
  const domainId = userData.domain || 'competitive-programming';
  const { latestPractice, practiceSections, subjects, terminology, config } = generateDomainPracticeContent(domainId);
  
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPractice, setSelectedPractice] = useState<PracticeTest | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  if (selectedPractice) {
    return (
      <PracticeDetail
        practice={selectedPractice}
        onBack={() => setSelectedPractice(null)}
        userData={userData}
      />
    );
  }

  const filteredSections = practiceSections.filter(section =>
    section.subjectIds.includes(selectedSubject)
  );

  const subjectFilters = [
    { id: 'all', label: `All ${terminology.subject}s` },
    ...subjects.map(s => ({ id: s.id, label: s.name }))
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Latest Practice Sets Carousel */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4">Latest {terminology.practice} Sets</h2>
        <div className="relative px-12">
          <Carousel
            setApi={setCarouselApi}
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {latestPractice.map((practice) => (
                <CarouselItem key={practice.id}>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-48 lg:h-64">
                      <ImageWithFallback
                        src={practice.image}
                        alt={practice.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-white/20 backdrop-blur-sm border-white/30">
                            {practice.subject}
                          </Badge>
                          <Badge 
                            className={`backdrop-blur-sm border-white/30 ${
                              practice.difficulty.includes('Hard') || practice.difficulty.includes('Advanced')
                                ? 'bg-red-500/80'
                                : practice.difficulty.includes('Medium') || practice.difficulty.includes('Intermediate')
                                ? 'bg-yellow-500/80'
                                : 'bg-green-500/80'
                            }`}
                          >
                            {practice.difficulty}
                          </Badge>
                        </div>
                        <h3 className="text-white mb-3">{practice.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{practice.questions} {terminology.question}s</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{practice.timeLimit}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{practice.attempted} attempted</span>
                          </div>
                        </div>
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
            {latestPractice.map((_, index) => (
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

      {/* Practice Sections */}
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
              {section.tests.map((test) => (
                <Card
                  key={test.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPractice(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{test.title}</h4>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                      {test.isImportant && (
                        <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{test.subject}</Badge>
                      <Badge 
                        className={
                          test.difficulty.includes('Hard') || test.difficulty.includes('Advanced') || test.difficulty.includes('Expert')
                            ? 'bg-red-100 text-red-700'
                            : test.difficulty.includes('Medium') || test.difficulty.includes('Intermediate')
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }
                      >
                        {test.difficulty}
                      </Badge>
                      {test.isShort && (
                        <Badge className="bg-blue-100 text-blue-700">Quick</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{test.questions} {terminology.question}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{test.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{test.concepts} {terminology.topic}s</span>
                      </div>
                    </div>
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
          <h3 className="text-gray-900 mb-2">No practice sets available</h3>
          <p className="text-gray-600">
            {terminology.practice} sets for this {terminology.subject.toLowerCase()} are coming soon!
          </p>
        </div>
      )}
    </div>
  );
}