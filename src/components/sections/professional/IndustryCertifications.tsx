import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  GraduationCap,
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';
import { UserData } from '../../../App';

interface IndustryCertificationsProps {
  userData: UserData;
}

export function IndustryCertifications({ userData }: IndustryCertificationsProps) {
  const earnedCertifications = [
    {
      name: 'System Design Professional',
      issuer: 'CodeEX',
      date: '2024-01-15',
      score: 92,
      verificationId: 'CODEX-SD-2024-001234',
      skills: ['System Design', 'Architecture', 'Scalability']
    },
    {
      name: 'Software Engineering Excellence',
      issuer: 'CodeEX',
      date: '2023-12-10',
      score: 88,
      verificationId: 'CODEX-SE-2023-005678',
      skills: ['Code Quality', 'Best Practices', 'Testing']
    }
  ];

  const availableCertifications = [
    {
      name: 'Cloud Architecture Professional',
      provider: 'CodeEX',
      duration: '8 weeks',
      difficulty: 'Advanced',
      requiredScore: 80,
      prerequisites: ['System Design Professional'],
      topics: ['AWS', 'Azure', 'Microservices', 'DevOps'],
      marketValue: 'High',
      industryRecognition: 95
    },
    {
      name: 'Tech Leadership Certificate',
      provider: 'CodeEX',
      duration: '6 weeks',
      difficulty: 'Intermediate',
      requiredScore: 75,
      prerequisites: [],
      topics: ['Team Management', 'Mentoring', 'Communication', 'Strategy'],
      marketValue: 'High',
      industryRecognition: 90
    },
    {
      name: 'Performance Optimization Expert',
      provider: 'CodeEX',
      duration: '4 weeks',
      difficulty: 'Advanced',
      requiredScore: 85,
      prerequisites: ['Software Engineering Excellence'],
      topics: ['Profiling', 'Caching', 'Database Optimization', 'Scalability'],
      marketValue: 'Medium',
      industryRecognition: 85
    }
  ];

  const inProgress = {
    name: 'Cloud Architecture Professional',
    progress: 65,
    completedModules: 5,
    totalModules: 8,
    nextDeadline: 'Assessment in 5 days',
    estimatedCompletion: '2 weeks'
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
            <h1 className="text-3xl font-bold gradient-text">Industry Certifications</h1>
            <p className="text-muted-foreground mt-1">
              Earn verified credentials for {userData.professionalDomain?.split('-').join(' ')}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Earned</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-1">{earnedCertifications.length}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Certifications</p>
                </div>
                <Award className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <h3 className="text-3xl font-bold text-blue-400 mt-1">1</h3>
                  <p className="text-xs text-muted-foreground mt-1">Active</p>
                </div>
                <Clock className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Boost</p>
                  <h3 className="text-3xl font-bold text-purple-400 mt-1">+42%</h3>
                  <p className="text-xs text-muted-foreground mt-1">Visibility</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* In Progress */}
          {inProgress && (
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Currently Pursuing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{inProgress.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {inProgress.completedModules}/{inProgress.totalModules} modules completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-400">{inProgress.progress}%</div>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  <Progress value={inProgress.progress} className="h-3 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📅 {inProgress.nextDeadline}</span>
                      <span>⌛ {inProgress.estimatedCompletion} remaining</span>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                Available Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableCertifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{cert.name}</h4>
                        <Badge variant="outline">{cert.difficulty}</Badge>
                        {cert.marketValue === 'High' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            High Demand
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{cert.provider}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cert.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {cert.duration}
                        </span>
                        <span>🎯 Pass score: {cert.requiredScore}%</span>
                        <span>📈 Recognition: {cert.industryRecognition}%</span>
                      </div>

                      {cert.prerequisites.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <span>Prerequisites: {cert.prerequisites.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <Button className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Enroll
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Earned Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Earned Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {earnedCertifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{cert.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{cert.issuer}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>📅 {cert.date}</span>
                        <span>•</span>
                        <span className="text-green-400">Score: {cert.score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">ID: {cert.verificationId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Why Get Certified?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Prove skills to employers</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Stand out in job applications</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Increase salary potential</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Build professional credibility</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Shareable on LinkedIn</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Path */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-sm">Recommended for {userData.targetRole}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-xs">Cloud Architecture Professional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-xs">Tech Leadership Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-xs">Performance Optimization Expert</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                Start Recommended Path
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}