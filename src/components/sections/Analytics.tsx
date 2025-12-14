import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Trophy,
  Zap,
  Calendar,
  Clock,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Brain,
  Code,
  CheckCircle2,
  XCircle,
  Flame,
  Star,
  Download,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { UserData } from '../../App';
import { getDomainConfig } from '../../utils/domainConfig';
import { toast } from 'sonner';

interface AnalyticsProps {
  userData: UserData;
}

export function Analytics({ userData }: AnalyticsProps) {
  const domainConfig = getDomainConfig(userData.domain || '');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock analytics data - in production, fetch from backend
  const [analytics, setAnalytics] = useState({
    overview: {
      totalSolved: 145,
      solvedChange: +12,
      accuracy: 87.5,
      accuracyChange: +3.2,
      streak: 12,
      streakChange: +2,
      rank: 1247,
      rankChange: -23,
    },
    problemStats: {
      easy: { solved: 65, total: 100 },
      medium: { solved: 58, total: 150 },
      hard: { solved: 22, total: 80 },
    },
    categoryBreakdown: [
      { name: 'Arrays', solved: 35, total: 50, accuracy: 85 },
      { name: 'Dynamic Programming', solved: 22, total: 40, accuracy: 78 },
      { name: 'Graphs', solved: 18, total: 35, accuracy: 82 },
      { name: 'Trees', solved: 25, total: 40, accuracy: 90 },
      { name: 'Strings', solved: 20, total: 30, accuracy: 88 },
      { name: 'Sorting', solved: 15, total: 25, accuracy: 92 },
    ],
    recentActivity: [
      { date: '2025-12-02', problems: 5, time: '2h 30m', accuracy: 80 },
      { date: '2025-12-01', problems: 7, time: '3h 15m', accuracy: 85.7 },
      { date: '2025-11-30', problems: 4, time: '1h 45m', accuracy: 75 },
      { date: '2025-11-29', problems: 6, time: '2h 50m', accuracy: 83.3 },
      { date: '2025-11-28', problems: 3, time: '1h 20m', accuracy: 66.7 },
      { date: '2025-11-27', problems: 8, time: '4h 10m', accuracy: 87.5 },
      { date: '2025-11-26', problems: 5, time: '2h 15m', accuracy: 80 },
    ],
    timeDistribution: {
      '00-06': 2,
      '06-12': 15,
      '12-18': 45,
      '18-24': 38,
    },
    languageStats: [
      { language: 'JavaScript', problems: 65, percentage: 44.8 },
      { language: 'Python', problems: 45, percentage: 31.0 },
      { language: 'Java', problems: 20, percentage: 13.8 },
      { language: 'C++', problems: 15, percentage: 10.4 },
    ],
    strengths: ['Arrays', 'Trees', 'Sorting', 'Two Pointers'],
    weaknesses: ['Dynamic Programming', 'Graphs', 'Backtracking'],
    suggestedTopics: ['Graph Algorithms', 'Advanced DP', 'Trie', 'Segment Trees'],
  });

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-500 to-emerald-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'hard':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const handleExportCSV = () => {
    // Generate CSV data
    const csvData = [
      ['Analytics Report', `${userData.name}`],
      ['Time Range', timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '90d' ? 'Last 90 days' : 'All time'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Overview Statistics'],
      ['Metric', 'Value', 'Change'],
      ['Problems Solved', analytics.overview.totalSolved, analytics.overview.solvedChange],
      ['Accuracy', `${analytics.overview.accuracy}%`, analytics.overview.accuracyChange],
      ['Current Streak', `${analytics.overview.streak} days`, analytics.overview.streakChange],
      ['Global Rank', analytics.overview.rank, analytics.overview.rankChange],
      [],
      ['Problem Difficulty Breakdown'],
      ['Difficulty', 'Solved', 'Total', 'Percentage'],
      ['Easy', analytics.problemStats.easy.solved, analytics.problemStats.easy.total, `${((analytics.problemStats.easy.solved / analytics.problemStats.easy.total) * 100).toFixed(1)}%`],
      ['Medium', analytics.problemStats.medium.solved, analytics.problemStats.medium.total, `${((analytics.problemStats.medium.solved / analytics.problemStats.medium.total) * 100).toFixed(1)}%`],
      ['Hard', analytics.problemStats.hard.solved, analytics.problemStats.hard.total, `${((analytics.problemStats.hard.solved / analytics.problemStats.hard.total) * 100).toFixed(1)}%`],
      [],
      ['Category Performance'],
      ['Category', 'Solved', 'Total', 'Accuracy'],
      ...analytics.categoryBreakdown.map(cat => [cat.name, cat.solved, cat.total, `${cat.accuracy}%`]),
      [],
      ['Language Statistics'],
      ['Language', 'Problems', 'Percentage'],
      ...analytics.languageStats.map(lang => [lang.language, lang.problems, `${lang.percentage}%`]),
      [],
      ['Strengths'],
      ...analytics.strengths.map(s => [s]),
      [],
      ['Areas to Improve'],
      ...analytics.weaknesses.map(w => [w]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Analytics report downloaded successfully!');
  };

  const handleExportJSON = () => {
    // Generate JSON export
    const exportData = {
      user: userData.name,
      timeRange,
      generated: new Date().toISOString(),
      analytics: analytics,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_data_${Date.now()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Analytics data exported successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <BarChart3 className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and identify areas for improvement
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Problems Solved',
            value: analytics.overview.totalSolved,
            change: analytics.overview.solvedChange,
            icon: CheckCircle2,
            gradient: 'from-purple-500 to-pink-500',
          },
          {
            label: 'Accuracy',
            value: `${analytics.overview.accuracy}%`,
            change: analytics.overview.accuracyChange,
            icon: Target,
            gradient: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Current Streak',
            value: `${analytics.overview.streak} days`,
            change: analytics.overview.streakChange,
            icon: Flame,
            gradient: 'from-orange-500 to-red-500',
          },
          {
            label: 'Global Rank',
            value: `#${analytics.overview.rank}`,
            change: analytics.overview.rankChange,
            icon: Trophy,
            gradient: 'from-yellow-500 to-amber-500',
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
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      {getChangeIcon(stat.change)}
                      <span
                        className={
                          stat.change > 0
                            ? 'text-green-500'
                            : stat.change < 0
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        }
                      >
                        {stat.change > 0 ? '+' : ''}
                        {stat.change} this week
                      </span>
                    </div>
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

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem Difficulty Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  Difficulty Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.problemStats).map(([difficulty, stats]) => (
                  <div key={difficulty} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium">{difficulty}</span>
                      <span className="text-muted-foreground">
                        {stats.solved}/{stats.total}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={(stats.solved / stats.total) * 100}
                        className="h-2"
                      />
                      <div
                        className={`absolute inset-0 h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(
                          difficulty
                        )} opacity-80`}
                        style={{
                          width: `${(stats.solved / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500" />
                  Language Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.languageStats.map((lang, index) => (
                  <div key={lang.language} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-muted-foreground">
                        {lang.problems} ({lang.percentage}%)
                      </span>
                    </div>
                    <Progress value={lang.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Practice Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(analytics.timeDistribution).map(([time, count]) => (
                  <div
                    key={time}
                    className="p-4 rounded-xl border border-border/50 bg-card/30 text-center"
                  >
                    <div className="text-2xl font-bold text-purple-500">{count}%</div>
                    <div className="text-sm text-muted-foreground mt-1">{time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Topic-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analytics.categoryBreakdown.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {category.solved}/{category.total} solved
                      </span>
                      <Badge
                        variant={category.accuracy >= 85 ? 'default' : 'secondary'}
                        className="min-w-[60px] justify-center"
                      >
                        {category.accuracy}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(category.solved / category.total) * 100}
                      className="h-3"
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
                        <Calendar className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">{day.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {day.problems} problems • {day.time}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={day.accuracy >= 80 ? 'default' : 'secondary'}
                      className="min-w-[60px] justify-center"
                    >
                      {day.accuracy}%
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <Star className="w-5 h-5" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.strengths.map((strength) => (
                    <Badge
                      key={strength}
                      variant="outline"
                      className="border-green-500/50 text-green-500"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Keep practicing these topics to maintain your edge!
                </p>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-500">
                  <Brain className="w-5 h-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.weaknesses.map((weakness) => (
                    <Badge
                      key={weakness}
                      variant="outline"
                      className="border-orange-500/50 text-orange-500"
                    >
                      {weakness}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Focus on these topics to improve your overall performance.
                </p>
              </CardContent>
            </Card>

            {/* Suggested Topics */}
            <Card className="lg:col-span-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-500">
                  <Zap className="w-5 h-5" />
                  Suggested Next Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analytics.suggestedTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="border-purple-500/50 text-purple-500 cursor-pointer hover:bg-purple-500/10 transition-colors"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your current progress, these topics will help you level up!
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
