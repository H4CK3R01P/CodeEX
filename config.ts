// Global configuration for EduMaster Pro

export const config = {
  // Set to false to use real Supabase backend (requires deployment)
  // Set to true to use client-side mock data (no backend needed)
  // UPDATED: Supabase credentials configured - ready to use real backend!
  useMockData: false, // Changed to false to use real Supabase backend
  
  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retries: 2,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
  },
  
  // Feature flags
  features: {
    codeExecution: true,
    discussions: true,
    contests: true,
    coins: true,
    achievements: true,
    bookmarks: true,
    analytics: true,
  },
  
  // Theme settings
  theme: {
    defaultMode: 'dark', // 'light' or 'dark'
    enableAnimations: true,
    enableGlowEffects: true,
  },
  
  // App metadata
  app: {
    name: 'EduMaster Pro',
    version: '1.0.0',
    description: 'Advanced Educational Platform',
  },
};

export default config;
