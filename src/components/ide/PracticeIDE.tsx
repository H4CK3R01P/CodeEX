import React, { useState } from 'react';
import { IDEProvider, useIDE } from './IDEContext';
import { ProblemView } from './ProblemView';
import { AIBrainSidebar } from './AIBrainSidebar';
import { CodeEditor } from '../CodeEditor';
import { Button } from '../ui/button';
import { ArrowLeft, Terminal } from 'lucide-react';

interface PracticeIDEProps {
  onBack?: () => void;
  problemId?: string;
}

const IDEContent: React.FC<PracticeIDEProps> = ({ onBack, problemId = 'two-sum' }) => {
  const { state, setCurrentCode, incrementFailedAttempts, markAsSolved, addChatMessage } = useIDE();
  const [consoleOutput, setConsoleOutput] = useState<{status: string, output: string} | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRun = async (code: string, language: string) => {
    setIsRunning(true);
    setCurrentCode(code, language);
    setConsoleOutput(null);
    
    // Simulate API call to runner
    setTimeout(() => {
      setConsoleOutput({
        status: 'SUCCESS',
        output: 'Test Case 1: Passed\\nTest Case 2: Passed'
      });
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = async (code: string, language: string) => {
    setIsSubmitting(true);
    setCurrentCode(code, language);
    setConsoleOutput(null);

    // Simulate Grader submission
    setTimeout(() => {
      // For demonstration, let's randomly fail it if attempts < 3, then AC
      const isPass = Math.random() > 0.5 || state.failedAttempts >= 3;
      
      if (isPass) {
        setConsoleOutput({
          status: 'AC',
          output: 'Verdict: Accepted!\\nTime: 45ms\\nMemory: 4.2MB'
        });
        markAsSolved();
        addChatMessage({
          role: 'system',
          content: 'Congratulations! You solved the problem. The "Refactor" action is now unlocked.'
        });
      } else {
        setConsoleOutput({
          status: 'WA',
          output: 'Verdict: Wrong Answer on Test Case 3\\nExpected: [0, 1]\\nGot: [1, 1]'
        });
        incrementFailedAttempts();
        
        // Show debug button hint
        addChatMessage({
          role: 'system',
          content: `Submission failed (Attempt ${state.failedAttempts + 1}). Try using the "Debug Code" action in the brain sidebar.`
        });
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden text-foreground">
      {/* Top Navigation */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-bold text-lg">{problemId.replace('-', ' ').toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full border border-destructive/20">
            Failed Attempts: {state.failedAttempts}
          </span>
          {state.isSolved && (
            <span className="bg-success/10 text-success px-3 py-1 rounded-full border border-success/20">
              SOLVED
            </span>
          )}
        </div>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Problem View (25%) */}
        <div className="w-1/4 h-full hidden lg:block">
          <ProblemView />
        </div>

        {/* Center Pane: Editor & Console (50%) */}
        <div className="flex-1 flex flex-col h-full border-l lg:border-l-0 border-border">
          {/* Editor (70%) */}
          <div className="h-[70%]">
            <CodeEditor
              height="100%"
              showSubmit={true}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onChange={(c, l) => setCurrentCode(c, l)}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Console (30%) */}
          <div className="h-[30%] bg-card flex flex-col border-t border-border">
            <div className="p-2 border-b border-border bg-muted/30 font-semibold text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Console Output
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {consoleOutput ? (
                <div className={`${consoleOutput.status === 'WA' ? 'text-destructive' : 'text-success'}`}>
                  {consoleOutput.output}
                </div>
              ) : (
                <div className="text-muted-foreground opacity-50">Run or Submit code to see output here.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: AI Brain Sidebar (25%) */}
        <div className="w-[30%] h-full hidden md:block">
          <AIBrainSidebar />
        </div>

      </div>
    </div>
  );
};

export const PracticeIDE: React.FC<PracticeIDEProps> = (props) => {
  return (
    <IDEProvider initialProblemId={props.problemId}>
      <IDEContent {...props} />
    </IDEProvider>
  );
};
