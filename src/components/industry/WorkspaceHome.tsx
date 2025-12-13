import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  FileText, 
  Users, 
  GraduationCap, 
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { UserData } from '../../App';

interface WorkspaceHomeProps {
  userData: UserData;
  onNavigate: (section: string) => void;
}

export function WorkspaceHome({ userData, onNavigate }: WorkspaceHomeProps) {
  // Get industry-specific labels
  const getLabels = () => {
    switch (userData.industryType) {
      case 'tech-company':
        return {
          assessments: 'Technical Assessments',
          evaluated: 'Candidates Evaluated',
          training: 'Developers in Training',
          gaps: 'Skill Gaps Identified',
          createAction: 'Create Technical Assessment',
          assignAction: 'Assign Developer Training'
        };
      case 'consulting':
        return {
          assessments: 'Case Studies',
          evaluated: 'Consultants Evaluated',
          training: 'Consultants in Training',
          gaps: 'Skill Gaps Identified',
          createAction: 'Create Case Study',
          assignAction: 'Assign Training'
        };
      case 'educational':
        return {
          assessments: 'Student Assessments',
          evaluated: 'Students Evaluated',
          training: 'Students in Courses',
          gaps: 'Learning Gaps',
          createAction: 'Create Assessment',
          assignAction: 'Assign Course'
        };
      case 'healthcare':
        return {
          assessments: 'Certifications',
          evaluated: 'Staff Evaluated',
          training: 'Staff in Training',
          gaps: 'Compliance Gaps',
          createAction: 'Create Certification',
          assignAction: 'Assign Training'
        };
      case 'financial':
        return {
          assessments: 'Compliance Tests',
          evaluated: 'Staff Evaluated',
          training: 'Staff in Training',
          gaps: 'Compliance Gaps',
          createAction: 'Create Compliance Test',
          assignAction: 'Assign Training'
        };
      default:
        return {
          assessments: 'Active Assessments',
          evaluated: 'People Evaluated',
          training: 'People in Training',
          gaps: 'Skill Gaps',
          createAction: 'Create Assessment',
          assignAction: 'Assign Training'
        };
    }
  };

  const labels = getLabels();

  const kpiCards = [
    { title: labels.assessments, value: '24', change: '+12%', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { title: labels.evaluated, value: '1,847', change: '+28%', icon: Users, color: 'from-purple-500 to-pink-500' },
    { title: labels.training, value: '156', change: '+8%', icon: GraduationCap, color: 'from-orange-500 to-red-500' },
    { title: labels.gaps, value: '43', change: '-15%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  ];

  const quickActions = [
    { label: labels.createAction, icon: FileText, action: () => onNavigate('assessments'), color: 'from-blue-600 to-cyan-600' },
    { label: labels.assignAction, icon: GraduationCap, action: () => onNavigate('learning'), color: 'from-purple-600 to-pink-600' },
    { label: 'Invite Team Member', icon: Users, action: () => onNavigate('team'), color: 'from-orange-600 to-red-600' },
  ];

  const recentActivity = [
    { title: `New assessment created: "Senior Developer Test"`, time: '2 hours ago', status: 'new' },
    { title: `15 candidates completed assessment`, time: '4 hours ago', status: 'completed' },
    { title: `Training program assigned to 12 team members`, time: '5 hours ago', status: 'assigned' },
    { title: `New team member joined`, time: '1 day ago', status: 'new' },
    { title: `Campus hiring drive completed successfully`, time: '2 days ago', status: 'completed' },
  ];

  const upcomingTasks = [
    { title: 'Review 8 pending assessments', dueDate: 'Today', priority: 'high', icon: FileText },
    { title: 'Schedule team performance review', dueDate: 'Tomorrow', priority: 'medium', icon: Calendar },
    { title: 'Update training curriculum', dueDate: 'This week', priority: 'low', icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userData.name?.split(' ')[0] || 'Admin'}!</h1>
        <p className="text-gray-400">Here's what's happening with your organization today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
                <p className={`text-sm ${
                  kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {kpi.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`w-full justify-start gap-3 bg-gradient-to-r ${action.color} hover:opacity-90 transition-opacity`}
                >
                  <Icon className="w-5 h-5" />
                  {action.label}
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.status === 'new' ? 'bg-blue-500' :
                    activity.status === 'completed' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-gray-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => {
                const Icon = task.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${
                      task.priority === 'high' ? 'bg-red-500/20' :
                      task.priority === 'medium' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        task.priority === 'high' ? 'text-red-400' :
                        task.priority === 'medium' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{task.title}</p>
                      <p className="text-gray-400 text-xs mt-1">Due: {task.dueDate}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                      Start
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer">
                <div className="text-sm text-blue-400 mb-2">Tomorrow, 10:00 AM</div>
                <div className="text-white font-medium mb-1">Campus Hiring Drive - Stanford University</div>
                <div className="text-gray-400 text-sm">150 students registered</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="text-sm text-purple-400 mb-2">In 3 days</div>
                <div className="text-white font-medium mb-1">Q4 Skills Assessment Review</div>
                <div className="text-gray-400 text-sm">24 assessments to review</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 hover:border-orange-500/50 transition-colors cursor-pointer">
                <div className="text-sm text-orange-400 mb-2">Next week</div>
                <div className="text-white font-medium mb-1">New Training Program Launch</div>
                <div className="text-gray-400 text-sm">AI/ML Fundamentals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
