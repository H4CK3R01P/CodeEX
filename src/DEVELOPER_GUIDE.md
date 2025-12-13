# CodeEX - Developer Quick Reference Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Modern web browser

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd codeex

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
/components
  /sections          - Dashboard section components
  /ui               - Reusable UI components (Shadcn)
  CodeEditor.tsx    - Custom code editor
  Dashboard.tsx     - Main dashboard
  [Other components]

/utils
  apiClient.ts      - API client with error handling
  config.ts         - Global configuration
  domainConfig.ts   - Domain-specific configs
  [Other utilities]

/styles
  globals.css       - Global styles & theme

App.tsx             - Main application entry
```

---

## 🎨 Theme System

### Colors
```typescript
// Primary colors (from globals.css)
--primary: #a855f7;      // Purple
--secondary: #f97316;    // Orange
--accent: #3b82f6;       // Blue
--danger: #ef4444;       // Red
--success: #22c55e;      // Green

// Usage in Tailwind
className="bg-primary text-primary-foreground"
className="from-purple-500 to-blue-500" // Gradients
```

### Animations
```typescript
import { motion } from 'motion/react';

// Simple fade
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Hover effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

---

## 🔌 API Integration

### Using the API Client
```typescript
import { api } from '../utils/apiClient';

// Execute code
const response = await api.executeCode({
  code: userCode,
  language: 'javascript',
  problemId: 'prob-123',
  testCases: [...],
});

// Submit code
const result = await api.submitCode({
  code: userCode,
  language: 'javascript',
  problemId: 'prob-123',
  testCases: [...],
});

// Get contests
const contests = await api.getContests();

// Join contest
await api.joinContest(contestId);

// Get submissions
const subs = await api.getSubmissions(problemId);

// Get leaderboard
const leaders = await api.getLeaderboard('problem', problemId);

// Get user stats
const stats = await api.getUserStats();
```

### Error Handling Pattern
```typescript
try {
  setLoading(true);
  const response = await api.someEndpoint();
  
  if (response.success && response.data) {
    // Handle success
    toast.success('Operation successful!');
  } else {
    toast.error('Operation failed');
  }
} catch (error) {
  console.error('Error:', error);
  toast.error('Something went wrong');
} finally {
  setLoading(false);
}
```

---

## 🎯 Toast Notifications

### Import
```typescript
import { toast } from 'sonner@2.0.3';
```

### Usage
```typescript
// Success
toast.success('Problem solved! 🎉');

// Error
toast.error('Failed to submit code');

// Warning
toast.warning('Connection unstable');

// Info
toast.info('Running your code...');

// Loading (with promise)
toast.promise(
  api.submitCode(...),
  {
    loading: 'Submitting...',
    success: 'Submitted successfully!',
    error: 'Submission failed',
  }
);
```

---

## 🧩 Component Patterns

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

// In JSX
{isLoading ? (
  <Loader2 className="w-4 h-4 animate-spin" />
) : (
  <Play className="w-4 h-4" />
)}

// Disabled during loading
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Error Boundaries
```typescript
// Wrap components that might error
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Motion Animations
```typescript
// Page transitions
<AnimatePresence mode="wait">
  <motion.div
    key={page}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

---

## 🎨 Styling Patterns

### Gradient Backgrounds
```typescript
className="bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500"
```

### Glassmorphism
```typescript
className="bg-card/50 backdrop-blur-xl border border-border/50"
```

### Hover Effects
```typescript
className="hover:shadow-lg hover:scale-105 transition-all duration-300"
```

### Glow Effects
```typescript
className="glow-purple" // Predefined in globals.css
// or custom
style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
```

---

## 📊 Domain Configuration

### Get Domain Config
```typescript
import { getDomainConfig } from '../utils/domainConfig';

const config = getDomainConfig('competitive-programming');
// Returns: { name, category, icon, ... }
```

### Get Domain Subjects
```typescript
import { getDomainSubjects } from '../utils/domainConfig';

const subjects = getDomainSubjects('jee');
// Returns array of subjects with chapters and topics
```

### Get Domain Terminology
```typescript
import { getDomainTerminology } from '../utils/domainConfig';

const terms = getDomainTerminology('neet');
// Returns: { subject, chapter, topic, test, practice }
```

---

## 🔒 Configuration

### Toggle Mock Data
```typescript
// In /utils/config.ts
export const config = {
  useMockData: false, // true for demo mode, false for backend
  // ...
};
```

### Feature Flags
```typescript
// In /utils/config.ts
features: {
  codeExecution: true,
  discussions: true,
  contests: true,
  // ...
}
```

---

## 🎯 Common Tasks

### Adding a New Section
1. Create component in `/components/sections/`
2. Add to Dashboard navigation in `Dashboard.tsx`
3. Add route case in `renderSection()`
4. Create section icon and gradient

### Adding a New Domain
1. Update `/utils/domainConfig.ts` with new domain
2. Add subjects, chapters, topics
3. Update images in components if needed
4. Add domain-specific logic where needed

