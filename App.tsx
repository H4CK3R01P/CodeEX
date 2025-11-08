import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { OTPVerification } from './components/OTPVerification';
import { ProfileSelection } from './components/ProfileSelection';
import { DomainSelection } from './components/DomainSelection';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

export type OnboardingStep = 'login' | 'otp' | 'profile' | 'domain' | 'dashboard';
export type ProfileType = 'student' | 'professional' | 'industry';

export interface UserData {
  name: string;
  contact: string;
  profileType?: ProfileType;
  domain?: string;
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
    setCurrentStep('domain');
  };

  const handleDomainSelect = (domain: string) => {
    setUserData({ ...userData, domain });
    setCurrentStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep === 'login' && (
        <LoginForm onSubmit={handleLoginSubmit} />
      )}
      {currentStep === 'otp' && (
        <OTPVerification 
          contact={userData.contact} 
          onVerified={handleOTPVerified}
          onBack={() => setCurrentStep('login')}
        />
      )}
      {currentStep === 'profile' && (
        <ProfileSelection 
          onSelect={handleProfileSelect}
          userName={userData.name}
        />
      )}
      {currentStep === 'domain' && (
        <DomainSelection 
          profileType={userData.profileType!}
          onSelect={handleDomainSelect}
          onBack={() => setCurrentStep('profile')}
        />
      )}
      {currentStep === 'dashboard' && (
        <Dashboard userData={userData} />
      )}
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
