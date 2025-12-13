import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { UserData } from '../../../App';

interface ProfessionalPerformanceProps {
  userData: UserData;
}

export function ProfessionalPerformance({ userData }: ProfessionalPerformanceProps) {
  const skillProgress = [
    { skill: 'System Design', current: 72, target: 85, trend: 'up', change: '+8%' },
    { skill: 'Cloud Architecture', current: 68, target: 80, trend: 'up', change: '+12%' },
    { skill: 'Leadership', current: 55, target: 85, trend: 'up', change: '+5%' },
    { skill: 'Performance Optimization', current: 78, target: 90, trend: 'stable', change: '+2%' },
    { skill: 'Microservices', current: 65, target: 80, trend: 'up', change: '+10%' }
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, tasks: 3 },
    { day: 'Tue', hours: 1.5, tasks: 2 },
    { day: 'Wed', hours: 3.0, tasks: 4 },
    { day: 'Thu', hours: 2.0, tasks: 3 },
    { day: 'Fri', hours: 2.5, tasks: 3 },
    { day: 'Sat', hours: 1.0, tasks: 1 },
    { day: 'Sun', hours: 1.5, tasks: 2 }
  ];

  const achievements = [
    { title: '7-Day Streak', icon: '🔥', unlocked: true },
    { title: 'System Design Master', icon: '🏆', unlocked: true },
    { title: 'Top 10% Performer', icon: '⭐', unlocked: false },
    { title: 'Mentor Badge', icon: '👥', unlocked: false }
  ];

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
            <h1 className="text-3xl font-bold gradient-text">Performance Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your growth towards {userData.targetRole}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Role Readiness</p>
                  <h3 className="text-3xl font-bold text-purple-400 mt-1">68%</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +6% this month
                  </p>
                </div>
                <Target className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">42</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    18 this week
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Practice Hours</p>
                  <h3 className="text-3xl font-bold text-orange-400 mt-1">14.5</h3>
                  <p className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    This week
                  </p>
                </div>
                <Clock className="w-12 h-12 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consistency</p>
                  <h3 className="text-3xl font-bold text-blue-400 mt-1">91%</h3>
                  <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />
                    Excellent
                  </p>
                </div>
                <Award className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Progress */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Skill Development Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillProgress.map((skill, index) => (
                <motion.div
                  key={skill.skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-foreground">{skill.skill}</h4>
                      {skill.trend === 'up' && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {skill.change}
                        </Badge>
                      )}
                      {skill.trend === 'down' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {skill.change}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {skill.current}% / {skill.target}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${(skill.current / skill.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyActivity.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg transition-all hover:from-purple-500 hover:to-blue-500"
                        style={{ height: `${(day.hours / 3) * 100}%`, minHeight: '20px' }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                      <span className="text-xs text-purple-400 font-medium">{day.hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                      : 'bg-muted/50 border-border opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <span className="text-sm font-medium">{achievement.title}</span>
                      {achievement.unlocked && (
                        <p className="text-xs text-green-400">✓ Unlocked</p>
                      )}
                      {!achievement.unlocked && (
                        <p className="text-xs text-muted-foreground">Locked</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Promotion Readiness */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Promotion Readiness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-purple-400 mb-2">68%</div>
                <p className="text-sm text-muted-foreground">Ready for {userData.targetRole}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Technical Skills</span>
                  <span className="text-purple-400">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Leadership</span>
                  <span className="text-purple-400">55%</span>
                </div>
                <Progress value={55} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Communication</span>
                  <span className="text-purple-400">80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Key Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                You're in the top 25% of professionals preparing for {userData.targetRole}. Focus on leadership skills to accelerate your progress.
              </p>
              <Button size="sm" className="w-full">
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}