import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Trophy, 
  Clock, 
  Users, 
  Calendar,
  TrendingUp,
  Medal,
  Star,
  Target,
  PlayCircle,
  CheckCircle2,
  Timer,
  Award,
  Crown
} from 'lucide-react';
import { Contest, generateContests } from '../../utils/codingProblems';
import { UserData } from '../../App';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';

interface ContestsHubProps {
  userData: UserData;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  problemsSolved: number;
  totalProblems: number;
  timeFinished?: string;
  country?: string;
}

export function ContestsHub({ userData }: ContestsHubProps) {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number>(0);

  useEffect(() => {
    const allContests = generateContests();
    setContests(allContests);
    
    // Generate mock leaderboard
    const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      username: `User${i + 1}`,
      score: Math.floor(Math.random() * 1000) + 500,
      problemsSolved: Math.floor(Math.random() * 4) + 1,
      totalProblems: 4,
      timeFinished: `${Math.floor(Math.random() * 90) + 10}m`,
      country: ['USA', 'India', 'China', 'UK', 'Germany'][Math.floor(Math.random() * 5)],
    }));
    mockLeaderboard.sort((a, b) => b.score - a.score);
    setLeaderboard(mockLeaderboard);
    setUserRank(Math.floor(Math.random() * 50) + 1);
  }, []);

  const getContestStatus = (contest: Contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    if (now < startTime) {
      return 'upcoming';
    } else if (now >= startTime && now <= endTime) {
      return 'active';
    } else {
      return 'ended';
    }
  };

  const getTimeUntil = (dateString: string) => {
    const target = new Date(dateString);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff < 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">🔴 Live</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'ended':
        return <Badge variant="outline">Ended</Badge>;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-600" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contests</h1>
            <p className="text-muted-foreground mt-1">
              Compete with developers worldwide and climb the leaderboard
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userRank}
                </div>
                <div className="text-xs text-muted-foreground">Global Rank</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  1250
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  15
                </div>
                <div className="text-xs text-muted-foreground">Contests</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="contests" className="h-full">
          <TabsList className="w-full justify-start border-b rounded-none h-14 px-6">
            <TabsTrigger value="contests" className="gap-2">
              <Trophy className="h-4 w-4" />
              All Contests
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Global Leaderboard
            </TabsTrigger>
            <TabsTrigger value="my-contests" className="gap-2">
              <Star className="h-4 w-4" />
              My Contests
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="contests" className="mt-0">
              <div className="grid gap-6">
                {/* Active/Live Contests */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                    Live Contests
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {contests
                      .filter(c => getContestStatus(c) === 'active')
                      .map((contest) => (
                        <Card key={contest.id} className="border-2 border-green-600">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle>{contest.title}</CardTitle>
                                  {getStatusBadge(getContestStatus(contest))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {contest.description}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Ends in {getTimeUntil(contest.endTime)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{contest.participants.toLocaleString()} participants</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span>{contest.problems.length} problems</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>{contest.duration} minutes</span>
                              </div>
                            </div>

                            {contest.prizes.length > 0 && (
                              <div className="pt-3 border-t">
                                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <Award className="h-4 w-4 text-yellow-600" />
                                  Prizes
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {contest.prizes.map((prize, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {prize}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Button className="w-full gap-2" size="lg">
                              <PlayCircle className="h-4 w-4" />
                              Enter Contest
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Upcoming Contests */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Contests
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {contests
                      .filter(c => getContestStatus(c) === 'upcoming')
                      .map((contest) => (
                        <Card key={contest.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle>{contest.title}</CardTitle>
                                  {getStatusBadge(getContestStatus(contest))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {contest.description}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">Starts in</div>
                              <div className="text-2xl font-bold text-blue-600">
                                {getTimeUntil(contest.startTime)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(contest.startTime).toLocaleString()}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>{contest.duration} minutes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span>{contest.problems.length} problems</span>
                              </div>
                            </div>

                            {contest.prizes.length > 0 && (
                              <div className="pt-3 border-t">
                                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <Award className="h-4 w-4 text-yellow-600" />
                                  Prizes
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {contest.prizes.map((prize, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {prize}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Button className="w-full" variant="outline">
                              Set Reminder
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Past Contests */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Past Contests</h2>
                  <div className="space-y-2">
                    {contests
                      .filter(c => getContestStatus(c) === 'ended')
                      .map((contest) => (
                        <Card key={contest.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                  <h3 className="font-semibold">{contest.title}</h3>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {contest.participants.toLocaleString()}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Problems
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Global Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.slice(0, 100).map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          entry.rank === userRank ? 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-500' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-12 flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {entry.username}
                            {entry.rank === userRank && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.country}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="font-semibold">{entry.score}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>

                        <div className="text-center">
                          <div className="font-semibold">
                            {entry.problemsSolved}/{entry.totalProblems}
                          </div>
                          <div className="text-xs text-muted-foreground">Solved</div>
                        </div>

                        {entry.timeFinished && (
                          <div className="text-center">
                            <div className="font-semibold">{entry.timeFinished}</div>
                            <div className="text-xs text-muted-foreground">Time</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-contests" className="mt-0">
              <Card>
                <CardContent className="py-16 text-center">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No contests participated yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Join a contest to see your history and performance
                  </p>
                  <Button>Browse Contests</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
