import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, Play, Clock, BookOpen } from 'lucide-react';
import { UserData } from '../../App';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay@8.6.0';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getDomainConfig, getDomainSubjects, getDomainTerminology } from '../../utils/domainConfig';
import { generateDomainLearnModules } from '../../utils/domainContentGenerator';

interface LearnProps {
  userData: UserData;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  views: string;
  thumbnail: string;
  instructor?: string;
}

interface ContentSection {
  id: string;
  title: string;
  subjectIds: string[];
  videos: Video[];
}

// Image mapping for different domain categories
const domainImages = {
  exam: {
    default: 'https://images.unsplash.com/photo-1565688695721-2b6f5a880a15?w=400',
    physics: 'https://images.unsplash.com/photo-1756829007483-414057ed33cd?w=400',
    chemistry: 'https://images.unsplash.com/photo-1562411403-f583472c8e87?w=400',
    mathematics: 'https://images.unsplash.com/photo-1758685734303-e85757067f28?w=400',
    biology: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400',
    botany: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
    zoology: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400',
  },
  coding: {
    default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    algorithms: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400',
    frontend: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    backend: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
  }
};

// Generate domain-aware video content
function generateDomainContent(domainId: string) {
  const config = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  const terminology = getDomainTerminology(domainId);
  const isExam = config.category === 'exam';
  
  // Generate latest topics carousel based on domain subjects
  const latestTopics = subjects.slice(0, 4).map((subject, idx) => {
    const chapter = subject.chapters[idx % subject.chapters.length];
    const imageCategory = config.category === 'exam' ? 'exam' : 'coding';
    const subjectKey = subject.id.split('-')[0] || 'default';
    
    return {
      id: subject.id,
      title: chapter.name,
      subject: subject.name,
      progress: 20 + (idx * 20),
      image: domainImages[imageCategory][subjectKey] || domainImages[imageCategory].default,
    };
  });

  // Generate content sections for each subject
  const contentSections: ContentSection[] = [];
  
  // All subjects overview section
  contentSections.push({
    id: 'overview',
    title: isExam ? `Complete ${config.name} Course Material` : `${config.name} Learning Path`,
    subjectIds: ['all'],
    videos: subjects.slice(0, 5).map((subject, idx) => ({
      id: `overview-${idx}`,
      title: `${subject.name} - Complete Guide`,
      duration: `${35 + idx * 5}:${15 + idx * 5}`,
      views: `${120 + idx * 20}K`,
      thumbnail: domainImages[config.category][(subject.id.split('-')[0]) || 'default'] || domainImages[config.category].default,
      instructor: isExam ? `Dr. ${['Amit', 'Priya', 'Rajesh', 'Meera', 'Suresh'][idx % 5]} ${['Kumar', 'Singh', 'Sharma', 'Patel', 'Verma'][idx % 5]}` : undefined,
    })),
  });

  // Trending/Popular section
  contentSections.push({
    id: 'trending',
    title: isExam ? 'Most Important Topics' : 'Trending Tutorials',
    subjectIds: ['all'],
    videos: subjects.slice(0, 5).map((subject, idx) => {
      const chapter = subject.chapters[0];
      return {
        id: `trending-${idx}`,
        title: `${chapter.topics[0]} - ${isExam ? 'Master Class' : 'Deep Dive'}`,
        duration: `${28 + idx * 3}:${10 + idx * 5}`,
        views: `${150 + idx * 25}K`,
        thumbnail: domainImages[config.category][subject.id.split('-')[0] || 'default'] || domainImages[config.category].default,
        instructor: isExam ? `Prof. ${['Neha', 'Vikram', 'Anjali', 'Deepak', 'Kavita'][idx % 5]} ${['Gupta', 'Rao', 'Mehta', 'Sinha', 'Reddy'][idx % 5]}` : `${['John', 'Sarah', 'Mike', 'Emma', 'David'][idx % 5]} ${['Doe', 'Smith', 'Johnson', 'Brown', 'Wilson'][idx % 5]}`,
      };
    }),
  });

  // Per-subject sections
  subjects.forEach((subject) => {
    const imageKey = subject.id.split('-')[0] || 'default';
    
    // Chapter-wise videos
    contentSections.push({
      id: `${subject.id}-chapters`,
      title: `${subject.name} - ${terminology.chapter}s`,
      subjectIds: ['all', subject.id],
      videos: subject.chapters.slice(0, 5).map((chapter, idx) => ({
        id: `${subject.id}-chapter-${idx}`,
        title: `${chapter.name} - Complete ${terminology.chapter}`,
        duration: `${40 + idx * 5}:${20 + idx * 3}`,
        views: `${180 + idx * 15}K`,
        thumbnail: domainImages[config.category][imageKey] || domainImages[config.category].default,
      })),
    });

    // Topic explainers
    contentSections.push({
      id: `${subject.id}-topics`,
      title: `${subject.name} - ${terminology.topic} Explainers`,
      subjectIds: ['all', subject.id],
      videos: subject.chapters[0]?.topics.slice(0, 5).map((topic, idx) => ({
        id: `${subject.id}-topic-${idx}`,
        title: `${topic} - Explained`,
        duration: `${25 + idx * 2}:${15 + idx * 2}`,
        views: `${140 + idx * 10}K`,
        thumbnail: domainImages[config.category][imageKey] || domainImages[config.category].default,
        instructor: isExam ? `Dr. ${['Ramesh', 'Priya', 'Anil', 'Sunita', 'Ashok'][idx % 5]} ${['Verma', 'Mathur', 'Sharma', 'Rao', 'Gupta'][idx % 5]}` : undefined,
      })) || [],
    });

    // Practice/Advanced section
    if (config.contentTypes.practice) {
      contentSections.push({
        id: `${subject.id}-practice`,
        title: `${subject.name} - ${isExam ? 'Problem Solving' : 'Hands-On Practice'}`,
        subjectIds: ['all', subject.id],
        videos: subject.chapters.slice(0, 5).map((chapter, idx) => ({
          id: `${subject.id}-practice-${idx}`,
          title: `${chapter.name} - ${isExam ? 'Solved Examples' : 'Build Projects'}`,
          duration: `${30 + idx * 4}:${10 + idx * 3}`,
          views: `${100 + idx * 12}K`,
          thumbnail: domainImages[config.category][imageKey] || domainImages[config.category].default,
        })),
      });
    }
  });

  return { latestTopics, contentSections, subjects, terminology };
}

