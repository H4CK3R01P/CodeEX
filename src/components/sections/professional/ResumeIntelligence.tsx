import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Download,
  Star,
  Eye,
  TrendingUp
} from 'lucide-react';
import { UserData } from '../../../App';

interface ResumeIntelligenceProps {
  userData: UserData;
}

export function ResumeIntelligence({ userData }: ResumeIntelligenceProps) {
  const atsScore = 78;
  
  const resumeAnalysis = {
    strengths: [
      'Clear work experience timeline',
      'Quantified achievements with metrics',
      'Relevant technical skills listed',
      'Professional summary is concise'
    ],
    improvements: [
      'Add more domain-specific keywords for ATS',
      'Include leadership examples',
      'Add certifications section',
      'Highlight system design projects'
    ],
    missingSkills: [
      'Microservices Architecture',
      'Cloud (AWS/Azure)',
      'Team Leadership',
      'Agile/Scrum'
    ]
  };

  const verifiedSkills = [
    { skill: 'System Design', verified: true, assessmentScore: 85 },
    { skill: 'Problem Solving', verified: true, assessmentScore: 92 },
    { skill: 'Code Quality', verified: true, assessmentScore: 88 },
    { skill: 'Cloud Architecture', verified: false, assessmentScore: 0 },
    { skill: 'Leadership', verified: false, assessmentScore: 0 }
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
            <h1 className="text-3xl font-bold gradient-text">Resume Intelligence</h1>
            <p className="text-muted-foreground mt-1">
              ATS-optimized resume for {userData.professionalDomain?.split('-').join(' ')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download Optimized
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ATS Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">ATS Compatibility Score</h3>
                <div className="flex items-end gap-4 mb-4">
                  <div className="text-6xl font-bold text-purple-400">{atsScore}</div>
                  <div className="text-3xl text-muted-foreground mb-2">/100</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your resume passes {atsScore}% of Applicant Tracking Systems for {userData.targetRole} positions
                </p>
                <Progress value={atsScore} className="h-3" />
              </div>
              <div className="ml-8">
                <FileText className="w-32 h-32 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis */}
        <div className="lg:col-span-2 space-y-4">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                What's Working Well
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {resumeAnalysis.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Recommended Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {resumeAnalysis.improvements.map((improvement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{improvement}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Fix
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                Skills Gap in Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                These skills are expected for {userData.targetRole} but missing from your resume
              </p>
              <div className="flex flex-wrap gap-2">
                {resumeAnalysis.missingSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-red-500/20 text-red-400 border-red-500/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Learn & Add These Skills
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Verified Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Verified Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {verifiedSkills.map((skill, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    skill.verified
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{skill.skill}</span>
                    {skill.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  {skill.verified && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Assessment Score</span>
                        <span className="text-green-400">{skill.assessmentScore}%</span>
                      </div>
                      <Progress value={skill.assessmentScore} className="h-1" />
                    </div>
                  )}
                  {!skill.verified && (
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      Take Assessment
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile Visibility */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Profile Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Views</span>
                    <span className="text-blue-400 font-medium">142</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Recruiter Interest</span>
                    <span className="text-blue-400 font-medium">High</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <Button size="sm" className="w-full">
                  Make Profile Public
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Star className="w-4 h-4 mr-2" />
                Get Skill Badges
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Preview Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}