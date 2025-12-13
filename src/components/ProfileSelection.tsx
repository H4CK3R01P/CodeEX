import { Card, CardContent } from './ui/card';
import { GraduationCap, Briefcase, Building2 } from 'lucide-react';
import { ProfileType } from '../App';

interface ProfileSelectionProps {
  onSelect: (profileType: ProfileType) => void;
  userName: string;
}

interface ProfileOption {
  type: ProfileType;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function ProfileSelection({ onSelect, userName }: ProfileSelectionProps) {
  const profiles: ProfileOption[] = [
    {
      type: 'student',
      icon: <GraduationCap className="w-12 h-12" />,
      title: 'Student',
      description: 'Preparing for competitive exams and building skills',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'professional',
      icon: <Briefcase className="w-12 h-12" />,
      title: 'Working Professional',
      description: 'Upskilling and advancing your career',
      color: 'from-purple-500 to-pink-500',
    },
    {
      type: 'industry',
      icon: <Building2 className="w-12 h-12" />,
      title: 'Industry/Organization',
      description: 'Train your team and assess candidates',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-indigo-900 mb-2">Welcome, {userName}! 👋</h1>
          <p className="text-gray-600">Tell us about yourself to personalize your experience</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card
              key={profile.type}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-indigo-300 group"
              onClick={() => onSelect(profile.type)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {profile.icon}
                </div>
                <h3 className="text-gray-900 mb-2">{profile.title}</h3>
                <p className="text-gray-600 text-sm">{profile.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't worry, you can change this later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
