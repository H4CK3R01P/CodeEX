import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Briefcase,
  Award,
  TrendingUp
} from 'lucide-react';
import { UserData } from '../../App';

interface TeamWorkspaceProps {
  userData: UserData;
}

export function TeamWorkspace({ userData }: TeamWorkspaceProps) {
  const employees = [
    { name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', skillLevel: 92, status: 'Active' },
    { name: 'Michael Chen', role: 'Team Lead', department: 'Engineering', skillLevel: 88, status: 'Active' },
    { name: 'Emily Rodriguez', role: 'Product Manager', department: 'Product', skillLevel: 85, status: 'Active' },
    { name: 'David Kim', role: 'DevOps Engineer', department: 'Operations', skillLevel: 90, status: 'On Leave' },
    { name: 'Jessica Williams', role: 'UX Designer', department: 'Design', skillLevel: 87, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team & Employees</h1>
          <p className="text-gray-400">Manage your team members and track their progress</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
          <UserPlus className="w-5 h-5" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">248</div>
            <div className="text-sm text-gray-400">Total Employees</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-sm text-gray-400">Departments</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">85%</div>
            <div className="text-sm text-gray-400">Avg Skill Level</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">18</div>
            <div className="text-sm text-gray-400">New This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-gray-800/50 border-gray-700">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Employee Directory */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Employee Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            {employees.map((employee, index) => (
              <div key={index} className="p-4 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{employee.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-400">{employee.role}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm text-gray-400">{employee.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Skill Level</div>
                      <div className="text-xl font-bold text-white">{employee.skillLevel}%</div>
                    </div>
                    <Badge className={employee.status === 'Active'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }>
                      {employee.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-700">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
