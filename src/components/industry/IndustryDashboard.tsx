import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  GraduationCap, 
  Users, 
  Building2, 
  BarChart3, 
  Settings,
  Plus,
  Bell,
  ChevronDown,
  Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { WorkspaceHome } from './WorkspaceHome';
import { AssessmentsWorkspace } from './AssessmentsWorkspace';
import { EvaluationWorkspace } from './EvaluationWorkspace';
import { LearningWorkspace } from './LearningWorkspace';
import { TeamWorkspace } from './TeamWorkspace';
import { CampusWorkspace } from './CampusWorkspace';
import { AnalyticsWorkspace } from './AnalyticsWorkspace';
import { SettingsWorkspace } from './SettingsWorkspace';
import { UserData } from '../../App';

interface IndustryDashboardProps {
  userData: UserData;
}

type WorkspaceSection = 'home' | 'assessments' | 'evaluation' | 'learning' | 'team' | 'campus' | 'analytics' | 'settings';

export function IndustryDashboard({ userData }: IndustryDashboardProps) {
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const navItems = [
    { id: 'home' as WorkspaceSection, label: 'Workspace Home', icon: LayoutDashboard },
    { id: 'assessments' as WorkspaceSection, label: 'Assessments', icon: FileText },
    { id: 'evaluation' as WorkspaceSection, label: 'Evaluation', icon: ClipboardCheck },
    { id: 'learning' as WorkspaceSection, label: 'Learning & Upskilling', icon: GraduationCap },
    { id: 'team' as WorkspaceSection, label: 'Team & Employees', icon: Users },
    { id: 'campus' as WorkspaceSection, label: 'Campus Hiring', icon: Building2 },
    { id: 'analytics' as WorkspaceSection, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <WorkspaceHome userData={userData} onNavigate={setActiveSection} />;
      case 'assessments':
        return <AssessmentsWorkspace userData={userData} />;
      case 'evaluation':
        return <EvaluationWorkspace userData={userData} />;
      case 'learning':
        return <LearningWorkspace userData={userData} />;
      case 'team':
        return <TeamWorkspace userData={userData} />;
      case 'campus':
        return <CampusWorkspace userData={userData} />;
      case 'analytics':
        return <AnalyticsWorkspace userData={userData} />;
      case 'settings':
        return <SettingsWorkspace userData={userData} />;
      default:
        return <WorkspaceHome userData={userData} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left: Logo & Org Switcher */}
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CodeEX
            </h1>
            <Button variant="outline" className="gap-2 bg-gray-800/50 border-gray-700">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{userData.name || 'My Organization'}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
              {userData.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 transition-all duration-300 z-40 ${
        sidebarExpanded ? 'w-64' : 'w-20'
      }`}>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarExpanded && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`pt-16 transition-all duration-300 ${
        sidebarExpanded ? 'pl-64' : 'pl-20'
      }`}>
        <div className="p-8">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
