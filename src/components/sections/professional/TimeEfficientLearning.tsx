import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Clock,
  Calendar,
  CheckCircle,
  Play,
  Bell,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { UserData } from '../../../App';

interface TimeEfficientLearningProps {
  userData: UserData;
}

export function TimeEfficientLearning({ userData }: TimeEfficientLearningProps) {
  const dailyPlan = [
    {
      time: '15 min',
      title: 'System Design Quick Review',
      type: 'Theory',
      priority: 'high',
      completed: true
    },
    {
      time: '20 min',
      title: 'Leadership Case Study',
      type: 'Reading',
      priority: 'high',
      completed: false
    },
    {
      time: '25 min',
      title: 'Code Review Practice',
      type: 'Practice',
      priority: 'medium',
      completed: false
    }
  ];

  const weeklyGoal = {
    target: 150, // minutes
    current: 95,
    daysCompleted: 4,
    daysTotal: 7
  };

  const learningModules = [
    {
      title: 'Microservices Patterns',
      duration: '3 x 15 min',
      progress: 67,
      nextSession: 'Today, 7:00 PM',
      topics: ['Service Discovery', 'API Gateway', 'Circuit Breaker']
    },
    {
      title: 'Leadership Essentials',
      duration: '5 x 20 min',
      progress: 40,
      nextSession: 'Tomorrow, 8:00 AM',
      topics: ['Delegation', 'Feedback', 'Team Dynamics']
    },
    {
      title: 'System Design Fundamentals',
      duration: '4 x 25 min',
      progress: 75,
      nextSession: 'Today, 9:00 PM',
      topics: ['Scalability', 'Caching', 'Load Balancing']
    }
  ];

  const learningStreak = 12;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Time-Efficient Learning</h1>
            <p className="text-muted-foreground mt-1">
              15-30 minute daily plans for busy professionals
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminders
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <h3 className="text-3xl font-bold text-orange-400 mt-1">{learningStreak}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Days</p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <h3 className="text-3xl font-bold text-blue-400 mt-1">{weeklyGoal.current}</h3>
                  <p className="text-xs text-muted-foreground mt-1">/ {weeklyGoal.target} min</p>
                </div>
                <Clock className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">1/3</h3>
                  <p className="text-xs text-muted-foreground mt-1">Sessions</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <h3 className="text-3xl font-bold text-purple-400 mt-1">78%</h3>
                  <p className="text-xs text-muted-foreground mt-1">Weekly goal</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Today's Learning Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyPlan.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    task.completed
                      ? 'bg-green-500/10 border-green-500/30 opacity-60'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{task.title}</h4>
                          <Badge variant="outline" className="text-xs">{task.type}</Badge>
                          {task.priority === 'high' && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{task.time}</span>
                        </div>
                      </div>
                    </div>
                    {!task.completed && (
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Active Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Active Learning Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningModules.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{module.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {module.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bell className="w-4 h-4" />
                          {module.nextSession}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="text-purple-400 font-medium">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Weekly Progress */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">{weeklyGoal.current} min</div>
                  <p className="text-sm text-muted-foreground">of {weeklyGoal.target} min goal</p>
                </div>
                <Progress value={(weeklyGoal.current / weeklyGoal.target) * 100} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span>Days Active</span>
                  <span className="text-purple-400 font-medium">{weeklyGoal.daysCompleted}/{weeklyGoal.daysTotal}</span>
                </div>
                <Button size="sm" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Complete Today's Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                Smart Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-1">Best Learning Time</p>
                <p className="text-xs text-muted-foreground">8:00 AM - 9:00 AM</p>
                <p className="text-xs text-muted-foreground">Based on your activity</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-1">Next Reminder</p>
                <p className="text-xs text-muted-foreground">Today at 7:00 PM</p>
                <p className="text-xs text-muted-foreground">Leadership Case Study</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Efficiency Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Avg. session</span>
                <span className="text-orange-400 font-medium">22 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completion rate</span>
                <span className="text-orange-400 font-medium">89%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total this month</span>
                <span className="text-orange-400 font-medium">420 min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}