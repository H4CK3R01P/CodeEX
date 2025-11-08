// Domain-specific content generator
// Generates tests, practice problems, learning modules, etc. based on domain configuration

import { getDomainConfig, getDomainSubjects, getAllChapters } from './domainConfig';

export interface GeneratedTest {
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
  attempted?: boolean;
}

export interface GeneratedPractice {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  solved: boolean;
  points: number;
  description?: string;
  tags?: string[];
}

export interface GeneratedLearnModule {
  id: string;
  name: string;
  description: string;
  duration: string;
  completed: boolean;
  subject: string;
  chapters: number;
  progress?: number;
}

// Generate domain-specific tests
export function generateDomainTests(domainId: string, count: number = 10): GeneratedTest[] {
  const config = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  const isExam = config.category === 'exam';
  const tests: GeneratedTest[] = [];
  
  // Full-length tests
  for (let i = 1; i <= Math.min(3, count); i++) {
    const questionsCount = isExam ? 180 : 50;
    const duration = isExam ? '180 mins' : '120 mins';
    
    tests.push({
      id: `full-${i}`,
      title: `${config.name} Full Length ${config.terminology.test} #${i}`,
      type: `Full ${config.terminology.test}`,
      duration,
      questions: questionsCount,
      marks: questionsCount * 4,
      coins: 150,
      subject: 'All',
      difficulty: isExam ? config.difficultyLevels[config.difficultyLevels.length - 1] : 'Mixed',
      syllabus: 'Full Syllabus',
      description: `Comprehensive ${config.terminology.test.toLowerCase()} covering all ${subjects.length} ${config.terminology.subject.toLowerCase()}s with questions from all chapters.`,
      tqs: 90 + Math.floor(Math.random() * 10),
      alignedToExam: config.name,
      attempted: Math.random() > 0.7,
    });
  }
  
  // Subject-specific tests
  subjects.forEach((subject, idx) => {
    const questionsPerSubject = isExam ? 60 : 30;
    tests.push({
      id: `subject-${subject.id}`,
      title: `${subject.name} ${config.terminology.test}`,
      type: `${config.terminology.subject} ${config.terminology.test}`,
      duration: isExam ? '90 mins' : '60 mins',
      questions: questionsPerSubject,
      marks: questionsPerSubject * 4,
      coins: 100,
      subject: subject.name,
      difficulty: 'Medium',
      syllabus: `Complete ${subject.name}`,
      description: `Focused ${config.terminology.test.toLowerCase()} for ${subject.name} covering all major ${config.terminology.chapter.toLowerCase()}s and ${config.terminology.topic.toLowerCase()}s.`,
      tqs: 85 + Math.floor(Math.random() * 10),
      alignedToExam: config.name,
      chapters: subject.chapters.map(ch => ch.name),
      attempted: Math.random() > 0.5,
    });
  });
  
  // Chapter-specific tests
  const allChapters = getAllChapters(domainId);
  allChapters.slice(0, Math.min(5, count - tests.length)).forEach((chapter, idx) => {
    const questionsPerChapter = isExam ? 30 : 20;
    const subjectName = subjects.find(s => s.chapters.includes(chapter))?.name || 'General';
    
    tests.push({
      id: `chapter-${chapter.id}`,
      title: `${chapter.name} - ${config.terminology.test}`,
      type: `${config.terminology.chapter} ${config.terminology.test}`,
      duration: '45 mins',
      questions: questionsPerChapter,
      marks: questionsPerChapter * 4,
      coins: 75,
      subject: subjectName,
      difficulty: chapter.difficulty,
      syllabus: chapter.name,
      description: `Targeted ${config.terminology.test.toLowerCase()} on ${chapter.name} covering: ${chapter.topics.slice(0, 3).join(', ')}.`,
      tqs: 80 + Math.floor(Math.random() * 15),
      alignedToExam: config.name,
      chapters: [chapter.name],
      attempted: Math.random() > 0.6,
    });
  });
  
  return tests.slice(0, count);
}

