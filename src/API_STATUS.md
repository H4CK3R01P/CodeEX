# CodeEX API Status & Configuration

## Overview
This document provides a comprehensive overview of all API endpoints in the CodeEX platform, their status, and configuration details.

## Configuration

### Current Mode
- **Backend Mode**: Supabase (Real Backend)
- **Use Mock Data**: `false` (configured in `/utils/config.ts`)
- **Project ID**: `crbsakzmbkfbdfxidshr`
- **API Base URL**: `https://crbsakzmbkfbdfxidshr.supabase.co/functions/v1/make-server-b9684b04`

### Environment
- API Timeout: 30 seconds
- Max Retries: 2
- Cache TTL: 5 minutes

## API Endpoints

### 1. Code Execution APIs

#### POST /execute-code
**Purpose**: Execute code against test cases (Run button functionality)  
**Status**: ✅ Implemented  
**Client**: `api.executeCode()`  
**Server**: `/supabase/functions/server/index.tsx` (line 29)  
**Request Body**:
```typescript
{
  code: string;
  language: string;
  problemId: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
  userId?: string;
}
```
**Response**:
```typescript
{
  results: Array<{
    passed: boolean;
    output: string;
    runtime: number;
    memory: number;
  }>;
}
```

#### POST /submit-code
**Purpose**: Submit code solution and record submission (Submit button functionality)  
**Status**: ✅ Implemented  
**Client**: `api.submitCode()`  
**Server**: `/supabase/functions/server/index.tsx` (line 46)  
**Request Body**: Same as /execute-code  
**Response**:
```typescript
{
  results: Array<TestResult>;
  status: 'accepted' | 'wrong_answer';
  avgRuntime: string;
  memory: string;
  failedCase?: {
    input: string;
    expected: string;
    actual: string;
  };
  submissionId: string;
}
```

### 2. Submission Management APIs

#### GET /submissions/:problemId
**Purpose**: Retrieve all submissions for a specific problem  
**Status**: ✅ Implemented  
**Client**: `api.getSubmissions(problemId, userId?)`  
**Server**: `/supabase/functions/server/index.tsx` (line 130)  
**Response**:
```typescript
{
  submissions: Array<{
    id: string;
    problemId: string;
    code: string;
    language: string;
    status: string;
    timestamp: string;
    runtime: string;
    memory: string;
    testCasesPassed: number;
    totalTestCases: number;
  }>;
}
```

### 3. Leaderboard APIs

#### GET /leaderboard/:type/:id
**Purpose**: Get leaderboard for problems or contests  
**Status**: ✅ Implemented  
**Client**: `api.getLeaderboard(type, id)`  
**Server**: `/supabase/functions/server/index.tsx` (line 146)  
**Parameters**:
- `type`: 'problem' | 'contest'
- `id`: Problem ID or Contest ID  
**Response**:
```typescript
{
  leaderboard: Array<{
    rank: number;
    userId: string;
    userName: string;
    score?: number; // For contests
    runtime?: string; // For problems
    problemsSolved?: number; // For contests
    timestamp: string;
    language: string;
  }>;
}
```

### 4. User Statistics APIs

#### GET /user-stats
**Purpose**: Retrieve user statistics and progress  
**Status**: ✅ Implemented  
**Client**: `api.getUserStats(userId?)`  
**Server**: `/supabase/functions/server/index.tsx` (line 171)  
**Query Parameters**: `userId` (optional, defaults to 'user-1')  
**Response**:
```typescript
{
  stats: {
    problemsSolved: number;
    totalSubmissions: number;
    acceptanceRate: number;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    streak: number;
    rank: number;
    rating: number;
    contestsParticipated: number;
    badges: string[];
  };
}
```

### 5. Contest APIs

#### GET /contests
**Purpose**: Get list of active/upcoming contests  
**Status**: ✅ Implemented  
**Client**: `api.getContests()`  
**Server**: `/supabase/functions/server/index.tsx` (line 206)  
**Response**:
```typescript
{
  contests: Array<{
    id: string;
    name: string;
    description: string;
    startTime: string;
    duration: string;
    participants: number;
    problems: number;
    status: 'upcoming' | 'running' | 'ended';
    difficulty: string;
    prize: string;
  }>;
}
```

