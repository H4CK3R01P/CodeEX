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
  Calendar
} from 'lucide-react';
import { UserData } from '../../../App';

interface CareerRoadmapProps {
  userData: UserData;
}

export function CareerRoadmap({ userData }: CareerRoadmapProps) {
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
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Adjust Timeline
          </Button>
        </div>
      </motion.div>

      {/* Timeline Selector */}
      <div className="flex gap-2">
        {['3 Months', '6 Months', '12 Months'].map((timeline) => (
          <Button
            key={timeline}
            variant={timeline === '6 Months' ? 'default' : 'outline'}
            size="sm"
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
                    {phase.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                        <span className={milestone.completed ? 'text-muted-foreground line-through' : ''}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
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
                  <div className="text-5xl font-bold text-purple-400 mb-2">22%</div>
                  <p className="text-sm text-muted-foreground">Completion towards {userData.targetRole}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Milestones completed</span>
                    <span className="text-purple-400 font-medium">2 / 12</span>
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
              <Button size="sm" className="w-full">
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