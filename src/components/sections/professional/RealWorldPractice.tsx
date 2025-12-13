import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Briefcase, 
  Code, 
  Clock, 
  TrendingUp,
  CheckCircle,
  Play,
  Star,
  Trophy,
  Filter
} from 'lucide-react';
import { UserData } from '../../../App';
import { toast } from 'sonner';

interface RealWorldPracticeProps {
  userData: UserData;
}

export function RealWorldPractice({ userData }: RealWorldPracticeProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [startedTasks, setStartedTasks] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const practiceTasks = [
    {
      id: 1,
      title: 'Microservices Migration Plan',
      description: 'Design migration strategy for monolith to microservices',
      difficulty: 'Advanced',
      type: 'System Design',
      duration: '120 min',
      points: 500,
      completionRate: 34,
      skills: ['System Design', 'Microservices', 'Architecture']
    },
    {
      id: 2,
      title: 'Performance Bottleneck Analysis',
      description: 'Debug and optimize slow API endpoints in production app',
      difficulty: 'Intermediate',
      type: 'Debugging',
      duration: '90 min',
      points: 350,
      completionRate: 58,
      skills: ['Performance', 'Profiling', 'Optimization']
    },
    {
      id: 3,
      title: 'Team Code Review Challenge',
      description: 'Review pull request and provide constructive feedback',
      difficulty: 'Intermediate',
      type: 'Leadership',
      duration: '60 min',
      points: 300,
      completionRate: 71,
      skills: ['Code Review', 'Communication', 'Mentoring']
    },
    {
      id: 4,
      title: 'Feature Implementation Sprint',
      description: 'Build real-time notification system from requirements',
      difficulty: 'Advanced',
      type: 'Implementation',
      duration: '180 min',
      points: 600,
      completionRate: 28,
      skills: ['WebSockets', 'Redis', 'System Design']
    }
  ];

  const completedTasksList = [
    { title: 'API Rate Limiting Implementation', score: 95, date: '2 days ago' },
    { title: 'Database Query Optimization', score: 88, date: '5 days ago' },
    { title: 'CI/CD Pipeline Setup', score: 92, date: '1 week ago' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Intermediate': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredTasks = filterDifficulty === 'all'
    ? practiceTasks
    : practiceTasks.filter(task => task.difficulty === filterDifficulty);

  const handleStartTask = (taskId: number, taskTitle: string) => {
    if (completedTasks.includes(taskId)) {
      toast.info('Task already completed!');
      return;
    }
    if (startedTasks.includes(taskId)) {
      toast.info('Resuming task...');
    } else {
      setStartedTasks([...startedTasks, taskId]);
      toast.success(`Started: ${taskTitle}`, {
        description: 'Good luck! Take your time to complete it well.'
      });
    }
  };

  const handleViewLeaderboard = () => {
    toast.info('Opening leaderboard...', {
      description: 'See how you rank against other professionals'
    });
  };

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
            <h1 className="text-3xl font-bold gradient-text">Real-World Practice</h1>
            <p className="text-muted-foreground mt-1">
              Industry-style tasks for {userData.professionalDomain?.split('-').join(' ')}
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={handleViewLeaderboard}
          >
            <Star className="w-4 h-4 mr-2" />
            View Leaderboard
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mt-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Difficulty:</span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
            <Button
              key={difficulty}
              size="sm"
              variant={filterDifficulty === difficulty ? 'default' : 'outline'}
              onClick={() => setFilterDifficulty(difficulty)}
            >
              {difficulty === 'all' ? 'All' : difficulty}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold text-blue-400">12</h3>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <h3 className="text-2xl font-bold text-purple-400">87%</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <h3 className="text-2xl font-bold text-orange-400">4,250</h3>
              </div>
              <Star className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <h3 className="text-2xl font-bold text-green-400">#124</h3>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Practice Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Available Tasks ({filteredTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks match the selected filter
                </div>
              )}
              {filteredTasks.map((task, index) => {
                const isStarted = startedTasks.includes(task.id);
                const isCompleted = completedTasks.includes(task.id);
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{task.title}</h4>
                          <Badge className={getDifficultyColor(task.difficulty)}>
                            {task.difficulty}
                          </Badge>
                          {isStarted && !isCompleted && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              In Progress
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Code className="w-4 h-4" />
                            {task.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {task.points} points
                          </span>
                          <span className="text-purple-400">
                            {task.completionRate}% completion rate
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => handleStartTask(task.id, task.title)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : isStarted ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Completions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Recent Completions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasksList.map((task, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium">{task.title}</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {task.score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Recommended Next</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your skill gaps, we recommend "Microservices Migration Plan" to strengthen system design.
              </p>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => handleStartTask(1, 'Microservices Migration Plan')}
              >
                Start Task
              </Button>
            </CardContent>
          </Card>

          {/* Daily Goal */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Daily Practice Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Today's Progress</span>
                    <span className="text-orange-400 font-medium">{startedTasks.length} / 2 tasks</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${(startedTasks.length / 2) * 100}%` }} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {startedTasks.length < 2 ? `Complete ${2 - startedTasks.length} more task(s) to maintain your streak!` : 'Great job! Daily goal achieved! 🎉'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V3H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 9H3V10C3 11.0609 3.42143 12.0783 4.17157 12.8284C4.92172 13.5786 5.93913 14 7 14H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 9H21V10C21 11.0609 20.5786 12.0783 19.8284 12.8284C19.0783 13.5786 18.0609 14 17 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}