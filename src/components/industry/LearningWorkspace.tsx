import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Users,
  Plus,
  Play
} from 'lucide-react';
import { UserData } from '../../App';

interface LearningWorkspaceProps {
  userData: UserData;
}

export function LearningWorkspace({ userData }: LearningWorkspaceProps) {
  const programs = [
    { title: 'AWS Cloud Practitioner', enrolled: 45, completed: 28, progress: 62, category: 'Cloud' },
    { title: 'React Advanced Patterns', enrolled: 32, completed: 18, progress: 56, category: 'Frontend' },
    { title: 'System Design Mastery', enrolled: 28, completed: 12, progress: 43, category: 'Architecture' },
    { title: 'Python Data Science', enrolled: 51, completed: 35, progress: 69, category: 'Data' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning & Upskilling</h1>
          <p className="text-gray-400">Corporate training and skill development programs</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-5 h-5" />
          Create Program
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Active Programs</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">12</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Enrolled Employees</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">156</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Certifications</span>
              <Award className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">89</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Avg Completion</span>
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">68%</div>
          </CardContent>
        </Card>
      </div>

      {/* Training Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white mb-2">{program.title}</CardTitle>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {program.category}
                  </Badge>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Enrolled</div>
                  <div className="text-xl font-bold text-white">{program.enrolled}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Completed</div>
                  <div className="text-xl font-bold text-white">{program.completed}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Overall Progress</span>
                  <span className="text-sm text-white font-medium">{program.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{width: `${program.progress}%`}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skill Gap Heatmap */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { skill: 'Cloud Architecture', gap: 'High', color: 'from-red-600/20 to-orange-600/20 border-red-500/30' },
              { skill: 'Machine Learning', gap: 'Medium', color: 'from-yellow-600/20 to-amber-600/20 border-yellow-500/30' },
              { skill: 'Frontend Frameworks', gap: 'Low', color: 'from-green-600/20 to-emerald-600/20 border-green-500/30' },
              { skill: 'DevOps', gap: 'High', color: 'from-red-600/20 to-orange-600/20 border-red-500/30' },
            ].map((item, index) => (
              <div key={index} className={`p-4 rounded-lg bg-gradient-to-br ${item.color} border`}>
                <div className="text-white font-medium mb-1">{item.skill}</div>
                <div className="text-sm text-gray-300">Gap: {item.gap}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
