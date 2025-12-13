import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Add logger
app.use('*', logger(console.log));

// Health check endpoint
app.get("/make-server-b9684b04/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Execute code endpoint (for "Run" button)
app.post("/make-server-b9684b04/execute-code", async (c) => {
  try {
    const { code, language, problemId, testCases } = await c.req.json();
    
    console.log(`Executing code for problem ${problemId} in ${language}`);
    
    // Simulate code execution (in production, use a service like Judge0, Piston, or custom sandboxed execution)
    const results = await executeCode(code, language, testCases);
    
    return c.json({ results });
  } catch (error) {
    console.error('Error executing code:', error);
    return c.json({ error: error instanceof Error ? error.message : 'Execution failed' }, 500);
  }
});

// Submit code endpoint (for "Submit" button)
app.post("/make-server-b9684b04/submit-code", async (c) => {
  try {
    const { code, language, problemId, testCases, userId = 'user-1' } = await c.req.json();
    
    console.log(`Submitting code for problem ${problemId} in ${language}`);
    
    // Execute against all test cases
    const results = await executeCode(code, language, testCases);
    
    // Calculate metrics
    const passedCount = results.filter((r: any) => r.passed).length;
    const totalCount = testCases.length;
    const status = passedCount === totalCount ? 'accepted' : 'wrong_answer';
    
    // Find first failed test case
    let failedCase = null;
    if (status === 'wrong_answer') {
      const failedIdx = results.findIndex((r: any) => !r.passed);
      if (failedIdx !== -1) {
        failedCase = {
          input: testCases[failedIdx].input,
          expected: testCases[failedIdx].expectedOutput,
          actual: results[failedIdx].output,
        };
      }
    }
    
    // Calculate average runtime
    const avgRuntime = results.reduce((sum: number, r: any) => sum + (r.runtime || 0), 0) / results.length;
    
    // Save submission to storage
    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const submission = {
      id: submissionId,
      problemId,
      code,
      language,
      status,
      timestamp: new Date().toISOString(),
      runtime: `${avgRuntime.toFixed(0)}ms`,
      memory: `${(Math.random() * 5 + 8).toFixed(1)}MB`,
      testCasesPassed: passedCount,
      totalTestCases: totalCount,
      userId,
    };
    
    // Store submission
    const submissionKey = `submission:${problemId}:${submissionId}`;
    await kv.set(submissionKey, submission);
    
    // Add to user's submissions list
    const userSubmissionsKey = `submissions:${problemId}`;
    const existingSubmissions = await kv.get(userSubmissionsKey);
    const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
    submissions.unshift(submission);
    // Keep only last 50 submissions
    if (submissions.length > 50) {
      submissions.length = 50;
    }
    await kv.set(userSubmissionsKey, JSON.stringify(submissions));
    
    // Update user stats if accepted
    if (status === 'accepted') {
      await updateUserStats(userId, problemId);
    }
    
    // Update leaderboard
    await updateLeaderboard(userId, problemId, avgRuntime, status);
    
    return c.json({
      results,
      status,
      avgRuntime: `${avgRuntime.toFixed(0)}ms`,
      memory: submission.memory,
      failedCase,
      submissionId,
    });
  } catch (error) {
    console.error('Error submitting code:', error);
    return c.json({ error: error instanceof Error ? error.message : 'Submission failed' }, 500);
  }
});

// Get submissions for a problem
app.get("/make-server-b9684b04/submissions/:problemId", async (c) => {
  try {
    const problemId = c.req.param('problemId');
    const userSubmissionsKey = `submissions:${problemId}`;
    
    const data = await kv.get(userSubmissionsKey);
    const submissions = data ? JSON.parse(data) : [];
    
    return c.json({ submissions });
  } catch (error) {
    console.error('Error getting submissions:', error);
    return c.json({ error: 'Failed to get submissions' }, 500);
  }
});

// Get leaderboard for a problem or contest
app.get("/make-server-b9684b04/leaderboard/:type/:id", async (c) => {
  try {
    const type = c.req.param('type'); // 'problem' or 'contest'
    const id = c.req.param('id');
    
    const leaderboardKey = `leaderboard:${type}:${id}`;
    let data = await kv.get(leaderboardKey);
    
    // If no leaderboard exists, generate mock data
    if (!data) {
      const mockLeaderboard = generateMockLeaderboard(type, id);
      await kv.set(leaderboardKey, JSON.stringify(mockLeaderboard));
      data = JSON.stringify(mockLeaderboard);
    }
    
    const leaderboard = data ? JSON.parse(data) : [];
    
    return c.json({ leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return c.json({ error: 'Failed to get leaderboard' }, 500);
  }
});

// Get user statistics
app.get("/make-server-b9684b04/user-stats", async (c) => {
  try {
    const userId = c.req.query('userId') || 'user-1';
    const statsKey = `user:${userId}:stats`;
    let data = await kv.get(statsKey);
    
    // If no stats exist, initialize with defaults
    if (!data) {
      const defaultStats = {
        problemsSolved: 47,
        totalSubmissions: 156,
        acceptanceRate: 65.8,
        easyCount: 23,
        mediumCount: 18,
        hardCount: 6,
        streak: 12,
        rank: 1247,
        rating: 1856,
        contestsParticipated: 8,
        badges: ['First Submission', '7 Day Streak', '10 Problems Solved'],
      };
      await kv.set(statsKey, JSON.stringify(defaultStats));
      data = JSON.stringify(defaultStats);
    }
    
    const stats = JSON.parse(data);
    
    return c.json({ stats });
  } catch (error) {
    console.error('Error getting user stats:', error);
    return c.json({ error: 'Failed to get stats' }, 500);
  }
});

// Get active contests
app.get("/make-server-b9684b04/contests", async (c) => {
  try {
    const contestsKey = `contests:active`;
    let data = await kv.get(contestsKey);
    
    // If no contests exist, generate mock data
    if (!data) {
      const mockContests = generateMockContests();
      await kv.set(contestsKey, JSON.stringify(mockContests));
      data = JSON.stringify(mockContests);
    }
    
    const contests = JSON.parse(data);
    
    return c.json({ contests });
  } catch (error) {
    console.error('Error getting contests:', error);
    return c.json({ error: 'Failed to get contests' }, 500);
  }
});

// Join contest
app.post("/make-server-b9684b04/contests/:contestId/join", async (c) => {
  try {
    const contestId = c.req.param('contestId');
    const { userId = 'user-1' } = await c.req.json();
    
    const participantsKey = `contest:${contestId}:participants`;
    const data = await kv.get(participantsKey);
    const participants = data ? JSON.parse(data) : [];
    
    if (!participants.includes(userId)) {
      participants.push(userId);
      await kv.set(participantsKey, JSON.stringify(participants));
    }
    
    return c.json({ success: true, message: 'Successfully joined contest' });
  } catch (error) {
    console.error('Error joining contest:', error);
    return c.json({ error: 'Failed to join contest' }, 500);
  }
});

// Get discussion/comments for a problem
app.get("/make-server-b9684b04/discussions/:problemId", async (c) => {
  try {
    const problemId = c.req.param('problemId');
    const discussionsKey = `discussions:${problemId}`;
    let data = await kv.get(discussionsKey);
    
    // If no discussions exist, generate mock data
    if (!data) {
      const mockDiscussions = generateMockDiscussions();
      await kv.set(discussionsKey, JSON.stringify(mockDiscussions));
      data = JSON.stringify(mockDiscussions);
    }
    
    const discussions = JSON.parse(data);
    
    return c.json({ discussions });
  } catch (error) {
    console.error('Error getting discussions:', error);
    return c.json({ error: 'Failed to get discussions' }, 500);
  }
});

// Post a comment/discussion
app.post("/make-server-b9684b04/discussions/:problemId", async (c) => {
  try {
    const problemId = c.req.param('problemId');
    const { content, userId = 'user-1', userName = 'Anonymous' } = await c.req.json();
    
    const discussionsKey = `discussions:${problemId}`;
    const data = await kv.get(discussionsKey);
    const discussions = data ? JSON.parse(data) : [];
    
    const newDiscussion = {
      id: `disc-${Date.now()}`,
      userId,
      userName,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    
    discussions.unshift(newDiscussion);
    await kv.set(discussionsKey, JSON.stringify(discussions));
    
    return c.json({ success: true, discussion: newDiscussion });
  } catch (error) {
    console.error('Error posting discussion:', error);
    return c.json({ error: 'Failed to post discussion' }, 500);
  }
});

// Award coins
app.post("/make-server-b9684b04/award-coins", async (c) => {
  try {
    const { userId = 'user-1', amount, reason } = await c.req.json();
    
    const coinsKey = `user:${userId}:coins`;
    const data = await kv.get(coinsKey);
    const currentCoins = data ? parseInt(data) : 250;
    
    const newTotal = currentCoins + amount;
    await kv.set(coinsKey, newTotal.toString());
    
    // Log transaction
    const transactionsKey = `user:${userId}:coin-transactions`;
    const transData = await kv.get(transactionsKey);
    const transactions = transData ? JSON.parse(transData) : [];
    
    transactions.unshift({
      id: `tx-${Date.now()}`,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      balance: newTotal,
    });
    
    if (transactions.length > 100) {
      transactions.length = 100;
    }
    
    await kv.set(transactionsKey, JSON.stringify(transactions));
    
    return c.json({ success: true, newTotal, transaction: transactions[0] });
  } catch (error) {
    console.error('Error awarding coins:', error);
    return c.json({ error: 'Failed to award coins' }, 500);
  }
});

// Get user's coins
app.get("/make-server-b9684b04/coins/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const coinsKey = `user:${userId}:coins`;
    const data = await kv.get(coinsKey);
    const coins = data ? parseInt(data) : 250;
    
    return c.json({ coins });
  } catch (error) {
    console.error('Error getting coins:', error);
    return c.json({ error: 'Failed to get coins' }, 500);
  }
});

// Get learning resources
app.get("/make-server-b9684b04/resources/:domain", async (c) => {
  try {
    const domain = c.req.param('domain');
    const resourcesKey = `resources:${domain}`;
    let data = await kv.get(resourcesKey);
    
    // If no resources exist, generate mock data
    if (!data) {
      const mockResources = generateMockResources(domain);
      await kv.set(resourcesKey, JSON.stringify(mockResources));
      data = JSON.stringify(mockResources);
    }
    
    const resources = JSON.parse(data);
    
    return c.json({ resources });
  } catch (error) {
    console.error('Error getting resources:', error);
    return c.json({ error: 'Failed to get resources' }, 500);
  }
});

// Save/bookmark a resource
app.post("/make-server-b9684b04/bookmarks", async (c) => {
  try {
    const { userId = 'user-1', resourceId, resourceType } = await c.req.json();
    
    const bookmarksKey = `user:${userId}:bookmarks`;
    const data = await kv.get(bookmarksKey);
    const bookmarks = data ? JSON.parse(data) : [];
    
    const bookmark = {
      id: `bm-${Date.now()}`,
      resourceId,
      resourceType,
      timestamp: new Date().toISOString(),
    };
    
    bookmarks.unshift(bookmark);
    await kv.set(bookmarksKey, JSON.stringify(bookmarks));
    
    return c.json({ success: true, bookmark });
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return c.json({ error: 'Failed to save bookmark' }, 500);
  }
});

// Get user's bookmarks
app.get("/make-server-b9684b04/bookmarks/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const bookmarksKey = `user:${userId}:bookmarks`;
    const data = await kv.get(bookmarksKey);
    const bookmarks = data ? JSON.parse(data) : [];
    
    return c.json({ bookmarks });
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return c.json({ error: 'Failed to get bookmarks' }, 500);
  }
});

