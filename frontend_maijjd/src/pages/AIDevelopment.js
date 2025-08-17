import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, Rocket, Code, Shield, BarChart3, 
  Terminal, Play, 
  Save,
  Download,
  Share2 as Share,
  Settings as SettingsIcon,
} from 'lucide-react';

const AIDevelopment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [aiTool, setAiTool] = useState('');
  const [productivityTool, setProductivityTool] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (location.state) {
      setSelectedService(location.state.selectedService);
      setAiTool(location.state.aiTool);
      setProductivityTool(location.state.productivityTool);
      
      // If we have AI response data, use it
      if (location.state.aiResponse) {
        console.log('AI Response received:', location.state.aiResponse);
        setOutput(`AI Analysis Complete!\n\n${JSON.stringify(location.state.aiResponse, null, 2)}`);
      }
      
      // If we have service data, use it for enhanced functionality
      if (location.state.serviceData) {
        console.log('Service data received:', location.state.serviceData);
      }
    }
  }, [location.state]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOutput(`AI Analysis Complete for ${selectedService}!\n\nGenerated Code:\n${code}\n\nAI Suggestions:\n- Optimize performance\n- Add error handling\n- Implement security measures`);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedService?.replace(/\s+/g, '_')}_code.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackToServices = () => {
    navigate('/services');
  };

  if (!selectedService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Development Environment</h1>
          <p className="text-xl text-gray-600 mb-6">No service selected</p>
          <button
            onClick={handleBackToServices}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 AI Development Environment</h1>
              <p className="text-gray-600">Access AI-powered tools for {selectedService}</p>
            </div>
            <button
              onClick={handleBackToServices}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Services
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Tool Available
              </h3>
              <p className="text-blue-800">{aiTool}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <Rocket className="h-5 w-5 mr-2" />
                Productivity Tool
              </h3>
              <p className="text-green-800">{productivityTool}</p>
            </div>
          </div>
        </div>

        {/* AI Development Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-600" />
                AI Code Editor
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveCode}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Save Code"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="p-2 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                  title="Run Code"
                >
                  {isRunning ? <Play className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// AI-powered code editor for ${selectedService}\n// Start coding with AI assistance...\n\nfunction ${selectedService?.replace(/\s+/g, '').toLowerCase()}() {\n  // Your code here\n}`}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setCode('')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setCode(`// AI-generated template for ${selectedService}\nfunction ${selectedService?.replace(/\s+/g, '').toLowerCase()}() {\n  // AI suggestions will appear here\n  console.log('AI-powered development');\n}`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Generate Template
              </button>
            </div>
          </div>

          {/* AI Output */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Analysis & Output
              </h3>
              <button
                onClick={() => setOutput('')}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Clear Output"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              {output || 'AI output will appear here when you run your code...'}
            </div>
            
            {isRunning && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-blue-800">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  AI is analyzing your code...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available AI Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Code Completion', icon: Code, description: 'AI-powered code suggestions and autocomplete' },
              { name: 'Bug Detection', icon: Shield, description: 'Automated code review and error detection' },
              { name: 'Performance Analysis', icon: BarChart3, description: 'AI-driven performance optimization suggestions' },
              { name: 'Security Scanner', icon: Shield, description: 'Automated security vulnerability detection' },
              { name: 'Documentation Generator', icon: Code, description: 'AI-generated code documentation' },
              { name: 'Testing Assistant', icon: Play, description: 'Automated test case generation' }
            ].map((tool, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-3">
                  <tool.icon className="h-6 w-6 text-blue-600 mr-3" />
                  <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Activate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Tools Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">⚡ Productivity Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-3">
                <Rocket className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="font-semibold text-gray-900">Workflow Automation</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">Automate repetitive tasks and streamline your development workflow</p>
              <button 
                onClick={() => {
                  setOutput(`🚀 Workflow Automation Activated!\n\nAutomating development tasks for ${selectedService}...\n\n✅ Code generation automated\n✅ Testing pipeline activated\n✅ Deployment workflow optimized\n✅ Performance monitoring enabled`);
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Activate Automation
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
                <h4 className="font-semibold text-gray-900">Performance Monitor</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">Real-time performance tracking and optimization suggestions</p>
              <button 
                onClick={() => {
                  setOutput(`📊 Performance Monitor Activated!\n\nMonitoring ${selectedService} performance...\n\n🔍 CPU Usage: 45%\n🔍 Memory Usage: 62%\n🔍 Response Time: 120ms\n🔍 Throughput: 1,250 req/s\n\n💡 Optimization Suggestions:\n• Enable caching for better performance\n• Optimize database queries\n• Implement lazy loading`);
                }}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Start Monitoring
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
              <Terminal className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Terminal</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
              <Download className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Download</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all">
              <Share className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Share</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all">
              <SettingsIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDevelopment;
