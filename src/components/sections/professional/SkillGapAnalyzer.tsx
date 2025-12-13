import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Users,
  Zap,
  Filter,
  Download
} from 'lucide-react';
import { UserData } from '../../../App';
import { toast } from 'sonner';

interface SkillGapAnalyzerProps {
  userData: UserData;
}

export function SkillGapAnalyzer({ userData }: SkillGapAnalyzerProps) {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Mock skill data based on domain
  const skillGaps = [
    {
      skill: 'System Design',
      currentLevel: 45,
      requiredLevel: 85,
      priority: 'high',
      timeToLearn: '2-3 months',
      industryDemand: 92
    },
    {
      skill: 'Cloud Architecture (AWS/Azure)',
      currentLevel: 30,
      requiredLevel: 75,
      priority: 'high',
      timeToLearn: '3-4 months',
      industryDemand: 88
    },
    {
      skill: 'Microservices',
      currentLevel: 55,
      requiredLevel: 80,
      priority: 'medium',
      timeToLearn: '1-2 months',
      industryDemand: 85
    },
    {
      skill: 'Leadership & Team Management',
      currentLevel: 40,
      requiredLevel: 90,
      priority: 'high',
      timeToLearn: '4-6 months',
      industryDemand: 95
    },
    {
      skill: 'Performance Optimization',
      currentLevel: 65,
      requiredLevel: 85,
      priority: 'medium',
      timeToLearn: '1 month',
      industryDemand: 78
    }
  ];

  const strengthAreas = [
    { skill: 'Problem Solving', level: 88 },
    { skill: 'Code Quality', level: 85 },
    { skill: 'Communication', level: 82 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredSkills = filterPriority === 'all' 
    ? skillGaps 
    : skillGaps.filter(skill => skill.priority === filterPriority);

  const handleStartLearning = (skillName: string) => {
    toast.success(`Starting learning path for ${skillName}!`, {
      description: 'We\'ll create a personalized plan for you.'
    });
    setSelectedSkills([...selectedSkills, skillName]);
  };

  const handleGenerateReport = () => {
    toast.success('Generating detailed skill gap report...', {
      description: 'You\'ll receive it via email in 2-3 minutes.'
    });
  };

  const handleViewRoadmap = () => {
    toast.info('Navigating to Career Roadmap...', {
      description: 'Check your personalized learning path.'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Skill Gap Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Bridge the gap between {userData.currentRole} and {userData.targetRole}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => handleGenerateReport()}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => handleGenerateReport()}
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by priority:</span>
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <Button
              key={priority}
              size="sm"
              variant={filterPriority === priority ? 'default' : 'outline'}
              onClick={() => setFilterPriority(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Gaps</p>
                  <h3 className="text-3xl font-bold text-red-400 mt-1">3</h3>
                  <p className="text-xs text-muted-foreground mt-1">High priority skills</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Est. Time to Ready</p>
                  <h3 className="text-3xl font-bold text-blue-400 mt-1">6-8</h3>
                  <p className="text-xs text-muted-foreground mt-1">Months with focus</p>
                </div>
                <Target className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Role Readiness</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">62%</h3>
                  <p className="text-xs text-muted-foreground mt-1">Based on peer data</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Gaps - Priority Ordered */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                Skills to Develop (Priority Order)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSkills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No skills match the selected filter
                </div>
              )}
              {filteredSkills.map((gap, index) => (
                <motion.div
                  key={gap.skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{gap.skill}</h4>
                        <Badge className={getPriorityColor(gap.priority)}>
                          {gap.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⏱️ {gap.timeToLearn}</span>
                        <span>📊 Industry demand: {gap.industryDemand}%</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={selectedSkills.includes(gap.skill) ? 'default' : 'outline'}
                      onClick={() => handleStartLearning(gap.skill)}
                      disabled={selectedSkills.includes(gap.skill)}
                    >
                      {selectedSkills.includes(gap.skill) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Added
                        </>
                      ) : (
                        'Start Learning'
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current</span>
                      <span className="text-muted-foreground">Target for {userData.targetRole}</span>
                    </div>
                    <div className="relative">
                      <Progress value={gap.requiredLevel} className="h-2 bg-gray-800" />
                      <Progress 
                        value={gap.currentLevel} 
                        className="h-2 absolute top-0 left-0" 
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{gap.currentLevel}%</span>
                      <span className="text-red-400">Gap: {gap.requiredLevel - gap.currentLevel}%</span>
                      <span>{gap.requiredLevel}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {strengthAreas.map((strength, index) => (
                <motion.div
                  key={strength.skill}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{strength.skill}</span>
                    <span className="text-green-400">{strength.level}%</span>
                  </div>
                  <Progress value={strength.level} className="h-2" />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Peer Comparison */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Peer Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Your Position</p>
                  <div className="flex items-center gap-2">
                    <Progress value={68} className="flex-1 h-3" />
                    <span className="text-purple-400 font-semibold">68%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Top 32% of professionals transitioning to {userData.targetRole}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Comparison
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-2">Ready to Bridge the Gap?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get a personalized learning plan to achieve {userData.targetRole}
              </p>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                View Roadmap
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}