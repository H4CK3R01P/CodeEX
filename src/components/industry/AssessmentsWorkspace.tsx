import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Code, 
  FileText, 
  Briefcase, 
  Home,
  Search,
  Filter,
  MoreVertical,
  Users,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { UserData } from '../../App';

interface AssessmentsWorkspaceProps {
  userData: UserData;
}

export function AssessmentsWorkspace({ userData }: AssessmentsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'coding' | 'mcq' | 'case' | 'takehome'>('coding');
  const [assessmentsList, setAssessmentsList] = useState([
    { 
      id: 1,
      name: 'Senior React Developer Assessment', 
      type: 'Coding - Frontend', 
      difficulty: 'Hard', 
      status: 'Active', 
      candidates: 24,
      duration: '120 min',
      created: '2 days ago'
    },
    { 
      id: 2,
      name: 'System Design - E-commerce Platform', 
      type: 'Coding - System Design', 
      difficulty: 'Hard', 
      status: 'Active', 
      candidates: 18,
      duration: '180 min',
      created: '5 days ago'
    },
    { 
      id: 3,
      name: 'Backend Engineer - Node.js', 
      type: 'Coding - Backend', 
      difficulty: 'Medium', 
      status: 'Draft', 
      candidates: 0,
      duration: '90 min',
      created: '1 week ago'
    },
    { 
      id: 4,
      name: 'Data Structures & Algorithms', 
      type: 'Coding - DSA', 
      difficulty: 'Medium', 
      status: 'Active', 
      candidates: 156,
      duration: '60 min',
      created: '2 weeks ago'
    },
    { 
      id: 5,
      name: 'Machine Learning Engineer Assessment', 
      type: 'Coding - ML/AI', 
      difficulty: 'Hard', 
      status: 'Scheduled', 
      candidates: 8,
      duration: '150 min',
      created: '3 days ago'
    },
  ]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', difficulty: '', duration: '', status: '' });

  const handleDelete = (assessment: any) => {
    setSelectedAssessment(assessment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setAssessmentsList(assessmentsList.filter(a => a.id !== selectedAssessment.id));
    setShowDeleteModal(false);
    setSelectedAssessment(null);
  };

  const handleEdit = (assessment: any) => {
    setSelectedAssessment(assessment);
    setEditForm({
      name: assessment.name,
      difficulty: assessment.difficulty,
      duration: assessment.duration,
      status: assessment.status
    });
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    setAssessmentsList(assessmentsList.map(a => 
      a.id === selectedAssessment.id 
        ? { ...a, ...editForm }
        : a
    ));
    setShowEditModal(false);
    setSelectedAssessment(null);
  };

  const handleDuplicate = (assessment: any) => {
    const newAssessment = {
      ...assessment,
      id: Math.max(...assessmentsList.map(a => a.id)) + 1,
      name: `${assessment.name} (Copy)`,
      status: 'Draft',
      candidates: 0,
      created: 'Just now'
    };
    setAssessmentsList([...assessmentsList, newAssessment]);
  };

  const tabs = [
    { id: 'coding' as const, label: 'Coding Tests', icon: Code },
    { id: 'mcq' as const, label: 'MCQs', icon: FileText },
    { id: 'case' as const, label: 'Case Studies', icon: Briefcase },
    { id: 'takehome' as const, label: 'Take-Home', icon: Home },
  ];

  const assessments = [
    { 
      name: 'Senior React Developer Assessment', 
      type: 'Coding - Frontend', 
      difficulty: 'Hard', 
      status: 'Active', 
      candidates: 24,
      duration: '120 min',
      created: '2 days ago'
    },
    { 
      name: 'System Design - E-commerce Platform', 
      type: 'Coding - System Design', 
      difficulty: 'Hard', 
      status: 'Active', 
      candidates: 18,
      duration: '180 min',
      created: '5 days ago'
    },
    { 
      name: 'Backend Engineer - Node.js', 
      type: 'Coding - Backend', 
      difficulty: 'Medium', 
      status: 'Draft', 
      candidates: 0,
      duration: '90 min',
      created: '1 week ago'
    },
    { 
      name: 'Data Structures & Algorithms', 
      type: 'Coding - DSA', 
      difficulty: 'Medium', 
      status: 'Active', 
      candidates: 156,
      duration: '60 min',
      created: '2 weeks ago'
    },
    { 
      name: 'Machine Learning Engineer Assessment', 
      type: 'Coding - ML/AI', 
      difficulty: 'Hard', 
      status: 'Scheduled', 
      candidates: 8,
      duration: '150 min',
      created: '3 days ago'
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Closed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assessments</h1>
          <p className="text-gray-400">Create, manage, and monitor your technical assessments</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
          <Plus className="w-5 h-5" />
          Create New Assessment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">24</div>
            <div className="text-sm text-gray-400">Active Tests</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">1,847</div>
            <div className="text-sm text-gray-400">Total Candidates</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">68%</div>
            <div className="text-sm text-gray-400">Avg Pass Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">105 min</div>
            <div className="text-sm text-gray-400">Avg Completion Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assessments..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-gray-800/50 border-gray-700">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Assessments Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Assessment Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Difficulty</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Candidates</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Duration</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Created</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{assessment.name}</div>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">{assessment.type}</td>
                    <td className="p-4">
                      <Badge className={getDifficultyColor(assessment.difficulty)}>
                        {assessment.difficulty}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4" />
                        {assessment.candidates}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4" />
                        {assessment.duration}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{assessment.created}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Test Builder Preview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Test Builder Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
              <Code className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-white font-medium mb-2">Coding Challenges</div>
              <div className="text-gray-400 text-sm">DSA, System Design, Full-Stack</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <FileText className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-white font-medium mb-2">MCQ Questions</div>
              <div className="text-gray-400 text-sm">Aptitude, Reasoning, Domain</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
              <Briefcase className="w-8 h-8 text-orange-400 mb-3" />
              <div className="text-white font-medium mb-2">Case Studies</div>
              <div className="text-gray-400 text-sm">Real-world problem solving</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
