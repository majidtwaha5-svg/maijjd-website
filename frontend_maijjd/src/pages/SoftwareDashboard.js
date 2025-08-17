import React, { useState, useEffect } from 'react';
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
  Download,
  Star,
  Play,
  RefreshCw,
  Bot,
  Zap,
  Cloud,
  Smartphone as Mobile,
  Server,
  Lock
} from 'lucide-react';
import apiService from '../services/api';

const SoftwareDashboard = () => {

  
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSoftware();
  }, []);

  const fetchSoftware = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSoftware();
      if (response.success) {
        setSoftware(response.data);
      } else {
        setError('Failed to fetch software data');
      }
    } catch (err) {
      setError('Error fetching software data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      '🤖': <Bot className="h-8 w-8" />,
      '💼': <Users className="h-8 w-8" />,
      '📊': <BarChart3 className="h-8 w-8" />,
      '🛡️': <Shield className="h-8 w-8" />,
      '☁️': <Cloud className="h-8 w-8" />,
      'users': <Users className="h-8 w-8" />,
      'cloud': <Cloud className="h-8 w-8" />,
      'globe': <Globe className="h-8 w-8" />,
      'zap': <Zap className="h-8 w-8" />,
      'shield': <Shield className="h-8 w-8" />,
      'bar-chart': <BarChart3 className="h-8 w-8" />,
      'mobile': <Mobile className="h-8 w-8" />,
      'server': <Server className="h-8 w-8" />,
      'refresh': <RefreshCw className="h-8 w-8" />,
      'code': <Code className="h-8 w-8" />,
      'database': <Database className="h-8 w-8" />,
      'settings': <Settings className="h-8 w-8" />,
      'monitor': <Monitor className="h-8 w-8" />,
      'lock': <Lock className="h-8 w-8" />
    };
    return iconMap[iconName] || <Code className="h-8 w-8" />;
  };

  const filteredSoftware = software.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(software.map(item => item.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading software dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchSoftware}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Software Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage and monitor your software services</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                <span className="text-sm font-medium">Total Software: {software.length}</span>
              </div>
              <button
                onClick={fetchSoftware}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search software..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Software Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSoftware.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No software found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSoftware.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getIconComponent(item.icon)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{item.downloads?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Monitor className="h-4 w-4" />
                        <span>{item.version}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </div>
                  </div>

                  {/* Features */}
                  {item.features && item.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {item.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                            +{item.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Metadata */}
                  {item.aiMetadata && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Bot className="h-4 w-4 mr-2 text-purple-600" />
                        AI Capabilities
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Intelligence:</span>
                          <span className="ml-1 font-medium text-gray-900">{item.aiMetadata.intelligenceLevel}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="ml-1 font-medium text-gray-900">{item.aiMetadata.accuracy}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-lg font-semibold text-gray-900">
                      {item.price}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        Details
                      </button>
                      <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Try Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareDashboard;
