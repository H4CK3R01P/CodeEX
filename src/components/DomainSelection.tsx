import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Code2, 
  Layout, 
  Database, 
  Smartphone, 
  BookOpen, 
  FlaskConical, 
  Landmark, 
  Briefcase,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { ProfileType } from '../App';

interface DomainSelectionProps {
  profileType: ProfileType;
  onSelect: (domain: string) => void;
  onBack: () => void;
}

interface Domain {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'coding' | 'exam';
  color: string;
  description: string;
}

export function DomainSelection({ profileType, onSelect, onBack }: DomainSelectionProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const codingDomains: Domain[] = [
    {
      id: 'competitive-programming',
      name: 'Competitive Programming',
      icon: <Code2 className="w-6 h-6" />,
      category: 'coding',
      color: 'bg-blue-500',
      description: 'DSA, Algorithms, Problem Solving',
    },
    {
      id: 'frontend',
      name: 'Frontend Development',
      icon: <Layout className="w-6 h-6" />,
      category: 'coding',
      color: 'bg-purple-500',
      description: 'React, CSS, JavaScript',
    },
    {
      id: 'backend',
      name: 'Backend Development',
      icon: <Database className="w-6 h-6" />,
      category: 'coding',
      color: 'bg-green-500',
      description: 'APIs, Databases, System Design',
    },
    {
      id: 'mobile-dev',
      name: 'Mobile Development',
      icon: <Smartphone className="w-6 h-6" />,
      category: 'coding',
      color: 'bg-pink-500',
      description: 'iOS, Android, React Native',
    },
  ];

  const examDomains: Domain[] = [
    {
      id: 'jee',
      name: 'JEE (Main & Advanced)',
      icon: <FlaskConical className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-orange-500',
      description: 'Engineering Entrance Exam',
    },
    {
      id: 'neet',
      name: 'NEET',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-red-500',
      description: 'Medical Entrance Exam',
    },
    {
      id: 'gaokao',
      name: 'Gaokao',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-yellow-600',
      description: 'China National College Entrance',
    },
    {
      id: 'upsc',
      name: 'UPSC',
      icon: <Landmark className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-indigo-600',
      description: 'Civil Services Examination',
    },
    {
      id: 'mpsc',
      name: 'MPSC',
      icon: <Landmark className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-teal-600',
      description: 'Maharashtra Public Service',
    },
    {
      id: 'gate',
      name: 'GATE',
      icon: <FlaskConical className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-cyan-600',
      description: 'Graduate Aptitude Test',
    },
    {
      id: 'cat',
      name: 'CAT',
      icon: <Briefcase className="w-6 h-6" />,
      category: 'exam',
      color: 'bg-violet-600',
      description: 'Common Admission Test',
    },
  ];

  const allDomains = [...codingDomains, ...examDomains];

  const toggleDomain = (domainId: string) => {
    setSelectedDomain(domainId);
  };

  const handleContinue = () => {
    if (selectedDomain) {
      onSelect(selectedDomain);
    }
  };

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

        <div className="mb-8">
          <h1 className="text-indigo-900 mb-2">Choose Your Domain</h1>
          <p className="text-gray-600">Select the area you want to focus on</p>
          {selectedDomain && (
            <Badge variant="secondary" className="mt-2">
              1 selected
            </Badge>
          )}
        </div>

        <div className="space-y-8">
          {/* Coding Domains */}
          <div>
            <h2 className="text-gray-900 mb-4 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-600" />
              Software Development & Coding
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {codingDomains.map((domain) => (
                <Card
                  key={domain.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedDomain === domain.id
                      ? 'border-2 border-indigo-500 shadow-lg'
                      : 'border-2 border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => toggleDomain(domain.id)}
                >
                  <CardContent className="p-4">
                    <div className={`${domain.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3`}>
                      {domain.icon}
                    </div>
                    <h3 className="text-gray-900 text-sm mb-1">{domain.name}</h3>
                    <p className="text-gray-600 text-xs">{domain.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Competitive Exams */}
          <div>
            <h2 className="text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Competitive Examinations
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {examDomains.map((domain) => (
                <Card
                  key={domain.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedDomain === domain.id
                      ? 'border-2 border-indigo-500 shadow-lg'
                      : 'border-2 border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => toggleDomain(domain.id)}
                >
                  <CardContent className="p-4">
                    <div className={`${domain.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3`}>
                      {domain.icon}
                    </div>
                    <h3 className="text-gray-900 text-sm mb-1">{domain.name}</h3>
                    <p className="text-gray-600 text-xs">{domain.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedDomain}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            Continue
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}