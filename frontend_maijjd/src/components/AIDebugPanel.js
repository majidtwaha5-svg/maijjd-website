import React, { useState, useEffect } from 'react';
import { Bug, TestTube, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import apiService from '../services/api';

const AIDebugPanel = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults({});
    setLogs([]);
    
    addLog('🧪 Starting AI Integration Tests...', 'info');

    try {
      // Test 1: Backend Health
      addLog('Testing backend health...', 'info');
      try {
        const healthResponse = await apiService.healthCheck();
        setTestResults(prev => ({ ...prev, health: { success: true, data: healthResponse } }));
        addLog('✅ Backend health check passed', 'success');
      } catch (error) {
        setTestResults(prev => ({ ...prev, health: { success: false, error: error.message } }));
        addLog(`❌ Backend health check failed: ${error.message}`, 'error');
      }

      // Test 2: AI Integration Endpoint
      addLog('Testing AI integration endpoint...', 'info');
      try {
        const integrationResponse = await fetch('http://localhost:5001/api/ai/integration');
        if (integrationResponse.ok) {
          const data = await integrationResponse.json();
          setTestResults(prev => ({ ...prev, integration: { success: true, data } }));
          addLog('✅ AI integration endpoint working', 'success');
        } else {
          throw new Error(`HTTP ${integrationResponse.status}`);
        }
      } catch (error) {
        setTestResults(prev => ({ ...prev, integration: { success: false, error: error.message } }));
        addLog(`❌ AI integration endpoint failed: ${error.message}`, 'error');
      }

      // Test 3: Public AI Chat
      addLog('Testing public AI chat...', 'info');
      try {
        const chatResponse = await apiService.demoAiChat('Test message', 'Test Software');
        setTestResults(prev => ({ ...prev, chat: { success: true, data: chatResponse } }));
        addLog('✅ Public AI chat working', 'success');
      } catch (error) {
        setTestResults(prev => ({ ...prev, chat: { success: false, error: error.message } }));
        addLog(`❌ Public AI chat failed: ${error.message}`, 'error');
      }

      // Test 4: API Service Methods
      addLog('Testing API service methods...', 'info');
      try {
        const services = await apiService.getServices();
        setTestResults(prev => ({ ...prev, services: { success: true, data: services } }));
        addLog('✅ Services endpoint working', 'success');
      } catch (error) {
        setTestResults(prev => ({ ...prev, services: { success: false, error: error.message } }));
        addLog(`❌ Services endpoint failed: ${error.message}`, 'error');
      }

      // Test 5: CORS Test
      addLog('Testing CORS configuration...', 'info');
      try {
        const corsTest = await fetch('http://localhost:5001/api/health', {
          method: 'GET',
          headers: {
            'Origin': 'http://localhost:3000'
          }
        });
        const corsHeaders = corsTest.headers.get('Access-Control-Allow-Origin');
        if (corsHeaders) {
          setTestResults(prev => ({ ...prev, cors: { success: true, data: { headers: corsHeaders } } }));
          addLog('✅ CORS properly configured', 'success');
        } else {
          throw new Error('CORS headers not found');
        }
      } catch (error) {
        setTestResults(prev => ({ ...prev, cors: { success: false, error: error.message } }));
        addLog(`❌ CORS test failed: ${error.message}`, 'error');
      }

      addLog('🎉 All tests completed!', 'success');

    } catch (error) {
      addLog(`💥 Test suite error: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="h-5 w-5" />
            <h3 className="font-semibold">AI Integration Debug Panel</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Test Controls */}
          <div className="mb-6 flex items-center space-x-4">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Tests...' : 'Run Tests'}</span>
            </button>
            
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Logs
            </button>
          </div>

          {/* Test Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(testResults).map(([testName, result]) => (
              <div
                key={testName}
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h4 className="font-semibold capitalize">{testName}</h4>
                </div>
                
                {result.success ? (
                  <p className="text-green-700 text-sm">
                    ✅ Test passed successfully
                  </p>
                ) : (
                  <p className="text-red-700 text-sm">
                    ❌ {result.error}
                  </p>
                )}

                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      View Response Data
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {/* Logs */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <TestTube className="h-4 w-4" />
              <span>Test Logs</span>
            </h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${
                    log.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : log.type === 'error'
                      ? 'bg-red-100 text-red-800'
                      : log.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="ml-2">{log.message}</span>
                </div>
              ))}
              
              {logs.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No logs yet. Run tests to see results.
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Test Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Tests:</span> {Object.keys(testResults).length}
                </div>
                <div>
                  <span className="font-medium">Passed:</span>{' '}
                  {Object.values(testResults).filter(r => r.success).length}
                </div>
                <div>
                  <span className="font-medium">Failed:</span>{' '}
                  {Object.values(testResults).filter(r => !r.success).length}
                </div>
                <div>
                  <span className="font-medium">Success Rate:</span>{' '}
                  {Object.keys(testResults).length > 0
                    ? Math.round(
                        (Object.values(testResults).filter(r => r.success).length /
                          Object.keys(testResults).length) *
                          100
                      )
                    : 0}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDebugPanel;
