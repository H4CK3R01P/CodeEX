import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Award, Lock, TrendingUp, Star } from 'lucide-react';
import { UserData } from '../../App';
import { getDomainData } from '../../utils/domainData';
import { getDomainConfig, getDomainTerminology } from '../../utils/domainConfig';

interface AchieveProps {
  userData: UserData;
}

export function Achieve({ userData }: AchieveProps) {
  const domainData = getDomainData(userData.domain || '');
  const config = getDomainConfig(userData.domain || '');
  const terminology = getDomainTerminology(userData.domain || '');
  const isExam = config.category === 'exam';

  const unlockedAchievements = domainData.achievements.filter(a => a.unlocked);
  const lockedAchievements = domainData.achievements.filter(a => !a.unlocked);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Achievements</h2>
        <p className="text-gray-600">Track your milestones and accomplishments</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">{unlockedAchievements.length}</div>
            <div className="text-sm text-gray-600">Unlocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">{lockedAchievements.length}</div>
            <div className="text-sm text-gray-600">Locked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">{unlockedAchievements.length * 50}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">
              {Math.round((unlockedAchievements.length / domainData.achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {unlockedAchievements.length} of {domainData.achievements.length} achievements unlocked
              </span>
              <span className="text-gray-900">
                {Math.round((unlockedAchievements.length / domainData.achievements.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(unlockedAchievements.length / domainData.achievements.length) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Unlocked Achievements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-gray-900">{achievement.name}</h4>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          +50 XP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Award className="w-4 h-4" />
                        <span>Unlocked</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-gray-900 mb-4">Locked Achievements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gray-50 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-3xl opacity-50">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-gray-900">{achievement.name}</h4>
                        <Badge variant="outline" className="bg-gray-100">
                          +50 XP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>Keep working to unlock this!</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                🎯
              </div>
              <div className="flex-1">
                <div className="text-gray-900 mb-1">Completed 100 Problems</div>
                <div className="text-sm text-gray-600">Achieved 2 days ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                📚
              </div>
              <div className="flex-1">
                <div className="text-gray-900 mb-1">Finished Learning Module</div>
                <div className="text-sm text-gray-600">Achieved 5 days ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                🔥
              </div>
              <div className="flex-1">
                <div className="text-gray-900 mb-1">7-Day Streak Achieved</div>
                <div className="text-sm text-gray-600">Achieved 1 week ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
