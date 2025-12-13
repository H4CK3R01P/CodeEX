# CodeEX - Tech Stack Documentation

## 🚀 Overview
CodeEX is a modern educational platform built with cutting-edge web technologies, combining features from CodeChef, LeetCode, Codeforces, and Embibe for comprehensive coding practice and competitive exam preparation.

---

## 🎨 Frontend Framework & Core Technologies

### **React 18+**
- Component-based architecture
- Hooks for state management (useState, useEffect, useCallback)
- Custom hooks for reusable logic
- Error boundaries for robust error handling

### **TypeScript**
- Type-safe development
- Interface definitions for data structures
- Enhanced IDE support and autocomplete
- Compile-time error detection

### **Tailwind CSS v4.0**
- Utility-first CSS framework
- Custom design tokens in `styles/globals.css`
- Responsive design utilities
- JIT (Just-In-Time) compilation
- Custom color palette: Orange, Purple, Blue, Red

---

## 🎯 UI Component Library

### **shadcn/ui**
Complete set of accessible, customizable components:
- **Layout**: Card, Sheet, Sidebar, Separator, Resizable
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- **Navigation**: Tabs, Breadcrumb, Navigation Menu, Menubar, Pagination
- **Feedback**: Alert, Alert Dialog, Dialog, Toast (Sonner), Progress, Skeleton
- **Data Display**: Table, Badge, Avatar, Aspect Ratio, Hover Card
- **Overlays**: Popover, Dropdown Menu, Context Menu, Tooltip, Command
- **Date/Time**: Calendar, Input OTP
- **Advanced**: Accordion, Collapsible, Carousel, Toggle, Form, Chart

---

## 📊 Data Visualization & Charts

### **Recharts**
- Interactive charts and graphs
- Line charts, bar charts, pie charts
- Performance analytics visualization
- Progress tracking displays

---

## 💻 Code Editor

### **Monaco Editor / Custom Code Editor**
- Multi-language syntax highlighting
- Code execution environment
- Real-time code validation
- Support for multiple programming languages:
  - JavaScript
  - Python
  - C++
  - Java
  - And more

---

## 🗄️ Backend & Database

### **Supabase**
- **PostgreSQL Database**: Relational data storage
- **Authentication**: User registration, login, OTP verification
- **Real-time Subscriptions**: Live updates
- **Edge Functions**: Serverless backend logic
- **Row Level Security**: Data protection
- **Storage**: File and asset management

### **API Architecture**
- RESTful API patterns
- Mock data for development (`utils/mockTestData.ts`)
- API client utilities (`utils/apiClient.ts`)
- Domain-specific data generators

---

## 🎨 Icons & Visual Assets

### **Lucide React**
- Modern icon library
- Tree-shakeable imports
- Consistent icon design system
- 1000+ icons available

---

## 🔧 State Management & Data Flow

### **React Context API**
- Global state management
- User authentication state
- Domain selection state
- Test/practice session state

### **Local State**
- Component-level state with useState
- Form state management
- UI interaction state

---

## 🎭 Animation & Motion

### **Motion (Framer Motion)**
- Smooth page transitions
- Component animations
- Gesture-based interactions
- Spring physics animations
- Exit animations

---

## 📱 Responsive Design

### **Mobile-First Approach**
- Custom `use-mobile.ts` hook
- Breakpoint-based responsive design
- Touch-optimized interactions
- Adaptive layouts for all screen sizes

---

## 🧪 Development Tools

### **Build Tools**
- Vite (assumed based on modern React setup)
- Hot Module Replacement (HMR)
- Fast refresh for development

### **Code Quality**
- TypeScript strict mode
- ESLint for code linting
- Error boundaries for runtime error handling

---

## 📦 Key Libraries & Packages

### **Form Handling**
```typescript
import { ... } from 'react-hook-form@7.55.0'
```
- Form validation
- Error handling
- Form state management

### **Toast Notifications**
```typescript
import { toast } from 'sonner@2.0.3'
```
- Success/error notifications
- User feedback messages
- Custom toast styling

### **Date & Time**
- Calendar components
- Date formatting utilities

### **Drag & Drop**
- `react-dnd` for drag-and-drop interactions
- Problem reordering
- Custom test creation

### **Carousel**
- `react-slick` for content carousels
- Image galleries
- Feature showcases

### **Masonry Layouts**
- `react-responsive-masonry` for grid layouts
- Dynamic content organization

---

## 🎨 Design System

### **Color Palette**
```css
/* Primary Brand Colors */
--color-orange: #FF6B35
--color-purple: #8B5CF6
--color-blue: #3B82F6
--color-red: #EF4444

/* Gradients */
gradient-to-r from-orange-500 to-red-500
gradient-to-r from-purple-500 to-pink-500
gradient-to-r from-blue-500 to-cyan-500
```

### **Typography**
- Custom font system in `globals.css`
- Default typography for HTML elements
- Responsive font scaling

### **Spacing & Layout**
- Consistent spacing scale
- Grid and flex layouts
- Container max-widths

---

