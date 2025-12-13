import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Building2,
  Users,
  Trophy,
  Calendar,
  Plus,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { UserData } from '../../App';

interface CampusWorkspaceProps {
  userData: UserData;
}

export function CampusWorkspace({ userData }: CampusWorkspaceProps) {
  const campusDrives = [
    { university: 'Stanford University', students: 150, selected: 12, date: 'Tomorrow', status: 'Upcoming' },
    { university: 'MIT', students: 200, selected: 18, date: 'In 1 week', status: 'Scheduled' },
    { university: 'Berkeley', students: 180, selected: 15, date: '2 days ago', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campus Hiring</h1>
          <p className="text-gray-400">Recruit top talent from universities</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-5 h-5" />
          Schedule Drive
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">24</div>
            <div className="text-sm text-gray-400">Active Drives</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">1,250</div>
            <div className="text-sm text-gray-400">Students Registered</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">89</div>
            <div className="text-sm text-gray-400">Selected Candidates</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">7.1%</div>
            <div className="text-sm text-gray-400">Selection Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campusDrives.map((drive, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {drive.university}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {drive.date}
                  </div>
                </div>
                <Badge className={drive.status === 'Upcoming'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : drive.status === 'Scheduled'
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                }>
                  {drive.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Registered</div>
                  <div className="text-xl font-bold text-white">{drive.students}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Selected</div>
                  <div className="text-xl font-bold text-white">{drive.selected}</div>
                </div>
              </div>
              <Button className="w-full bg-gray-900/50 border border-gray-700">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
