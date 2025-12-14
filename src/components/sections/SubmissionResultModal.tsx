import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Database, 
  Coins,
  TrendingUp,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface SubmissionResultModalProps {
  open: boolean;
  onClose: () => void;
  result: {
    status: 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compilation_error';
    testCasesPassed: number;
    totalTestCases: number;
    runtime: string;
    memory: string;
    error?: string;
    failedTestCase?: {
      input: string;
      expectedOutput: string;
      actualOutput: string;
    };
  };
  coinsEarned?: number;
}

export function SubmissionResultModal({ open, onClose, result, coinsEarned }: SubmissionResultModalProps) {
  const isAccepted = result.status === 'accepted';
  const statusConfig = {
    accepted: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      title: 'Accepted',
      message: 'Congratulations! Your solution passed all test cases.',
    },
    wrong_answer: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      title: 'Wrong Answer',
      message: 'Your solution did not produce the expected output.',
    },
    time_limit: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      title: 'Time Limit Exceeded',
      message: 'Your solution took too long to execute.',
    },
    runtime_error: {
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      title: 'Runtime Error',
      message: 'Your solution encountered an error during execution.',
    },
    compilation_error: {
      icon: AlertCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      title: 'Compilation Error',
      message: 'Your code could not be compiled.',
    },
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
          >
            <p className="text-sm">{config.message}</p>
          </motion.div>

          {/* Test Cases Result */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Test Cases</span>
              <Badge variant={isAccepted ? "default" : "destructive"}>
                {result.testCasesPassed} / {result.totalTestCases} Passed
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isAccepted ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${(result.testCasesPassed / result.totalTestCases) * 100}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Runtime</p>
                <p className="text-sm font-semibold">{result.runtime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Database className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Memory</p>
                <p className="text-sm font-semibold">{result.memory}</p>
              </div>
            </div>
          </div>

          {/* Coins Awarded (if accepted) */}
          {isAccepted && coinsEarned && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-yellow-500/20">
                    <Coins className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Coins Earned</p>
                    <p className="text-xs text-muted-foreground">Added to your balance</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-500">
                  +{coinsEarned}
                </div>
              </div>
            </motion.div>
          )}

          {/* Failed Test Case Details */}
          {result.failedTestCase && (
            <div className="space-y-3">
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Failed Test Case
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="p-3 rounded bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Input</p>
                    <pre className="font-mono text-xs">{result.failedTestCase.input}</pre>
                  </div>
                  
                  <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                    <p className="text-xs text-muted-foreground mb-1">Expected Output</p>
                    <pre className="font-mono text-xs">{result.failedTestCase.expectedOutput}</pre>
                  </div>
                  
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-muted-foreground mb-1">Your Output</p>
                    <pre className="font-mono text-xs">{result.failedTestCase.actualOutput}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {result.error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-500 font-mono">{result.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1">
              {isAccepted ? 'Continue' : 'Try Again'}
            </Button>
            {isAccepted && (
              <Button variant="outline" onClick={onClose}>
                View Submissions
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