// Generate domain-specific practice problems
export function generateDomainPractice(domainId: string, count: number = 20): GeneratedPractice[] {
  const config = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  const practices: GeneratedPractice[] = [];
  
  subjects.forEach(subject => {
    subject.chapters.forEach((chapter, chIdx) => {
      const problemCount = Math.floor(count / subjects.length / 2);
      
      for (let i = 0; i < problemCount; i++) {
        const difficultyIdx = i % config.difficultyLevels.length;
        const difficulty = config.difficultyLevels[difficultyIdx];
        const topic = chapter.topics[i % chapter.topics.length];
        
        practices.push({
          id: `practice-${subject.id}-${chapter.id}-${i}`,
          title: `${topic} - ${config.terminology.practice} Set ${i + 1}`,
          difficulty,
          category: subject.name,
          solved: Math.random() > 0.6,
          points: 10 + (difficultyIdx * 15),
          description: `Practice ${config.terminology.question.toLowerCase()}s on ${topic} from ${chapter.name}`,
          tags: [subject.name, chapter.name, topic],
        });
      }
    });
  });
  
  return practices.slice(0, count);
}

// Generate domain-specific learning modules
export function generateDomainLearnModules(domainId: string): GeneratedLearnModule[] {
  const config = getDomainConfig(domainId);
  const subjects = getDomainSubjects(domainId);
  const modules: GeneratedLearnModule[] = [];
  
  subjects.forEach(subject => {
    // Full subject module
    modules.push({
      id: `module-${subject.id}`,
      name: `Complete ${subject.name}`,
      description: `Comprehensive course covering all ${subject.chapters.length} ${config.terminology.chapter.toLowerCase()}s in ${subject.name}`,
      duration: `${subject.chapters.reduce((acc, ch) => acc + ch.estimatedHours, 0)} hours`,
      completed: Math.random() > 0.7,
      subject: subject.name,
      chapters: subject.chapters.length,
      progress: Math.floor(Math.random() * 100),
    });
    
    // Individual chapter modules
    subject.chapters.forEach(chapter => {
      modules.push({
        id: `module-${subject.id}-${chapter.id}`,
        name: chapter.name,
        description: `${chapter.topics.length} ${config.terminology.topic.toLowerCase()}s: ${chapter.topics.join(', ')}`,
        duration: `${chapter.estimatedHours} hours`,
        completed: Math.random() > 0.5,
        subject: subject.name,
        chapters: 1,
        progress: Math.floor(Math.random() * 100),
      });
    });
  });
  
  return modules;
}

// Generate practice progress data
export function generatePracticeProgress(domainId: string) {
  const subjects = getDomainSubjects(domainId);
  
  return subjects.map(subject => {
    const totalQuestions = subject.chapters.reduce((acc, ch) => acc + ch.topics.length * 10, 0);
    const completed = Math.floor(totalQuestions * (0.5 + Math.random() * 0.4));
    
    return {
      name: subject.name,
      progress: Math.round((completed / totalQuestions) * 100),
      total: totalQuestions,
      completed,
    };
  });
}

// Generate subject filter list
export function generateSubjectFilters(domainId: string): string[] {
  const subjects = getDomainSubjects(domainId);
  return ['all', ...subjects.map(s => s.id)];
}

// Get subject display name
export function getSubjectDisplayName(domainId: string, subjectId: string): string {
  if (subjectId === 'all') return 'All';
  const subjects = getDomainSubjects(domainId);
  const subject = subjects.find(s => s.id === subjectId);
  return subject?.name || subjectId;
}

// Generate chapter analysis for a subject
export function generateChapterAnalysis(domainId: string, subjectId: string) {
  const subjects = getDomainSubjects(domainId);
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) return [];
  
  return subject.chapters.map(chapter => ({
    id: chapter.id,
    name: chapter.name,
    topics: chapter.topics.length,
    difficulty: chapter.difficulty,
    estimatedHours: chapter.estimatedHours,
    completed: Math.floor(Math.random() * chapter.topics.length),
    accuracy: 60 + Math.floor(Math.random() * 35),
  }));
}
