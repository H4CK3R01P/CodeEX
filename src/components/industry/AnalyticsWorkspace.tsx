import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp,
  Users,
  FileText,
  Award,
  Download,
  Calendar
} from 'lucide-react';
import { UserData } from '../../App';

interface AnalyticsWorkspaceProps {
  userData: UserData;
}

export function AnalyticsWorkspace({ userData }: AnalyticsWorkspaceProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Comprehensive insights and performance metrics</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
          <Download className="w-5 h-5" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Assessments</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">2,847</div>
            <div className="text-sm text-green-400">+15% from last quarter</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Candidates Evaluated</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">5,249</div>
            <div className="text-sm text-green-400">+28% from last quarter</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Skills Certified</span>
              <Award className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">892</div>
            <div className="text-sm text-green-400">+8% from last quarter</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">ROI</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">245%</div>
            <div className="text-sm text-green-400">Excellent performance</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Chart visualization goes here</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Chart visualization goes here</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
