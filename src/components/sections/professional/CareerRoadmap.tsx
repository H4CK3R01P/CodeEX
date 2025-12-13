import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  TrendingUp, 
  CheckCircle, 
  Circle, 
  Clock,
  ArrowRight,
  Star,
  Target,
  Calendar,
  Download
} from 'lucide-react';
import { UserData } from '../../../App';
import { toast } from 'sonner';

interface CareerRoadmapProps {
  userData: UserData;
}

export function CareerRoadmap({ userData }: CareerRoadmapProps) {
  const [selectedTimeline, setSelectedTimeline] = useState('6 Months');
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([
    'Master System Design Basics',
    'Complete AWS Cloud Practitioner'
  ]);

  const roadmapPhases = [
    {
      phase: 'Phase 1: Foundation',
      duration: '0-3 months',
      status: 'in-progress',
      progress: 65,
      milestones: [
        { title: 'Master System Design Basics', completed: true },
        { title: 'Complete AWS Cloud Practitioner', completed: true },
        { title: 'Build 2 Portfolio Projects', completed: false },
        { title: 'Leadership Training Course', completed: false }
      ]
    },
    {
      phase: 'Phase 2: Intermediate Skills',
      duration: '3-6 months',
      status: 'upcoming',
      progress: 0,
      milestones: [
        { title: 'Advanced System Design Patterns', completed: false },
        { title: 'Microservices Architecture', completed: false },
        { title: 'Team Lead Simulation Project', completed: false },
        { title: 'Industry Certification', completed: false }
      ]
    },
    {
      phase: 'Phase 3: Role Readiness',
      duration: '6-9 months',
      status: 'locked',
      progress: 0,
      milestones: [
        { title: 'Mock Interviews (Tech Lead)', completed: false },
        { title: 'Performance Optimization Mastery', completed: false },
        { title: 'Stakeholder Management', completed: false },
        { title: 'Final Assessment', completed: false }
      ]
    }
  ];

  const upcomingMilestones = [
    { title: 'Build Portfolio Project #2', deadline: 'In 5 days', priority: 'high' },
    { title: 'Leadership Training Module 3', deadline: 'In 12 days', priority: 'medium' },
    { title: 'System Design Practice', deadline: 'Weekly', priority: 'high' }
  ];

  const handleToggleMilestone = (title: string) => {
    if (completedMilestones.includes(title)) {
      setCompletedMilestones(completedMilestones.filter(m => m !== title));
      toast.info(`Milestone unmarked: ${title}`);
    } else {
      setCompletedMilestones([...completedMilestones, title]);
      toast.success(`Milestone completed: ${title}! 🎉`);
    }
  };

  const handleAdjustTimeline = () => {
    toast.success('Timeline adjustment saved!', {
      description: 'Your roadmap has been updated based on your pace.'
    });
  };

  const handleDownloadRoadmap = () => {
    toast.success('Downloading your personalized roadmap...', {
      description: 'PDF will be ready in a moment.'
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
            <h1 className="text-3xl font-bold gradient-text">Career Roadmap</h1>
            <p className="text-muted-foreground mt-1">
              Your personalized path from {userData.currentRole} to {userData.targetRole}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleDownloadRoadmap}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleAdjustTimeline}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Adjust Timeline
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Timeline Selector */}
      <div className="flex gap-2">
        {['3 Months', '6 Months', '12 Months'].map((timeline) => (
          <Button
            key={timeline}
            variant={timeline === selectedTimeline ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectedTimeline(timeline);
              toast.info(`Timeline adjusted to ${timeline}`);
            }}
          >
            {timeline}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          {roadmapPhases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={phase.status === 'locked' ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {phase.status === 'in-progress' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                      )}
                      {phase.status === 'upcoming' && (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      {phase.status === 'locked' && (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{phase.phase}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {phase.duration}
                        </p>
                      </div>
                    </div>
                    <Badge variant={phase.status === 'in-progress' ? 'default' : 'secondary'}>
                      {phase.status === 'in-progress' ? `${phase.progress}%` : phase.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phase.milestones.map((milestone, idx) => {
                      const isCompleted = completedMilestones.includes(milestone.title);
                      return (
                        <button
                          key={idx}
                          onClick={() => phase.status !== 'locked' && handleToggleMilestone(milestone.title)}
                          disabled={phase.status === 'locked'}
                          className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={isCompleted ? 'text-muted-foreground line-through' : ''}>
                            {milestone.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-400 mb-2">{Math.round((completedMilestones.length / 12) * 100)}%</div>
                  <p className="text-sm text-muted-foreground">Completion towards {userData.targetRole}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Milestones completed</span>
                    <span className="text-purple-400 font-medium">{completedMilestones.length} / 12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated time remaining</span>
                    <span className="text-purple-400 font-medium">7 months</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-400" />
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMilestones.map((milestone, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium">{milestone.title}</span>
                    <Badge 
                      variant="outline"
                      className={milestone.priority === 'high' ? 'border-red-500/30 text-red-400' : 'border-orange-500/30 text-orange-400'}
                    >
                      {milestone.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.deadline}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Smart Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your progress, we recommend focusing on system design this week to stay on track.
              </p>
              <Button size="sm" className="w-full" onClick={() => toast.info('Viewing personalized recommendations...')}>
                View Recommendation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}