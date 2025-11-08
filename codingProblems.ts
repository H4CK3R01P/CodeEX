// Comprehensive coding problem data structure and generator

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface ProblemConstraint {
  text: string;
}

export interface CodeTemplate {
  language: string;
  code: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  topics: string[];
  companies: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: ProblemConstraint[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  codeTemplates: CodeTemplate[];
  hints: string[];
  editorial?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  acceptanceRate: number;
  submissions: number;
  accepted: number;
  likes: number;
  dislikes: number;
  isPremium: boolean;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  problems: CodingProblem[];
  participants: number;
  isActive: boolean;
  isUpcoming: boolean;
  prizes: string[];
  difficulty: string;
}

// Generate problems for Competitive Programming
export function generateCompetitiveProgrammingProblems(): CodingProblem[] {
  return [
    {
      id: 'cp-1',
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      category: 'Arrays & Strings',
      topics: ['Array', 'Hash Table', 'Two Pointers'],
      companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      inputFormat: 'Line 1: Array size n\nLine 2: n space-separated integers (nums)\nLine 3: target integer',
      outputFormat: 'Two space-separated integers representing the indices',
      constraints: [
        { text: '2 <= nums.length <= 10^4' },
        { text: '-10^9 <= nums[i] <= 10^9' },
        { text: '-10^9 <= target <= 10^9' },
        { text: 'Only one valid answer exists' },
      ],
      examples: [
        {
          input: '4\n2 7 11 15\n9',
          output: '0 1',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
          input: '3\n3 2 4\n6',
          output: '1 2',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        },
      ],
      testCases: [
        {
          id: 'tc-1',
          input: '4\n2 7 11 15\n9',
          expectedOutput: '0 1',
          isHidden: false,
          explanation: 'nums[0] (2) + nums[1] (7) = 9, so we return indices [0, 1]',
        },
        {
          id: 'tc-2',
          input: '3\n3 2 4\n6',
          expectedOutput: '1 2',
          isHidden: false,
          explanation: 'nums[1] (2) + nums[2] (4) = 6, so we return indices [1, 2]',
        },
        {
          id: 'tc-3',
          input: '2\n3 3\n6',
          expectedOutput: '0 1',
          isHidden: true,
          explanation: 'Both elements are 3, and 3+3=6. Return [0, 1]',
        },
      ],
      codeTemplates: [
        {
          language: 'javascript',
          code: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}\n\n// Don't modify below\nconst readline = require('readline');\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nlet lines = [];\nrl.on('line', (line) => {\n  lines.push(line);\n}).on('close', () => {\n  const n = parseInt(lines[0]);\n  const nums = lines[1].split(' ').map(Number);\n  const target = parseInt(lines[2]);\n  const result = twoSum(nums, target);\n  console.log(result.join(' '));\n});`,
        },
        {
          language: 'python',
          code: `def twoSum(nums, target):\n    # Write your solution here\n    pass\n\n# Don't modify below\nif __name__ == "__main__":\n    n = int(input())\n    nums = list(map(int, input().split()))\n    target = int(input())\n    result = twoSum(nums, target)\n    print(' '.join(map(str, result)))`,
        },
        {
          language: 'cpp',
          code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    \n}\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) {\n        cin >> nums[i];\n    }\n    cin >> target;\n    \n    vector<int> result = twoSum(nums, target);\n    cout << result[0] << " " << result[1] << endl;\n    \n    return 0;\n}`,
        },
      ],
      hints: [
        'Try using a hash map to store values you\'ve seen',
        'For each number, check if target - number exists in the hash map',
        'Remember to store the index along with the value',
      ],
      editorial: `## Approach 1: Brute Force\n\nCheck every pair of numbers.\n\n**Time Complexity:** O(n²)\n**Space Complexity:** O(1)\n\n## Approach 2: Hash Map (Optimal)\n\nUse a hash map to store numbers we've seen. For each number, check if target - number exists in the map.\n\n**Time Complexity:** O(n)\n**Space Complexity:** O(n)`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      acceptanceRate: 48.5,
      submissions: 15420000,
      accepted: 7478000,
      likes: 42500,
      dislikes: 1520,
      isPremium: false,
    },
    {
      id: 'cp-2',
      title: 'Longest Substring Without Repeating Characters',
      slug: 'longest-substring-without-repeating',
      difficulty: 'Medium',
      category: 'Arrays & Strings',
      topics: ['String', 'Hash Table', 'Sliding Window'],
      companies: ['Amazon', 'Google', 'Bloomberg', 'Adobe'],
      description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
      inputFormat: 'A single string s',
      outputFormat: 'An integer representing the length',
      constraints: [
        { text: '0 <= s.length <= 5 * 10^4' },
        { text: 's consists of English letters, digits, symbols and spaces' },
      ],
      examples: [
        {
          input: 'abcabcbb',
          output: '3',
          explanation: 'The answer is "abc", with the length of 3.',
        },
        {
          input: 'bbbbb',
          output: '1',
          explanation: 'The answer is "b", with the length of 1.',
        },
        {
          input: 'pwwkew',
          output: '3',
          explanation: 'The answer is "wke", with the length of 3.',
        },
      ],
      testCases: [
        { id: 'tc-1', input: 'abcabcbb', expectedOutput: '3', isHidden: false, explanation: 'Longest substring is "abc" with length 3' },
        { id: 'tc-2', input: 'bbbbb', expectedOutput: '1', isHidden: false, explanation: 'All characters are same, so longest is "b" with length 1' },
        { id: 'tc-3', input: 'pwwkew', expectedOutput: '3', isHidden: false, explanation: 'Longest substring is "wke" with length 3' },
        { id: 'tc-4', input: '', expectedOutput: '0', isHidden: true, explanation: 'Empty string has length 0' },
        { id: 'tc-5', input: 'dvdf', expectedOutput: '3', isHidden: true, explanation: 'Longest is "vdf" with length 3' },
      ],
      codeTemplates: [
        {
          language: 'javascript',
          code: `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  \n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on('line', (line) => {\n  console.log(lengthOfLongestSubstring(line));\n  rl.close();\n});`,
        },
        {
          language: 'python',
          code: `def lengthOfLongestSubstring(s):\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    s = input()\n    print(lengthOfLongestSubstring(s))`,
        },
      ],
      hints: [
        'Use a sliding window approach',
        'Keep track of characters in a set or hash map',
        'When you find a duplicate, move the left pointer',
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(m, n))',
      acceptanceRate: 33.2,
      submissions: 8950000,
      accepted: 2971000,
      likes: 35800,
      dislikes: 1680,
      isPremium: false,
    },
    {
      id: 'cp-3',
      title: 'Median of Two Sorted Arrays',
      slug: 'median-of-two-sorted-arrays',
      difficulty: 'Hard',
      category: 'Arrays & Strings',
      topics: ['Array', 'Binary Search', 'Divide and Conquer'],
      companies: ['Google', 'Microsoft', 'Apple', 'Amazon'],
      description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
      inputFormat: 'Line 1: Size m\nLine 2: m space-separated integers (nums1)\nLine 3: Size n\nLine 4: n space-separated integers (nums2)',
      outputFormat: 'A floating point number with 1 decimal place',
      constraints: [
        { text: 'nums1.length == m' },
        { text: 'nums2.length == n' },
        { text: '0 <= m <= 1000' },
        { text: '0 <= n <= 1000' },
        { text: '1 <= m + n <= 2000' },
        { text: '-10^6 <= nums1[i], nums2[i] <= 10^6' },
      ],
      examples: [
        {
          input: '2\n1 3\n1\n2',
          output: '2.0',
          explanation: 'Merged array = [1,2,3] and median is 2.',
        },
        {
          input: '2\n1 2\n2\n3 4',
          output: '2.5',
          explanation: 'Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
        },
      ],
      testCases: [
        { id: 'tc-1', input: '2\n1 3\n1\n2', expectedOutput: '2.0', isHidden: false },
        { id: 'tc-2', input: '2\n1 2\n2\n3 4', expectedOutput: '2.5', isHidden: false },
        { id: 'tc-3', input: '0\n\n1\n1', expectedOutput: '1.0', isHidden: true },
      ],
      codeTemplates: [
        {
          language: 'javascript',
          code: `function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n  \n}\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nlet lines = [];\nrl.on('line', (line) => lines.push(line)).on('close', () => {\n  const m = parseInt(lines[0]);\n  const nums1 = m > 0 ? lines[1].split(' ').map(Number) : [];\n  const n = parseInt(lines[2]);\n  const nums2 = n > 0 ? lines[3].split(' ').map(Number) : [];\n  console.log(findMedianSortedArrays(nums1, nums2).toFixed(1));\n});`,
        },
      ],
      hints: [
        'This problem requires binary search',
        'Think about partitioning both arrays',
        'The median divides the sorted array into two halves',
      ],
      timeComplexity: 'O(log(min(m,n)))',
      spaceComplexity: 'O(1)',
      acceptanceRate: 36.8,
      submissions: 3200000,
      accepted: 1177600,
      likes: 24500,
      dislikes: 2840,
      isPremium: false,
    },
    // Add 7 more Competitive Programming problems
    {
      id: 'cp-4',
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      difficulty: 'Easy',
      category: 'Arrays & Strings',
      topics: ['Stack', 'String'],
      companies: ['Amazon', 'Microsoft', 'Bloomberg'],
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
      inputFormat: 'A single string s',
      outputFormat: 'true or false',
      constraints: [{ text: '1 <= s.length <= 10^4' }],
      examples: [
        { input: '()', output: 'true', explanation: 'Valid' },
        { input: '()[]{}', output: 'true', explanation: 'All valid pairs' },
      ],
      testCases: [
        { id: 'tc-1', input: '()', expectedOutput: 'true', isHidden: false },
        { id: 'tc-2', input: '(]', expectedOutput: 'false', isHidden: true },
      ],
      codeTemplates: [
        { language: 'javascript', code: `function isValid(s) {\n  // Your code here\n}\nconsole.log(isValid(require('fs').readFileSync(0, 'utf-8').trim()));` },
      ],
      hints: ['Use a stack', 'Match opening with closing brackets'],
      acceptanceRate: 40.5,
      submissions: 5200000,
      accepted: 2106000,
      likes: 18500,
      dislikes: 850,
      isPremium: false,
    },
    {
      id: 'cp-5',
      title: 'Merge Two Sorted Lists',
      slug: 'merge-two-sorted-lists',
      difficulty: 'Easy',
      category: 'Trees & BST',
      topics: ['Linked List', 'Recursion'],
      companies: ['Amazon', 'Microsoft', 'Apple'],
      description: `Merge two sorted linked lists and return it as a sorted list.`,
      inputFormat: 'Two lines with space-separated integers',
      outputFormat: 'Space-separated integers of merged list',
      constraints: [{ text: '0 <= list length <= 50' }],
      examples: [
        { input: '1 2 4\n1 3 4', output: '1 1 2 3 4 4', explanation: 'Merged sorted lists' },
      ],
      testCases: [
        { id: 'tc-1', input: '1 2 4\n1 3 4', expectedOutput: '1 1 2 3 4 4', isHidden: false },
      ],
      codeTemplates: [
        { language: 'python', code: `def mergeTwoLists(l1, l2):\n    # Your code\n    pass\nprint(' '.join(map(str, mergeTwoLists(list(map(int, input().split())), list(map(int, input().split()))))))` },
      ],
      hints: ['Use two pointers', 'Compare values and build new list'],
      acceptanceRate: 58.3,
      submissions: 4800000,
      accepted: 2798400,
      likes: 16200,
      dislikes: 520,
      isPremium: false,
    },
    {
      id: 'cp-6',
      title: 'Maximum Subarray',
      slug: 'maximum-subarray',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      topics: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
      companies: ['Amazon', 'Microsoft', 'LinkedIn'],
      description: `Given an integer array nums, find the contiguous subarray with the largest sum.`,
      inputFormat: 'Line 1: n\nLine 2: n integers',
      outputFormat: 'Maximum subarray sum',
      constraints: [{ text: '1 <= nums.length <= 10^5' }],
      examples: [
        { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'Subarray [4,-1,2,1] has sum 6' },
      ],
      testCases: [
        { id: 'tc-1', input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      ],
      codeTemplates: [
        { language: 'cpp', code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Kadane's algorithm\n    return 0;\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    cout << maxSubArray(nums);\n    return 0;\n}` },
      ],
      hints: ['Use Kadane\'s algorithm', 'Keep track of current and max sum'],
      acceptanceRate: 49.8,
      submissions: 6200000,
      accepted: 3087600,
      likes: 28500,
      dislikes: 1350,
      isPremium: false,
    },
    {
      id: 'cp-7',
      title: 'Binary Tree Level Order Traversal',
      slug: 'binary-tree-level-order',
      difficulty: 'Medium',
      category: 'Trees & BST',
      topics: ['Tree', 'BFS', 'Binary Tree'],
      companies: ['Amazon', 'Microsoft', 'Facebook'],
      description: `Given the root of a binary tree, return the level order traversal of its nodes' values.`,
      inputFormat: 'Level-order values (null for empty)',
      outputFormat: 'Level by level values',
      constraints: [{ text: '0 <= nodes <= 2000' }],
      examples: [
        { input: '3 9 20 null null 15 7', output: '[[3],[9,20],[15,7]]', explanation: 'Level order traversal' },
      ],
      testCases: [
        { id: 'tc-1', input: '3 9 20 null null 15 7', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false },
      ],
      codeTemplates: [
        { language: 'javascript', code: `function levelOrder(root) {\n    // BFS approach\n    return [];\n}\n// Input parsing and output` },
      ],
      hints: ['Use BFS with queue', 'Process level by level'],
      acceptanceRate: 61.5,
      submissions: 3800000,
      accepted: 2337000,
      likes: 12800,
      dislikes: 280,
      isPremium: false,
    },
    {
      id: 'cp-8',
      title: 'Coin Change',
      slug: 'coin-change',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      topics: ['Array', 'Dynamic Programming', 'BFS'],
      companies: ['Amazon', 'Google', 'Uber'],
      description: `You are given an integer array coins representing different denominations and an integer amount. Return the fewest number of coins needed to make up that amount.`,
      inputFormat: 'Line 1: n (coins count)\nLine 2: n coin values\nLine 3: amount',
      outputFormat: 'Minimum coins needed, or -1 if impossible',
      constraints: [{ text: '1 <= coins.length <= 12' }, { text: '1 <= amount <= 10^4' }],
      examples: [
        { input: '3\n1 2 5\n11', output: '3', explanation: '11 = 5 + 5 + 1' },
      ],
      testCases: [
        { id: 'tc-1', input: '3\n1 2 5\n11', expectedOutput: '3', isHidden: false },
      ],
      codeTemplates: [
        { language: 'python', code: `def coinChange(coins, amount):\n    # DP solution\n    pass\nn = int(input())\ncoins = list(map(int, input().split()))\namount = int(input())\nprint(coinChange(coins, amount))` },
      ],
      hints: ['Use dynamic programming', 'Build up from amount 0'],
      acceptanceRate: 41.2,
      submissions: 4500000,
      accepted: 1854000,
      likes: 15600,
      dislikes: 380,
      isPremium: false,
    },
    {
      id: 'cp-9',
      title: 'Number of Islands',
      slug: 'number-of-islands',
      difficulty: 'Medium',
      category: 'Graph Algorithms',
      topics: ['Array', 'DFS', 'BFS', 'Matrix'],
      companies: ['Amazon', 'Microsoft', 'Google'],
      description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.`,
      inputFormat: 'Line 1: rows m, cols n\nNext m lines: grid',
      outputFormat: 'Number of islands',
      constraints: [{ text: '1 <= m, n <= 300' }],
      examples: [
        { input: '4 5\n11110\n11010\n11000\n00000', output: '1', explanation: 'One connected island' },
      ],
      testCases: [
        { id: 'tc-1', input: '4 5\n11110\n11010\n11000\n00000', expectedOutput: '1', isHidden: false },
      ],
      codeTemplates: [
        { language: 'cpp', code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n    // DFS/BFS solution\n    return 0;\n}\n\nint main() {\n    int m, n; cin >> m >> n;\n    vector<vector<char>> grid(m, vector<char>(n));\n    for(int i = 0; i < m; i++)\n        for(int j = 0; j < n; j++)\n            cin >> grid[i][j];\n    cout << numIslands(grid);\n    return 0;\n}` },
      ],
      hints: ['Use DFS or BFS', 'Mark visited cells'],
      acceptanceRate: 52.8,
      submissions: 5600000,
      accepted: 2956800,
      likes: 19400,
      dislikes: 450,
      isPremium: false,
    },
    {
      id: 'cp-10',
      title: 'Climbing Stairs',
      slug: 'climbing-stairs',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      topics: ['Math', 'Dynamic Programming', 'Memoization'],
      companies: ['Amazon', 'Google', 'Adobe'],
      description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
      inputFormat: 'A single integer n',
      outputFormat: 'Number of distinct ways',
      constraints: [{ text: '1 <= n <= 45' }],
      examples: [
        { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
      ],
      testCases: [
        { id: 'tc-1', input: '3', expectedOutput: '3', isHidden: false },
        { id: 'tc-2', input: '5', expectedOutput: '8', isHidden: true },
      ],
      codeTemplates: [
        { language: 'javascript', code: `function climbStairs(n) {\n    // Your solution\n    return 0;\n}\nconsole.log(climbStairs(parseInt(require('fs').readFileSync(0, 'utf-8').trim())));` },
      ],
      hints: ['It\'s a Fibonacci sequence', 'Use DP or memoization'],
      acceptanceRate: 51.3,
      submissions: 7200000,
      accepted: 3693600,
      likes: 16800,
      dislikes: 520,
      isPremium: false,
    },
  ];
}

