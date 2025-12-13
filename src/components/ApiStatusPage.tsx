import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Activity,
  Server,
  Database,
  Zap,
  Clock,
} from 'lucide-react';
import { apiTester } from '../utils/apiTester';
import { config } from '../utils/config';

interface TestResult {
  endpoint: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  duration?: number;
  data?: any;
}

export function ApiStatusPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const runTests = async () => {
    setTesting(true);
    try {
      const testResults = await apiTester.runAllTests();
      setResults(testResults);
      setLastTestTime(new Date());
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    // Run tests on mount
    runTests();
  }, []);

  const passedCount = results.filter(r => r.status === 'pass').length;
  const failedCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const totalCount = results.length;
  const passRate = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pass</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      default:
        return null;
    }
  };

  const averageDuration = results.length > 0
    ? results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length
    : 0;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">API Status & Testing</h1>
        <p className="text-gray-600">
          Monitor and test all CodeEX API endpoints
        </p>
      </div>

      {/* System Info */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Backend Mode</div>
                <div className="text-lg text-gray-900">
                  {config.useMockData ? 'Mock Data' : 'Supabase'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">API Version</div>
                <div className="text-lg text-gray-900">v1.0.0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className="text-lg text-gray-900">
                  {passRate >= 90 ? 'Healthy' : passRate >= 70 ? 'Degraded' : 'Critical'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Summary */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test Summary</CardTitle>
              <CardDescription>
                {lastTestTime
                  ? `Last tested: ${lastTestTime.toLocaleTimeString()}`
                  : 'No tests run yet'}
              </CardDescription>
            </div>
            <Button
              onClick={runTests}
              disabled={testing}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {totalCount > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl text-gray-900 mb-1">{totalCount}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl text-green-600 mb-1">{passedCount}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl text-red-600 mb-1">{failedCount}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl text-yellow-600 mb-1">{warningCount}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="text-gray-900">{passRate.toFixed(1)}%</span>
                </div>
                <Progress value={passRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Avg Response Time:</span>
                  <span className="text-gray-900">{averageDuration.toFixed(0)}ms</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Endpoints:</span>
                  <span className="text-gray-900">{totalCount}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Status of all API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No test results yet</p>
                <Button
                  onClick={runTests}
                  disabled={testing}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Run Tests
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <div className="text-gray-900">{result.endpoint}</div>
                          <div className="text-sm text-gray-600">{result.message}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.duration && (
                          <Badge variant="outline" className="text-xs">
                            {result.duration}ms
                          </Badge>
                        )}
                        {getStatusBadge(result.status)}
                      </div>
                    </div>

                    {result.data && result.status === 'pass' && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2).substring(0, 200)}
                        {JSON.stringify(result.data).length > 200 && '...'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
