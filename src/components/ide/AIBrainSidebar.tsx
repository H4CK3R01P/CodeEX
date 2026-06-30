import React, { useRef, useEffect, useState } from 'react';
import { useIDE } from './IDEContext';
import { aiClient } from '../../api/aiClient';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Bot, Lightbulb, ListTodo, Code2, Bug, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AIBrainSidebar: React.FC = () => {
  const { state, addChatMessage, incrementHintLevel } = useIDE();
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatHistory]);

  const handlePlanApproach = async () => {
    setIsProcessing(true);
    addChatMessage({ role: 'user', content: 'Help me plan an approach for this problem.' });
    
    try {
      // Mocking planner since we need a generic /plan endpoint, or using generateQuestion as proxy
      // In production, we'd add an orchestration endpoint for planning.
      const response = await fetch('http://localhost:8000/api/v1/ai/status');
      if (response.ok) {
        addChatMessage({
          role: 'assistant',
          content: 'Here is a suggested plan:\\n1. Parse the input array.\\n2. Initialize a Hash Map.\\n3. Iterate and check for the complement.'
        });
      }
    } catch (error: any) {
      toast.error('Planning Failed');
      addChatMessage({ role: 'system', content: `Error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetHint = async () => {
    setIsProcessing(true);
    addChatMessage({ role: 'user', content: 'Can I get a hint?' });
    
    try {
      const response = await aiClient.generateHint({
        problem_id: state.currentProblemId || 'two-sum',
        user_code: state.currentCode,
        hint_level: state.hintLevel + 1,
        attempt_count: state.failedAttempts,
        domain: 'competitive_programming'
      });

      addChatMessage({
        role: 'assistant',
        content: `**Hint Level ${response.hint_level}:**\\n${response.hint}`
      });
      incrementHintLevel();
    } catch (error: any) {
      toast.error('Failed to get hint', { description: error.message });
      addChatMessage({ role: 'system', content: `Error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShowSolution = () => {
    if (state.failedAttempts < 3) {
      toast.error('Attempt 3 times first', {
        description: `You have ${state.failedAttempts}/3 failed attempts.`
      });
      return;
    }
    
    addChatMessage({ role: 'user', content: 'Show me the solution.' });
    addChatMessage({ 
      role: 'assistant', 
      content: 'Here is the solution... (Note: this reduces your points)' 
    });
  };

  const handleDebugCode = async () => {
    setIsProcessing(true);
    addChatMessage({ role: 'user', content: 'Please help me debug my code.' });
    
    try {
      const response = await aiClient.reviewSolution({
        problem_id: state.currentProblemId || 'two-sum',
        user_code: state.currentCode,
        language: state.currentLanguage,
        verdict: 'WA',
        domain: 'competitive_programming'
      });

      addChatMessage({
        role: 'assistant',
        content: `**Debug Analysis:**\\nCorrectness: ${response.review?.correctness}\\nComplexity: ${response.review?.complexity}\\n\\nSuggestions:\\n${response.suggestions?.join('\\n')}`
      });
    } catch (error: any) {
      toast.error('Debug failed');
      addChatMessage({ role: 'system', content: `Error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefactorCode = async () => {
    if (!state.isSolved) {
      toast.error('Solve the problem first', {
        description: 'Refactoring is unlocked after you get an Accepted (AC) verdict.'
      });
      return;
    }
    
    setIsProcessing(true);
    addChatMessage({ role: 'user', content: 'Can you refactor my working solution?' });
    
    try {
      const response = await aiClient.reviewSolution({
        problem_id: state.currentProblemId || 'two-sum',
        user_code: state.currentCode,
        language: state.currentLanguage,
        verdict: 'AC',
        focus_areas: ['readability', 'efficiency'],
        domain: 'competitive_programming'
      });

      addChatMessage({
        role: 'assistant',
        content: `**Refactoring Suggestions:**\\n${response.suggestions?.join('\\n')}`
      });
    } catch (error: any) {
      toast.error('Refactor failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card font-semibold text-foreground">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          CodeEX Brain
        </div>
      </div>

      {/* Chat Area (70%) */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4">
          {state.chatHistory.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm mt-10">
              <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>I am your CodeEX AI Assistant.</p>
              <p>How can I help you today?</p>
            </div>
          ) : (
            state.chatHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : msg.role === 'system'
                        ? 'bg-destructive/10 text-destructive border border-destructive/20'
                        : 'bg-muted text-foreground rounded-tl-none border border-border'
                  }`}
                >
                  {/* Basic markdown parsing support for line breaks */}
                  {msg.content.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex self-start bg-muted p-3 rounded-lg rounded-tl-none border border-border text-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Agent Action Grid (30%) */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start gap-2 h-10 hover:bg-primary/10 border-border"
            onClick={handlePlanApproach}
            disabled={isProcessing}
          >
            <ListTodo className="w-4 h-4 text-blue-500" /> Plan Approach
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start gap-2 h-10 hover:bg-primary/10 border-border relative overflow-hidden"
            onClick={handleGetHint}
            disabled={isProcessing || state.hintLevel >= 3}
          >
            <Lightbulb className={`w-4 h-4 ${state.hintLevel === 0 ? 'text-yellow-500' : state.hintLevel === 1 ? 'text-orange-500' : 'text-red-500'}`} /> 
            Get Hint ({3 - state.hintLevel})
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start gap-2 h-10 hover:bg-primary/10 border-border"
            onClick={handleShowSolution}
            disabled={isProcessing || state.failedAttempts < 3}
          >
            <Code2 className="w-4 h-4 text-purple-500" /> Show Solution
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start gap-2 h-10 hover:bg-primary/10 border-border"
            onClick={handleDebugCode}
            disabled={isProcessing}
          >
            <Bug className="w-4 h-4 text-red-500" /> Debug Code
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start gap-2 h-10 hover:bg-primary/10 border-border"
            disabled={true} // Triggered from ProblemView
            title="Highlight text in problem description to use this"
          >
            <FileText className="w-4 h-4 text-green-500" /> Explain Concept
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-start gap-2 h-10 hover:bg-primary/10 border-border"
            onClick={handleRefactorCode}
            disabled={isProcessing || !state.isSolved}
          >
            <RefreshCw className="w-4 h-4 text-emerald-500" /> Refactor
          </Button>
        </div>
      </div>
    </div>
  );
};