### Adding a New API Endpoint
1. Add method to `/utils/apiClient.ts`
2. Add mock data to MockDataService
3. Add error handling
4. Add to fallback system
5. Export from api object

### Creating a New Component
```typescript
import { useState } from 'react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface MyComponentProps {
  // Define props
}

export function MyComponent({ }: MyComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      // Do something
      toast.success('Success!');
    } catch (error) {
      toast.error('Failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Button onClick={handleAction} disabled={loading}>
        {loading ? 'Loading...' : 'Action'}
      </Button>
    </motion.div>
  );
}
```

---

## 🐛 Debugging

### Console Logging
```typescript
// Development only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Error logging (always log)
console.error('Error:', error);
```

### React DevTools
- Install React Developer Tools extension
- Inspect component hierarchy
- View props and state
- Profile performance

### Network Debugging
- Open browser DevTools (F12)
- Go to Network tab
- Filter by XHR/Fetch
- Inspect request/response

---

## ⚡ Performance Tips

### Memoization
```typescript
import { useMemo, useCallback } from 'react';

// Expensive calculations
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// Callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

// In render
<Suspense fallback={<Loader />}>
  <HeavyComponent />
</Suspense>
```

### Avoid Re-renders
```typescript
// Use React.memo for pure components
export const MyComponent = React.memo(({ prop }) => {
  // Component logic
});
```

---

## 🧪 Testing Tips

### Manual Testing Checklist
1. ✅ Test all buttons click
2. ✅ Forms submit correctly
3. ✅ Navigation works
4. ✅ Loading states show
5. ✅ Errors display properly
6. ✅ Toast notifications appear
7. ✅ Responsive on mobile
8. ✅ Keyboard navigation

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🔧 Common Issues & Solutions

### Issue: Toast not showing
```typescript
// Solution: Add Toaster to App.tsx
import { Toaster } from './components/ui/sonner';

<Toaster position="top-right" richColors />
```

### Issue: Motion animations not working
```typescript
// Solution: Check import
import { motion } from 'motion/react'; // Correct
// NOT: import { motion } from 'framer-motion'; // Old
```

### Issue: API calls failing
```typescript
// Solution: Check config
// In /utils/config.ts
useMockData: false // Should be false for backend
```

### Issue: Styles not applying
```typescript
// Solution: Check Tailwind classes
// Ensure classes are complete strings, not concatenated
className="text-primary" // ✅ Good
className={`text-${color}`} // ❌ Bad (Tailwind can't purge)
```

---

## 📚 Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Motion](https://motion.dev)
- [Shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

### Internal Docs
- `UI_UX_IMPROVEMENTS.md` - All improvements made
- `TESTING_CHECKLIST.md` - Testing guide
- `FINAL_SUMMARY.md` - Complete summary
- `TECH_STACK.md` - Technology details

---

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] All features tested
- [ ] No console errors
- [ ] Performance optimized
- [ ] Environment variables set
- [ ] Backend connected
- [ ] Build succeeds

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 💡 Best Practices

### Code Style
- Use TypeScript for type safety
- Follow component naming: PascalCase
- Use meaningful variable names
- Add comments for complex logic
- Keep components focused (single responsibility)

### State Management
- Use `useState` for local state
- Use `useEffect` for side effects
- Clean up effects (return cleanup function)
- Avoid prop drilling (use context if needed)

### Error Handling
- Always use try-catch for async operations
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI

### Performance
- Avoid unnecessary re-renders
- Use memoization when appropriate
- Lazy load heavy components
- Optimize images
- Cache API responses

---

## 🔑 Keyboard Shortcuts

### Code Editor
- `Tab` - Insert 2 spaces
- `Shift+Tab` - Outdent (prepared)
- `Ctrl/Cmd+Enter` - Run code (prepared)
- `Ctrl/Cmd+S` - Submit (prepared)

### Navigation
- `Tab` - Navigate through elements
- `Enter` - Activate buttons/links
- `Escape` - Close modals/menus
- `Arrow Keys` - Navigate lists

---

## 📞 Getting Help

### When Stuck
1. Check console for errors
2. Review relevant documentation
3. Check component props
4. Verify API responses
5. Check browser DevTools
6. Review this guide

### Common Errors
- "Cannot find module" → Run `npm install`
- "Type error" → Check TypeScript types
- "Network error" → Check API endpoint
- "Hook error" → Check React rules of hooks

---

## ✅ Quick Reference

### Component Imports
```typescript
// UI Components
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

// Icons
import { Play, Send, Loader2 } from 'lucide-react';

// Utils
import { api } from '../utils/apiClient';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
```

### Common Patterns
```typescript
// Loading button
<Button disabled={loading}>
  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  {loading ? 'Loading...' : 'Submit'}
</Button>

// Toast notification
toast.success('Action completed!');

// API call with error handling
try {
  const response = await api.someMethod();
  if (response.success) {
    toast.success('Success!');
  }
} catch (error) {
  toast.error('Failed');
}

// Motion animation
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

---

**Happy Coding! 🚀**

For more detailed information, refer to the complete documentation files in the project root.

---

**Last Updated:** November 30, 2025  
**Version:** 2.0.0