// Generate problems for Frontend Development
export function generateFrontendProblems(): CodingProblem[] {
  return [
    {
      id: 'fe-1',
      title: 'Build a Debounced Search Component',
      slug: 'debounced-search',
      difficulty: 'Medium',
      category: 'React',
      topics: ['React', 'Hooks', 'Performance', 'Debouncing'],
      companies: ['Airbnb', 'Netflix', 'Uber'],
      description: `Create a React search component that debounces user input to reduce API calls. 

Requirements:
- Input should debounce with 300ms delay
- Show loading state while searching
- Display results below the search bar
- Clear results when input is empty`,
      inputFormat: 'N/A - React Component Challenge',
      outputFormat: 'Working React component with debounced search',
      constraints: [
        { text: 'Must use React hooks' },
        { text: 'Debounce delay: 300ms' },
        { text: 'Must handle edge cases (empty input, rapid typing)' },
      ],
      examples: [
        {
          input: 'User types "react"',
          output: 'API called only after 300ms of no typing',
          explanation: 'Debouncing prevents excessive API calls',
        },
      ],
      testCases: [
        {
          id: 'tc-1',
          input: 'Type and wait',
          expectedOutput: 'API called once',
          isHidden: false,
        },
      ],
      codeTemplates: [
        {
          language: 'javascript',
          code: `import React, { useState, useEffect } from 'react';\n\nfunction DebouncedSearch() {\n  // Implement debounced search here\n  \n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n\nexport default DebouncedSearch;`,
        },
        {
          language: 'typescript',
          code: `import React, { useState, useEffect } from 'react';\n\ninterface SearchResult {\n  id: number;\n  title: string;\n}\n\nfunction DebouncedSearch() {\n  // Implement debounced search here\n  \n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n\nexport default DebouncedSearch;`,
        },
      ],
      hints: [
        'Use useEffect with a cleanup function',
        'setTimeout for debouncing',
        'Store timeout ID to clear it on cleanup',
      ],
      acceptanceRate: 62.3,
      submissions: 45000,
      accepted: 28035,
      likes: 1250,
      dislikes: 45,
      isPremium: false,
    },
    {
      id: 'fe-2',
      title: 'Implement Infinite Scroll',
      slug: 'infinite-scroll',
      difficulty: 'Medium',
      category: 'React',
      topics: ['React', 'Intersection Observer', 'Performance', 'Pagination'],
      companies: ['Twitter', 'Instagram', 'Pinterest'],
      description: `Build an infinite scroll component that loads more data as the user scrolls.

Requirements:
- Load 20 items initially
- Load 20 more items when scrolling near bottom
- Show loading indicator while fetching
- Handle end of data gracefully`,
      inputFormat: 'N/A - React Component Challenge',
      outputFormat: 'Working infinite scroll component',
      constraints: [
        { text: 'Use Intersection Observer API' },
        { text: 'Initial load: 20 items' },
        { text: 'Load more: 20 items per trigger' },
      ],
      examples: [],
      testCases: [],
      codeTemplates: [
        {
          language: 'javascript',
          code: `import React, { useState, useEffect, useRef } from 'react';\n\nfunction InfiniteScroll() {\n  // Implement infinite scroll here\n  \n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n\nexport default InfiniteScroll;`,
        },
      ],
      hints: [
        'Use Intersection Observer to detect when user reaches bottom',
        'Create a ref for the sentinel element',
        'Prevent duplicate loads with a loading flag',
      ],
      acceptanceRate: 55.7,
      submissions: 32000,
      accepted: 17824,
      likes: 980,
      dislikes: 67,
      isPremium: false,
    },
  ];
}

