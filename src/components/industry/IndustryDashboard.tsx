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

  // Get industry-specific navigation items
  const getNavItems = () => {
    const industryType = userData.industryType;
    const baseItems = [
      { id: 'home' as WorkspaceSection, label: 'Workspace Home', icon: LayoutDashboard },
    ];

    // Customize navigation based on industry type
    switch (industryType) {
      case 'tech-company':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Technical Assessments', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Candidate Evaluation', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Developer Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Engineering Teams', icon: Users },
          { id: 'campus' as WorkspaceSection, label: 'Campus Hiring', icon: Building2 },
          { id: 'analytics' as WorkspaceSection, label: 'Hiring Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'consulting':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Case Studies', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Consultant Evaluation', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Professional Development', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Consultants', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Project Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'educational':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Student Assessments', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Grading & Evaluation', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Course Management', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Faculty & Staff', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Academic Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'healthcare':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Certifications', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Staff Evaluation', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Medical Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Medical Staff', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Compliance Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'financial':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Compliance Tests', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Risk Assessment', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Regulatory Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Financial Team', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Risk Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'manufacturing':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Safety Assessments', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Quality Control', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Operations Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Production Team', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Operations Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'retail':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Service Assessments', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Performance Review', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Sales Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Store Teams', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Sales Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      case 'government':
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Civil Service Exams', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Performance Review', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Public Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Public Servants', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Service Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
      default:
        return [
          ...baseItems,
          { id: 'assessments' as WorkspaceSection, label: 'Assessments', icon: FileText },
          { id: 'evaluation' as WorkspaceSection, label: 'Evaluation', icon: ClipboardCheck },
          { id: 'learning' as WorkspaceSection, label: 'Learning & Training', icon: GraduationCap },
          { id: 'team' as WorkspaceSection, label: 'Team Management', icon: Users },
          { id: 'analytics' as WorkspaceSection, label: 'Analytics', icon: BarChart3 },
          { id: 'settings' as WorkspaceSection, label: 'Settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

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
      {/* Top Bar with Logo and Organization Name */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        {/* First Row: Logo, Org Name, Actions */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800/50">
          {/* Left: Logo & Org Name */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CodeEX
            </h1>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-white">{userData.name || 'My Organization'}</span>
            </div>
          </div>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-800">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {userData.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        {/* Second Row: Navigation Bar */}
        <div className="flex items-center h-14 px-6 gap-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                data-testid={`nav-${item.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap font-medium text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Adjusted for new header height */}
      <div className="pt-32 min-h-screen">
        <div className="px-8 py-6 max-w-[1920px] mx-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
