import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target,
  TrendingUp,
  Briefcase,
  Award,
  FileText,
  MessageSquare,
  Trophy,
  Clock,
  GraduationCap,
  Bell,
  User,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { SkillGapAnalyzer } from './sections/professional/SkillGapAnalyzer';
import { CareerRoadmap } from './sections/professional/CareerRoadmap';
import { RealWorldPractice } from './sections/professional/RealWorldPractice';
import { ProfessionalPerformance } from './sections/professional/ProfessionalPerformance';
import { ResumeIntelligence } from './sections/professional/ResumeIntelligence';
import { CareerAssistant } from './sections/professional/CareerAssistant';
import { InterviewReadiness } from './sections/professional/InterviewReadiness';
import { TimeEfficientLearning } from './sections/professional/TimeEfficientLearning';
import { IndustryCertifications } from './sections/professional/IndustryCertifications';
import { ProfessionalCompete } from './sections/professional/ProfessionalCompete';
import { StatusIndicator } from './StatusIndicator';
import { UserData } from '../App';

interface ProfessionalDashboardProps {
  userData: UserData;
}

type Section = 'skill-gap' | 'roadmap' | 'practice' | 'performance' | 'resume' | 'assistant' | 'interview' | 'learning' | 'certifications' | 'compete';

export function ProfessionalDashboard({ userData }: ProfessionalDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('skill-gap');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(2);

  // Handle logout - clear session and reload page
  const handleLogout = () => {
    setShowUserMenu(false);
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.removeItem('userData');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  // Handle settings navigation
  const handleSettings = () => {
    setShowUserMenu(false);
    alert('Settings feature coming soon! You can change your preferences here.');
  };

  const navItems = [
    { id: 'skill-gap' as Section, label: 'Skill Gap', icon: <Target className="w-4 h-4" />, gradient: 'from-red-500 to-orange-500' },
    { id: 'roadmap' as Section, label: 'Roadmap', icon: <TrendingUp className="w-4 h-4" />, gradient: 'from-purple-500 to-pink-500' },
    { id: 'practice' as Section, label: 'Practice', icon: <Briefcase className="w-4 h-4" />, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'performance' as Section, label: 'Performance', icon: <BarChart3 className="w-4 h-4" />, gradient: 'from-green-500 to-emerald-500' },
    { id: 'resume' as Section, label: 'Resume', icon: <FileText className="w-4 h-4" />, gradient: 'from-indigo-500 to-blue-500' },
    { id: 'assistant' as Section, label: 'Assistant', icon: <MessageSquare className="w-4 h-4" />, gradient: 'from-violet-500 to-purple-500' },
    { id: 'interview' as Section, label: 'Interview', icon: <Award className="w-4 h-4" />, gradient: 'from-pink-500 to-rose-500' },
    { id: 'learning' as Section, label: 'Learning', icon: <Clock className="w-4 h-4" />, gradient: 'from-orange-500 to-amber-500' },
    { id: 'certifications' as Section, label: 'Certifications', icon: <GraduationCap className="w-4 h-4" />, gradient: 'from-teal-500 to-cyan-500' },
    { id: 'compete' as Section, label: 'Competitions', icon: <Trophy className="w-4 h-4" />, gradient: 'from-yellow-500 to-orange-500' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'skill-gap':
        return <SkillGapAnalyzer userData={userData} />;
      case 'roadmap':
        return <CareerRoadmap userData={userData} />;
      case 'practice':
        return <RealWorldPractice userData={userData} />;
      case 'performance':
        return <ProfessionalPerformance userData={userData} />;
      case 'resume':
        return <ResumeIntelligence userData={userData} />;
      case 'assistant':
        return <CareerAssistant userData={userData} />;
      case 'interview':
        return <InterviewReadiness userData={userData} />;
      case 'learning':
        return <TimeEfficientLearning userData={userData} />;
      case 'certifications':
        return <IndustryCertifications userData={userData} />;
      case 'compete':
        return <ProfessionalCompete userData={userData} />;
      default:
        return <SkillGapAnalyzer userData={userData} />;
    }
  };

  const getDomainTitle = () => {
    const domainMap: Record<string, string> = {
      'software-it': 'Software / IT',
      'banking-finance': 'Banking & Finance',
      'data-analytics': 'Data & Analytics',
      'product-management': 'Product Management',
      'consulting': 'Consulting',
      'operations': 'Operations',
      'marketing-growth': 'Marketing / Growth',
      'cybersecurity-cloud': 'Cybersecurity / Cloud'
    };
    return domainMap[userData.professionalDomain || ''] || 'Professional';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-20">
        {/* Top Bar */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border/30">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500 rounded-xl blur-lg opacity-75 animate-pulse-glow" />
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2.5 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg gradient-text font-bold">CodeEX Pro</h1>
              <p className="text-xs text-muted-foreground">{getDomainTitle()}</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2">
            {/* Career Path Display */}
            <motion.div 
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-3 py-1.5 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm text-muted-foreground">{userData.currentRole}</span>
              <ChevronRight className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{userData.targetRole}</span>
            </motion.div>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all"
              >
                <Bell className="w-5 h-5 text-purple-400" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-medium border-2 border-background">
                    {notifications}
                  </span>
                )}
              </Button>
            </motion.div>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 rounded-xl p-1.5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-75" />
                  <div className="relative w-9 h-9 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-foreground text-sm font-medium">{userData.name}</div>
                  <div className="text-muted-foreground text-xs">Professional</div>
                </div>
              </motion.button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-80 bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-75" />
                          <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                            {userData.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground font-medium truncate">{userData.name}</div>
                          <div className="text-muted-foreground text-sm truncate">{userData.contact}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="px-3 py-2 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Domain</div>
                        <div className="text-sm text-foreground font-medium">{getDomainTitle()}</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Current Role</div>
                        <div className="text-sm text-foreground font-medium">{userData.currentRole}</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <div className="text-xs text-muted-foreground">Target Role</div>
                        <div className="text-sm text-purple-400 font-medium">{userData.targetRole}</div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-border/50 space-y-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start hover:bg-purple-500/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="overflow-x-auto">
          <nav className="flex px-4 min-w-max">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`relative flex items-center gap-2 px-4 py-3 transition-all whitespace-nowrap group ${
                  activeSection === item.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  activeSection === item.id 
                    ? `bg-gradient-to-r ${item.gradient}` 
                    : 'bg-muted/50 group-hover:bg-muted'
                }`}>
                  <div className={activeSection === item.id ? 'text-white' : ''}>
                    {item.icon}
                  </div>
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient}`}
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Status Indicator */}
      <StatusIndicator />
    </div>
  );
}