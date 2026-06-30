import React, { useState, useRef, useEffect } from 'react';
import { useIDE } from './IDEContext';
import { aiClient } from '../../api/aiClient';
import { Button } from '../ui/button';
import { Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export const ProblemView: React.FC = () => {
  const { addChatMessage } = useIDE();
  const [selectedText, setSelectedText] = useState('');
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle text selection
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0 && containerRef.current?.contains(selection?.anchorNode || null)) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          // Position popup above the selection
          setPopupPos({
            top: rect.top - 40,
            left: rect.left + rect.width / 2 - 50 // Center horizontally
          });
          setSelectedText(text);
        }
      } else {
        setPopupPos(null);
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleExplain = async () => {
    if (!selectedText) return;

    setIsExplaining(true);
    setPopupPos(null); // Hide popup while explaining

    try {
      addChatMessage({
        role: 'user',
        content: `Explain this concept: "${selectedText}"`
      });

      const response = await aiClient.generateExplanation({
        concept: selectedText,
        detail_level: 'moderate',
        include_examples: true,
        domain: 'competitive_programming'
      });

      addChatMessage({
        role: 'assistant',
        content: response.explanation || 'No explanation returned.'
      });
      
    } catch (error: any) {
      toast.error('Explanation Failed', { description: error.message });
      addChatMessage({
        role: 'system',
        content: `Error generating explanation: ${error.message}`
      });
    } finally {
      setIsExplaining(false);
      window.getSelection()?.removeAllRanges(); // Clear selection
    }
  };

  const MOCK_PROBLEM_MD = `
# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:

**Input:** \`nums = [2,7,11,15]\`, \`target = 9\`
**Output:** \`[0,1]\`
**Explanation:** Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`.

## Example 2:

**Input:** \`nums = [3,2,4]\`, \`target = 6\`
**Output:** \`[1,2]\`

## Constraints:
* \`2 <= nums.length <= 10^4\`
* \`-10^9 <= nums[i] <= 10^9\`
* \`-10^9 <= target <= 10^9\`
* Only one valid answer exists.
  `;

  return (
    <div className="h-full bg-card flex flex-col border-r border-border relative" ref={containerRef}>
      <div className="p-4 border-b border-border font-semibold flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Problem Description
      </div>
      <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
        {/* Render markdown - for now just use a basic string split to simulate */}
        {MOCK_PROBLEM_MD.split('\\n').map((line, idx) => (
          <p key={idx} className="mb-2">{line}</p>
        ))}
      </div>

      {/* Floating Explain Button */}
      {popupPos && (
        <div 
          className="fixed z-50 animate-in fade-in zoom-in duration-200"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <Button 
            size="sm" 
            onClick={handleExplain}
            disabled={isExplaining}
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isExplaining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            👨‍🏫 Explain
          </Button>
        </div>
      )}
    </div>
  );
};
