import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  Flame,
  TrendingUp,
  ChevronRight,
  Calendar,
  Award,
  BookOpen,
  Video,
  CheckCircle2,
  PlayCircle,
  FileText,
  CalendarDays,
  Home,
  Bookmark,
  Heart,
  ExternalLink,
  Zap,
  Star,
  Rocket,
  Activity
} from 'lucide-react';
import { UserData } from '../../App';
import { getDomainData } from '../../utils/domainData';
import { motion } from 'motion/react';

interface DashboardHomeProps {
  userData: UserData;
  onNavigate?: (section: 'dashboard' | 'learn' | 'practice' | 'compete' | 'test' | 'achieve' | 'coins' | 'problems') => void;
}

export function DashboardHome({ userData, onNavigate }: DashboardHomeProps) {
  const domainData = getDomainData(userData.domain || '');
  const isJEE = userData.domain === 'jee';
  const isCoding = ['competitive-programming', 'frontend', 'backend', 'mobile-dev'].includes(userData.domain || '');

  // Mock data for JEE-specific features
  const lastActivity = {
    type: 'lecture',
    title: 'Rotational Motion - Advanced Concepts',
    subject: 'Physics',
    progress: 75,
    duration: '45 mins',
    timestamp: '2 hours ago'
  };

  const assignments = [
    { id: 1, title: 'Complete Organic Chemistry - Chapter 5', assignedBy: 'Parent', dueDate: 'Dec 10', coins: 50, completed: false },
    { id: 2, title: 'Solve 20 Calculus Problems', assignedBy: 'Parent', dueDate: 'Dec 12', coins: 30, completed: true },
    { id: 3, title: 'Watch Electrostatics Video Lectures', assignedBy: 'Parent', dueDate: 'Dec 15', coins: 40, completed: false },
  ];

  const favoriteBooks = [
    { id: 1, title: 'HC Verma - Concepts of Physics Vol 1', subject: 'Physics', pages: 462, bookmark: 'Chapter 12' },
    { id: 2, title: 'NCERT Chemistry Class 12', subject: 'Chemistry', pages: 380, bookmark: 'Chapter 8' },
    { id: 3, title: 'RD Sharma Mathematics', subject: 'Mathematics', pages: 520, bookmark: 'Chapter 15' },
  ];

  const bookmarkedVideos = [
    { id: 1, title: 'Newton\'s Laws of Motion', subject: 'Physics', type: 'topic', duration: '18 mins', chapter: 'Mechanics' },
    { id: 2, title: 'Organic Reactions Mechanism', subject: 'Chemistry', type: 'topic', duration: '15 mins', chapter: 'Organic Chemistry' },
    { id: 3, title: 'Differential Calculus - Complete', subject: 'Mathematics', type: 'chapter', duration: '58 mins', chapter: 'Calculus' },
    { id: 4, title: 'Thermodynamics Basics', subject: 'Physics', type: 'topic', duration: '20 mins', chapter: 'Heat & Thermodynamics' },
  ];

  const bookmarkedQuestions = [
    { id: 1, title: 'Projectile Motion - Advanced', subject: 'Physics', difficulty: 'Hard', topic: 'Mechanics' },
    { id: 2, title: 'Electrochemistry Numerical', subject: 'Chemistry', difficulty: 'Medium', topic: 'Physical Chemistry' },
    { id: 3, title: 'Integration Techniques', subject: 'Mathematics', difficulty: 'Hard', topic: 'Calculus' },
  ];

  const quickAccessItems = [
    { id: 'home', label: 'My Home', icon: <Home className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-500', action: 'dashboard' },
    { id: 'recorded', label: 'Recorded Class', icon: <Video className="w-5 h-5" />, gradient: 'from-purple-500 to-pink-500', action: 'learn' },
    { id: 'revision', label: 'Revision List', icon: <BookOpen className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-500', action: 'learn' },
    { id: 'timeline', label: 'My Timeline', icon: <CalendarDays className="w-5 h-5" />, gradient: 'from-orange-500 to-red-500', action: 'learn' },
  ];

  const stats = [
    { label: domainData.stats[0].label, value: domainData.stats[0].value, icon: <Target className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-500/10 to-cyan-500/10' },
    { label: 'Current Streak', value: '12', icon: <Flame className="w-5 h-5" />, gradient: 'from-orange-500 to-red-500', bgGradient: 'from-orange-500/10 to-red-500/10' },
    { label: domainData.stats[1].label, value: domainData.stats[1].value, icon: <Trophy className="w-5 h-5" />, gradient: 'from-yellow-500 to-amber-500', bgGradient: 'from-yellow-500/10 to-amber-500/10' },
    { label: 'Study Hours', value: '68', icon: <Clock className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-500', bgGradient: 'from-emerald-500/10 to-teal-500/10' },
  ];

  const handleQuickAccess = (action: string) => {
    if (onNavigate) {
      onNavigate(action as any);
    }
  };

  if (isJEE) {
    return (
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-foreground mb-1 flex items-center gap-2">
            Welcome back, <span className="gradient-text">{userData.name}</span>! 
            <Rocket className="w-6 h-6 text-purple-400" />
          </h1>
          <p className="text-muted-foreground">Continue your JEE preparation journey</p>
        </motion.div>

        {/* Activity Summary with Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 overflow-hidden relative border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-orange-500/10" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-foreground mb-1 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Last Activity
                  </h3>
                  <p className="text-sm text-muted-foreground">{lastActivity.timestamp}</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">{lastActivity.subject}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {lastActivity.type === 'lecture' ? (
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                      <PlayCircle className="w-6 h-6 text-purple-400" />
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-foreground">{lastActivity.title}</h4>
                    <p className="text-sm text-muted-foreground">{lastActivity.duration}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">{lastActivity.progress}%</span>
                  </div>
                  <Progress value={lastActivity.progress} className="h-2.5 bg-muted/50" />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-purple-500/50 transition-all"
                  onClick={() => onNavigate && onNavigate('learn')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Continue {lastActivity.type === 'lecture' ? 'Learning' : 'Test'}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access Cards */}
        <div className="mb-6">
          <h2 className="text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            Quick Access
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:scale-105 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 group"
                  onClick={() => handleQuickAccess(item.action)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`p-4 bg-gradient-to-r ${item.gradient} rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <span className="text-foreground font-medium">{item.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Student Assignments */}
          {userData.profileType === 'student' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    My Assignments
                  </CardTitle>
                  <CardDescription>Complete assignments to earn coins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div 
                        key={assignment.id}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          assignment.completed 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-card/50 border-border/50 hover:bg-card/80'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className={`text-sm ${assignment.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {assignment.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Due: {assignment.dueDate}</p>
                          </div>
                          {assignment.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Badge variant="outline" className="flex-shrink-0 border-amber-500/30 text-amber-400 bg-amber-500/10">
                              {assignment.coins} coins
                            </Badge>
                          )}
                        </div>
                        {!assignment.completed && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                            onClick={() => onNavigate && onNavigate('practice')}
                          >
                            Start Assignment
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* My Favorite Books */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  My Favorite Books
                </CardTitle>
                <CardDescription>Your ebook collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {favoriteBooks.map((book) => (
                    <div 
                      key={book.id} 
                      className="flex items-start gap-3 p-3 bg-card/50 border border-border/50 rounded-xl hover:bg-card/80 hover:border-purple-500/30 transition-all cursor-pointer group"
                      onClick={() => onNavigate && onNavigate('learn')}
                    >
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate font-medium">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.subject} • {book.pages} pages</p>
                        <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                          <Bookmark className="w-3 h-3" />
                          {book.bookmark}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-purple-400 transition-colors" />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full border-border/50 hover:bg-purple-500/10 hover:border-purple-500/30"
                    onClick={() => onNavigate && onNavigate('learn')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add More Books
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* My Bookmarks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-400" />
                My Bookmarks
              </CardTitle>
              <CardDescription>Quick access to your saved videos and questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bookmarked Videos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-foreground flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-400" />
                      Videos
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-purple-500/10 text-purple-400"
                      onClick={() => onNavigate && onNavigate('learn')}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {bookmarkedVideos.map((video) => (
                      <div 
                        key={video.id}
                        className="border border-border/50 rounded-xl p-3 hover:bg-card/80 hover:border-purple-500/30 transition-all cursor-pointer group"
                        onClick={() => onNavigate && onNavigate('learn')}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate font-medium">{video.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{video.subject} • {video.chapter}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400 bg-blue-500/10">
                                {video.type === 'topic' ? '📝 Topic' : '📚 Chapter'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{video.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookmarked Questions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-400" />
                      Questions
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-orange-500/10 text-orange-400"
                      onClick={() => onNavigate && onNavigate('practice')}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {bookmarkedQuestions.map((question) => (
                      <div 
                        key={question.id}
                        className="border border-border/50 rounded-xl p-3 hover:bg-card/80 hover:border-orange-500/30 transition-all cursor-pointer group"
                        onClick={() => onNavigate && onNavigate('practice')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400 bg-blue-500/10">
                            {question.subject}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              question.difficulty === 'Hard' 
                                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                : question.difficulty === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            } border`}
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-1 font-medium">{question.title}</p>
                        <p className="text-xs text-muted-foreground">{question.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 bg-gradient-to-r ${stat.gradient} rounded-lg`}>
                      <div className="text-white">{stat.icon}</div>
                    </div>
                  </div>
                  <div className="text-foreground text-3xl mb-1 font-bold">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {domainData.progressTopics.map((topic, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium">{topic.name}</span>
                      <span className="text-sm text-muted-foreground">{topic.completed}/{topic.total} {domainData.progressUnit}</span>
                    </div>
                    <Progress value={topic.progress} className="h-2.5 bg-muted/50" />
                    <div className="text-sm text-muted-foreground">{topic.progress}% complete</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Enhanced dashboard for coding domains
  if (isCoding) {
    return (
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-foreground mb-1 flex items-center gap-2">
            Welcome back, <span className="gradient-text">{userData.name}</span>! 
            <Rocket className="w-6 h-6 text-purple-400" />
          </h1>
          <p className="text-muted-foreground">Continue your journey in {domainData.name}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 bg-gradient-to-r ${stat.gradient} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">{stat.icon}</div>
                    </div>
                  </div>
                  <div className="text-foreground text-3xl mb-1 font-bold">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Challenge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  {domainData.dailyChallenge.title}
                </CardTitle>
                <CardDescription>{domainData.dailyChallenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">{domainData.dailyChallenge.name}</span>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
                      {domainData.dailyChallenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{domainData.dailyChallenge.reward}</span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-purple-500/50 transition-all"
                    onClick={() => onNavigate && onNavigate('practice')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start Challenge
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {domainData.upcomingEvents.map((event, index) => (
                    <div 
                      key={index} 
                      className="border-l-4 border-purple-500 pl-4 py-2 rounded-r-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer"
                      onClick={() => onNavigate && onNavigate('compete')}
                    >
                      <div className="text-foreground mb-1 font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {event.time}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full border-border/50 hover:bg-purple-500/10 hover:border-purple-500/30"
                    onClick={() => onNavigate && onNavigate('compete')}
                  >
                    View All Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {domainData.progressTopics.map((topic, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium">{topic.name}</span>
                      <span className="text-sm text-muted-foreground">{topic.completed}/{topic.total} {domainData.progressUnit}</span>
                    </div>
                    <Progress value={topic.progress} className="h-2.5 bg-muted/50" />
                    <div className="text-sm text-muted-foreground">{topic.progress}% complete</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Original dashboard for other domains
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-foreground mb-1 flex items-center gap-2">
          Welcome back, <span className="gradient-text">{userData.name}</span>! 
          <Rocket className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-muted-foreground">Continue your journey in {domainData.name}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 bg-gradient-to-r ${stat.gradient} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{stat.icon}</div>
                  </div>
                </div>
                <div className="text-foreground text-3xl mb-1 font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                {domainData.dailyChallenge.title}
              </CardTitle>
              <CardDescription>{domainData.dailyChallenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">{domainData.dailyChallenge.name}</span>
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
                    {domainData.dailyChallenge.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{domainData.dailyChallenge.reward}</span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-purple-500/50 transition-all"
                  onClick={() => onNavigate && onNavigate('practice')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Challenge
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domainData.upcomingEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className="border-l-4 border-purple-500 pl-4 py-2 rounded-r-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer"
                    onClick={() => onNavigate && onNavigate('compete')}
                  >
                    <div className="text-foreground mb-1 font-medium">{event.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {event.time}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-border/50 hover:bg-purple-500/10 hover:border-purple-500/30"
                  onClick={() => onNavigate && onNavigate('compete')}
                >
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {domainData.progressTopics.map((topic, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">{topic.name}</span>
                    <span className="text-sm text-muted-foreground">{topic.completed}/{topic.total} {domainData.progressUnit}</span>
                  </div>
                  <Progress value={topic.progress} className="h-2.5 bg-muted/50" />
                  <div className="text-sm text-muted-foreground">{topic.progress}% complete</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