// Helper function to execute code
async function executeCode(code: string, language: string, testCases: any[]) {
  // In production, integrate with Judge0 API, Piston API, or build custom sandboxed execution
  // For now, simulate execution with mock results
  
  const results = [];
  
  for (const testCase of testCases) {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    
    // Simulate execution
    const isPassing = simulateExecution(code, testCase);
    
    results.push({
      passed: isPassing,
      output: isPassing ? testCase.expectedOutput : 'incorrect output',
      runtime: Math.floor(Math.random() * 100) + 10,
      memory: Math.floor(Math.random() * 10) + 5,
    });
  }
  
  return results;
}

// Simulate code execution (replace with actual execution in production)
function simulateExecution(code: string, testCase: any): boolean {
  // Very simple simulation - in production, use actual code execution
  // Check if code has some basic structure
  const hasFunction = code.includes('function') || code.includes('def ') || code.includes('int main') || code.includes('=>');
  const hasReturn = code.includes('return') || code.includes('print') || code.includes('cout') || code.includes('console.log');
  
  // Randomly pass/fail based on code quality indicators
  if (hasFunction && hasReturn) {
    // 80% chance to pass if code looks reasonable
    return Math.random() < 0.8;
  }
  
  // 30% chance to pass if code is basic
  return Math.random() < 0.3;
}

