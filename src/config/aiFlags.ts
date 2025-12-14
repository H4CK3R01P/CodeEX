/**
 * AI Feature Flags
 * 
 * Controls which AI features are enabled in the application.
 * AI is OPTIONAL - failures should never block user flow.
 * 
 * RULES:
 * - AI must NEVER submit, grade, or modify answers
 * - AI failures must not block user flow
 * - All features are off by default in production
 * - Can be enabled via environment variables or admin settings
 */

// ============================================================================
// Feature Flag Types
// ============================================================================

export interface AIFeatureFlags {
  // Global AI toggle
  enabled: boolean;
  
  // Individual feature toggles
  features: {
    hints: boolean;              // Show hint generation button
    explanations: boolean;       // Show explanation panel
    solutionReview: boolean;     // Show AI code review
    questionGeneration: boolean; // Admin-only question generator
  };
  
  // Rate limiting (client-side tracking)
  limits: {
    hintsPerProblem: number;     // Max hints per problem
    reviewsPerDay: number;       // Max reviews per day
    explanationsPerDay: number;  // Max explanations per day
  };
  
  // UI behavior
  ui: {
    showLoadingStates: boolean;  // Show loading indicators
    allowRetry: boolean;         // Allow retry on failure
    autoCollapse: boolean;       // Auto-collapse AI panels
    showBetaBadge: boolean;      // Show "Beta" badge on AI features
  };
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_FLAGS: AIFeatureFlags = {
  enabled: false, // OFF by default in production
  
  features: {
    hints: false,
    explanations: false,
    solutionReview: false,
    questionGeneration: false,
  },
  
  limits: {
    hintsPerProblem: 5,
    reviewsPerDay: 10,
    explanationsPerDay: 20,
  },
  
  ui: {
    showLoadingStates: true,
    allowRetry: true,
    autoCollapse: false,
    showBetaBadge: true,
  },
};

// ============================================================================
// Environment-based Configuration
// ============================================================================

/**
 * Load AI flags from environment variables
 */
function loadFlagsFromEnv(): Partial<AIFeatureFlags> {
  const env = import.meta.env;
  
  return {
    enabled: env.VITE_AI_ENABLED === 'true',
    
    features: {
      hints: env.VITE_AI_HINTS_ENABLED === 'true',
      explanations: env.VITE_AI_EXPLANATIONS_ENABLED === 'true',
      solutionReview: env.VITE_AI_REVIEW_ENABLED === 'true',
      questionGeneration: env.VITE_AI_QUESTION_GEN_ENABLED === 'true',
    },
    
    limits: {
      hintsPerProblem: parseInt(env.VITE_AI_HINTS_LIMIT || '5', 10),
      reviewsPerDay: parseInt(env.VITE_AI_REVIEWS_LIMIT || '10', 10),
      explanationsPerDay: parseInt(env.VITE_AI_EXPLANATIONS_LIMIT || '20', 10),
    },
  };
}

// ============================================================================
// Feature Flag Manager
// ============================================================================

class AIFlagManager {
  private flags: AIFeatureFlags;
  private listeners: Set<(flags: AIFeatureFlags) => void> = new Set();

  constructor() {
    // Merge default flags with environment overrides
    const envFlags = loadFlagsFromEnv();
    this.flags = {
      ...DEFAULT_FLAGS,
      ...envFlags,
      features: {
        ...DEFAULT_FLAGS.features,
        ...envFlags.features,
      },
      limits: {
        ...DEFAULT_FLAGS.limits,
        ...envFlags.limits,
      },
      ui: {
        ...DEFAULT_FLAGS.ui,
      },
    };
    
    // Load from localStorage if available (admin override)
    this.loadFromStorage();
  }

  /**
   * Get current flags
   */
  getFlags(): AIFeatureFlags {
    return { ...this.flags };
  }

  /**
   * Check if AI is globally enabled
   */
  isEnabled(): boolean {
    return this.flags.enabled;
  }

  /**
   * Check if a specific feature is enabled
   */
  isFeatureEnabled(feature: keyof AIFeatureFlags['features']): boolean {
    return this.flags.enabled && this.flags.features[feature];
  }

  /**
   * Get limit for a specific feature
   */
  getLimit(limit: keyof AIFeatureFlags['limits']): number {
    return this.flags.limits[limit];
  }

  /**
   * Update flags (admin only, persists to localStorage)
   */
  updateFlags(partial: Partial<AIFeatureFlags>): void {
    this.flags = {
      ...this.flags,
      ...partial,
      features: {
        ...this.flags.features,
        ...(partial.features || {}),
      },
      limits: {
        ...this.flags.limits,
        ...(partial.limits || {}),
      },
      ui: {
        ...this.flags.ui,
        ...(partial.ui || {}),
      },
    };
    
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Reset to default flags
   */
  reset(): void {
    this.flags = { ...DEFAULT_FLAGS };
    localStorage.removeItem('ai_flags');
    this.notifyListeners();
  }

  /**
   * Subscribe to flag changes
   */
  subscribe(listener: (flags: AIFeatureFlags) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Load flags from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('ai_flags');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.flags = {
          ...this.flags,
          ...parsed,
          features: {
            ...this.flags.features,
            ...(parsed.features || {}),
          },
          limits: {
            ...this.flags.limits,
            ...(parsed.limits || {}),
          },
          ui: {
            ...this.flags.ui,
            ...(parsed.ui || {}),
          },
        };
      }
    } catch (error) {
      console.warn('Failed to load AI flags from storage:', error);
    }
  }