export function Learn({ userData }: LearnProps) {
  const domainId = userData.domain || 'competitive-programming';
  const { latestTopics, contentSections, subjects, terminology } = generateDomainContent(domainId);
  
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const filteredSections = contentSections.filter(section => 
    section.subjectIds.includes(selectedSubject)
  );

  const subjectFilters = [
    { id: 'all', label: `All ${terminology.subject}s` },
    ...subjects.map(s => ({ id: s.id, label: s.name }))
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Latest Topics Carousel */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4">Latest {terminology.chapter}s</h2>
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
              {latestTopics.map((topic) => (
                <CarouselItem key={topic.id}>
                  <Card className="overflow-hidden">
                    <div className="relative h-48 lg:h-64">
                      <ImageWithFallback
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <Badge className="mb-2 bg-white/20 backdrop-blur-sm border-white/30">
                          {topic.subject}
                        </Badge>
                        <h3 className="text-white mb-2">{topic.title}</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/20 rounded-full h-2 backdrop-blur-sm">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${topic.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{topic.progress}%</span>
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
            {latestTopics.map((_, index) => (
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

      {/* Content Sections */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">{section.title}</h3>
              <Button variant="link" className="text-indigo-600">
                View All →
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {section.videos.map((video) => (
                <Card 
                  key={video.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <ImageWithFallback
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>
                      <span>•</span>
                      <span>{video.views} views</span>
                    </div>
                    {video.instructor && (
                      <p className="text-xs text-gray-500 mt-1">{video.instructor}</p>
                    )}
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
          <h3 className="text-gray-900 mb-2">No content available</h3>
          <p className="text-gray-600">
            Content for this {terminology.subject.toLowerCase()} is coming soon!
          </p>
        </div>
      )}
    </div>
  );
}