## 📂 Project Structure

```
CodeEX/
├── App.tsx                          # Main application component
├── components/
│   ├── Dashboard.tsx                # Main dashboard
│   ├── CodeEditor.tsx               # Code execution environment
│   ├── LoginForm.tsx                # Authentication
│   ├── OTPVerification.tsx          # OTP verification
│   ├── ProfileSelection.tsx         # User profile setup
│   ├── DomainSelection.tsx          # Domain/field selection
│   ├── ErrorBoundary.tsx            # Error handling
│   ├── sections/                    # Dashboard sections
│   │   ├── DashboardHome.tsx        # Overview
│   │   ├── Practice.tsx             # Coding practice
│   │   ├── ProblemDetail.tsx        # Problem solving
│   │   ├── Test.tsx                 # Test management
│   │   ├── Compete.tsx              # Contests
│   │   ├── Learn.tsx                # Learning resources
│   │   ├── CoinsSection.tsx         # Rewards
│   │   └── Achieve.tsx              # Achievements
│   └── ui/                          # shadcn/ui components
├── utils/
│   ├── apiClient.ts                 # API utilities
│   ├── domainConfig.ts              # Domain configurations
│   ├── domainData.ts                # Domain-specific data
│   ├── codingProblems.ts            # Problem database
│   └── mockTestData.ts              # Mock data
├── supabase/
│   └── functions/                   # Supabase edge functions
└── styles/
    └── globals.css                  # Global styles & tokens
```

---

## 🔐 Security Features

### **Authentication**
- Secure OTP verification
- Password hashing
- Session management
- JWT tokens (via Supabase)

### **Data Protection**
- Row Level Security (RLS)
- Input sanitization
- CORS policies
- Secure API endpoints

---

## 🚀 Performance Optimizations

### **Code Splitting**
- Lazy loading components
- Dynamic imports
- Route-based splitting

### **Asset Optimization**
- Image lazy loading with `ImageWithFallback`
- SVG optimization
- Font loading strategies

### **Caching**
- API response caching
- Static asset caching
- Browser caching strategies

---

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📈 Analytics & Monitoring (Planned)

- User activity tracking
- Performance monitoring
- Error logging
- Usage analytics

---

## 🔄 Version Control

- Git for source control
- Semantic versioning
- Feature branch workflow

---

## 🎯 Key Features Implementation

### **Multi-Domain Support**
- Coding: Competitive Programming, Frontend, Backend, Mobile
- Exams: JEE, NEET
- Dynamic content generation per domain

### **Code Execution**
- Real-time code compilation
- Multiple language support
- Test case validation
- Performance metrics

### **Test System**
- Custom test creation
- Chapter-wise selection
- Difficulty levels (Easy, Medium, Hard)
- Timer functionality
- Instant feedback
- Detailed explanations

### **Gamification**
- Coins and rewards
- Leaderboards
- Achievements
- Progress tracking
- Streaks and milestones

### **Contest Platform**
- Live contests
- Past contests
- Rankings
- Virtual participation

---

## 📱 PWA Features (Future)

- Offline capability
- Install to home screen
- Push notifications
- Background sync

---

## 🤝 Third-Party Integrations

### **Current**
- Supabase (Backend)
- Lucide Icons
- Unsplash (Images via API)

### **Planned**
- Email service (SendGrid/Mailgun)
- Payment gateway (Stripe/Razorpay)
- Cloud storage (AWS S3/Cloudflare R2)
- Code execution API (Judge0/Piston)

---

## 📝 Documentation

- START_HERE.md - Getting started guide
- QUICK_START.md - Quick setup instructions
- README.md - Project overview
- STATUS.md - Current development status
- IMPLEMENTATION_SUMMARY.md - Feature implementation details
- ERROR_FIXES.md - Bug fixes documentation
- SUPABASE_CONFIGURED.md - Backend setup guide

---

## 🔮 Future Tech Additions

- **GraphQL**: For more flexible API queries
- **Redis**: For caching and session management
- **WebSockets**: For real-time features
- **Docker**: For containerization
- **CI/CD**: Automated testing and deployment
- **Testing**: Jest, React Testing Library, Cypress

---

## 📞 Tech Stack Summary

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18+, TypeScript, Tailwind CSS v4.0 |
| **UI Library** | shadcn/ui (50+ components) |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **State** | React Context API, Hooks |
| **Animation** | Motion (Framer Motion) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Forms** | React Hook Form |
| **Notifications** | Sonner |
| **Code Editor** | Monaco Editor / Custom |
| **Styling** | Tailwind CSS, CSS Variables |
| **Build** | Vite (assumed) |
| **Deployment** | Figma Make Platform |

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org)

---

## 💡 Best Practices

✅ Component-based architecture
✅ Type safety with TypeScript
✅ Responsive mobile-first design
✅ Accessible UI components
✅ Clean code organization
✅ Error boundary implementation
✅ Optimized performance
✅ Secure authentication
✅ Consistent design system

---

**Built with ❤️ using modern web technologies**

*Last Updated: November 9, 2025*
