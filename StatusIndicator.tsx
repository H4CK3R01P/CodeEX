import { motion, AnimatePresence } from 'motion/react';
import { Zap, Cloud, CloudOff } from 'lucide-react';
import { config } from '../utils/config';
import { useState } from 'react';

export function StatusIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border shadow-lg ${
            config.useMockData
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            {config.useMockData ? (
              <>
                <CloudOff className="w-4 h-4" />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <CloudOff className="w-4 h-4 text-amber-400" />
                </motion.div>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}
          </div>
          <span className="text-sm font-medium">
            {config.useMockData ? 'Demo Mode' : 'Live Backend'}
          </span>
          <Zap className="w-3 h-3" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
