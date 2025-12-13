import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Code, 
  TrendingUp, 
  Database, 
  Briefcase, 
  Users,
  Settings,
  Target,
  Shield,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export type ProfessionalDomain = 
  | 'software-it'
  | 'banking-finance'
  | 'data-analytics'
  | 'product-management'
  | 'consulting'
  | 'operations'
  | 'marketing-growth'
  | 'cybersecurity-cloud';

interface ProfessionalDomainSelectionProps {
  onSelect: (domain: ProfessionalDomain) => void;
  onBack: () => void;
  userName: string;
}

interface DomainOption {
  domain: ProfessionalDomain;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  roles: string[];
}

export function ProfessionalDomainSelection({ onSelect, onBack, userName }: ProfessionalDomainSelectionProps) {
  const [selectedDomain, setSelectedDomain] = useState<ProfessionalDomain | null>(null);

  const domains: DomainOption[] = [
    {
      domain: 'software-it',
      icon: <Code className="w-12 h-12" />,
      title: 'Software / IT',
      description: 'Software Development, Engineering, Tech Leadership',
      color: 'from-blue-500 to-cyan-500',
      roles: ['Software Engineer', 'Tech Lead', 'Engineering Manager', 'Architect']
    },
    {
      domain: 'banking-finance',
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Banking & Finance',
      description: 'Investment Banking, Financial Analysis, Risk Management',
      color: 'from-green-500 to-emerald-500',
      roles: ['Financial Analyst', 'Investment Banker', 'Risk Manager', 'Portfolio Manager']
    },
    {
      domain: 'data-analytics',
      icon: <Database className="w-12 h-12" />,
      title: 'Data & Analytics',
      description: 'Data Science, Business Intelligence, Analytics',
      color: 'from-purple-500 to-pink-500',
      roles: ['Data Analyst', 'Data Scientist', 'ML Engineer', 'Analytics Lead']
    },
    {
      domain: 'product-management',
      icon: <Briefcase className="w-12 h-12" />,
      title: 'Product Management',
      description: 'Product Strategy, Roadmap Planning, User Research',
      color: 'from-orange-500 to-red-500',
      roles: ['Product Analyst', 'Product Manager', 'Senior PM', 'Product Lead']
    },
    {
      domain: 'consulting',
      icon: <Users className="w-12 h-12" />,
      title: 'Consulting',
      description: 'Strategy Consulting, Management Advisory, Business Solutions',
      color: 'from-indigo-500 to-violet-500',
      roles: ['Business Analyst', 'Consultant', 'Senior Consultant', 'Partner']
    },
    {
      domain: 'operations',
      icon: <Settings className="w-12 h-12" />,
      title: 'Operations',
      description: 'Operations Management, Process Optimization, Supply Chain',
      color: 'from-gray-500 to-slate-500',
      roles: ['Operations Analyst', 'Operations Manager', 'Head of Operations', 'COO']
    },
    {
      domain: 'marketing-growth',
      icon: <Target className="w-12 h-12" />,
      title: 'Marketing / Growth',
      description: 'Digital Marketing, Growth Strategy, Brand Management',
      color: 'from-pink-500 to-rose-500',
      roles: ['Marketing Analyst', 'Growth Manager', 'Marketing Lead', 'CMO']
    },
    {
      domain: 'cybersecurity-cloud',
      icon: <Shield className="w-12 h-12" />,
      title: 'Cybersecurity / Cloud',
      description: 'Security Engineering, Cloud Architecture, DevSecOps',
      color: 'from-red-500 to-orange-500',
      roles: ['Security Analyst', 'Cloud Engineer', 'Security Architect', 'CISO']
    },
  ];

  const handleContinue = () => {
    if (selectedDomain) {
      onSelect(selectedDomain);
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Choose Your Primary Domain</h1>
          <p className="text-muted-foreground text-lg">
            Select the industry domain where you want to advance your career
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            This will customize your learning path, skill gaps, and career roadmap
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {domains.map((domainOption) => (
            <Card
              key={domainOption.domain}
              className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                selectedDomain === domainOption.domain
                  ? 'border-2 border-primary shadow-2xl ring-4 ring-primary/20 scale-105'
                  : 'border-2 border-transparent hover:border-border'
              }`}
              onClick={() => setSelectedDomain(domainOption.domain)}
            >
              <CardContent className="p-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${domainOption.color} flex items-center justify-center text-white`}>
                  {domainOption.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-center">{domainOption.title}</h3>
                <p className="text-muted-foreground text-sm text-center mb-4">
                  {domainOption.description}
                </p>
                <div className="space-y-1">
                  {domainOption.roles.slice(0, 3).map((role, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary"></div>
                      {role}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Domain Details */}
        {selectedDomain && (
          <Card className="bg-accent/10 border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Selected: {domains.find(d => d.domain === selectedDomain)?.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    You'll get domain-specific skill gaps, career roadmaps, and interview prep for {domains.find(d => d.domain === selectedDomain)?.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {domains.find(d => d.domain === selectedDomain)?.roles.map((role, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue to Role Selection
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedDomain && (
          <div className="text-center text-muted-foreground">
            Select your primary domain to continue
          </div>
        )}
      </div>
    </div>
  );
}
