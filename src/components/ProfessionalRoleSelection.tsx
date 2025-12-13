import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Target
} from 'lucide-react';

interface ProfessionalRoleSelectionProps {
  onSelect: (currentRole: string, targetRole: string) => void;
  onBack: () => void;
  userName: string;
}

export function ProfessionalRoleSelection({ onSelect, onBack, userName }: ProfessionalRoleSelectionProps) {
  const [currentRole, setCurrentRole] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');

  // Comprehensive role list across all domains
  const roles = {
    'Fresher / Entry Level': [
      'Fresher - Software/IT',
      'Fresher - Banking/Finance',
      'Fresher - Data/Analytics',
      'Fresher - Product Management',
      'Fresher - Consulting',
      'Fresher - Operations',
      'Fresher - Marketing/Growth',
      'Fresher - Cybersecurity/Cloud'
    ],
    'Software / IT': [
      'Junior Software Engineer',
      'Software Engineer',
      'Senior Software Engineer',
      'Tech Lead',
      'Engineering Manager',
      'Senior Engineering Manager',
      'Director of Engineering',
      'VP Engineering',
      'CTO'
    ],
    'Banking & Finance': [
      'Financial Analyst',
      'Senior Financial Analyst',
      'Associate - Investment Banking',
      'VP - Investment Banking',
      'Director - Investment Banking',
      'Risk Manager',
      'Portfolio Manager',
      'Managing Director',
      'CFO'
    ],
    'Data & Analytics': [
      'Data Analyst',
      'Senior Data Analyst',
      'Data Scientist',
      'Senior Data Scientist',
      'ML Engineer',
      'Lead Data Scientist',
      'Head of Data',
      'Director of Analytics',
      'Chief Data Officer'
    ],
    'Product Management': [
      'Associate Product Manager',
      'Product Manager',
      'Senior Product Manager',
      'Lead Product Manager',
      'Director of Product',
      'VP Product',
      'Chief Product Officer'
    ],
    'Consulting': [
      'Business Analyst',
      'Associate Consultant',
      'Consultant',
      'Senior Consultant',
      'Manager',
      'Senior Manager',
      'Principal',
      'Partner'
    ],
    'Operations': [
      'Operations Analyst',
      'Operations Manager',
      'Senior Operations Manager',
      'Head of Operations',
      'Director of Operations',
      'VP Operations',
      'COO'
    ],
    'Marketing / Growth': [
      'Marketing Analyst',
      'Marketing Manager',
      'Senior Marketing Manager',
      'Growth Manager',
      'Head of Marketing',
      'Director of Marketing',
      'VP Marketing',
      'CMO'
    ],
    'Cybersecurity / Cloud': [
      'Security Analyst',
      'Cloud Engineer',
      'Security Engineer',
      'Senior Security Engineer',
      'Cloud Architect',
      'Security Architect',
      'Director of Security',
      'CISO'
    ]
  };

  const allRoles = Object.values(roles).flat();

  const handleContinue = () => {
    if (currentRole && targetRole) {
      onSelect(currentRole, targetRole);
    }
  };

  const getRecommendedTargets = () => {
    if (!currentRole) return [];
    
    // Find domain of current role
    for (const [domain, rolesList] of Object.entries(roles)) {
      const currentIndex = rolesList.indexOf(currentRole);
      if (currentIndex !== -1) {
        // Return next 2-3 roles in progression
        return rolesList.slice(currentIndex + 1, currentIndex + 4);
      }
    }
    return [];
  };

  const recommendedTargets = getRecommendedTargets();

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Define Your Career Path</h1>
          <p className="text-muted-foreground text-lg">
            Where are you now, and where do you want to be?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Role Selection */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Current Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select your current role</option>
                {Object.entries(roles).map(([domain, rolesList]) => (
                  <optgroup key={domain} label={domain}>
                    {rolesList.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              
              {currentRole && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400">✓ Selected: <span className="font-semibold">{currentRole}</span></p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Role Selection */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-purple-400" />
                Target Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!currentRole}
              >
                <option value="">Select your target role</option>
                {Object.entries(roles).map(([domain, rolesList]) => (
                  <optgroup key={domain} label={domain}>
                    {rolesList.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              
              {targetRole && (
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-purple-400">✓ Target: <span className="font-semibold">{targetRole}</span></p>
                </div>
              )}

              {!currentRole && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-400">⚠ Please select your current role first</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Career Paths */}
        {recommendedTargets.length > 0 && !targetRole && (
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Based on your current role, here are typical career progressions:</p>
              <div className="flex flex-wrap gap-3">
                {recommendedTargets.map(role => (
                  <Badge
                    key={role}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 text-purple-300 cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
                    onClick={() => setTargetRole(role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Path Preview */}
        {currentRole && targetRole && (
          <Card className="bg-accent/10 border-primary/50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4">Your Career Path</h3>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-400">Current</p>
                      <p className="font-semibold text-white">{currentRole}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                    <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                      <p className="text-sm text-purple-400">Target</p>
                      <p className="font-semibold text-white">{targetRole}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    We'll create a personalized roadmap with skill gaps, practice tasks, and interview prep to help you reach this goal.
                  </p>
                </div>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Start Your Journey
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!currentRole && (
          <div className="text-center text-muted-foreground">
            Select your current role to begin
          </div>
        )}
      </div>
    </div>
  );
}