// Generate problems for Backend Development
export function generateBackendProblems(): CodingProblem[] {
  return [
    {
      id: 'be-1',
      title: 'Design a Rate Limiter',
      slug: 'rate-limiter',
      difficulty: 'Medium',
      category: 'System Design',
      topics: ['System Design', 'API Design', 'Algorithms'],
      companies: ['Stripe', 'Cloudflare', 'AWS'],
      description: `Implement a rate limiter that restricts the number of requests a user can make.

Requirements:
- Limit requests per user per time window
- Support multiple time windows (second, minute, hour)
- Return appropriate error when limit exceeded
- Be thread-safe`,
      inputFormat: 'API requests with user ID',
      outputFormat: 'Allow or deny request',
      constraints: [
        { text: 'Support 100-1000 requests per second' },
        { text: 'Memory efficient' },
        { text: 'Thread-safe implementation' },
      ],
      examples: [
        {
          input: 'User makes 5 requests in 1 second (limit: 3)',
          output: 'First 3 allowed, last 2 denied',
          explanation: 'Rate limit enforced per second',
        },
      ],
      testCases: [],
      codeTemplates: [
        {
          language: 'javascript',
          code: `class RateLimiter {\n  constructor(maxRequests, timeWindow) {\n    // Initialize rate limiter\n  }\n  \n  allowRequest(userId) {\n    // Check if request is allowed\n    return true;\n  }\n}\n\nmodule.exports = RateLimiter;`,
        },
        {
          language: 'python',
          code: `from time import time\nfrom collections import defaultdict\n\nclass RateLimiter:\n    def __init__(self, max_requests, time_window):\n        # Initialize rate limiter\n        pass\n    \n    def allow_request(self, user_id):\n        # Check if request is allowed\n        return True`,
        },
      ],
      hints: [
        'Use a sliding window algorithm',
        'Store timestamps of requests',
        'Clean up old timestamps periodically',
      ],
      acceptanceRate: 48.5,
      submissions: 28000,
      accepted: 13580,
      likes: 1450,
      dislikes: 89,
      isPremium: false,
    },
  ];
}

