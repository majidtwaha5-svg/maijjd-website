import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { 
  Code, 
  Database, 
  Settings, 
  Users, 
  BarChart3, 
  Shield, 
  Globe,
  ArrowRight,
  Monitor,
  TrendingUp,
  Activity,
  Brain,
  Edit,
  Wrench
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 12,
    activeUsers: 156,
    systemHealth: 'Excellent',
    uptime: '99.9%'
  });
  const [showDevelopmentEnvironment, setShowDevelopmentEnvironment] = useState(false);
  const [selectedToolForDev, setSelectedToolForDev] = useState(null);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'Project Created',
      description: 'New CRM system project started',
      timestamp: '2 hours ago',
      icon: <Code className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'User Registration',
      description: 'New user account created',
      timestamp: '4 hours ago',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'System Update',
      description: 'Security patches applied',
      timestamp: '1 day ago',
      icon: <Shield className="h-4 w-4" />
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'Create Project',
      description: 'Start a new software project',
      icon: <Code className="h-8 w-8" />,
      link: '/contact',
      color: 'bg-blue-500'
    },
    {
      title: 'View Services',
      description: 'Explore our service offerings',
      icon: <Settings className="h-8 w-8" />,
      link: '/services',
      color: 'bg-green-500'
    },
    {
      title: 'Browse Software',
      description: 'Check out our software solutions',
      icon: <Monitor className="h-8 w-8" />,
      link: '/software',
      color: 'bg-purple-500'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: <Users className="h-8 w-8" />,
      link: '/contact',
      color: 'bg-orange-500'
    }
  ];

  const aiTools = [
    {
      title: 'AI Coding Assistant',
      description: 'Intelligent code generation and debugging',
      icon: <Brain className="h-8 w-8" />,
      link: '/ai-development',
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      features: ['Code Generation', 'Smart Debugging', 'Performance Analysis'],
      toolType: 'coding'
    },
    {
      title: 'AI Editing Suite',
      description: 'AI-powered content creation and editing',
      icon: <Edit className="h-8 w-8" />,
      link: '/ai-development',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      features: ['Content Generation', 'Document Editing', 'Multimedia Processing'],
      toolType: 'editing'
    },
    {
      title: 'AI Development Tools',
      description: 'Complete AI development environment',
      icon: <Wrench className="h-8 w-8" />,
      link: '/ai-development',
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      features: ['Model Building', 'Neural Networks', 'MLOps Pipeline'],
      toolType: 'development'
    }
  ];

  // Open development environment with full coding tools
  const openDevelopmentEnvironment = (toolType) => {
    console.log('🚀 Opening development environment for tool:', toolType);
    setSelectedToolForDev(toolType);
    setShowDevelopmentEnvironment(true);
    console.log('Development environment state set to true');
  };

  const closeDevelopmentEnvironment = () => {
    setShowDevelopmentEnvironment(false);
    setSelectedToolForDev(null);
  };

  // AI Tool functions
  const handleAIToolAccess = async (toolType) => {
    try {
      let message = '';
      switch (toolType) {
        case 'coding':
          message = 'Generate code examples and provide development guidance';
          break;
        case 'editing':
          message = 'Provide content editing and optimization assistance';
          break;
        case 'development':
          message = 'Analyze development requirements and provide technical insights';
          break;
        default:
          message = 'Provide AI-powered assistance and recommendations';
      }

      // Use API service instead of direct fetch
      const result = await apiService.demoAiChat(message, 'Dashboard', {
        software_id: 'dashboard-' + Date.now(),
        analysis_type: toolType,
        ai_model: 'gpt-4'
      });

      alert(`🤖 AI ${toolType.charAt(0).toUpperCase() + toolType.slice(1)} Tool:\n\n${result.content || 'AI tool ready to assist you!'}`);
    } catch (error) {
      console.error('Error accessing AI tool:', error);
      alert('❌ Error accessing AI tool. Please try again.');
    }
  };

  const systemMetrics = [
    {
      label: 'CPU Usage',
      value: '23%',
      status: 'normal',
      icon: <Activity className="h-5 w-5" />
    },
    {
      label: 'Memory Usage',
      value: '67%',
      status: 'warning',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      label: 'Disk Space',
      value: '45%',
      status: 'normal',
      icon: <Database className="h-5 w-5" />
    },
    {
      label: 'Network',
      value: '12%',
      status: 'normal',
      icon: <Globe className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to your Maijjd Software Suite dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">System Status</p>
                <p className="text-lg font-semibold text-green-600">{stats.systemHealth}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="text-lg font-semibold text-blue-600">{stats.uptime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Performance</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Security Score</p>
                <p className="text-2xl font-bold text-gray-900">A+</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Metrics</h2>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {metric.icon}
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">{metric.label}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Tools Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">🤖 MJND-Powered Tools</h2>
              <Link 
                to="/ai-development" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All AI Tools
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {aiTools.map((tool, index) => (
                  <div
                    key={index}
                    className="group block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => openDevelopmentEnvironment(tool.toolType)}
                  >
                    <div className={`p-3 rounded-lg ${tool.color} text-white mb-4`}>
                      {tool.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                    <div className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-between text-xs text-gray-500 p-1">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span>{feature}</span>
                          </div>
                          <button
                            onClick={() => openDevelopmentEnvironment(tool.toolType)}
                            className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                            title={`Start coding with ${feature}`}
                          >
                            🚀 Start
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      Start Coding
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    {activity.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Development Environment Modal */}
      {showDevelopmentEnvironment && selectedToolForDev && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Code className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Development Environment - AI {selectedToolForDev.charAt(0).toUpperCase() + selectedToolForDev.slice(1)} Tools
                </h2>
              </div>
              <button
                onClick={closeDevelopmentEnvironment}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Development Tools */}
            <div className="flex-1 flex flex-col lg:flex-row">
              {/* Left Panel - Code Editor */}
              <div className="flex-1 border-r border-gray-200">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200">
                        AI Coding
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200">
                        AI Editing
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-auto">
                    <div className="mb-2">// Welcome to AI {selectedToolForDev} Development Environment</div>
                    <div className="mb-2">// Start coding with AI assistance</div>
                    <div className="mb-2">// Use AI tools for code generation and optimization</div>
                    <div className="mb-2"></div>
                    <div className="mb-2">function initializeAI{selectedToolForDev.charAt(0).toUpperCase() + selectedToolForDev.slice(1)}() {'{'}</div>
                    <div className="mb-2">  // AI-powered code generation</div>
                    <div className="mb-2">  // Intelligent debugging</div>
                    <div className="mb-2">  // Automated testing</div>
                    <div className="mb-2">{'}'}</div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Tools & Terminal */}
              <div className="w-80 flex flex-col">
                {/* AI Tools */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Development Tools</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAIToolAccess(selectedToolForDev)}
                      className="w-full p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-left"
                    >
                      <div className="font-medium">🤖 AI Coding Assistant</div>
                      <div className="text-sm opacity-75">Generate code with AI</div>
                    </button>
                    <button
                      onClick={() => handleAIToolAccess(selectedToolForDev)}
                      className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-left"
                    >
                      <div className="font-medium">✏️ AI Editing Suite</div>
                      <div className="text-sm opacity-75">Smart code editing</div>
                    </button>
                    <button
                      onClick={() => handleAIToolAccess(selectedToolForDev)}
                      className="w-full p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-left"
                    >
                      <div className="font-medium">🔧 AI Development Tools</div>
                      <div className="text-sm opacity-75">Advanced development features</div>
                    </button>
                  </div>
                </div>

                {/* Terminal */}
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Terminal</h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm h-32 overflow-auto">
                    <div className="mb-1">$ cd ai-{selectedToolForDev}</div>
                    <div className="mb-1">$ npm install</div>
                    <div className="mb-1">$ npm start</div>
                    <div className="mb-1">🚀 Development server started</div>
                    <div className="mb-1">📱 AI tools ready</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      PREVIEW
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      RUN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
