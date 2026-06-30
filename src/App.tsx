import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { OTPVerification } from './components/OTPVerification';
import { ProfileSelection } from './components/ProfileSelection';
import { DomainSelection } from './components/DomainSelection';
import { IndustryTypeSelection, IndustryType } from './components/IndustryTypeSelection';
import { ProfessionalDomainSelection, ProfessionalDomain } from './components/ProfessionalDomainSelection';
import { ProfessionalRoleSelection } from './components/ProfessionalRoleSelection';
import { Dashboard } from './components/Dashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { StatusIndicator } from './components/StatusIndicator';
import { PracticeIDE } from './components/ide/PracticeIDE';
import { motion, AnimatePresence } from 'motion/react';

export type OnboardingStep = 'login' | 'otp' | 'profile' | 'domain' | 'industry-type' | 'professional-domain' | 'professional-role' | 'dashboard' | 'practice-ide';
export type ProfileType = 'student' | 'professional' | 'industry';

export interface UserData {
  name: string;
  contact: string;
  profileType?: ProfileType;
  domain?: string;
  industryType?: IndustryType;
  // Professional-specific fields
  professionalDomain?: ProfessionalDomain;
  currentRole?: string;
  targetRole?: string;
}

function AppContent() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('login');
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    contact: '',
  });

  const handleLoginSubmit = (name: string, contact: string) => {
    setUserData({ ...userData, name, contact });
    setCurrentStep('otp');
  };

  const handleOTPVerified = () => {
    setCurrentStep('profile');
  };

  const handleProfileSelect = (profileType: ProfileType) => {
    setUserData({ ...userData, profileType });
    // Route based on profile type
    if (profileType === 'industry') {
      setCurrentStep('industry-type');
    } else if (profileType === 'professional') {
      setCurrentStep('professional-domain');
    } else {
      // Student goes to regular domain selection
      setCurrentStep('domain');
    }
  };

  const handleDomainSelect = (domain: string) => {
    setUserData({ ...userData, domain });
    setCurrentStep('dashboard');
  };

  const handleIndustryTypeSelect = (industryType: IndustryType) => {
    setUserData({ ...userData, industryType });
    setCurrentStep('dashboard');
  };

  const handleProfessionalDomainSelect = (professionalDomain: ProfessionalDomain) => {
    setUserData({ ...userData, professionalDomain });
    setCurrentStep('professional-role');
  };

  const handleProfessionalRoleSelect = (currentRole: string, targetRole: string) => {
    setUserData({ ...userData, currentRole, targetRole });
    setCurrentStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentStep === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm onSubmit={handleLoginSubmit} />
          </motion.div>
        )}
        {currentStep === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <OTPVerification 
              contact={userData.contact} 
              onVerified={handleOTPVerified}
              onBack={() => setCurrentStep('login')}
            />
          </motion.div>
        )}
        {currentStep === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileSelection 
              onSelect={handleProfileSelect}
              userName={userData.name}
            />
          </motion.div>
        )}
        {currentStep === 'domain' && (
          <motion.div
            key="domain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DomainSelection 
              profileType={userData.profileType!}
              onSelect={handleDomainSelect}
              onBack={() => setCurrentStep('profile')}
            />
          </motion.div>
        )}
        {currentStep === 'industry-type' && (
          <motion.div
            key="industry-type"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <IndustryTypeSelection 
              onSelect={handleIndustryTypeSelect}
              onBack={() => setCurrentStep('profile')}
              organizationName={userData.name}
            />
          </motion.div>
        )}
        {currentStep === 'professional-domain' && (
          <motion.div
            key="professional-domain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfessionalDomainSelection 
              onSelect={handleProfessionalDomainSelect}
              onBack={() => setCurrentStep('profile')}
              userName={userData.name}
            />
          </motion.div>
        )}
        {currentStep === 'professional-role' && (
          <motion.div
            key="professional-role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfessionalRoleSelection 
              onSelect={handleProfessionalRoleSelect}
              onBack={() => setCurrentStep('professional-domain')}
              userName={userData.name}
            />
          </motion.div>
        )}
        {currentStep === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData.profileType === 'industry' ? (
              <IndustryDashboard userData={userData} />
            ) : userData.profileType === 'professional' ? (
              <ProfessionalDashboard userData={userData} />
            ) : (
              <Dashboard 
                userData={userData} 
                onStartPractice={(problemId) => {
                  setSelectedProblemId(problemId);
                  setCurrentStep('practice-ide');
                }} 
              />
            )}
          </motion.div>
        )}
        {currentStep === 'practice-ide' && (
          <motion.div
            key="practice-ide"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <PracticeIDE 
              problemId={selectedProblemId} 
              onBack={() => setCurrentStep('dashboard')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        expand={false}
        duration={3000}
      />
      
      {/* Status Indicator */}
      <StatusIndicator />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}