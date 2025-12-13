import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HintDialogProps {
  hint: string;
  hintNumber: number;
  problemTitle: string;
  open: boolean;
  onClose: () => void;
}

export function HintDialog({ hint, hintNumber, problemTitle, open, onClose }: HintDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-foreground">Hint {hintNumber}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Related to: {problemTitle}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 rounded-xl" />
          
          {/* Content */}
          <div className="relative p-6 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Helpful Hint
              </Badge>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {hint}
              </p>
            </div>

            {/* Hint indicator */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Lightbulb className="w-3 h-3 text-yellow-400" />
                Use hints wisely to guide your problem-solving approach
              </p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
