// Comprehensive domain configuration system
// This centralizes all domain-specific data structures and content

export interface SubjectConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: ChapterConfig[];
}

export interface ChapterConfig {
  id: string;
  name: string;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedHours: number;
}

export interface DomainConfig {
  id: string;
  name: string;
  category: 'coding' | 'exam';
  
  // Terminology - domain-specific naming
  terminology: {
    subject: string; // "Subject" for exams, "Track" for coding
    chapter: string; // "Chapter" for exams, "Module" for coding
    topic: string; // "Topic" for exams, "Lesson" for coding
    question: string; // "Question" for exams, "Problem" for coding
    test: string; // "Mock Test" for exams, "Assessment" for coding
    practice: string; // "Practice Set" for exams, "Challenge" for coding
  };
  
  // Subject structure
  subjects: SubjectConfig[];
  
  // Difficulty levels specific to domain
  difficultyLevels: string[];
  
  // Question types
  questionTypes: string[];
  
  // Content recommendations
  contentTypes: {
    video: boolean;
    article: boolean;
    interactive: boolean;
    liveClass: boolean;
    practice: boolean;
  };
}

// Domain configurations
export const DOMAIN_CONFIGS: { [key: string]: DomainConfig } = {
  'competitive-programming': {
    id: 'competitive-programming',
    name: 'Competitive Programming',
    category: 'coding',
    terminology: {
      subject: 'Track',
      chapter: 'Module',
      topic: 'Concept',
      question: 'Problem',
      test: 'Contest',
      practice: 'Challenge',
    },
    subjects: [
      {
        id: 'arrays-strings',
        name: 'Arrays & Strings',
        icon: '📊',
        color: 'bg-blue-500',
        chapters: [
          {
            id: 'basic-arrays',
            name: 'Array Fundamentals',
            topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'Kadane\'s Algorithm'],
            difficulty: 'Easy',
            estimatedHours: 8,
          },
          {
            id: 'string-manipulation',
            name: 'String Manipulation',
            topics: ['Pattern Matching', 'String Hashing', 'KMP Algorithm', 'Trie'],
            difficulty: 'Medium',
            estimatedHours: 10,
          },
        ],
      },
      {
        id: 'dynamic-programming',
        name: 'Dynamic Programming',
        icon: '🧩',
        color: 'bg-purple-500',
        chapters: [
          {
            id: 'dp-fundamentals',
            name: 'DP Fundamentals',
            topics: ['Memoization', 'Tabulation', 'State Definition', 'Recurrence Relations'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
          {
            id: 'advanced-dp',
            name: 'Advanced DP Patterns',
            topics: ['Digit DP', 'Bitmask DP', 'DP on Trees', 'Matrix Chain Multiplication'],
            difficulty: 'Hard',
            estimatedHours: 20,
          },
        ],
      },
      {
        id: 'graphs',
        name: 'Graph Algorithms',
        icon: '🕸️',
        color: 'bg-green-500',
        chapters: [
          {
            id: 'graph-traversal',
            name: 'Graph Traversal',
            topics: ['BFS', 'DFS', 'Topological Sort', 'Cycle Detection'],
            difficulty: 'Medium',
            estimatedHours: 12,
          },
          {
            id: 'shortest-path',
            name: 'Shortest Path Algorithms',
            topics: ['Dijkstra', 'Bellman-Ford', 'Floyd-Warshall', 'A* Algorithm'],
            difficulty: 'Hard',
            estimatedHours: 15,
          },
        ],
      },
      {
        id: 'trees',
        name: 'Trees & BST',
        icon: '🌳',
        color: 'bg-emerald-500',
        chapters: [
          {
            id: 'binary-trees',
            name: 'Binary Trees',
            topics: ['Tree Traversals', 'Tree Construction', 'Lowest Common Ancestor', 'Path Sum'],
            difficulty: 'Easy',
            estimatedHours: 10,
          },
          {
            id: 'advanced-trees',
            name: 'Advanced Tree Structures',
            topics: ['Segment Trees', 'Fenwick Trees', 'AVL Trees', 'Red-Black Trees'],
            difficulty: 'Hard',
            estimatedHours: 18,
          },
        ],
      },
    ],
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    questionTypes: ['Coding Problem', 'Multiple Choice', 'Debug Code', 'Fill in the Blank'],
    contentTypes: {
      video: true,
      article: true,
      interactive: true,
      liveClass: false,
      practice: true,
    },
  },

  'frontend': {
    id: 'frontend',
    name: 'Frontend Development',
    category: 'coding',
    terminology: {
      subject: 'Technology',
      chapter: 'Module',
      topic: 'Lesson',
      question: 'Challenge',
      test: 'Project Assessment',
      practice: 'Exercise',
    },
    subjects: [
      {
        id: 'react',
        name: 'React',
        icon: '⚛️',
        color: 'bg-cyan-500',
        chapters: [
          {
            id: 'react-basics',
            name: 'React Fundamentals',
            topics: ['Components', 'Props', 'State', 'Event Handling', 'Conditional Rendering'],
            difficulty: 'Easy',
            estimatedHours: 12,
          },
          {
            id: 'react-hooks',
            name: 'React Hooks',
            topics: ['useState', 'useEffect', 'useContext', 'useReducer', 'Custom Hooks'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
          {
            id: 'react-advanced',
            name: 'Advanced React',
            topics: ['Performance Optimization', 'Code Splitting', 'Suspense', 'Error Boundaries'],
            difficulty: 'Hard',
            estimatedHours: 20,
          },
        ],
      },
      {
        id: 'css',
        name: 'CSS & Styling',
        icon: '🎨',
        color: 'bg-pink-500',
        chapters: [
          {
            id: 'css-fundamentals',
            name: 'CSS Fundamentals',
            topics: ['Selectors', 'Box Model', 'Positioning', 'Display & Visibility'],
            difficulty: 'Easy',
            estimatedHours: 8,
          },
          {
            id: 'css-layout',
            name: 'Modern Layouts',
            topics: ['Flexbox', 'CSS Grid', 'Responsive Design', 'Mobile-First Approach'],
            difficulty: 'Medium',
            estimatedHours: 12,
          },
          {
            id: 'css-advanced',
            name: 'Advanced CSS',
            topics: ['Animations', 'Transitions', 'Custom Properties', 'CSS Architecture'],
            difficulty: 'Medium',
            estimatedHours: 10,
          },
        ],
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: '📜',
        color: 'bg-yellow-500',
        chapters: [
          {
            id: 'js-fundamentals',
            name: 'JavaScript Basics',
            topics: ['Variables', 'Functions', 'Objects', 'Arrays', 'Control Flow'],
            difficulty: 'Easy',
            estimatedHours: 10,
          },
          {
            id: 'js-es6',
            name: 'ES6+ Features',
            topics: ['Arrow Functions', 'Destructuring', 'Spread/Rest', 'Promises', 'Async/Await'],
            difficulty: 'Medium',
            estimatedHours: 12,
          },
          {
            id: 'js-advanced',
            name: 'Advanced JavaScript',
            topics: ['Closures', 'Prototypes', 'Event Loop', 'Design Patterns'],
            difficulty: 'Hard',
            estimatedHours: 15,
          },
        ],
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        icon: '🔷',
        color: 'bg-blue-600',
        chapters: [
          {
            id: 'ts-basics',
            name: 'TypeScript Fundamentals',
            topics: ['Type Annotations', 'Interfaces', 'Type Inference', 'Union Types'],
            difficulty: 'Medium',
            estimatedHours: 10,
          },
          {
            id: 'ts-advanced',
            name: 'Advanced TypeScript',
            topics: ['Generics', 'Utility Types', 'Decorators', 'Type Guards'],
            difficulty: 'Hard',
            estimatedHours: 15,
          },
        ],
      },
    ],
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    questionTypes: ['Code Challenge', 'Build Component', 'Debug Issue', 'Design Implementation'],
    contentTypes: {
      video: true,
      article: true,
      interactive: true,
      liveClass: true,
      practice: true,
    },
  },

  'backend': {
    id: 'backend',
    name: 'Backend Development',
    category: 'coding',
    terminology: {
      subject: 'Technology',
      chapter: 'Module',
      topic: 'Lesson',
      question: 'Challenge',
      test: 'System Design',
      practice: 'Exercise',
    },
    subjects: [
      {
        id: 'nodejs',
        name: 'Node.js',
        icon: '🟢',
        color: 'bg-green-600',
        chapters: [
          {
            id: 'node-basics',
            name: 'Node.js Fundamentals',
            topics: ['Event Loop', 'Modules', 'File System', 'Streams', 'HTTP Server'],
            difficulty: 'Easy',
            estimatedHours: 12,
          },
          {
            id: 'express',
            name: 'Express.js',
            topics: ['Routing', 'Middleware', 'Error Handling', 'RESTful APIs'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
        ],
      },
      {
        id: 'databases',
        name: 'Databases',
        icon: '💾',
        color: 'bg-indigo-500',
        chapters: [
          {
            id: 'sql',
            name: 'SQL Databases',
            topics: ['Queries', 'Joins', 'Indexing', 'Transactions', 'Normalization'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
          {
            id: 'nosql',
            name: 'NoSQL Databases',
            topics: ['MongoDB', 'Redis', 'Document Stores', 'Key-Value Stores'],
            difficulty: 'Medium',
            estimatedHours: 12,
          },
        ],
      },
      {
        id: 'system-design',
        name: 'System Design',
        icon: '🏗️',
        color: 'bg-purple-600',
        chapters: [
          {
            id: 'design-basics',
            name: 'Design Fundamentals',
            topics: ['Scalability', 'Load Balancing', 'Caching', 'CDN', 'Microservices'],
            difficulty: 'Hard',
            estimatedHours: 20,
          },
          {
            id: 'advanced-design',
            name: 'Advanced System Design',
            topics: ['Distributed Systems', 'CAP Theorem', 'Sharding', 'Replication'],
            difficulty: 'Hard',
            estimatedHours: 25,
          },
        ],
      },
    ],
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    questionTypes: ['Code Challenge', 'API Design', 'Database Schema', 'System Architecture'],
    contentTypes: {
      video: true,
      article: true,
      interactive: true,
      liveClass: true,
      practice: true,
    },
  },

  'mobile-dev': {
    id: 'mobile-dev',
    name: 'Mobile Development',
    category: 'coding',
    terminology: {
      subject: 'Platform',
      chapter: 'Module',
      topic: 'Lesson',
      question: 'Challenge',
      test: 'App Assessment',
      practice: 'Exercise',
    },
    subjects: [
      {
        id: 'react-native',
        name: 'React Native',
        icon: '📱',
        color: 'bg-cyan-600',
        chapters: [
          {
            id: 'rn-basics',
            name: 'React Native Basics',
            topics: ['Components', 'Styling', 'Navigation', 'State Management'],
            difficulty: 'Easy',
            estimatedHours: 15,
          },
          {
            id: 'rn-advanced',
            name: 'Advanced React Native',
            topics: ['Native Modules', 'Performance', 'Animations', 'Platform APIs'],
            difficulty: 'Hard',
            estimatedHours: 20,
          },
        ],
      },
      {
        id: 'ios',
        name: 'iOS Development',
        icon: '🍎',
        color: 'bg-gray-700',
        chapters: [
          {
            id: 'swift',
            name: 'Swift Programming',
            topics: ['Syntax', 'Optionals', 'Protocols', 'Closures', 'Memory Management'],
            difficulty: 'Medium',
            estimatedHours: 18,
          },
          {
            id: 'swiftui',
            name: 'SwiftUI',
            topics: ['Views', 'State', 'Binding', 'Navigation', 'Animations'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
        ],
      },
      {
        id: 'android',
        name: 'Android Development',
        icon: '🤖',
        color: 'bg-green-700',
        chapters: [
          {
            id: 'kotlin',
            name: 'Kotlin Programming',
            topics: ['Syntax', 'Null Safety', 'Coroutines', 'Extension Functions'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
          {
            id: 'jetpack-compose',
            name: 'Jetpack Compose',
            topics: ['Composables', 'State', 'Layouts', 'Navigation', 'Material Design'],
            difficulty: 'Medium',
            estimatedHours: 15,
          },
        ],
      },
    ],
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    questionTypes: ['Code Challenge', 'UI Implementation', 'Debug Issue', 'Feature Development'],
    contentTypes: {
      video: true,
      article: true,
      interactive: true,
      liveClass: true,
      practice: true,
    },
  },

  'jee': {
    id: 'jee',
    name: 'JEE (Main & Advanced)',
    category: 'exam',
    terminology: {
      subject: 'Subject',
      chapter: 'Chapter',
      topic: 'Topic',
      question: 'Question',
      test: 'Mock Test',
      practice: 'Practice Set',
    },
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        icon: '⚛️',
        color: 'bg-blue-600',
        chapters: [
          {
            id: 'mechanics',
            name: 'Mechanics',
            topics: ['Kinematics', 'Laws of Motion', 'Work Energy Power', 'Rotational Motion', 'Gravitation'],
            difficulty: 'Medium',
            estimatedHours: 40,
          },
          {
            id: 'thermodynamics',
            name: 'Thermodynamics',
            topics: ['Heat & Temperature', 'Kinetic Theory', 'Laws of Thermodynamics', 'Heat Engines'],
            difficulty: 'Medium',
            estimatedHours: 25,
          },
          {
            id: 'electromagnetism',
            name: 'Electromagnetism',
            topics: ['Electrostatics', 'Current Electricity', 'Magnetic Effects', 'Electromagnetic Induction'],
            difficulty: 'Hard',
            estimatedHours: 45,
          },
          {
            id: 'optics',
            name: 'Optics',
            topics: ['Ray Optics', 'Wave Optics', 'Optical Instruments', 'Interference & Diffraction'],
            difficulty: 'Medium',
            estimatedHours: 30,
          },
          {
            id: 'modern-physics',
            name: 'Modern Physics',
            topics: ['Dual Nature', 'Atoms', 'Nuclei', 'Semiconductors', 'Communication Systems'],
            difficulty: 'Hard',
            estimatedHours: 35,
          },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        icon: '🧪',
        color: 'bg-green-600',
        chapters: [
          {
            id: 'physical-chemistry',
            name: 'Physical Chemistry',
            topics: ['Mole Concept', 'Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium'],
            difficulty: 'Medium',
            estimatedHours: 40,
          },
          {
            id: 'organic-chemistry',
            name: 'Organic Chemistry',
            topics: ['Hydrocarbons', 'Organic Compounds', 'Reactions', 'Mechanisms', 'Biomolecules'],
            difficulty: 'Hard',
            estimatedHours: 50,
          },
          {
            id: 'inorganic-chemistry',
            name: 'Inorganic Chemistry',
            topics: ['Periodic Table', 's-Block', 'p-Block', 'd-Block', 'f-Block', 'Coordination'],
            difficulty: 'Medium',
            estimatedHours: 45,
          },
        ],
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        icon: '📐',
        color: 'bg-orange-600',
        chapters: [
          {
            id: 'algebra',
            name: 'Algebra',
            topics: ['Complex Numbers', 'Quadratic Equations', 'Sequences & Series', 'Permutations', 'Binomial'],
            difficulty: 'Medium',
            estimatedHours: 35,
          },
          {
            id: 'calculus',
            name: 'Calculus',
            topics: ['Limits', 'Derivatives', 'Applications of Derivatives', 'Integrals', 'Differential Equations'],
            difficulty: 'Hard',
            estimatedHours: 45,
          },
          {
            id: 'coordinate-geometry',
            name: 'Coordinate Geometry',
            topics: ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola'],
            difficulty: 'Medium',
            estimatedHours: 35,
          },
          {
            id: 'vectors',
            name: 'Vectors & 3D',
            topics: ['Vectors', '3D Geometry', 'Planes', 'Direction Cosines'],
            difficulty: 'Medium',
            estimatedHours: 25,
          },
          {
            id: 'trigonometry',
            name: 'Trigonometry',
            topics: ['Ratios', 'Equations', 'Inverse Functions', 'Properties of Triangles'],
            difficulty: 'Easy',
            estimatedHours: 20,
          },
        ],
      },
    ],
    difficultyLevels: ['JEE Main', 'JEE Advanced'],
    questionTypes: ['Single Correct', 'Multiple Correct', 'Numerical', 'Assertion-Reason', 'Paragraph'],
    contentTypes: {
      video: true,
      article: true,
      interactive: true,
      liveClass: true,
      practice: true,
    },
  },

  'neet': {
    id: 'neet',
    name: 'NEET',
    category: 'exam',
    terminology: {
      subject: 'Subject',
      chapter: 'Chapter',
      topic: 'Topic',
      question: 'Question',
      test: 'Mock Test',
      practice: 'Practice Set',
    },
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        icon: '⚛️',
        color: 'bg-blue-600',
        chapters: [
          {
            id: 'mechanics',
            name: 'Mechanics',
            topics: ['Motion', 'Forces', 'Work & Energy', 'Rotational Dynamics', 'Gravitation'],
            difficulty: 'Medium',
            estimatedHours: 35,
          },
          {
            id: 'thermodynamics',
            name: 'Heat & Thermodynamics',
            topics: ['Temperature', 'Calorimetry', 'Heat Transfer', 'Thermodynamic Processes'],
            difficulty: 'Medium',
            estimatedHours: 20,
          },
          {
            id: 'electricity',
            name: 'Electricity & Magnetism',
            topics: ['Electrostatics', 'Current', 'Magnetic Effects', 'EM Induction'],
            difficulty: 'Medium',
            estimatedHours: 30,
          },
          {
            id: 'optics-waves',
            name: 'Optics & Waves',
            topics: ['Wave Motion', 'Sound', 'Light', 'Optical Instruments'],
            difficulty: 'Easy',
            estimatedHours: 25,
          },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        icon: '🧪',
        color: 'bg-green-600',
        chapters: [
          {
            id: 'physical-chemistry',
            name: 'Physical Chemistry',
            topics: ['Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Solutions', 'Equilibrium'],
            difficulty: 'Medium',
            estimatedHours: 35,
          },
          {
            id: 'organic-chemistry',
            name: 'Organic Chemistry',
            topics: ['Basic Concepts', 'Hydrocarbons', 'Oxygen Compounds', 'Nitrogen Compounds', 'Biomolecules'],
            difficulty: 'Hard',
            estimatedHours: 45,
          },
          {
            id: 'inorganic-chemistry',
            name: 'Inorganic Chemistry',
            topics: ['Classification', 'Periodic Properties', 'Chemical Bonding', 'Coordination Chemistry'],
            difficulty: 'Medium',
            estimatedHours: 35,
          },
        ],
      },
      {
        id: 'botany',
        name: 'Botany',
        icon: '🌿',
        color: 'bg-emerald-600',
        chapters: [
          {
            id: 'plant-physiology',
            name: 'Plant Physiology',
            topics: ['Photosynthesis', 'Respiration', 'Plant Growth', 'Mineral Nutrition'],
            difficulty: 'Medium',
            estimatedHours: 30,
          },
          {
            id: 'plant-diversity',
            name: 'Diversity in Living World',
            topics: ['Classification', 'Plant Kingdom', 'Morphology', 'Anatomy'],
            difficulty: 'Easy',
            estimatedHours: 25,
          },
          {
            id: 'genetics-evolution',
            name: 'Genetics & Evolution',
            topics: ['Inheritance', 'Molecular Basis', 'Evolution', 'Biotechnology'],
            difficulty: 'Hard',
            estimatedHours: 35,
          },
        ],
      },
      {
        id: 'zoology',
        name: 'Zoology',
        icon: '🦋',
        color: 'bg-rose-600',
        chapters: [
          {
            id: 'human-physiology',
            name: 'Human Physiology',
            topics: ['Digestion', 'Breathing', 'Circulation', 'Excretion', 'Locomotion', 'Neural Control'],
            difficulty: 'Medium',
            estimatedHours: 40,
          },
          {
            id: 'animal-diversity',
            name: 'Animal Diversity',
            topics: ['Animal Kingdom', 'Structural Organization', 'Morphology'],
            difficulty: 'Easy',
            estimatedHours: 20,
          },
          {
            id: 'reproduction',
            name: 'Reproduction & Development',
            topics: ['Human Reproduction', 'Reproductive Health', 'Principles of Inheritance'],
            difficulty: 'Medium',
            estimatedHours: 25,
          },
          {
            id: 'ecology',
            name: 'Ecology & Environment',
            topics: ['Organisms & Environment', 'Ecosystem', 'Biodiversity', 'Environmental Issues'],
            difficulty: 'Easy',
            estimatedHours: 20,
          },
        ],
      },
    ],
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    questionTypes: ['Single Correct', 'Assertion-Reason', 'Statement Based'],
    contentTypes: {
      video: true,
      article: true,
      interactive: true,
      liveClass: true,
      practice: true,
    },
  },
};

// Helper function to get domain configuration
export function getDomainConfig(domainId: string): DomainConfig {
  return DOMAIN_CONFIGS[domainId] || DOMAIN_CONFIGS['competitive-programming'];
}

// Helper function to get all subjects for a domain
export function getDomainSubjects(domainId: string): SubjectConfig[] {
  const config = getDomainConfig(domainId);
  return config.subjects;
}

// Helper function to get all chapters across all subjects
export function getAllChapters(domainId: string): ChapterConfig[] {
  const subjects = getDomainSubjects(domainId);
  return subjects.flatMap(subject => subject.chapters);
}

// Helper function to get chapters for a specific subject
export function getSubjectChapters(domainId: string, subjectId: string): ChapterConfig[] {
  const subjects = getDomainSubjects(domainId);
  const subject = subjects.find(s => s.id === subjectId);
  return subject?.chapters || [];
}

// Helper function to get terminology
export function getDomainTerminology(domainId: string) {
  const config = getDomainConfig(domainId);
  return config.terminology;
}