// Generate problems for Mobile Development
export function generateMobileProblems(): CodingProblem[] {
  return [
    {
      id: 'mob-1',
      title: 'Build a Pull-to-Refresh Component',
      slug: 'pull-to-refresh',
      difficulty: 'Medium',
      category: 'React Native',
      topics: ['React Native', 'Gestures', 'Animations', 'UI'],
      companies: ['Facebook', 'Instagram', 'Snapchat'],
      description: `Create a pull-to-refresh component for React Native.

Requirements:
- Smooth pull gesture
- Animated refresh indicator
- Callback on refresh trigger
- Configurable threshold`,
      inputFormat: 'N/A - Component Challenge',
      outputFormat: 'Working pull-to-refresh component',
      constraints: [
        { text: 'Use React Native Animated API' },
        { text: 'Support both iOS and Android' },
        { text: 'Smooth 60fps animation' },
      ],
      examples: [],
      testCases: [],
      codeTemplates: [
        {
          language: 'javascript',
          code: `import React from 'react';\nimport { View, Animated, PanResponder } from 'react-native';\n\nfunction PullToRefresh({ onRefresh, children }) {\n  // Implement pull-to-refresh here\n  \n  return (\n    <View>\n      {children}\n    </View>\n  );\n}\n\nexport default PullToRefresh;`,
        },
      ],
      hints: [
        'Use PanResponder for gesture handling',
        'Animated.Value for smooth animations',
        'Set a threshold for triggering refresh',
      ],
      acceptanceRate: 52.1,
      submissions: 18000,
      accepted: 9378,
      likes: 750,
      dislikes: 34,
      isPremium: false,
    },
  ];
}

