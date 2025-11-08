import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trophy, Users, Calendar, Award, Clock, TrendingUp } from 'lucide-react';
import { UserData } from '../../App';
import { getDomainData } from '../../utils/domainData';
import { getDomainConfig, getDomainTerminology } from '../../utils/domainConfig';
import { ContestsHub } from './ContestsHub';

interface CompeteProps {
  userData: UserData;
}

export function Compete({ userData }: CompeteProps) {
  const config = getDomainConfig(userData.domain || '');
  const isCodingDomain = config.category === 'coding';
  
  // For coding domains, use the new ContestsHub with code editor
  if (isCodingDomain) {
    return <ContestsHub userData={userData} />;
  }
  
  // For exam domains, use the existing compete section
  const domainData = getDomainData(userData.domain || '');
  const terminology = getDomainTerminology(userData.domain || '');
  const isExam = config.category === 'exam';

  const upcomingContests = domainData.contests.filter(c => c.status === 'upcoming');
  const pastContests = domainData.contests.filter(c => c.status === 'completed');

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">{isExam ? 'Competitions & Challenges' : 'Contests & Competitions'}</h2>
        <p className="text-gray-600">Compete with others and climb the leaderboard</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">12</div>
            <div className="text-sm text-gray-600">{isExam ? 'Competitions' : 'Contests'} Participated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">3</div>
            <div className="text-sm text-gray-600">Podium Finishes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">{domainData.stats[1].value}</div>
            <div className="text-sm text-gray-600">Current Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">#342</div>
            <div className="text-sm text-gray-600">Global Rank</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past {isExam ? 'Competitions' : 'Contests'}</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingContests.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      {contest.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {contest.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {contest.participants.toLocaleString()} registered
                      </span>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {contest.prize}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Registration closes 1 hour before start
                  </div>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastContests.map((contest) => (
            <Card key={contest.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {contest.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {contest.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {contest.participants.toLocaleString()} participants
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Your Rank</div>
                    <div className="text-2xl text-gray-900">#127</div>
                  </div>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Leaderboard Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Top Performers This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Alex Chen', rating: 2450, change: '+125' },
              { rank: 2, name: 'Sarah Johnson', rating: 2398, change: '+98' },
              { rank: 3, name: 'Michael Park', rating: 2356, change: '+76' },
              { rank: 4, name: 'You', rating: 1847, change: '+45', highlight: true },
              { rank: 5, name: 'Emma Wilson', rating: 1832, change: '+32' },
            ].map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.highlight ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <div className="text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">Rating: {user.rating}</div>
                  </div>
                </div>
                <Badge variant={user.highlight ? 'default' : 'secondary'} className="text-green-600">
                  {user.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}