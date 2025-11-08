export interface DomainDataType {
  name: string;
  category: 'coding' | 'exam';
  stats: Array<{ label: string; value: string }>;
  dailyChallenge: {
    title: string;
    description: string;
    name: string;
    difficulty: string;
    reward: string;
  };
  upcomingEvents: Array<{ name: string; time: string }>;
  progressTopics: Array<{ name: string; progress: number; total: number; completed: number }>;
  progressUnit: string;
  learnModules: Array<{ id: string; name: string; description: string; duration: string; completed: boolean }>;
  practiceProblems: Array<{ id: string; title: string; difficulty: string; category: string; solved: boolean; points: number }>;
  contests: Array<{ id: string; name: string; date: string; participants: number; prize: string; status: string }>;
  tests: Array<{ id: string; name: string; duration: string; questions: number; attempted: boolean; score?: number }>;
  achievements: Array<{ id: string; name: string; description: string; unlocked: boolean; icon: string }>;
}

export function getDomainData(domain: string): DomainDataType {
  switch (domain) {
    case 'competitive-programming':
      return {
        name: 'Competitive Programming',
        category: 'coding',
        stats: [
          { label: 'Problems Solved', value: '147' },
          { label: 'Contest Rating', value: '1847' },
        ],
        dailyChallenge: {
          title: 'Daily Challenge',
          description: 'Complete today\'s problem to maintain your streak',
          name: 'Longest Palindromic Substring',
          difficulty: 'Medium',
          reward: '50 XP + 🔥 Streak Bonus',
        },
        upcomingEvents: [
          { name: 'Weekly Contest 382', time: 'Starts in 2 hours 15 minutes' },
          { name: 'Biweekly Contest 125', time: 'Tomorrow, 8:00 PM' },
        ],
        progressTopics: [
          { name: 'Arrays & Strings', progress: 85, total: 120, completed: 102 },
          { name: 'Dynamic Programming', progress: 45, total: 80, completed: 36 },
          { name: 'Graphs & Trees', progress: 60, total: 100, completed: 60 },
        ],
        progressUnit: 'problems',
        learnModules: [
          { id: '1', name: 'Binary Search Mastery', description: 'Master binary search and its variations', duration: '4 hours', completed: true },
          { id: '2', name: 'Dynamic Programming Fundamentals', description: 'Learn DP patterns and problem-solving techniques', duration: '8 hours', completed: false },
          { id: '3', name: 'Graph Algorithms', description: 'BFS, DFS, Dijkstra, and advanced graph algorithms', duration: '6 hours', completed: false },
          { id: '4', name: 'Advanced Data Structures', description: 'Segment Trees, Fenwick Trees, and more', duration: '10 hours', completed: false },
        ],
        practiceProblems: [
          { id: '1', title: 'Two Sum', difficulty: 'Easy', category: 'Array', solved: true, points: 10 },
          { id: '2', title: 'Binary Tree Traversal', difficulty: 'Medium', category: 'Trees', solved: true, points: 25 },
          { id: '3', title: '0/1 Knapsack Problem', difficulty: 'Hard', category: 'DP', solved: false, points: 50 },
          { id: '4', title: 'Shortest Path in Graph', difficulty: 'Medium', category: 'Graphs', solved: false, points: 30 },
          { id: '5', title: 'Maximum Subarray Sum', difficulty: 'Easy', category: 'Array', solved: true, points: 15 },
        ],
        contests: [
          { id: '1', name: 'Weekly Contest 382', date: 'Dec 15, 2024', participants: 15420, prize: '1000 coins', status: 'upcoming' },
          { id: '2', name: 'Biweekly Contest 125', date: 'Dec 22, 2024', participants: 8950, prize: '750 coins', status: 'upcoming' },
          { id: '3', name: 'Monthly Challenge - November', date: 'Nov 30, 2024', participants: 25680, prize: '2000 coins', status: 'completed' },
        ],
        tests: [
          { id: '1', name: 'Arrays & Hashing Assessment', duration: '60 mins', questions: 20, attempted: true, score: 85 },
          { id: '2', name: 'Tree & Graph Quiz', duration: '45 mins', questions: 15, attempted: false },
          { id: '3', name: 'DP Mastery Test', duration: '90 mins', questions: 25, attempted: false },
        ],
        achievements: [
          { id: '1', name: 'First Blood', description: 'Solve your first problem', unlocked: true, icon: '🎯' },
          { id: '2', name: 'Speed Demon', description: 'Solve 10 problems in one day', unlocked: true, icon: '⚡' },
          { id: '3', name: 'Streak Master', description: 'Maintain a 30-day streak', unlocked: false, icon: '🔥' },
          { id: '4', name: 'Contest Champion', description: 'Win a weekly contest', unlocked: false, icon: '🏆' },
        ],
      };

    case 'frontend':
      return {
        name: 'Frontend Development',
        category: 'coding',
        stats: [
          { label: 'Projects Completed', value: '23' },
          { label: 'Skill Level', value: 'Advanced' },
        ],
        dailyChallenge: {
          title: 'Daily UI Challenge',
          description: 'Build today\'s component to improve your skills',
          name: 'Responsive Navigation Bar',
          difficulty: 'Medium',
          reward: '40 XP + Design Tokens',
        },
        upcomingEvents: [
          { name: 'React Workshop', time: 'Today, 6:00 PM' },
          { name: 'CSS Grid Masterclass', time: 'Tomorrow, 3:00 PM' },
        ],
        progressTopics: [
          { name: 'React Fundamentals', progress: 90, total: 50, completed: 45 },
          { name: 'CSS & Styling', progress: 75, total: 40, completed: 30 },
          { name: 'JavaScript ES6+', progress: 80, total: 60, completed: 48 },
        ],
        progressUnit: 'exercises',
        learnModules: [
          { id: '1', name: 'React Hooks Deep Dive', description: 'Master useState, useEffect, and custom hooks', duration: '5 hours', completed: true },
          { id: '2', name: 'Advanced CSS Techniques', description: 'Grid, Flexbox, Animations, and more', duration: '4 hours', completed: true },
          { id: '3', name: 'TypeScript for React', description: 'Type-safe React development', duration: '6 hours', completed: false },
          { id: '4', name: 'Performance Optimization', description: 'Make your React apps blazing fast', duration: '5 hours', completed: false },
        ],
        practiceProblems: [
          { id: '1', title: 'Build a Todo App', difficulty: 'Easy', category: 'React', solved: true, points: 20 },
          { id: '2', title: 'Create Infinite Scroll', difficulty: 'Medium', category: 'React', solved: false, points: 35 },
          { id: '3', title: 'Responsive Dashboard', difficulty: 'Hard', category: 'CSS', solved: false, points: 50 },
          { id: '4', title: 'Form Validation', difficulty: 'Easy', category: 'JavaScript', solved: true, points: 15 },
        ],
        contests: [
          { id: '1', name: 'UI Component Challenge', date: 'Dec 18, 2024', participants: 3420, prize: '500 coins', status: 'upcoming' },
          { id: '2', name: 'Full Page Design Sprint', date: 'Dec 25, 2024', participants: 2150, prize: '1000 coins', status: 'upcoming' },
        ],
        tests: [
          { id: '1', name: 'React Fundamentals Quiz', duration: '30 mins', questions: 25, attempted: true, score: 92 },
          { id: '2', name: 'CSS Layout Assessment', duration: '45 mins', questions: 20, attempted: false },
        ],
        achievements: [
          { id: '1', name: 'First Component', description: 'Build your first React component', unlocked: true, icon: '🎨' },
          { id: '2', name: 'Styling Pro', description: 'Complete 50 CSS challenges', unlocked: true, icon: '💅' },
          { id: '3', name: 'Performance Guru', description: 'Optimize an app to 95+ Lighthouse score', unlocked: false, icon: '⚡' },
        ],
      };

    case 'jee':
      return {
        name: 'JEE (Main & Advanced)',
        category: 'exam',
        stats: [
          { label: 'Questions Solved', value: '2,847' },
          { label: 'Mock Test Score', value: '245/300' },
        ],
        dailyChallenge: {
          title: 'Daily Practice',
          description: 'Complete today\'s practice set',
          name: 'Physics - Rotational Motion',
          difficulty: 'JEE Advanced',
          reward: '30 XP + Detailed Solutions',
        },
        upcomingEvents: [
          { name: 'Full Length Mock Test #15', time: 'This Saturday, 9:00 AM' },
          { name: 'Doubt Clearing Session - Chemistry', time: 'Tomorrow, 5:00 PM' },
        ],
        progressTopics: [
          { name: 'Physics - Mechanics', progress: 85, total: 500, completed: 425 },
          { name: 'Chemistry - Organic', progress: 60, total: 400, completed: 240 },
          { name: 'Mathematics - Calculus', progress: 75, total: 450, completed: 337 },
        ],
        progressUnit: 'questions',
        learnModules: [
          { id: '1', name: 'Physics - Electrostatics', description: 'Complete chapter with video lectures', duration: '12 hours', completed: true },
          { id: '2', name: 'Chemistry - Chemical Bonding', description: 'Theory and numerical problems', duration: '10 hours', completed: false },
          { id: '3', name: 'Mathematics - Coordinate Geometry', description: 'All concepts and problem solving', duration: '15 hours', completed: false },
          { id: '4', name: 'Physics - Modern Physics', description: 'Quantum mechanics and nuclear physics', duration: '14 hours', completed: false },
        ],
        practiceProblems: [
          { id: '1', title: 'Projectile Motion - Set A', difficulty: 'Easy', category: 'Physics', solved: true, points: 10 },
          { id: '2', title: 'Organic Reactions Mechanism', difficulty: 'Hard', category: 'Chemistry', solved: false, points: 40 },
          { id: '3', title: 'Integration Techniques', difficulty: 'Medium', category: 'Mathematics', solved: true, points: 25 },
          { id: '4', title: 'Thermodynamics Problems', difficulty: 'Hard', category: 'Physics', solved: false, points: 45 },
        ],
        contests: [
          { id: '1', name: 'All India Mock Test #20', date: 'Dec 16, 2024', participants: 45000, prize: 'Detailed Analysis', status: 'upcoming' },
          { id: '2', name: 'Subject Test - Mathematics', date: 'Dec 20, 2024', participants: 28000, prize: 'Rank Certificate', status: 'upcoming' },
        ],
        tests: [
          { id: '1', name: 'JEE Main Mock Test #14', duration: '180 mins', questions: 90, attempted: true, score: 82 },
          { id: '2', name: 'JEE Advanced Mock #8', duration: '180 mins', questions: 54, attempted: false },
          { id: '3', name: 'Physics Chapter Test - Wave Optics', duration: '60 mins', questions: 30, attempted: true, score: 88 },
        ],
        achievements: [
          { id: '1', name: 'Dedicated Learner', description: 'Complete 100 questions', unlocked: true, icon: '📚' },
          { id: '2', name: 'Mock Master', description: 'Score 90%+ in a mock test', unlocked: false, icon: '🎯' },
          { id: '3', name: 'Consistent Performer', description: 'Maintain 60-day study streak', unlocked: true, icon: '🔥' },
          { id: '4', name: 'Subject Expert', description: 'Complete all chapters in one subject', unlocked: false, icon: '🏆' },
        ],
      };

    case 'neet':
      return {
        name: 'NEET',
        category: 'exam',
        stats: [
          { label: 'Questions Solved', value: '3,245' },
          { label: 'Mock Test Score', value: '620/720' },
        ],
        dailyChallenge: {
          title: 'Daily Practice',
          description: 'Complete today\'s practice set',
          name: 'Biology - Human Physiology',
          difficulty: 'NEET Level',
          reward: '30 XP + Video Solutions',
        },
        upcomingEvents: [
          { name: 'Full Syllabus Mock Test #12', time: 'This Sunday, 10:00 AM' },
          { name: 'Biology Revision Session', time: 'Tomorrow, 4:00 PM' },
        ],
        progressTopics: [
          { name: 'Biology - Botany', progress: 80, total: 600, completed: 480 },
          { name: 'Biology - Zoology', progress: 75, total: 600, completed: 450 },
          { name: 'Physics - Mechanics & Thermodynamics', progress: 70, total: 400, completed: 280 },
        ],
        progressUnit: 'questions',
        learnModules: [
          { id: '1', name: 'Human Anatomy & Physiology', description: 'Complete system-wise coverage', duration: '20 hours', completed: true },
          { id: '2', name: 'Plant Physiology', description: 'Photosynthesis, respiration, and more', duration: '15 hours', completed: true },
          { id: '3', name: 'Organic Chemistry for NEET', description: 'All reactions and mechanisms', duration: '18 hours', completed: false },
          { id: '4', name: 'Genetics & Evolution', description: 'Molecular basis and inheritance', duration: '12 hours', completed: false },
        ],
        practiceProblems: [
          { id: '1', title: 'Cell Biology - Practice Set', difficulty: 'Easy', category: 'Biology', solved: true, points: 15 },
          { id: '2', title: 'Human Physiology - Tough Questions', difficulty: 'Hard', category: 'Biology', solved: false, points: 40 },
          { id: '3', title: 'Optics Numerical', difficulty: 'Medium', category: 'Physics', solved: true, points: 25 },
          { id: '4', title: 'Chemical Equilibrium', difficulty: 'Medium', category: 'Chemistry', solved: false, points: 30 },
        ],
        contests: [
          { id: '1', name: 'Grand Mock Test Series #10', date: 'Dec 17, 2024', participants: 52000, prize: 'AIR Ranking', status: 'upcoming' },
          { id: '2', name: 'Biology Marathon', date: 'Dec 21, 2024', participants: 35000, prize: 'Detailed Report', status: 'upcoming' },
        ],
        tests: [
          { id: '1', name: 'NEET Mock Test #15', duration: '180 mins', questions: 180, attempted: true, score: 85 },
          { id: '2', name: 'Biology Full Test', duration: '90 mins', questions: 90, attempted: false },
          { id: '3', name: 'Chemistry Chapter Test', duration: '60 mins', questions: 45, attempted: true, score: 90 },
        ],
        achievements: [
          { id: '1', name: 'Biology Master', description: 'Complete 500 biology questions', unlocked: true, icon: '🧬' },
          { id: '2', name: 'Perfect Score', description: 'Score 100% in a chapter test', unlocked: true, icon: '💯' },
          { id: '3', name: 'Mock Marathon', description: 'Attempt 20 full-length mocks', unlocked: false, icon: '🏃' },
        ],
      };

    // Add more cases for other domains...
    default:
      // Generic data for unlisted domains
      return {
        name: domain,
        category: 'coding',
        stats: [
          { label: 'Tasks Completed', value: '156' },
          { label: 'Skill Rating', value: '1650' },
        ],
        dailyChallenge: {
          title: 'Daily Challenge',
          description: 'Complete today\'s challenge',
          name: 'Practice Problem of the Day',
          difficulty: 'Medium',
          reward: '50 XP',
        },
        upcomingEvents: [
          { name: 'Weekly Challenge', time: 'Starting Soon' },
          { name: 'Study Session', time: 'Tomorrow' },
        ],
        progressTopics: [
          { name: 'Core Concepts', progress: 70, total: 100, completed: 70 },
          { name: 'Advanced Topics', progress: 45, total: 80, completed: 36 },
        ],
        progressUnit: 'items',
        learnModules: [
          { id: '1', name: 'Fundamentals', description: 'Learn the basics', duration: '5 hours', completed: true },
          { id: '2', name: 'Intermediate Concepts', description: 'Level up your skills', duration: '8 hours', completed: false },
        ],
        practiceProblems: [
          { id: '1', title: 'Basic Problem 1', difficulty: 'Easy', category: 'General', solved: true, points: 10 },
          { id: '2', title: 'Intermediate Problem 1', difficulty: 'Medium', category: 'General', solved: false, points: 25 },
        ],
        contests: [
          { id: '1', name: 'Weekly Contest', date: 'Coming Soon', participants: 1000, prize: '500 coins', status: 'upcoming' },
        ],
        tests: [
          { id: '1', name: 'Assessment Test', duration: '60 mins', questions: 30, attempted: false },
        ],
        achievements: [
          { id: '1', name: 'Getting Started', description: 'Complete your first task', unlocked: true, icon: '🎯' },
        ],
      };
  }
}
