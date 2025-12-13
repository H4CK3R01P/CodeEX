// Comprehensive API Testing Utility for CodeEX
// Tests all API endpoints and verifies functionality

import { api } from './apiClient';

interface TestResult {
  endpoint: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  duration?: number;
  data?: any;
}

class ApiTester {
  private results: TestResult[] = [];

  // Helper to test an API call
  private async testEndpoint(
    name: string,
    apiCall: () => Promise<any>,
    expectedDataKeys?: string[]
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const response = await apiCall();
      const duration = Date.now() - startTime;

      if (!response.success) {
        return {
          endpoint: name,
          status: 'fail',
          message: `API call failed: ${response.error || 'Unknown error'}`,
          duration,
        };
      }

      // Check if expected data keys are present
      if (expectedDataKeys && response.data) {
        const missingKeys = expectedDataKeys.filter(key => !(key in response.data));
        if (missingKeys.length > 0) {
          return {
            endpoint: name,
            status: 'warning',
            message: `Missing expected keys: ${missingKeys.join(', ')}`,
            duration,
            data: response.data,
          };
        }
      }

      return {
        endpoint: name,
        status: 'pass',
        message: 'API call successful',
        duration,
        data: response.data,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        endpoint: name,
        status: 'fail',
        message: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration,
      };
    }
  }

  // Test Code Execution APIs
  async testCodeExecution() {
    console.log('🧪 Testing Code Execution APIs...');

    const testCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

    const testCases = [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
    ];

    // Test executeCode
    const executeResult = await this.testEndpoint(
      'POST /execute-code',
      () => api.executeCode({
        code: testCode,
        language: 'javascript',
        problemId: 'test-problem-1',
        testCases,
      }),
      ['results']
    );
    this.results.push(executeResult);

    // Test submitCode
    const submitResult = await this.testEndpoint(
      'POST /submit-code',
      () => api.submitCode({
        code: testCode,
        language: 'javascript',
        problemId: 'test-problem-1',
        testCases,
      }),
      ['results', 'status']
    );
    this.results.push(submitResult);
  }

  // Test Submission APIs
  async testSubmissions() {
    console.log('🧪 Testing Submission APIs...');

    const result = await this.testEndpoint(
      'GET /submissions/:problemId',
      () => api.getSubmissions('test-problem-1'),
      ['submissions']
    );
    this.results.push(result);
  }

  // Test Leaderboard APIs
  async testLeaderboard() {
    console.log('🧪 Testing Leaderboard APIs...');

    const problemLeaderboard = await this.testEndpoint(
      'GET /leaderboard/problem/:id',
      () => api.getLeaderboard('problem', 'test-problem-1'),
      ['leaderboard']
    );
    this.results.push(problemLeaderboard);

    const contestLeaderboard = await this.testEndpoint(
      'GET /leaderboard/contest/:id',
      () => api.getLeaderboard('contest', 'test-contest-1'),
      ['leaderboard']
    );
    this.results.push(contestLeaderboard);
  }

  // Test User Stats APIs
  async testUserStats() {
    console.log('🧪 Testing User Stats APIs...');

    const result = await this.testEndpoint(
      'GET /user-stats',
      () => api.getUserStats(),
      ['stats']
    );
    this.results.push(result);
  }

  // Test Contest APIs
  async testContests() {
    console.log('🧪 Testing Contest APIs...');

    const getContests = await this.testEndpoint(
      'GET /contests',
      () => api.getContests(),
      ['contests']
    );
    this.results.push(getContests);

    const joinContest = await this.testEndpoint(
      'POST /contests/:contestId/join',
      () => api.joinContest('test-contest-1'),
      ['success']
    );
    this.results.push(joinContest);
  }

  // Test Discussion APIs
  async testDiscussions() {
    console.log('🧪 Testing Discussion APIs...');

    const getDiscussions = await this.testEndpoint(
      'GET /discussions/:problemId',
      () => api.getDiscussions('test-problem-1'),
      ['discussions']
    );
    this.results.push(getDiscussions);

    const postDiscussion = await this.testEndpoint(
      'POST /discussions/:problemId',
      () => api.postDiscussion({
        problemId: 'test-problem-1',
        content: 'This is a test discussion post',
        userId: 'test-user-1',
        userName: 'Test User',
      }),
      ['success']
    );
    this.results.push(postDiscussion);
  }

  // Test Coins APIs
  async testCoins() {
    console.log('🧪 Testing Coins APIs...');

    const getUserCoins = await this.testEndpoint(
      'GET /coins/:userId',
      () => api.getUserCoins(),
      ['coins']
    );
    this.results.push(getUserCoins);

    const awardCoins = await this.testEndpoint(
      'POST /award-coins',
      () => api.awardCoins({
        amount: 50,
        reason: 'Test reward',
      }),
      ['success', 'newTotal']
    );
    this.results.push(awardCoins);
  }

  // Test Resources APIs
  async testResources() {
    console.log('🧪 Testing Resources APIs...');

    const result = await this.testEndpoint(
      'GET /resources/:domain',
      () => api.getResources('competitive-programming'),
      ['resources']
    );
    this.results.push(result);
  }

  // Test Bookmarks APIs
  async testBookmarks() {
    console.log('🧪 Testing Bookmarks APIs...');

    const getBookmarks = await this.testEndpoint(
      'GET /bookmarks/:userId',
      () => api.getBookmarks(),
      ['bookmarks']
    );
    this.results.push(getBookmarks);

    const addBookmark = await this.testEndpoint(
      'POST /bookmarks',
      () => api.addBookmark({
        resourceId: 'test-resource-1',
        resourceType: 'problem',
      }),
      ['success', 'bookmark']
    );
    this.results.push(addBookmark);
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Starting Comprehensive API Tests...\n');
    this.results = [];

    await this.testCodeExecution();
    await this.testSubmissions();
    await this.testLeaderboard();
    await this.testUserStats();
    await this.testContests();
    await this.testDiscussions();
    await this.testCoins();
    await this.testResources();
    await this.testBookmarks();

    return this.results;
  }

  // Generate test report
  generateReport(): string {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const total = this.results.length;

    let report = '\n' + '='.repeat(80) + '\n';
    report += '  CodeEX API Test Report\n';
    report += '='.repeat(80) + '\n\n';

    report += `📊 Summary:\n`;
    report += `  Total Tests: ${total}\n`;
    report += `  ✅ Passed: ${passed} (${((passed/total)*100).toFixed(1)}%)\n`;
    report += `  ❌ Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)\n`;
    report += `  ⚠️  Warnings: ${warnings} (${((warnings/total)*100).toFixed(1)}%)\n\n`;

    report += '─'.repeat(80) + '\n';
    report += 'Detailed Results:\n';
    report += '─'.repeat(80) + '\n\n';

    for (const result of this.results) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
      const duration = result.duration ? ` (${result.duration}ms)` : '';
      
      report += `${icon} ${result.endpoint}${duration}\n`;
      report += `   ${result.message}\n`;
      
      if (result.data && result.status === 'pass') {
        const dataPreview = JSON.stringify(result.data).substring(0, 100);
        report += `   Data: ${dataPreview}${dataPreview.length >= 100 ? '...' : ''}\n`;
      }
      
      report += '\n';
    }

    report += '='.repeat(80) + '\n';

    return report;
  }

  // Get results as JSON
  getResults(): TestResult[] {
    return this.results;
  }
}

// Export singleton instance
export const apiTester = new ApiTester();

// Export test function for easy use
export async function testAllApis() {
  await apiTester.runAllTests();
  const report = apiTester.generateReport();
  console.log(report);
  return apiTester.getResults();
}

export default apiTester;
