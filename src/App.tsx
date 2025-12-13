import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { OTPVerification } from './components/OTPVerification';
import { ProfileSelection } from './components/ProfileSelection';
import { DomainSelection } from './components/DomainSelection';
import { IndustryTypeSelection, IndustryType } from './components/IndustryTypeSelection';
import { Dashboard } from './components/Dashboard';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { StatusIndicator } from './components/StatusIndicator';
import { motion, AnimatePresence } from 'motion/react';

export type OnboardingStep = 'login' | 'otp' | 'profile' | 'domain' | 'industry-type' | 'dashboard';
export type ProfileType = 'student' | 'professional' | 'industry';

export interface UserData {
  name: string;
  contact: string;
  profileType?: ProfileType;
  domain?: string;
  industryType?: IndustryType;
}

function AppContent() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('login');
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
    // Industry users go to industry type selection, others go to domain selection
    if (profileType === 'industry') {
      setCurrentStep('industry-type');
    } else {
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
        {currentStep === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData.profileType === 'industry' ? (
              <IndustryDashboard userData={userData} />
            ) : (
              <Dashboard userData={userData} />
            )}
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