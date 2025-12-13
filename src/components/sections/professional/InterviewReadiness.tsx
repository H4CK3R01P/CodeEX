import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Award,
  Play,
  Clock,
  CheckCircle,
  TrendingUp,
  Target,
  Video,
  MessageSquare
} from 'lucide-react';
import { UserData } from '../../../App';

interface InterviewReadinessProps {
  userData: UserData;
}

export function InterviewReadiness({ userData }: InterviewReadinessProps) {
  const interviewTypes = [
    {
      type: 'Technical Interview',
      readiness: 75,
      completed: 12,
      total: 20,
      topics: ['System Design', 'Coding', 'Architecture'],
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'
    },
    {
      type: 'Behavioral Interview',
      readiness: 68,
      completed: 8,
      total: 15,
      topics: ['Leadership', 'Teamwork', 'Conflict Resolution'],
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30'
    },
    {
      type: 'Case Study',
      readiness: 55,
      completed: 4,
      total: 10,
      topics: ['Problem Solving', 'Analysis', 'Presentation'],
      color: 'from-orange-500/10 to-red-500/10 border-orange-500/30'
    }
  ];

  const mockInterviews = [
    {
      title: 'Tech Lead - System Design',
      duration: '60 min',
      difficulty: 'Advanced',
      topics: ['Distributed Systems', 'Scalability', 'Trade-offs'],
      participants: 1,
      type: 'AI Interviewer'
    },
    {
      title: 'Senior Engineer - Coding',
      duration: '45 min',
      difficulty: 'Intermediate',
      topics: ['Algorithms', 'Data Structures', 'Optimization'],
      participants: 1,
      type: 'AI Interviewer'
    },
    {
      title: 'Leadership Behavioral',
      duration: '30 min',
      difficulty: 'Intermediate',
      topics: ['Team Management', 'Conflict', 'Mentoring'],
      participants: 1,
      type: 'AI Interviewer'
    }
  ];

  const recentPractice = [
    { date: '2 days ago', type: 'System Design', score: 82, feedback: 'Good scalability discussion' },
    { date: '5 days ago', type: 'Behavioral', score: 75, feedback: 'Add more specific examples' },
    { date: '1 week ago', type: 'Technical', score: 88, feedback: 'Excellent code quality' }
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
            <h1 className="text-3xl font-bold gradient-text">Interview Readiness</h1>
            <p className="text-muted-foreground mt-1">
              Prepare for {userData.targetRole} interviews
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Video className="w-4 h-4 mr-2" />
            Start Mock Interview
          </Button>
        </div>
      </motion.div>

      {/* Overall Readiness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Overall Interview Readiness</h3>
                <div className="flex items-end gap-4 mb-4">
                  <div className="text-6xl font-bold text-purple-400">71%</div>
                  <div className="text-2xl text-muted-foreground mb-2">Ready</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on {(12 + 8 + 4)} completed practice sessions and skill assessments
                </p>
                <Progress value={71} className="h-3" />
              </div>
              <Target className="w-32 h-32 text-purple-400 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Type Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Readiness by Interview Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interviewTypes.map((interview, index) => (
                <motion.div
                  key={interview.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg bg-gradient-to-br ${interview.color}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{interview.type}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {interview.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Practice: {interview.completed}/{interview.total}</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {interview.readiness}% ready
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{interview.readiness}%</div>
                        <p className="text-xs text-muted-foreground">Readiness</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={interview.readiness} className="h-2" />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Mock Interviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-400" />
                Available Mock Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockInterviews.map((interview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{interview.title}</h4>
                        <Badge variant="outline">{interview.difficulty}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {interview.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.duration}
                        </span>
                        <span>{interview.type}</span>
                      </div>
                    </div>
                    <Button className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Practice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Recent Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPractice.map((practice, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{practice.type}</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {practice.score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{practice.feedback}</p>
                  <p className="text-xs text-muted-foreground">{practice.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interview Tips */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Interview Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                  <p className="text-xs text-muted-foreground">Use STAR method for behavioral questions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                  <p className="text-xs text-muted-foreground">Think out loud during technical problems</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                  <p className="text-xs text-muted-foreground">Ask clarifying questions first</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                  <p className="text-xs text-muted-foreground">Discuss trade-offs in system design</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Score */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Confidence Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-400 mb-2">8.2/10</div>
                <p className="text-sm text-muted-foreground">Interview Confidence</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Your confidence has increased by 15% this month through consistent practice.
              </p>
              <Button size="sm" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}