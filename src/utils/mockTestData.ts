// Mock test results data for demo purposes
// In production, this would come from your backend API

import { getDomainConfig, getDomainSubjects } from './domainConfig';

export const generateMockTestResults = (test: any, domainId?: string) => {
  // Get domain-specific configuration
  const domain = domainId || 'jee';
  const domainConfig = getDomainConfig(domain);
  const subjects = getDomainSubjects(domain);
  
  // Use actual subjects from domain config
  const subjectNames = subjects.slice(0, 3).map(s => s.name);
  return {
    score: 245,
    totalMarks: test.marks || 300,
    percentage: 81.7,
    rank: 1247,
    totalStudents: 45890,
    correctAnswers: 66,
    incorrectAnswers: 18,
    unattempted: 6,
    totalQuestions: test.questions || 90,
    timeSpent: 180, // minutes
    averageTime: 2, // minutes per question
    
    // Subject-wise breakdown (domain-specific)
    subjectScores: subjects.slice(0, 3).map((subject, idx) => {
      const scores = [85, 88, 72];
      const correctCounts = [22, 24, 20];
      const incorrectCounts = [6, 5, 7];
      const unattemptedCounts = [2, 1, 3];
      const avgTimes = [2.3, 1.8, 2.1];
      
      const topChapter = subject.chapters[0]?.name || 'Core Topics';
      const weakChapter = subject.chapters[subject.chapters.length - 1]?.name || 'Advanced Topics';
      
      return {
        subject: subject.name,
        score: scores[idx] || 75,
        total: 100,
        correct: correctCounts[idx] || 20,
        incorrect: incorrectCounts[idx] || 6,
        unattempted: unattemptedCounts[idx] || 4,
        avgTime: avgTimes[idx] || 2.0,
        topSkill: topChapter,
        weakArea: weakChapter,
      };
    }),

    // AI Predictions
    predictions: {
      currentScore: 245,
      predictedScore: 285,
      improvement: 40,
      confidenceLevel: 87,
      studyHoursNeeded: 25,
      estimatedRank: 850,
      strengths: ['Organic Chemistry', 'Mechanics', 'Calculus'],
      weaknesses: ['Modern Physics', 'Physical Chemistry', 'Coordinate Geometry'],
    },

    // Time Management
    timeDistribution: [
      { section: 'Physics', time: 62, ideal: 60, color: '#3b82f6' },
      { section: 'Chemistry', time: 54, ideal: 60, color: '#10b981' },
      { section: 'Mathematics', time: 64, ideal: 60, color: '#f59e0b' },
    ],

    questionwiseSpeed: [
      { range: 'Fast (<1 min)', count: 28, percentage: 31 },
      { range: 'Moderate (1-3 min)', count: 45, percentage: 50 },
      { range: 'Slow (>3 min)', count: 17, percentage: 19 },
    ],

    // Chapter-wise Analysis (domain-specific)
    chapterAnalysis: subjects.flatMap(subject => 
      subject.chapters.slice(0, 3).map(chapter => {
        const attempted = Math.floor(Math.random() * 10) + 8;
        const correct = Math.floor(attempted * (0.6 + Math.random() * 0.3));
        return {
          chapter: chapter.name,
          attempted,
          correct,
          accuracy: Math.round((correct / attempted) * 100),
          avgTime: 1.5 + Math.random() * 2,
        };
      })
    ),

    // Behavioral Analysis
    behavior: {
      sincerityScore: 78,
      positiveActions: [
        'Consistent time per question',
        'Reviewed flagged questions',
        'Attempted all sections',
        'Good use of elimination technique',
      ],
      negativeActions: [
        'Rushed through last 10 questions',
        'Didn\'t review incorrect attempts',
      ],
      focusLevel: 82,
      stressLevel: 35,
    },

    // Mistake Analysis
    mistakeBreakdown: [
      { type: 'Conceptual Error', count: 8, color: '#ef4444' },
      { type: 'Calculation Error', count: 5, color: '#f59e0b' },
      { type: 'Careless Mistake', count: 3, color: '#fbbf24' },
      { type: 'Time Pressure', count: 2, color: '#fb923c' },
    ],

    // Historical Performance
    historicalScores: [
      { test: 'Test 1', score: 210, date: 'Oct 15' },
      { test: 'Test 2', score: 225, date: 'Oct 22' },
      { test: 'Test 3', score: 235, date: 'Oct 29' },
      { test: 'Test 4', score: 245, date: 'Nov 5' },
    ],

    // Skill Radar
    skillRadar: [
      { skill: 'Problem Solving', score: 85 },
      { skill: 'Speed', score: 72 },
      { skill: 'Accuracy', score: 88 },
      { skill: 'Conceptual', score: 78 },
      { skill: 'Application', score: 82 },
      { skill: 'Analysis', score: 75 },
    ],

    // Achievements
    achievements: {
      coinsEarned: 125,
      badgesUnlocked: ['Speed Demon', 'Accuracy Master'],
      streakDays: 7,
      totalTests: 23,
      avgImprovement: 5.2,
    },

    // Question-wise Analysis
    questionAnalysis: generateQuestionWiseData(domain),
  };
};

// Generate detailed question-wise data
const generateQuestionWiseData = (domainId?: string) => {
  const domain = domainId || 'jee';
  const domainConfig = getDomainConfig(domain);
  const subjects = getDomainSubjects(domain);
  
  // Build topics map from domain config
  const topicsMap: { [key: string]: string[] } = {};
  subjects.forEach(subject => {
    topicsMap[subject.name] = subject.chapters.flatMap(ch => ch.topics);
  });
  
  const difficulties = domainConfig.difficultyLevels;
  const statuses = ['correct', 'incorrect', 'unattempted'];
  
  const questions = [];
  const questionsPerSubject = Math.floor(90 / subjects.length);
  
  for (let i = 1; i <= 90; i++) {
    const subjectIndex = Math.floor((i - 1) / questionsPerSubject);
    const subject = subjects[Math.min(subjectIndex, subjects.length - 1)];
    const topicList = topicsMap[subject.name] || ['General'];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    
    // Determine status with weighted probability
    let status;
    const rand = Math.random();
    if (rand < 0.73) status = 'correct';
    else if (rand < 0.93) status = 'incorrect';
    else status = 'unattempted';
    
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const marks = 2 + Math.floor(Math.random() * 3); // 2-4 marks
    
    questions.push({
      id: i,
      questionNumber: i,
      subject: subject.name,
      topic,
      difficulty,
      status,
      marks,
      marksObtained: status === 'correct' ? marks : status === 'incorrect' ? -1 : 0,
      timeSpent: status === 'unattempted' ? 0 : Math.floor(Math.random() * 5) + 1, // 1-5 minutes
      yourAnswer: status === 'unattempted' ? null : ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      questionText: `Sample question ${i} related to ${topic}`,
      explanation: `This question tests your understanding of ${topic}. The correct approach involves...`,
      bookmarked: Math.random() > 0.8,
    });
  }
  
  return questions;
};
