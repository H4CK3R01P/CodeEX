import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  CheckCircle2,
  Circle,
  Lock,
  TrendingUp,
  Clock,
  Code,
  Trophy,
  Target
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { ProblemDetail } from './ProblemDetail';
import { EnhancedProblemDetail } from './EnhancedProblemDetail';
import { CodingProblem, getProblemsByDomain } from '../../utils/codingProblems';
import { UserData } from '../../App';
import { getDomainConfig } from '../../utils/domainConfig';

interface ProblemsLibraryProps {
  userData: UserData;
}

export function ProblemsLibrary({ userData }: ProblemsLibraryProps) {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load problems for the domain
    const domainProblems = getProblemsByDomain(userData.domain || '');
    setProblems(domainProblems);
    setFilteredProblems(domainProblems);
  }, [userData.domain]);

  useEffect(() => {
    // Apply filters
    let filtered = [...problems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    // Topics filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(problem =>
        problem.topics.some(topic => selectedTopics.includes(topic))
      );
    }

    // Status filter
    if (selectedStatus === 'solved') {
      filtered = filtered.filter(problem => solvedProblems.has(problem.id));
    } else if (selectedStatus === 'unsolved') {
      filtered = filtered.filter(problem => !solvedProblems.has(problem.id));
    }

    // Sort
    if (sortBy === 'acceptance-asc') {
      filtered.sort((a, b) => a.acceptanceRate - b.acceptanceRate);
    } else if (sortBy === 'acceptance-desc') {
      filtered.sort((a, b) => b.acceptanceRate - a.acceptanceRate);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }

    setFilteredProblems(filtered);
  }, [searchQuery, selectedDifficulty, selectedTopics, selectedStatus, sortBy, problems, solvedProblems]);

  // Get all unique topics from problems
  const allTopics = Array.from(new Set(problems.flatMap(p => p.topics)));

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const domainConfig = getDomainConfig(userData.domain || '');
  const isTechDomain = domainConfig.category === 'coding';

  if (selectedProblem) {
    // Use EnhancedProblemDetail for tech/coding domains
    if (isTechDomain) {
      return (
        <EnhancedProblemDetail
          problem={selectedProblem}
          onBack={() => setSelectedProblem(null)}
          domainId={userData.domain || ''}
        />
      );
    }
    
    // Use regular ProblemDetail for exam domains
    return (
      <ProblemDetail
        problem={selectedProblem}
        onBack={() => setSelectedProblem(null)}
        domainId={userData.domain || ''}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Problem Set</h1>
            <p className="text-muted-foreground mt-1">
              Solve {problems.length} problems to master your skills
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="border-2">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {solvedProblems.size}
                  </div>
                  <div className="text-xs text-muted-foreground">Solved</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Math.floor(problems.length * 0.3)}
                  </div>
                  <div className="text-xs text-muted-foreground">Attempted</div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {problems.length - solvedProblems.size}
                  </div>
                  <div className="text-xs text-muted-foreground">Todo</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Topics
                {selectedTopics.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {selectedTopics.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Topics</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {allTopics.map((topic) => (
                  <DropdownMenuCheckboxItem
                    key={topic}
                    checked={selectedTopics.includes(topic)}
                    onCheckedChange={() => toggleTopic(topic)}
                  >
                    {topic}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Order</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="acceptance-desc">Acceptance (High to Low)</SelectItem>
              <SelectItem value="acceptance-asc">Acceptance (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(selectedTopics.length > 0 || selectedDifficulty !== 'all' || selectedStatus !== 'all') && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedDifficulty !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {selectedDifficulty}
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {selectedStatus}
                <button
                  onClick={() => setSelectedStatus('all')}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="gap-1">
                {topic}
                <button
                  onClick={() => toggleTopic(topic)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  ×
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedStatus('all');
                setSelectedTopics([]);
                setSearchQuery('');
              }}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => (
              <Card
                key={problem.id}
                className="hover:shadow-md transition-all cursor-pointer border-l-4"
                style={{
                  borderLeftColor: solvedProblems.has(problem.id) ? '#22c55e' : 'transparent',
                }}
                onClick={() => setSelectedProblem(problem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="flex items-center justify-center w-8">
                      {solvedProblems.has(problem.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>

                    {/* Problem Number */}
                    <div className="w-12 text-center text-sm text-muted-foreground">
                      #{idx + 1}
                    </div>

                    {/* Problem Title and Topics */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{problem.title}</h3>
                        {problem.isPremium && (
                          <Lock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {problem.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {problem.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{problem.topics.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Companies */}
                    <div className="hidden md:flex items-center gap-2 w-48">
                      {problem.companies.slice(0, 2).map((company) => (
                        <Badge key={company} variant="secondary" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                      {problem.companies.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{problem.companies.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Difficulty */}
                    <Badge className={`${getDifficultyColor(problem.difficulty)} border w-24 justify-center`}>
                      {problem.difficulty}
                    </Badge>

                    {/* Acceptance Rate */}
                    <div className="flex items-center gap-2 w-24">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {problem.acceptanceRate}%
                      </span>
                    </div>

                    {/* Actions */}
                    <Button size="sm" className="gap-2">
                      <Code className="h-4 w-4" />
                      Solve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No problems found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDifficulty('all');
                  setSelectedStatus('all');
                  setSelectedTopics([]);
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