#### POST /contests/:contestId/join
**Purpose**: Register user for a contest  
**Status**: ✅ Implemented  
**Client**: `api.joinContest(contestId, userId?)`  
**Server**: `/supabase/functions/server/index.tsx` (line 228)  
**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

### 6. Discussion APIs

#### GET /discussions/:problemId
**Purpose**: Get discussion threads for a problem  
**Status**: ✅ Implemented  
**Client**: `api.getDiscussions(problemId)`  
**Server**: `/supabase/functions/server/index.tsx` (line 250)  
**Response**:
```typescript
{
  discussions: Array<{
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
    likes: number;
    replies: Array<Reply>;
  }>;
}
```

#### POST /discussions/:problemId
**Purpose**: Post a new discussion/comment  
**Status**: ✅ Implemented  
**Client**: `api.postDiscussion(params)`  
**Server**: `/supabase/functions/server/index.tsx` (line 273)  
**Request Body**:
```typescript
{
  problemId: string;
  userId?: string;
  userName?: string;
  content: string;
}
```

### 7. Coins & Rewards APIs

#### GET /coins/:userId
**Purpose**: Get user's coin balance  
**Status**: ✅ Implemented  
**Client**: `api.getUserCoins(userId?)`  
**Server**: `/supabase/functions/server/index.tsx` (line 341)  
**Response**:
```typescript
{
  coins: number;
}
```

#### POST /award-coins
**Purpose**: Award coins to user for achievements  
**Status**: ✅ Implemented  
**Client**: `api.awardCoins(params)`  
**Server**: `/supabase/functions/server/index.tsx` (line 303)  
**Request Body**:
```typescript
{
  userId?: string;
  amount: number;
  reason: string;
}
```
**Response**:
```typescript
{
  success: boolean;
  newTotal: number;
  transaction: {
    id: string;
    amount: number;
    reason: string;
    timestamp: string;
    balance: number;
  };
}
```

### 8. Resources APIs

#### GET /resources/:domain
**Purpose**: Get learning resources for a specific domain  
**Status**: ✅ Implemented  
**Client**: `api.getResources(domain)`  
**Server**: `/supabase/functions/server/index.tsx` (line 356)  
**Response**:
```typescript
{
  resources: Array<{
    id: string;
    title: string;
    type: 'video' | 'article' | 'course';
    duration: string;
    difficulty: string;
    topic: string;
    completed: boolean;
    rating: number;
  }>;
}
```

### 9. Bookmarks APIs

#### GET /bookmarks/:userId
**Purpose**: Get user's bookmarked resources  
**Status**: ✅ Implemented  
**Client**: `api.getBookmarks(userId?)`  
**Server**: `/supabase/functions/server/index.tsx` (line 405)  
**Response**:
```typescript
{
  bookmarks: Array<{
    id: string;
    resourceId: string;
    resourceType: string;
    timestamp: string;
  }>;
}
```

#### POST /bookmarks
**Purpose**: Bookmark a resource  
**Status**: ✅ Implemented  
**Client**: `api.addBookmark(params)`  
**Server**: `/supabase/functions/server/index.tsx` (line 379)  
**Request Body**:
```typescript
{
  userId?: string;
  resourceId: string;
  resourceType: string;
}
```

### 10. Health Check API

#### GET /health
**Purpose**: Check API server health status  
**Status**: ✅ Implemented  
**Server**: `/supabase/functions/server/index.tsx` (line 24)  
**Response**:
```typescript
{
  status: 'ok';
  timestamp: string;
}
```

## Data Storage

### KV Store
All data is stored in Supabase's PostgreSQL database using a key-value store pattern:
- **Table**: `kv_store_b9684b04`
- **Schema**: `{ key: TEXT PRIMARY KEY, value: JSONB }`
- **Location**: `/supabase/functions/server/kv_store.tsx`

### Key Patterns
- Submissions: `submissions:{problemId}`
- User Stats: `user:{userId}:stats`
- Leaderboard: `leaderboard:{type}:{id}`
- Contests: `contests:active`
- Discussions: `discussions:{problemId}`
- Coins: `user:{userId}:coins`
- Bookmarks: `user:{userId}:bookmarks`
- Resources: `resources:{domain}`

## Cache Strategy

