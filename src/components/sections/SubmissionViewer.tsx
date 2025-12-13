import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  X, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Code,
  GitCompare,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Submission {
  id: string;
  timestamp: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  code?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface SubmissionViewerProps {
  submission: Submission | null;
  allSubmissions: Submission[];
  problemId: string;
  open: boolean;
  onClose: () => void;
}

export function SubmissionViewer({ 
  submission, 
  allSubmissions,
  problemId,
  open, 
  onClose 
}: SubmissionViewerProps) {
  const [compareMode, setCompareMode] = useState(false);
  const [compareSubmission, setCompareSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCompareMode(false);
      setCompareSubmission(null);
    }
  }, [open]);

  if (!submission) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'wrong_answer':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'time_limit':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'accepted' ? (
      <CheckCircle2 className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  const availableSubmissions = allSubmissions.filter(s => s.id !== submission.id);

  const renderSubmissionDetails = (sub: Submission, label: string) => (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-medium">{label}</h3>
          <Badge className={`${getStatusColor(sub.status)} border flex items-center gap-1`}>
            {getStatusIcon(sub.status)}
            {sub.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">Runtime</span>
              </div>
              <p className="text-foreground font-medium">{sub.runtime}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-muted-foreground">Memory</span>
              </div>
              <p className="text-foreground font-medium">{sub.memory}</p>
            </CardContent>
          </Card>
        </div>

        {/* Complexity Analysis */}
        {(sub.timeComplexity || sub.spaceComplexity) && (
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="p-4">
              <h4 className="text-foreground font-medium mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Complexity Analysis
              </h4>
              <div className="space-y-2">
                {sub.timeComplexity && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Complexity:</span>
                    <code className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                      {sub.timeComplexity}
                    </code>
                  </div>
                )}
                {sub.spaceComplexity && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Space Complexity:</span>
                    <code className="text-sm text-blue-300 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
                      {sub.spaceComplexity}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            {sub.language}
          </span>
          <span>•</span>
          <span>{new Date(sub.timestamp).toLocaleString()}</span>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-foreground font-medium">Code</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(sub.code || '')}
            className="hover:bg-purple-500/10 text-purple-400"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
        <ScrollArea className="h-64 w-full rounded-lg border border-border/50 bg-muted/20">
          <pre className="p-4 text-sm">
            <code className="text-foreground">{sub.code || '// Code not available'}</code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-foreground flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              Submission Details
            </span>
            <div className="flex items-center gap-2">
              {availableSubmissions.length > 0 && !compareMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareMode(true)}
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              )}
              {compareMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCompareMode(false);
                    setCompareSubmission(null);
                  }}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Compare
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          {compareMode && !compareSubmission ? (
            <div className="p-4 space-y-4">
              <h3 className="text-foreground font-medium">Select a submission to compare:</h3>
              <div className="space-y-2">
                {availableSubmissions.map((sub) => (
                  <Card 
                    key={sub.id}
                    className="cursor-pointer hover:bg-card/80 transition-colors border-border/50"
                    onClick={() => setCompareSubmission(sub)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(sub.status)} border`}>
                            {getStatusIcon(sub.status)}
                          </Badge>
                          <div>
                            <p className="text-foreground text-sm font-medium">{sub.language}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(sub.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{sub.runtime}</span>
                          <span>{sub.memory}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : compareMode && compareSubmission ? (
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {renderSubmissionDetails(submission, 'Current Submission')}
                </div>
                <div>
                  {renderSubmissionDetails(compareSubmission, 'Comparing With')}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {renderSubmissionDetails(submission, 'Submission')}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
