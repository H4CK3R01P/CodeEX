import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search,
  Filter,
  User,
  Code,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { UserData } from '../../App';

interface EvaluationWorkspaceProps {
  userData: UserData;
}

export function EvaluationWorkspace({ userData }: EvaluationWorkspaceProps) {
  const candidates = [
    { 
      name: 'Sarah Johnson', 
      assessment: 'Senior React Developer', 
      score: 92, 
      status: 'Passed',
      time: '98 min',
      date: '2 hours ago',
      plagiarism: false
    },
    { 
      name: 'Michael Chen', 
      assessment: 'System Design', 
      score: 78, 
      status: 'Passed',
      time: '165 min',
      date: '5 hours ago',
      plagiarism: false
    },
    { 
      name: 'Emily Rodriguez', 
      assessment: 'Backend Engineer', 
      score: 45, 
      status: 'Failed',
      time: '52 min',
      date: '1 day ago',
      plagiarism: false
    },
    { 
      name: 'David Kim', 
      assessment: 'DSA Assessment', 
      score: 88, 
      status: 'Passed',
      time: '55 min',
      date: '1 day ago',
      plagiarism: true
    },
    { 
      name: 'Jessica Williams', 
      assessment: 'ML Engineer', 
      score: 95, 
      status: 'Passed',
      time: '142 min',
      date: '2 days ago',
      plagiarism: false
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Evaluation</h1>
        <p className="text-gray-400">Review and analyze candidate performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Pending Review</div>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">18</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Auto-Graded</div>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">156</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Flagged</div>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">3</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Avg Score</div>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">76%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-gray-800/50 border-gray-700">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates List */}
        <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Evaluations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-800">
              {candidates.map((candidate, index) => (
                <div key={index} className="p-4 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{candidate.name}</div>
                        <div className="text-gray-400 text-sm">{candidate.assessment}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={candidate.status === 'Passed' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }>
                            {candidate.status}
                          </Badge>
                          {candidate.plagiarism && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">{candidate.score}%</div>
                      <div className="text-xs text-gray-400">{candidate.time}</div>
                      <div className="text-xs text-gray-500 mt-1">{candidate.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700">
                      <Code className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Code Quality</span>
                <span className="text-sm text-white font-medium">8.5/10</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{width: '85%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Time Management</span>
                <span className="text-sm text-white font-medium">7.2/10</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: '72%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Problem Solving</span>
                <span className="text-sm text-white font-medium">9.1/10</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: '91%'}}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-3">Benchmark Comparison</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Top 10%</span>
                  <span className="text-green-400 font-medium">42 candidates</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Top 25%</span>
                  <span className="text-blue-400 font-medium">95 candidates</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Below Average</span>
                  <span className="text-red-400 font-medium">28 candidates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
