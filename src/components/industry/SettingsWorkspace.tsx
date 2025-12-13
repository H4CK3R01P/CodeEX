import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Building2,
  Users,
  Shield,
  Database,
  Save
} from 'lucide-react';
import { UserData } from '../../App';

interface SettingsWorkspaceProps {
  userData: UserData;
}

export function SettingsWorkspace({ userData }: SettingsWorkspaceProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your organization settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Details */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Organization Name</label>
              <input
                type="text"
                defaultValue={userData.name || 'My Organization'}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Industry</label>
              <select className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Education</option>
              </select>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Team Roles */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Roles & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-white font-medium mb-1">Admin</div>
                <div className="text-sm text-gray-400">Full access to all features</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-white font-medium mb-1">Manager</div>
                <div className="text-sm text-gray-400">Manage assessments and teams</div>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="text-white font-medium mb-1">Viewer</div>
                <div className="text-sm text-gray-400">Read-only access</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Proctoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enable Proctoring</span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-full h-full bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Plagiarism Detection</span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-full h-full bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Data & Security */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-gray-900/50 border-gray-700">
              Export All Data
            </Button>
            <Button variant="outline" className="w-full justify-start bg-gray-900/50 border-gray-700">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start bg-gray-900/50 border-gray-700 text-red-400 hover:text-red-300">
              Delete Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
