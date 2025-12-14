import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, RotateCcw, Settings, Maximize2, Minimize2, Loader2, Send } from 'lucide-react';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface CodeEditorProps {
  defaultCode?: string;
  language?: string;
  onRun?: (code: string, language: string) => void;
  onSubmit?: (code: string, language: string) => void;
  onChange?: (code: string, language: string) => void;
  readOnly?: boolean;
  height?: string;
  showSubmit?: boolean;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

// Language configurations
const LANGUAGE_CONFIGS = {
  javascript: {
    name: 'JavaScript',
    defaultCode: `function solution(input) {\n  // Write your code here\n  return input;\n}\n\n// Test your code\nconsole.log(solution("test"));`,
  },
  python: {
    name: 'Python',
    defaultCode: `def solution(input):\n    # Write your code here\n    return input\n\n# Test your code\nprint(solution("test"))`,
  },
  cpp: {
    name: 'C++',
    defaultCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
  },
  java: {
    name: 'Java',
    defaultCode: `public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,
  },
  typescript: {
    name: 'TypeScript',
    defaultCode: `function solution(input: string): string {\n  // Write your code here\n  return input;\n}\n\n// Test your code\nconsole.log(solution("test"));`,
  },
  go: {
    name: 'Go',
    defaultCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n    fmt.Println("Hello, World!")\n}`,
  },
  rust: {
    name: 'Rust',
    defaultCode: `fn main() {\n    // Write your code here\n    println!("Hello, World!");\n}`,
  },
};

export function CodeEditor({
  defaultCode,
  language = 'javascript',
  onRun,
  onSubmit,
  onChange,
  readOnly = false,
  height = '600px', // Increased from 400px to 600px
  showSubmit = false,
  isRunning = false,
  isSubmitting = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode || LANGUAGE_CONFIGS[language].defaultCode);
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGE_CONFIGS>(language as keyof typeof LANGUAGE_CONFIGS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
    }
  }, [defaultCode]);

  useEffect(() => {
    if (onChange) {
      onChange(code, selectedLanguage);
    }
  }, [code, selectedLanguage]);

  const handleRun = async () => {
    if (onRun) {
      await onRun(code, selectedLanguage);
    }
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(code, selectedLanguage);
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_CONFIGS[selectedLanguage].defaultCode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleLanguageChange = (value: keyof typeof LANGUAGE_CONFIGS) => {
    setSelectedLanguage(value);
    setCode(LANGUAGE_CONFIGS[value].defaultCode);
  };

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <Select
            value={selectedLanguage}
            onValueChange={(value) => handleLanguageChange(value as keyof typeof LANGUAGE_CONFIGS)}
            disabled={isRunning || isSubmitting}
          >
            <SelectTrigger className="w-[140px] bg-card border-border text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground">
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline" className="hidden sm:flex border-border text-foreground">
            {code.split('\n').length} lines
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isRunning || isSubmitting}
            className="hidden sm:flex hover:bg-muted/50 text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            disabled={isRunning || isSubmitting}
            className="hover:bg-muted/50 text-foreground"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRun?.(code, selectedLanguage)}
              disabled={isRunning || isSubmitting || !code.trim()}
              className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-foreground"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </>
              )}
            </Button>
          </motion.div>

          {showSubmit && onSubmit && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={() => onSubmit(code, selectedLanguage)}
                disabled={isRunning || isSubmitting || !code.trim()}
                className="bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-700 text-success-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 font-mono resize-none focus:outline-none bg-card text-card-foreground border-0"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: '1.6', 
            tabSize: 2,
            whiteSpace: 'pre',
            wordWrap: 'normal',
            overflowWrap: 'normal',
            overflowY: 'auto',
            overflowX: 'auto',
            minHeight: '100%',
          }}
          placeholder="// Start coding here..."
          spellCheck={false}
          readOnly={readOnly || isRunning || isSubmitting}
          disabled={isRunning || isSubmitting}
        />
        {(isRunning || isSubmitting) && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 bg-card/90 p-6 rounded-lg border border-border shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-card-foreground">
                {isRunning ? 'Running your code...' : 'Submitting solution...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}