  /**
   * Save flags to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('ai_flags', JSON.stringify(this.flags));
    } catch (error) {
      console.warn('Failed to save AI flags to storage:', error);
    }
  }

  /**
   * Notify all listeners of flag changes
   */
  private notifyListeners(): void {
    const flags = this.getFlags();
    this.listeners.forEach(listener => listener(flags));
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const aiFlags = new AIFlagManager();

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Check if AI is enabled globally
 */
export function isAIEnabled(): boolean {
  return aiFlags.isEnabled();
}

/**
 * Check if hints are enabled
 */
export function areHintsEnabled(): boolean {
  return aiFlags.isFeatureEnabled('hints');
}

/**
 * Check if explanations are enabled
 */
export function areExplanationsEnabled(): boolean {
  return aiFlags.isFeatureEnabled('explanations');
}

/**
 * Check if solution review is enabled
 */
export function isSolutionReviewEnabled(): boolean {
  return aiFlags.isFeatureEnabled('solutionReview');
}

/**
 * Check if question generation is enabled (admin only)
 */
export function isQuestionGenerationEnabled(): boolean {
  return aiFlags.isFeatureEnabled('questionGeneration');
}

/**
 * Get hints limit per problem
 */
export function getHintsLimit(): number {
  return aiFlags.getLimit('hintsPerProblem');
}

/**
 * Get reviews limit per day
 */
export function getReviewsLimit(): number {
  return aiFlags.getLimit('reviewsPerDay');
}

/**
 * Get explanations limit per day
 */
export function getExplanationsLimit(): number {
  return aiFlags.getLimit('explanationsPerDay');
}

// ============================================================================
// Usage Tracking (Client-side)
// ============================================================================

interface UsageStats {
  hints: { [problemId: string]: number };
  reviews: { date: string; count: number }[];
  explanations: { date: string; count: number }[];
}

class AIUsageTracker {
  private stats: UsageStats;

  constructor() {
    this.stats = this.loadStats();
  }

  /**
   * Track hint usage
   */
  trackHint(problemId: string): boolean {
    const limit = getHintsLimit();
    const current = this.stats.hints[problemId] || 0;
    
    if (current >= limit) {
      return false; // Limit reached
    }
    
    this.stats.hints[problemId] = current + 1;
    this.saveStats();
    return true;
  }

  /**
   * Get remaining hints for a problem
   */
  getRemainingHints(problemId: string): number {
    const limit = getHintsLimit();
    const used = this.stats.hints[problemId] || 0;
    return Math.max(0, limit - used);
  }

  /**
   * Track review usage
   */
  trackReview(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const limit = getReviewsLimit();
    
    const todayStats = this.stats.reviews.find(r => r.date === today);
    const current = todayStats?.count || 0;
    
    if (current >= limit) {
      return false; // Limit reached
    }
    
    if (todayStats) {
      todayStats.count++;
    } else {
      this.stats.reviews.push({ date: today, count: 1 });
    }
    
    this.cleanOldStats();
    this.saveStats();
    return true;
  }

  /**
   * Get remaining reviews for today
   */
  getRemainingReviews(): number {
    const today = new Date().toISOString().split('T')[0];
    const limit = getReviewsLimit();
    const todayStats = this.stats.reviews.find(r => r.date === today);
    const used = todayStats?.count || 0;
    return Math.max(0, limit - used);
  }

  /**
   * Track explanation usage
   */
  trackExplanation(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const limit = getExplanationsLimit();
    
    const todayStats = this.stats.explanations.find(e => e.date === today);
    const current = todayStats?.count || 0;
    
    if (current >= limit) {
      return false; // Limit reached
    }
    
    if (todayStats) {
      todayStats.count++;
    } else {
      this.stats.explanations.push({ date: today, count: 1 });
    }
    
    this.cleanOldStats();
    this.saveStats();
    return true;
  }

  /**
   * Get remaining explanations for today
   */
  getRemainingExplanations(): number {
    const today = new Date().toISOString().split('T')[0];
    const limit = getExplanationsLimit();
    const todayStats = this.stats.explanations.find(e => e.date === today);
    const used = todayStats?.count || 0;
    return Math.max(0, limit - used);
  }

  /**
   * Reset all stats
   */
  reset(): void {
    this.stats = { hints: {}, reviews: [], explanations: [] };
    this.saveStats();
  }

  /**
   * Load stats from localStorage
   */
  private loadStats(): UsageStats {
    try {
      const stored = localStorage.getItem('ai_usage_stats');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load AI usage stats:', error);
    }
    return { hints: {}, reviews: [], explanations: [] };
  }

  /**
   * Save stats to localStorage
   */
  private saveStats(): void {
    try {
      localStorage.setItem('ai_usage_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Failed to save AI usage stats:', error);
    }
  }

  /**
   * Clean stats older than 7 days
   */
  private cleanOldStats(): void {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoff = sevenDaysAgo.toISOString().split('T')[0];
    
    this.stats.reviews = this.stats.reviews.filter(r => r.date >= cutoff);
    this.stats.explanations = this.stats.explanations.filter(e => e.date >= cutoff);
  }
}

export const aiUsage = new AIUsageTracker();

// ============================================================================
// React Hook for Feature Flags
// ============================================================================

import { useState, useEffect } from 'react';

/**
 * React hook to access AI feature flags
 */
export function useAIFlags() {
  const [flags, setFlags] = useState<AIFeatureFlags>(aiFlags.getFlags());

  useEffect(() => {
    // Subscribe to flag changes
    const unsubscribe = aiFlags.subscribe(setFlags);
    return unsubscribe;
  }, []);

  return {
    flags,
    isEnabled: aiFlags.isEnabled(),
    isFeatureEnabled: (feature: keyof AIFeatureFlags['features']) =>
      aiFlags.isFeatureEnabled(feature),
    updateFlags: (partial: Partial<AIFeatureFlags>) =>
      aiFlags.updateFlags(partial),
    reset: () => aiFlags.reset(),
  };
}
