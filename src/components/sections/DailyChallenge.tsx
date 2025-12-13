import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Trophy,
  Flame,
  Star,
  Gift,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  ChevronRight,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { UserData } from '../../App';
import { CodeEditor } from '../CodeEditor';
import { CodingProblem } from '../../utils/codingProblems';

interface DailyChallengeProps {
  userData: UserData;
}

export function DailyChallenge({ userData }: DailyChallengeProps) {
  const [currentStreak, setCurrentStreak] = useState(12);
  const [longestStreak, setLongestStreak] = useState(28);
  const [dailyProgress, setDailyProgress] = useState(1);
  const [showProblem, setShowProblem] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Today's challenge problem
  const [todayProblem] = useState<CodingProblem>({
    id: 'daily-001',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'Strings',
    topics: ['Stack', 'String'],
    description:
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The input string is valid.',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'The input string is valid.',
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'The brackets are not properly closed.',
      },
    ],
    testCases: [
      {
        input: '()',
        expectedOutput: 'true',
        isHidden: false,
      },
      {
        input: '()[]{}',
        expectedOutput: 'true',
        isHidden: false,
      },
      {
        input: '(]',
        expectedOutput: 'false',
        isHidden: false,
      },
    ],
    hints: [
      'Use a stack data structure.',
      'For every opening bracket, push it to the stack.',
      'For every closing bracket, check if it matches the top of the stack.',
    ],
    companies: ['Google', 'Amazon', 'Microsoft'],
  });

  // Streak calendar data (last 30 days)
  const [streakCalendar] = useState(() => {
    const calendar = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const completed = i > 0 && Math.random() > 0.3; // Random completion for demo
      calendar.push({
        date: date.toISOString().split('T')[0],
        completed: i === 0 ? isCompleted : completed,
        day: date.getDate(),
      });
    }
    return calendar;
  });

  // Rewards and milestones
  const [rewards] = useState([
    {
      id: 1,
      title: '7 Day Streak',
      description: 'Complete 7 consecutive daily challenges',
      reward: '50 Coins',
      icon: Flame,
      target: 7,
      current: currentStreak >= 7 ? 7 : currentStreak,
      completed: currentStreak >= 7,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 2,
      title: '30 Day Streak',
      description: 'Complete 30 consecutive daily challenges',
      reward: '200 Coins + Special Badge',
      icon: Trophy,
      target: 30,
      current: currentStreak >= 30 ? 30 : currentStreak,
      completed: currentStreak >= 30,
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      id: 3,
      title: '100 Day Streak',
      description: 'Complete 100 consecutive daily challenges',
      reward: '1000 Coins + Legendary Badge',
      icon: Star,
      target: 100,
      current: currentStreak >= 100 ? 100 : currentStreak,
      completed: currentStreak >= 100,
      gradient: 'from-purple-500 to-pink-500',
    },
  ]);

  // Calculate time remaining until next challenge
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      setTimeRemaining(diff);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartChallenge = () => {
    setShowProblem(true);
    toast.success('Daily Challenge Started! Good luck! 🚀');
  };

  const handleCompleteChallenge = () => {
    setIsCompleted(true);
    setCurrentStreak((prev) => prev + 1);
    setDailyProgress(100);
    toast.success('🎉 Daily Challenge Completed! +10 Coins');
  };

  if (showProblem) {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Daily Challenge
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete today's challenge to maintain your streak!
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowProblem(false)}>
            Back to Overview
          </Button>
        </motion.div>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">{currentStreak} day streak</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">
                    Resets in {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <Star className="w-3 h-3 mr-1" />
                Daily Challenge
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{todayProblem.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        todayProblem.difficulty === 'easy'
                          ? 'bg-green-500/10 text-green-500'
                          : todayProblem.difficulty === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                      }
                    >
                      {todayProblem.difficulty}
                    </Badge>
                    <Badge variant="outline">{todayProblem.category}</Badge>
                    {todayProblem.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{todayProblem.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Examples</h3>
                <div className="space-y-3">
                  {todayProblem.examples?.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1"
                    >
                      <div className="font-mono text-sm">
                        <strong>Input:</strong> {example.input}
                      </div>
                      <div className="font-mono text-sm">
                        <strong>Output:</strong> {example.output}
                      </div>
                      {example.explanation && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Constraints</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {todayProblem.constraints?.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <CodeEditor
            initialCode={''}
            onRun={async () => {
              toast.info('Running test cases...');
            }}
            onSubmit={async () => {
              handleCompleteChallenge();
            }}
            testCases={todayProblem.testCases}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Daily Challenge
        </h1>
        <p className="text-muted-foreground">
          Build consistency with daily coding challenges and earn rewards
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Current Streak',
            value: `${currentStreak} days`,
            icon: Flame,
            gradient: 'from-orange-500 to-red-500',
            description: 'Keep it going!',
          },
          {
            label: 'Longest Streak',
            value: `${longestStreak} days`,
            icon: Trophy,
            gradient: 'from-yellow-500 to-amber-500',
            description: 'Personal best',
          },
          {
            label: 'Total Completed',
            value: '145',
            icon: CheckCircle2,
            gradient: 'from-green-500 to-emerald-500',
            description: 'All time',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-10`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Today's Challenge */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Today's Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCompleted ? (
            <>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{todayProblem.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Easy
                    </Badge>
                    <Badge variant="outline">{todayProblem.category}</Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                    {todayProblem.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Resets in</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">+10 Coins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">+5 XP</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={handleStartChallenge}
                >
                  Start Challenge
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Challenge Completed!</h3>
              <p className="text-muted-foreground mb-4">
                Great job! Come back tomorrow for a new challenge.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-lg py-2 px-4">
                  <Trophy className="w-4 h-4 mr-2" />
                  +10 Coins Earned
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-lg py-2 px-4">
                  <Zap className="w-4 h-4 mr-2" />
                  +5 XP Earned
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            30-Day Streak Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {streakCalendar.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium border transition-all cursor-pointer hover:scale-110 ${
                  day.completed
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-green-500'
                    : 'bg-muted/50 text-muted-foreground border-border/50'
                }`}
                title={day.date}
              >
                {day.completed ? <CheckCircle2 className="w-4 h-4" /> : day.day}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones & Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-500" />
            Streak Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                reward.completed
                  ? 'border-green-500/20 bg-green-500/5'
                  : 'border-border/50 bg-card/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${reward.gradient} bg-opacity-10`}
                  >
                    <reward.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {reward.title}
                      {reward.completed && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${
                    reward.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {reward.reward}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {reward.current} / {reward.target} days
                  </span>
                </div>
                <Progress value={(reward.current / reward.target) * 100} />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
