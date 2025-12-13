import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Landmark,
  Factory,
  ShoppingBag,
  Globe,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export type IndustryType = 
  | 'tech-company'
  | 'consulting'
  | 'educational'
  | 'healthcare'
  | 'financial'
  | 'manufacturing'
  | 'retail'
  | 'government';

interface IndustryTypeSelectionProps {
  onSelect: (type: IndustryType) => void;
  onBack: () => void;
  organizationName: string;
}

interface IndustryOption {
  type: IndustryType;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  features: string[];
}

export function IndustryTypeSelection({ onSelect, onBack, organizationName }: IndustryTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<IndustryType | null>(null);

  const industryTypes: IndustryOption[] = [
    {
      type: 'tech-company',
      icon: <Building2 className="w-12 h-12" />,
      title: 'Tech Company',
      description: 'Software development, IT services, tech products',
      color: 'from-blue-500 to-cyan-500',
      features: ['Coding Assessments', 'System Design', 'Tech Interviews', 'Developer Training']
    },
    {
      type: 'consulting',
      icon: <Briefcase className="w-12 h-12" />,
      title: 'Consulting Firm',
      description: 'Business consulting, strategy, advisory services',
      color: 'from-purple-500 to-pink-500',
      features: ['Case Studies', 'Aptitude Tests', 'Client Management', 'Project Assessment']
    },
    {
      type: 'educational',
      icon: <GraduationCap className="w-12 h-12" />,
      title: 'Educational Institution',
      description: 'Universities, colleges, training centers',
      color: 'from-green-500 to-emerald-500',
      features: ['Student Assessment', 'Course Management', 'Learning Paths', 'Certifications']
    },
    {
      type: 'healthcare',
      icon: <Heart className="w-12 h-12" />,
      title: 'Healthcare Organization',
      description: 'Hospitals, clinics, health services',
      color: 'from-red-500 to-orange-500',
      features: ['Medical Certifications', 'Compliance Training', 'Staff Assessment', 'Safety Protocols']
    },
    {
      type: 'financial',
      icon: <Landmark className="w-12 h-12" />,
      title: 'Financial Services',
      description: 'Banks, insurance, fintech, investment firms',
      color: 'from-yellow-500 to-amber-500',
      features: ['Compliance Tests', 'Risk Assessment', 'Financial Analysis', 'Regulatory Training']
    },
    {
      type: 'manufacturing',
      icon: <Factory className="w-12 h-12" />,
      title: 'Manufacturing',
      description: 'Production, industrial, supply chain',
      color: 'from-gray-500 to-slate-500',
      features: ['Safety Training', 'Quality Control', 'Operations Assessment', 'Technical Skills']
    },
    {
      type: 'retail',
      icon: <ShoppingBag className="w-12 h-12" />,
      title: 'Retail & E-commerce',
      description: 'Stores, online retail, customer service',
      color: 'from-pink-500 to-rose-500',
      features: ['Customer Service', 'Sales Training', 'Product Knowledge', 'Team Assessment']
    },
    {
      type: 'government',
      icon: <Globe className="w-12 h-12" />,
      title: 'Government / Public Sector',
      description: 'Public administration, civic services',
      color: 'from-indigo-500 to-violet-500',
      features: ['Civil Service Exams', 'Compliance Training', 'Public Policy', 'Service Assessment']
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
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
          <h1 className="text-4xl font-bold mb-2">Select Your Industry Type</h1>
          <p className="text-muted-foreground text-lg">
            Choose the industry that best describes <span className="text-primary font-semibold">{organizationName}</span>
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            This will customize your workspace with relevant features and tools
          </p>
        </div>

        {/* Industry Types Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {industryTypes.map((industry) => (
            <Card
              key={industry.type}
              className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                selectedType === industry.type
                  ? 'border-2 border-primary shadow-2xl ring-4 ring-primary/20 scale-105'
                  : 'border-2 border-transparent hover:border-border'
              }`}
              onClick={() => setSelectedType(industry.type)}
            >
              <CardContent className="p-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${industry.color} flex items-center justify-center text-white`}>
                  {industry.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-center">{industry.title}</h3>
                <p className="text-muted-foreground text-sm text-center mb-4">
                  {industry.description}
                </p>
                <div className="space-y-1">
                  {industry.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Industry Details */}
        {selectedType && (
          <Card className="bg-accent/10 border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Selected: {industryTypes.find(i => i.type === selectedType)?.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    Your workspace will include features optimized for {industryTypes.find(i => i.type === selectedType)?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {industryTypes.find(i => i.type === selectedType)?.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue to Workspace
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedType && (
          <div className="text-center text-muted-foreground">
            Select an industry type to continue
          </div>
        )}
      </div>
    </div>
  );
}