### Client-Side Caching
- **Implementation**: In-memory Map with TTL
- **TTL**: 5 minutes
- **Location**: `/utils/apiClient.ts` (ApiCache class)
- **Cached Endpoints**:
  - Submissions
  - Leaderboards
  - User Stats
  - Contests
  - Discussions
  - Coins
  - Resources
  - Bookmarks

### Cache Invalidation
- Automatic: After TTL expires
- Manual: On data mutation (POST/PUT/DELETE operations)
- API: `api.clearCache()` method available

## Fallback Mechanism

### Mock Data Fallback
When the backend API is unavailable or `useMockData: true`:
1. Client attempts real API call
2. On failure, falls back to MockDataService
3. Simulates realistic delays (100-300ms)
4. Returns mock data matching production schema
5. Logs warning to console

### Mock Data Features
- Realistic code execution simulation
- Persistent in-memory storage
- Dynamic data generation
- Consistent with production schemas

## Testing

### API Tester
**Location**: `/utils/apiTester.ts`

**Features**:
- Tests all 18+ API endpoints
- Measures response times
- Validates response schemas
- Generates detailed reports

**Usage**:
```typescript
import { testAllApis } from './utils/apiTester';

// Run all tests
const results = await testAllApis();
```

### API Status Page
**Component**: `/components/ApiStatusPage.tsx`

**Features**:
- Real-time API health monitoring
- Visual test results
- Performance metrics
- Auto-refresh capability

## Integration Points

### Components Using APIs

1. **ProblemDetail.tsx** - Uses: executeCode, submitCode, getSubmissions
2. **EnhancedProblemDetail.tsx** - Uses: executeCode, submitCode, getSubmissions
3. **ContestsHub.tsx** - Uses: getContests, joinContest
4. **Compete.tsx** - Contest integration
5. **Learn.tsx** - Resources integration
6. **CoinsSection.tsx** - Coins display (static currently)
7. **Achieve.tsx** - User stats display

### Potential Enhancements

1. **Real-time Updates**: WebSocket integration for live leaderboards
2. **Batch Operations**: Combine multiple API calls
3. **Offline Support**: Service Worker + IndexedDB caching
4. **Analytics**: Track API usage and performance
5. **Rate Limiting**: Client-side throttling
6. **Optimistic Updates**: Update UI before API confirmation

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - **Solution**: Check Supabase function CORS configuration
   - **Location**: `/supabase/functions/server/index.tsx` (line 9)

2. **Timeout Errors**
   - **Solution**: Increase timeout in config
   - **Location**: `/utils/config.ts`

3. **Cache Issues**
   - **Solution**: Call `api.clearCache()`
   - **Manual**: Clear browser cache

4. **Mock Data Stuck**
   - **Solution**: Change `useMockData` to `false` in config
   - **Location**: `/utils/config.ts`

### Debug Mode

Enable verbose logging:
```typescript
// In browser console
localStorage.setItem('DEBUG_API', 'true');
```

## Performance Metrics

### Target Benchmarks
- Code Execution: < 2000ms
- Data Fetching: < 500ms
- Mutations: < 1000ms
- Cache Hits: < 10ms

### Monitoring
Use API Status Page to monitor:
- Success rates
- Average response times
- Error patterns
- Endpoint availability

## Security

### Current Implementation
- Bearer token authentication
- CORS enabled for all origins (development)
- Service role key for backend operations
- No sensitive data in client code

### Production Recommendations
1. Restrict CORS to production domain
2. Implement request signing
3. Add rate limiting
4. Enable audit logging
5. Implement JWT refresh tokens
6. Add input validation middleware

## Version History

### v1.0.0 (Current)
- ✅ All 18 endpoints implemented
- ✅ Mock data fallback system
- ✅ Client-side caching
- ✅ Comprehensive testing utility
- ✅ API status monitoring
- ✅ Supabase integration

## Next Steps

1. ✅ Add missing API methods to client (COMPLETED)
2. ✅ Create comprehensive testing utility (COMPLETED)
3. ✅ Implement API status monitoring (COMPLETED)
4. ⏳ Integrate real code execution service (Judge0/Piston)
5. ⏳ Add WebSocket support for real-time features
6. ⏳ Implement analytics and monitoring
7. ⏳ Add user authentication system
8. ⏳ Implement contest timer and auto-submission

---

**Last Updated**: November 30, 2025  
**Maintainer**: CodeEX Development Team  
**Status**: Production Ready (Mock Mode) / Beta (Real Backend)
