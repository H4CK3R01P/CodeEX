import { useState } from 'react';
import { Button } from './ui/button';
import { 
  LayoutDashboard,
  BookOpen, 
  Code2, 
  Trophy, 
  FileText,
  Award,
  Coins,
  Bell,
  ListChecks,
  Settings,
  LogOut,
  Sparkles,
  Zap,
  Flame
} from 'lucide-react';
import { UserData } from '../App';
import { DashboardHome } from './sections/DashboardHome';
import { Learn } from './sections/Learn';
import { Practice } from './sections/Practice';
import { Compete } from './sections/Compete';
import { Test } from './sections/Test';
import { Achieve } from './sections/Achieve';
import { CoinsSection } from './sections/CoinsSection';
import { ProblemsLibrary } from './sections/ProblemsLibrary';
import { getDomainConfig, getDomainTerminology } from '../utils/domainConfig';
import { motion, AnimatePresence } from 'motion/react';
import { StatusIndicator } from './StatusIndicator';

interface DashboardProps {
  userData: UserData;
}

type Section = 'dashboard' | 'learn' | 'practice' | 'problems' | 'compete' | 'test' | 'achieve' | 'coins';

export function Dashboard({ userData }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [userCoins, setUserCoins] = useState(250);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userStreak, setUserStreak] = useState(12);
  const [notifications, setNotifications] = useState(3);
  
  const config = getDomainConfig(userData.domain || '');
  const terminology = getDomainTerminology(userData.domain || '');
  const isCodingDomain = config.category === 'coding';

  const navItems = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, gradient: 'from-purple-500 to-pink-500' },
    { id: 'learn' as Section, label: 'Learn', icon: <BookOpen className="w-4 h-4" />, gradient: 'from-blue-500 to-cyan-500' },
    ...(isCodingDomain ? [
      { id: 'problems' as Section, label: 'Problems', icon: <ListChecks className="w-4 h-4" />, gradient: 'from-emerald-500 to-teal-500' }
    ] : []),
    { id: 'practice' as Section, label: 'Practice', icon: <Code2 className="w-4 h-4" />, gradient: 'from-orange-500 to-red-500' },
    { id: 'compete' as Section, label: 'Compete', icon: <Trophy className="w-4 h-4" />, gradient: 'from-yellow-500 to-amber-500' },
    { id: 'test' as Section, label: terminology.test + 's', icon: <FileText className="w-4 h-4" />, gradient: 'from-violet-500 to-purple-500' },
    { id: 'achieve' as Section, label: 'Achieve', icon: <Award className="w-4 h-4" />, gradient: 'from-pink-500 to-rose-500' },
    { id: 'coins' as Section, label: 'Coins', icon: <Coins className="w-4 h-4" />, gradient: 'from-amber-500 to-yellow-500' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome userData={userData} onNavigate={setActiveSection} />;
      case 'learn':
        return <Learn userData={userData} />;
      case 'problems':
        return <ProblemsLibrary userData={userData} />;
      case 'practice':
        return <Practice userData={userData} />;
      case 'compete':
        return <Compete userData={userData} />;
      case 'test':
        return <Test userData={userData} />;
      case 'achieve':
        return <Achieve userData={userData} />;
      case 'coins':
        return <CoinsSection coins={userCoins} />;
      default:
        return <DashboardHome userData={userData} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-20">
        {/* Top Bar with Logo and Actions */}
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
              <h1 className="text-lg gradient-text font-bold">EduMaster Pro</h1>
              <p className="text-xs text-muted-foreground">{config.name}</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2">
            {/* Streak Display */}
            <motion.div 
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 px-3 py-1.5 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">{userStreak} day streak</span>
            </motion.div>

            {/* Coins Display */}
            <motion.button
              onClick={() => setActiveSection('coins')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:from-amber-500/30 hover:to-yellow-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">{userCoins}</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </motion.button>

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
                  <div className="text-muted-foreground text-xs capitalize">{userData.profileType}</div>
                </div>
              </motion.button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-72 bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50 overflow-hidden"
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
                    <div className="p-3 space-y-1">
                      <div className="px-3 py-2 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Profile Type</div>
                        <div className="text-sm text-foreground capitalize font-medium">{userData.profileType}</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Domain</div>
                        <div className="text-sm text-foreground font-medium">{config.name}</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <div className="text-xs text-muted-foreground">Category</div>
                        <div className="text-sm text-foreground font-medium flex items-center gap-2">
                          {config.category === 'exam' ? '📚 Exam Preparation' : '💻 Coding Track'}
                        </div>
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
                {item.id === 'coins' && (
                  <span className="sm:hidden bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 rounded-lg text-xs font-medium">
                    {userCoins}
                  </span>
                )}
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