// Generate contests
export function generateContests(): Contest[] {
  return [
    {
      id: 'contest-1',
      title: 'Weekly Contest 385',
      description: 'Compete with developers worldwide in this weekly coding challenge',
      startTime: '2024-12-15T14:00:00Z',
      endTime: '2024-12-15T15:30:00Z',
      duration: 90,
      problems: generateCompetitiveProgrammingProblems().slice(0, 4),
      participants: 15420,
      isActive: false,
      isUpcoming: true,
      prizes: ['$500', '$300', '$200', 'T-Shirts for Top 50'],
      difficulty: 'All Levels',
    },
    {
      id: 'contest-2',
      title: 'Biweekly Contest 122',
      description: 'A bi-weekly challenge featuring algorithmic problems',
      startTime: '2024-12-20T18:00:00Z',
      endTime: '2024-12-20T19:30:00Z',
      duration: 90,
      problems: [],
      participants: 8950,
      isActive: false,
      isUpcoming: true,
      prizes: ['$300', '$200', '$100'],
      difficulty: 'Medium-Hard',
    },
  ];
}

// Get problems by domain
export function getProblemsByDomain(domainId: string): CodingProblem[] {
  switch (domainId) {
    case 'competitive-programming':
      return generateCompetitiveProgrammingProblems();
    case 'frontend':
      return generateFrontendProblems();
    case 'backend':
      return generateBackendProblems();
    case 'mobile-dev':
      return generateMobileProblems();
    default:
      return [];
  }
}