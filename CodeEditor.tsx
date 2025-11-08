import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, RotateCcw, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface CodeEditorProps {
  defaultCode?: string;
  language?: string;
  onRun?: (code: string, language: string) => void;
  onSubmit?: (code: string, language: string) => void;
  readOnly?: boolean;
  height?: string;
  showSubmit?: boolean;
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
  readOnly = false,
  height = '600px',
  showSubmit = true,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(defaultCode || LANGUAGE_CONFIGS[language].defaultCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
    }
  }, [defaultCode]);

  const handleRun = async () => {
    if (onRun) {
      setIsRunning(true);
      try {
        await onRun(code, selectedLanguage);
      } finally {
        setIsRunning(false);
      }
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

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} border border-border rounded-lg overflow-hidden bg-background`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Font Size
            </Badge>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              >
                -
              </Button>
              <span className="text-xs w-6 text-center">{fontSize}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {onRun && (
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="h-8"
              variant="default"
            >
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          )}

          {showSubmit && onSubmit && (
            <Button
              onClick={handleSubmit}
              className="h-8 bg-green-600 hover:bg-green-700"
            >
              Submit
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className={`w-full h-full resize-none p-4 font-mono focus:outline-none ${
            theme === 'dark'
              ? 'bg-gray-900 text-gray-100'
              : 'bg-white text-gray-900'
          }`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}