// Update user stats
async function updateUserStats(userId: string, problemId: string) {
  const statsKey = `user:${userId}:stats`;
  const data = await kv.get(statsKey);
  const stats = data ? JSON.parse(data) : {
    problemsSolved: 0,
    totalSubmissions: 0,
    acceptanceRate: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    streak: 0,
    rank: 0,
    rating: 1200,
    contestsParticipated: 0,
    badges: [],
  };
  
  // Check if problem was already solved
  const solvedKey = `user:${userId}:solved`;
  const solvedData = await kv.get(solvedKey);
  const solvedProblems = solvedData ? JSON.parse(solvedData) : [];
  
  if (!solvedProblems.includes(problemId)) {
    stats.problemsSolved++;
    solvedProblems.push(problemId);
    await kv.set(solvedKey, JSON.stringify(solvedProblems));
    
    // Randomly categorize as easy/medium/hard
    const difficulty = Math.random();
    if (difficulty < 0.5) stats.easyCount++;
    else if (difficulty < 0.85) stats.mediumCount++;
    else stats.hardCount++;
  }
  
  stats.totalSubmissions++;
  stats.acceptanceRate = (stats.problemsSolved / stats.totalSubmissions) * 100;
  
  await kv.set(statsKey, JSON.stringify(stats));
}

