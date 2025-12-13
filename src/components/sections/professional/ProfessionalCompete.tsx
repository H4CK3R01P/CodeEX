import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Trophy,
  Users,
  Clock,
  TrendingUp,
  Award,
  Target,
  Briefcase,
  Zap,
  Calendar
} from 'lucide-react';
import { UserData } from '../../../App';

interface ProfessionalCompeteProps {
  userData: UserData;
}

export function ProfessionalCompete({ userData }: ProfessionalCompeteProps) {
  const competitions = [
    {
      id: 1,
      title: 'System Design Challenge',
      type: 'Case Study',
      duration: '3 days',
      participants: 245,
      prize: 'Top 3 get certification',
      difficulty: 'Advanced',
      deadline: 'Ends in 2 days',
      topics: ['System Architecture', 'Scalability', 'Trade-offs'],
      status: 'active'
    },
    {
      id: 2,
      title: 'Leadership Hackathon',
      type: 'Team Challenge',
      duration: '48 hours',
      participants: 180,
      prize: 'Industry recognition + Network',
      difficulty: 'Intermediate',
      deadline: 'Starts in 5 days',
      topics: ['Team Building', 'Strategy', 'Communication'],
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Code Review Competition',
      type: 'Skill Challenge',
      duration: '2 hours',
      participants: 320,
      prize: 'Skill badges + Points',
      difficulty: 'Intermediate',
      deadline: 'Starts tomorrow',
      topics: ['Code Quality', 'Best Practices', 'Refactoring'],
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'Cloud Architecture Sprint',
      type: 'Case Study',
      duration: '1 week',
      participants: 150,
      prize: 'AWS Credits + Certification',
      difficulty: 'Advanced',
      deadline: 'Starts in 10 days',
      topics: ['AWS', 'Microservices', 'DevOps'],
      status: 'upcoming'
    }
  ];

  const leaderboard = [
    { rank: 12, name: 'You', points: 2450, change: '+3', trend: 'up' },
    { rank: 1, name: 'Alex Chen', points: 5240, change: '-', trend: 'stable' },
    { rank: 2, name: 'Sarah Kumar', points: 4890, change: '+1', trend: 'up' },
    { rank: 3, name: 'Mike Johnson', points: 4120, change: '-1', trend: 'down' }
  ];

  const recentResults = [
    { competition: 'Performance Optimization', rank: 15, participants: 200, date: '3 days ago' },
    { competition: 'System Design Basics', rank: 8, participants: 150, date: '1 week ago' },
    { competition: 'Code Quality Challenge', rank: 22, participants: 180, date: '2 weeks ago' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Intermediate': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
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
            <h1 className="text-3xl font-bold gradient-text">Professional Competitions</h1>
            <p className="text-muted-foreground mt-1">
              Case studies, hackathons, and skill challenges for {userData.professionalDomain?.split('-').join(' ')}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Trophy className="w-4 h-4 mr-2" />
            View Leaderboard
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <h3 className="text-3xl font-bold text-purple-400 mt-1">#12</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +3 this week
                  </p>
                </div>
                <Trophy className="w-12 h-12 text-purple-400" />
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
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <h3 className="text-3xl font-bold text-blue-400 mt-1">2,450</h3>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <Award className="w-12 h-12 text-blue-400" />
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
                  <p className="text-sm text-muted-foreground">Participated</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">8</h3>
                  <p className="text-xs text-muted-foreground mt-1">Competitions</p>
                </div>
                <Target className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Rank</p>
                  <h3 className="text-3xl font-bold text-orange-400 mt-1">#8</h3>
                  <p className="text-xs text-muted-foreground mt-1">Top 5%</p>
                </div>
                <Zap className="w-12 h-12 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Competitions */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Available Competitions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {competitions.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{comp.title}</h4>
                        <Badge className={getDifficultyColor(comp.difficulty)}>
                          {comp.difficulty}
                        </Badge>
                        {comp.status === 'active' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{comp.type}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {comp.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {comp.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {comp.participants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {comp.deadline}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">{comp.prize}</span>
                      </div>
                    </div>
                    <Button className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      {comp.status === 'active' ? 'Join Now' : 'Register'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    entry.name === 'You'
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                        entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.points} pts</p>
                      </div>
                    </div>
                    {entry.change !== '-' && (
                      <Badge variant="outline" className={entry.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {entry.trend === 'up' ? '+' : ''}{entry.change}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full">
                View Full Leaderboard
              </Button>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-blue-400" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{result.competition}</span>
                    <Badge variant="outline" className="text-blue-400">
                      #{result.rank}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.participants} participants • {result.date}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Competition Tips */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Competition Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                <p className="text-xs text-muted-foreground">Read requirements carefully</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                <p className="text-xs text-muted-foreground">Submit early and iterate</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                <p className="text-xs text-muted-foreground">Network with participants</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}