// Update leaderboard
async function updateLeaderboard(userId: string, problemId: string, runtime: number, status: string) {
  if (status !== 'accepted') return;
  
  const leaderboardKey = `leaderboard:problem:${problemId}`;
  const data = await kv.get(leaderboardKey);
  const leaderboard = data ? JSON.parse(data) : [];
  
  // Add or update user entry
  const existingIndex = leaderboard.findIndex((entry: any) => entry.userId === userId);
  const entry = {
    userId,
    userName: `User${userId.slice(-4)}`,
    runtime: `${runtime.toFixed(0)}ms`,
    timestamp: new Date().toISOString(),
    language: 'JavaScript',
  };
  
  if (existingIndex !== -1) {
    // Only update if new runtime is better
    const existingRuntime = parseFloat(leaderboard[existingIndex].runtime);
    if (runtime < existingRuntime) {
      leaderboard[existingIndex] = entry;
    }
  } else {
    leaderboard.push(entry);
  }
  
  // Sort by runtime
  leaderboard.sort((a: any, b: any) => parseFloat(a.runtime) - parseFloat(b.runtime));
  
  // Keep top 100
  if (leaderboard.length > 100) {
    leaderboard.length = 100;
  }
  
  await kv.set(leaderboardKey, JSON.stringify(leaderboard));
}

// Generate mock leaderboard
function generateMockLeaderboard(type: string, id: string) {
  const leaderboard = [];
  for (let i = 0; i < 20; i++) {
    leaderboard.push({
      rank: i + 1,
      userId: `user-${i + 1}`,
      userName: `CodeMaster${i + 1}`,
      score: type === 'contest' ? 1200 - (i * 50) : undefined,
      runtime: type === 'problem' ? `${50 + (i * 10)}ms` : undefined,
      problemsSolved: type === 'contest' ? 4 - Math.floor(i / 5) : undefined,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      language: ['JavaScript', 'Python', 'C++', 'Java'][i % 4],
    });
  }
  return leaderboard;
}

// Generate mock contests
function generateMockContests() {
  const now = Date.now();
  return [
    {
      id: 'contest-1',
      name: 'Weekly Contest 375',
      description: 'Test your skills in this weekly coding challenge',
      startTime: new Date(now + 86400000).toISOString(),
      duration: '90 minutes',
      participants: 1247,
      problems: 4,
      status: 'upcoming',
      difficulty: 'Medium',
      prize: '500 coins',
    },
    {
      id: 'contest-2',
      name: 'Biweekly Contest 120',
      description: 'Compete with coders from around the world',
      startTime: new Date(now + 172800000).toISOString(),
      duration: '120 minutes',
      participants: 856,
      problems: 4,
      status: 'upcoming',
      difficulty: 'Hard',
      prize: '1000 coins',
    },
    {
      id: 'contest-3',
      name: 'Algorithm Sprint',
      description: 'Fast-paced algorithmic problem solving',
      startTime: new Date(now - 7200000).toISOString(),
      duration: '60 minutes',
      participants: 2341,
      problems: 5,
      status: 'running',
      difficulty: 'Easy',
      prize: '300 coins',
    },
  ];
}

// Generate mock discussions
function generateMockDiscussions() {
  return [
    {
      id: 'disc-1',
      userId: 'user-123',
      userName: 'AlgoExpert',
      content: 'Great problem! I solved it using dynamic programming. The key insight is to...',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 24,
      replies: [
        {
          id: 'reply-1',
          userId: 'user-456',
          userName: 'CodeNinja',
          content: 'Thanks for the explanation! This really helped me understand the approach.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          likes: 5,
        },
      ],
    },
    {
      id: 'disc-2',
      userId: 'user-789',
      userName: 'DevGuru',
      content: 'Can anyone help me understand why my solution is getting TLE?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: 8,
      replies: [],
    },
  ];
}

// Generate mock resources
function generateMockResources(domain: string) {
  return [
    {
      id: 'res-1',
      title: `${domain} Fundamentals`,
      type: 'video',
      duration: '45 minutes',
      difficulty: 'Easy',
      topic: 'Basics',
      completed: false,
      rating: 4.8,
    },
    {
      id: 'res-2',
      title: `Advanced ${domain} Concepts`,
      type: 'article',
      duration: '20 min read',
      difficulty: 'Hard',
      topic: 'Advanced',
      completed: false,
      rating: 4.9,
    },
    {
      id: 'res-3',
      title: `${domain} Interview Prep`,
      type: 'course',
      duration: '6 hours',
      difficulty: 'Medium',
      topic: 'Interview',
      completed: false,
      rating: 4.7,
    },
  ];
}

Deno.serve(app.fetch);
