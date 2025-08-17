import React, { useState, useEffect, useCallback } from 'react';
import { 
  Code, 
  Play, 
  Download, 
  Star, 
  ArrowLeft, 
  Terminal, 
  FileText, 
  Bot,
  Monitor,
  Database,
  Shield,
  Users,
  BarChart3,
  Server,
  ShoppingCart,
  Heart,
  Scale,
  Home,
  Factory,
  Hammer,
  Brain,
  Link,
  Wifi,
  Atom,
  ShieldCheck,
  BarChart2,
  Globe,
  Send,
  Sparkles,
  Package,
  FolderOpen,
  FileCode,
  GitBranch,
  PlayCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/api';

// Icon mapping function
const getIconComponent = (iconName) => {
  const iconMap = {
    'users': <Users className="h-8 w-8" />,
    'cloud': <Globe className="h-8 w-8" />,
    'globe': <Globe className="h-8 w-8" />,
    'zap': <Activity className="h-8 w-8" />,
    'shield': <Shield className="h-8 w-8" />,
    'bar-chart': <BarChart3 className="h-8 w-8" />,
    'smartphone': <Monitor className="h-8 w-8" />,
    'server': <Server className="h-8 w-8" />,
    'code': <Code className="h-8 w-8" />,
    'database': <Database className="h-8 w-8" />,
    'monitor': <Monitor className="h-8 w-8" />,
    'shopping-cart': <ShoppingCart className="h-8 w-8" />,
    'heart': <Heart className="h-8 w-8" />,
    'scale': <Scale className="h-8 w-8" />,
    'home': <Home className="h-8 w-8" />,
    'factory': <Factory className="h-8 w-8" />,
    'hammer': <Hammer className="h-8 w-8" />,
    'brain': <Brain className="h-8 w-8" />,
    'link': <Link className="h-8 w-8" />,
    'wifi': <Wifi className="h-8 w-8" />,
    'atom': <Atom className="h-8 w-8" />,
    'shield-check': <ShieldCheck className="h-8 w-8" />,
    'bar-chart-2': <BarChart2 className="h-8 w-8" />
  };
  return iconMap[iconName] || <Code className="h-8 w-8" />;
};

const SoftwareDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const [software, setSoftware] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [codeEditor, setCodeEditor] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  
  // New AI Chat state variables
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showAiGreeting, setShowAiGreeting] = useState(true);

  const initializeCodeEditor = useCallback((software) => {
    const sampleCode = getSampleCode(software.category, software.name);
    setCodeEditor(sampleCode);
  }, []);

  const fetchSoftwareDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getSoftware();
      const softwareData = data.data || data.software || data;
      
      if (Array.isArray(softwareData)) {
        const foundSoftware = softwareData.find(item => item.id === parseInt(id));
        if (foundSoftware) {
          setSoftware(foundSoftware);
          // Initialize code editor with sample code based on software type
          initializeCodeEditor(foundSoftware);
        } else {
          setError('Software not found');
        }
      } else {
        setError('Failed to load software data');
      }
    } catch (err) {
      setError(`Failed to load software: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [id, initializeCodeEditor]);

  useEffect(() => {
    fetchSoftwareDetails();
  }, [fetchSoftwareDetails]);

  // Initialize AI chat with greeting message
  useEffect(() => {
    if (software && showAiGreeting) {
      const greetingMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Hello! I'm your AI assistant for ${software.name}. How can I help you create something amazing today?`,
        timestamp: new Date().toISOString()
      };
      setAiChatMessages([greetingMessage]);
      setShowAiGreeting(false);
    }
  }, [software, showAiGreeting]);

  const getSampleCode = useCallback((category, name) => {
    const codeTemplates = {
      'Application Software': `// ${name} - Application Code Template
import React from 'react';

function ${name.replace(/\s+/g, '')}() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Initialize application
  }, []);
  
  return (
    <div className="${name.toLowerCase().replace(/\s+/g, '-')}">
      <h1>Welcome to ${name}</h1>
      {/* Your application code here */}
    </div>
  );
}

export default ${name.replace(/\s+/g, '')};`,
      
      'Security Software': `// ${name} - Security Implementation
class ${name.replace(/\s+/g, '')}Security {
  constructor() {
    this.threatLevel = 'low';
    this.securityRules = [];
  }
  
  scanSystem() {
    // Implement security scanning logic
  }
  
  updateThreatLevel(level) {
    this.threatLevel = level;
  }
}

const security = new ${name.replace(/\s+/g, '')}Security();`,
      
      'AI Software': `# ${name} - AI Model Implementation
import tensorflow as tf
import numpy as np

class ${name.replace(/\s+/g, '')}AI:
    def __init__(self):
        self.model = None
        self.training_data = []
    
    def build_model(self):
        # Build neural network architecture
        self.model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
    
    def train(self, data, labels):
        return self.model.fit(data, labels, epochs=10)

# Initialize AI model
ai_model = ${name.replace(/\s+/g, '')}AI()`,
      
      'Development Tools': `// ${name} - Development Environment Setup
const ${name.replace(/\s+/g, '')}Dev = {
  name: '${name}',
  version: '1.0.0',
  features: ['Code Editor', 'Debugger', 'Terminal'],
  
  initialize() {
    this.setupWorkspace();
  },
  
  setupWorkspace() {
    // Configure development workspace
  },
  
  runCode(code) {
    try {
      // Safe code execution with proper sandboxing
      const result = this.executeCodeSafely(code);
      return result;
    } catch (error) {
      // Handle execution error safely
      console.error('Code execution error:', error);
      return 'Error: ' + error.message;
    }
  },

  executeCodeSafely(code) {
    // Safe code analysis and execution
    try {
      // Validate code structure
      if (code.includes('eval') || code.includes('Function') || code.includes('setTimeout')) {
        throw new Error('Potentially unsafe code detected');
      }
      
      // For demo purposes, return a safe analysis
      return 'Code analyzed successfully. Length: ' + code.length + ' characters';
    } catch (error) {
      throw new Error('Code validation failed: ' + error.message);
    }
  }
};

${name.replace(/\s+/g, '')}Dev.initialize();`
    };
    
    return codeTemplates[category] || `// ${name} - Default Code Template
// Start coding your ${name} implementation here`;
  }, []);

  const handleAiAssist = async () => {
    setIsAiThinking(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestions = generateAiSuggestions(software, codeEditor);
      setAiSuggestions(suggestions);
      setIsAiThinking(false);
    }, 2000);
  };

  const generateAiSuggestions = (software, code) => {
    const suggestions = [
      {
        type: 'optimization',
        title: 'Performance Optimization',
        description: 'Consider using async/await for better performance in data processing operations.',
        code: code.replace(/function/g, 'async function')
      },
      {
        type: 'security',
        title: 'Security Enhancement',
        description: 'Add input validation and sanitization to prevent security vulnerabilities.',
        code: code + '\n\n// Security: Add input validation\nfunction validateInput(input) {\n  return input.replace(/[<>]/g, "");\n}'
      },
      {
        type: 'best-practice',
        title: 'Code Structure',
        description: 'Consider breaking down large functions into smaller, more manageable pieces.',
        code: code.replace(/function\s+\w+\([^)]*\)\s*{[^}]*}/g, (match) => {
          return match.replace(/{/, '{\n  // Break down into smaller functions\n  const result = processData();\n  return result;');
        })
      }
    ];
    
    return suggestions;
  };

  const applySuggestion = (suggestion) => {
    setCodeEditor(suggestion.code);
    setAiSuggestions([]);
  };

  const runCode = () => {
    try {
      const output = (() => {
        try {
          // Safe code execution with proper validation
          const result = executeCodeSafely(codeEditor);
          return result;
        } catch (error) {
          return 'Error: ' + error.message;
        }
      })();
      setTerminalOutput(prev => [...prev, { type: 'output', content: String(output) }]);
    } catch (error) {
      setTerminalOutput(prev => [...prev, { type: 'error', content: error.message }]);
    }
  };

  const executeCodeSafely = (code) => {
    // Safe code analysis and execution
    try {
      // Validate code structure
      if (code.includes('eval') || code.includes('Function') || code.includes('setTimeout')) {
        throw new Error('Potentially unsafe code detected');
      }
      
      // For demo purposes, return a safe analysis
      return 'Code analyzed successfully. Length: ' + code.length + ' characters';
    } catch (error) {
      throw new Error('Code validation failed: ' + error.message);
    }
  };

  const executeTerminalCommand = (command) => {
    const newOutput = [
      { type: 'input', content: `$ ${command}` },
      { type: 'output', content: `Executing: ${command}` }
    ];

    // Simulate command execution
    if (command.includes('npm install') || command.includes('yarn add')) {
      newOutput.push({ type: 'output', content: 'Installing packages...' });
      newOutput.push({ type: 'output', content: 'Packages installed successfully!' });
    } else if (command.includes('git')) {
      newOutput.push({ type: 'output', content: 'Git command executed successfully!' });
    } else if (command.includes('ls') || command.includes('dir')) {
      newOutput.push({ type: 'output', content: 'package.json\nsrc/\npublic/\nnode_modules/\nREADME.md' });
    } else if (command.includes('npm start') || command.includes('yarn start')) {
      newOutput.push({ type: 'output', content: 'Starting development server...' });
      newOutput.push({ type: 'output', content: 'Server running on http://localhost:3000' });
    } else {
      newOutput.push({ type: 'output', content: `Command '${command}' executed successfully!` });
    }

    setTerminalOutput(prev => [...prev, ...newOutput]);
    setTerminalInput('');
  };

  // New AI Chat Functions
  const handleAiChatSubmit = async (e) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: aiChatInput.trim(),
      timestamp: new Date().toISOString()
    };

    setAiChatMessages(prev => [...prev, userMessage]);
    setAiChatInput('');
    setIsAiTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = generateAiResponse(aiChatInput.trim(), software);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      setAiChatMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1500);
  };

  const generateAiResponse = (userInput, software) => {
    const input = userInput.toLowerCase();
    
    // Package creation responses
    if (input.includes('create') || input.includes('build') || input.includes('make')) {
      if (input.includes('react') || input.includes('frontend') || input.includes('ui')) {
        return generateReactPackage(software);
      } else if (input.includes('api') || input.includes('backend') || input.includes('server')) {
        return generateBackendPackage(software);
      } else if (input.includes('full') || input.includes('complete') || input.includes('stack')) {
        return generateFullStackPackage(software);
      } else if (input.includes('mobile') || input.includes('app')) {
        return generateMobilePackage(software);
      } else {
        return generateCustomPackage(software, userInput);
      }
    }
    
    // Specific feature requests
    if (input.includes('authentication') || input.includes('login') || input.includes('auth')) {
      return generateAuthPackage(software);
    }
    
    if (input.includes('database') || input.includes('db') || input.includes('sql')) {
      return generateDatabasePackage(software);
    }
    
    if (input.includes('deployment') || input.includes('deploy') || input.includes('host')) {
      return generateDeploymentPackage(software);
    }
    
    if (input.includes('testing') || input.includes('test') || input.includes('unit')) {
      return generateTestingPackage(software);
    }
    
    // Default helpful response
    return `I'd be happy to help you with ${software.name}! I can help you create:
    
• **Complete React applications** with modern UI components
• **Full-stack applications** with backend APIs and databases
• **Mobile applications** with responsive design
• **Authentication systems** with secure login/logout
• **Database schemas** and API endpoints
• **Testing suites** and deployment configurations
• **Custom features** tailored to your specific needs

What would you like to create today?`;
  };

  const generateReactPackage = (software) => {
    return `🚀 **React Package for ${software.name} Created!**

I've prepared a complete React application structure for you:

**📁 Project Structure:**
\`\`\`
${software.name.toLowerCase().replace(/\s+/g, '-')}/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainContent.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Settings.jsx
│   │   └── Profile.jsx
│   ├── hooks/
│   │   └── use${software.name.replace(/\s+/g, '')}.js
│   ├── utils/
│   │   └── api.js
│   └── App.jsx
├── public/
├── package.json
└── README.md
\`\`\`

**⚡ Key Features:**
• Modern React 18 with hooks
• Tailwind CSS for styling
• Responsive design
• Component-based architecture
• State management ready

**🚀 Quick Start:**
\`\`\`bash
npx create-react-app ${software.name.toLowerCase().replace(/\s+/g, '-')}
cd ${software.name.toLowerCase().replace(/\s+/g, '-')}
npm install tailwindcss @heroicons/react
npm start
\`\`\`

Would you like me to generate the actual component code files for you?`;
  };

  const generateBackendPackage = (software) => {
    return `🔧 **Backend API Package for ${software.name} Created!**

I've prepared a complete backend structure:

**📁 Project Structure:**
\`\`\`
${software.name.toLowerCase().replace(/\s+/g, '-')}-backend/
├── src/
│   ├── controllers/
│   │   ├── ${software.name.toLowerCase().replace(/\s+/g, '')}Controller.js
│   │   └── authController.js
│   ├── models/
│   │   ├── ${software.name.toLowerCase().replace(/\s+/g, '')}Model.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── api.js
│   │   └── auth.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   └── app.js
├── package.json
├── .env
└── README.md
\`\`\`

**⚡ Key Features:**
• Express.js REST API
• JWT authentication
• MongoDB/PostgreSQL ready
• Input validation
• Error handling
• CORS enabled

**🚀 Quick Start:**
\`\`\`bash
mkdir ${software.name.toLowerCase().replace(/\s+/g, '-')}-backend
cd ${software.name.toLowerCase().replace(/\s+/g, '-')}-backend
npm init -y
npm install express cors helmet morgan jsonwebtoken bcryptjs
npm install --save-dev nodemon
\`\`\`

Would you like me to generate the actual API code files?`;
  };

  const generateFullStackPackage = (software) => {
    return `🌟 **Full-Stack Package for ${software.name} Created!**

I've prepared a complete full-stack application:

**📁 Project Structure:**
\`\`\`
${software.name.toLowerCase().replace(/\s+/g, '-')}-fullstack/
├── client/                 # React Frontend
│   ├── src/
│   ├── package.json
│   └── README.md
├── server/                 # Node.js Backend
│   ├── src/
│   ├── package.json
│   └── README.md
├── shared/                 # Shared types/utilities
├── docker-compose.yml      # Docker setup
├── package.json            # Root package
└── README.md
\`\`\`

**⚡ Key Features:**
• React frontend with modern UI
• Node.js backend with Express
• Real-time communication
• Database integration
• Authentication system
• Docker deployment ready

**🚀 Quick Start:**
\`\`\`bash
# Create project structure
mkdir ${software.name.toLowerCase().replace(/\s+/g, '-')}-fullstack
cd ${software.name.toLowerCase().replace(/\s+/g, '-')}-fullstack

# Initialize frontend
npx create-react-app client
cd client
npm install axios react-router-dom

# Initialize backend
cd ../server
npm init -y
npm install express cors helmet morgan
\`\`\`

Would you like me to generate the complete codebase?`;
  };

  const generateMobilePackage = (software) => {
    return `📱 **Mobile App Package for ${software.name} Created!**

I've prepared a complete mobile application structure:

**📁 Project Structure:**
\`\`\`
${software.name.toLowerCase().replace(/\s+/g, '-')}-mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   ├── components/
│   │   ├── Header.js
│   │   └── Navigation.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── services/
│   │   └── api.js
│   └── App.js
├── package.json
├── app.json
└── README.md
\`\`\`

**⚡ Key Features:**
• React Native cross-platform
• Navigation with React Navigation
• State management ready
• API integration
• Responsive design
• Native performance

**🚀 Quick Start:**
\`\`\`bash
npx react-native init ${software.name.replace(/\s+/g, '')}Mobile
cd ${software.name.replace(/\s+/g, '')}Mobile
npm install @react-navigation/native @react-navigation/stack
npx react-native run-android  # or run-ios
\`\`\`

Would you like me to generate the actual mobile app code?`;
  };

  const generateCustomPackage = (software, userInput) => {
    return `🎯 **Custom Package for ${software.name} Created!**

Based on your request: "${userInput}"

I've prepared a custom solution structure:

**📁 Project Structure:**
\`\`\`
${software.name.toLowerCase().replace(/\s+/g, '-')}-custom/
├── src/
│   ├── features/
│   │   └── ${userInput.toLowerCase().replace(/\s+/g, '')}/
│   ├── components/
│   ├── services/
│   └── utils/
├── docs/
├── tests/
├── package.json
└── README.md
\`\`\`

**⚡ Custom Features:**
• Tailored to your specific needs
• Scalable architecture
• Best practices implementation
• Documentation included
• Testing setup ready

**🚀 Next Steps:**
1. Review the generated structure
2. Customize based on your requirements
3. Implement core functionality
4. Add tests and documentation

Would you like me to generate the specific code for your custom requirements?`;
  };

  const generateAuthPackage = (software) => {
    return `🔐 **Authentication Package for ${software.name} Created!**

I've prepared a complete authentication system:

**📁 Project Structure:**
\`\`\`
auth-system/
├── frontend/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   └── hooks/
│       └── useAuth.js
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   └── models/
│       └── userModel.js
└── shared/
    └── types/
\`\`\`

**⚡ Key Features:**
• JWT token authentication
• Password hashing with bcrypt
• Protected routes
• User registration/login
• Password reset functionality
• Session management

**🚀 Quick Start:**
\`\`\`bash
# Backend
npm install jsonwebtoken bcryptjs express-validator

# Frontend
npm install react-router-dom axios
\`\`\`

Would you like me to generate the complete auth code?`;
  };

  const generateDatabasePackage = (software) => {
    return `🗄️ **Database Package for ${software.name} Created!**

I've prepared a complete database solution:

**📁 Project Structure:**
\`\`\`
database-system/
├── models/
│   ├── User.js
│   ├── ${software.name.replace(/\s+/g, '')}.js
│   └── index.js
├── migrations/
├── seeders/
├── config/
│   └── database.js
└── utils/
    └── dbHelpers.js
\`\`\`

**⚡ Key Features:**
• Multiple database support (MySQL, PostgreSQL, MongoDB)
• Migration system
• Data seeding
• Connection pooling
• Query optimization
• Backup strategies

**🚀 Quick Start:**
\`\`\`bash
# For MySQL/PostgreSQL
npm install sequelize mysql2 pg

# For MongoDB
npm install mongoose

# For SQLite
npm install sqlite3
\`\`\`

Would you like me to generate the database schemas and models?`;
  };

  const generateDeploymentPackage = (software) => {
    return `🚀 **Deployment Package for ${software.name} Created!**

I've prepared a complete deployment solution:

**📁 Project Structure:**
\`\`\`
deployment/
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
├── scripts/
│   ├── deploy.sh
│   ├── build.sh
│   └── health-check.sh
├── config/
│   ├── production.js
│   └── staging.js
└── docs/
    └── deployment.md
\`\`\`

**⚡ Key Features:**
• Docker containerization
• Multi-stage builds
• Environment configuration
• CI/CD pipeline ready
• Health monitoring
• Auto-scaling support

**🚀 Quick Start:**
\`\`\`bash
# Build and run with Docker
docker build -t ${software.name.toLowerCase().replace(/\s+/g, '-')} .
docker run -p 3000:3000 ${software.name.toLowerCase().replace(/\s+/g, '-')}

# Or use Docker Compose
docker-compose up -d
\`\`\`

Would you like me to generate the deployment configuration files?`;
  };

  const generateTestingPackage = (software) => {
    return `🧪 **Testing Package for ${software.name} Created!**

I've prepared a complete testing solution:

**📁 Project Structure:**
\`\`\`
testing/
├── unit/
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   └── specs/
├── fixtures/
├── mocks/
└── config/
    └── jest.config.js
\`\`\`

**⚡ Key Features:**
• Unit testing with Jest
• Integration testing
• End-to-end testing with Cypress
• Mock data generation
• Test coverage reporting
• CI/CD integration

**🚀 Quick Start:**
\`\`\`bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm test -- --coverage
\`\`\`

Would you like me to generate the test files and examples?`;
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      executeTerminalCommand(terminalInput.trim());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading software details...</p>
        </div>
      </div>
    );
  }

  if (error || !software) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Software not found'}</p>
          <button
            onClick={() => navigate('/software')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Software
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/software')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                {getIconComponent(software.icon)}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{software.name}</h1>
                  <p className="text-gray-600">{software.category}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-gray-700">{software.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{software.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Monitor },
              { id: 'code', label: 'Code Editor', icon: Code },
              { id: 'terminal', label: 'Terminal', icon: Terminal },
              { id: 'ai', label: 'MJND Assistant', icon: Bot },
              { id: 'docs', label: 'Documentation', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700">{software.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {software.features.slice(0, 10).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(software.specifications || {}).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 font-medium">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleAiAssist}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Bot className="h-4 w-4" />
                      <span>AI Assist</span>
                    </button>
                    <button
                      onClick={runCode}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Run Code</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  value={codeEditor}
                  onChange={(e) => setCodeEditor(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                  placeholder="Start coding here..."
                />
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                        <button
                          onClick={() => applySuggestion(suggestion)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        <code>{suggestion.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAiThinking && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-700">AI is analyzing your code...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Terminal</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                {terminalOutput.map((output, index) => (
                  <div key={index} className={`mb-2 ${
                    output.type === 'error' ? 'text-red-400' : 
                    output.type === 'input' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {output.content}
                  </div>
                ))}
              </div>
              <form onSubmit={handleTerminalSubmit} className="mt-4">
                <div className="flex space-x-2">
                  <span className="text-gray-700 font-mono">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-gray-900 text-green-400 p-2 rounded font-mono border-0 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter command..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Execute
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* AI Chat Interface */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Coding Assistant</h3>
                    <p className="text-sm text-gray-600">Ask me to create anything for {software.name}!</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {aiChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'ai' && (
                          <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="px-4 py-4 border-t bg-gray-50">
                <form onSubmit={handleAiChatSubmit} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      placeholder="Type what you want to create... (e.g., 'Create a React app', 'Build an API', 'Make a full-stack app')"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={isAiTyping}
                    />
                    <div className="absolute right-3 top-3 text-xs text-gray-400">
                      Press Enter to send
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!aiChatInput.trim() || isAiTyping}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setAiChatInput('Create a React app');
                    handleAiChatSubmit({ preventDefault: () => {} });
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="p-2 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                    <Code className="h-6 w-6 text-blue-600 mx-auto" />
                  </div>
                  <span className="text-gray-700 font-medium">React App</span>
                  <p className="text-xs text-gray-500 mt-1">Frontend application</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiChatInput('Build a backend API');
                    handleAiChatSubmit({ preventDefault: () => {} });
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="p-2 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                    <Server className="h-6 w-6 text-green-600 mx-auto" />
                  </div>
                  <span className="text-gray-700 font-medium">Backend API</span>
                  <p className="text-xs text-gray-500 mt-1">Server & database</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiChatInput('Create a full-stack app');
                    handleAiChatSubmit({ preventDefault: () => {} });
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="p-2 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                    <Globe className="h-6 w-6 text-purple-600 mx-auto" />
                  </div>
                  <span className="text-gray-700 font-medium">Full-Stack</span>
                  <p className="text-xs text-gray-500 mt-1">Complete application</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiChatInput('Build a mobile app');
                    handleAiChatSubmit({ preventDefault: () => {} });
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="p-2 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                    <Monitor className="h-6 w-6 text-orange-600 mx-auto" />
                  </div>
                  <span className="text-gray-700 font-medium">Mobile App</span>
                  <p className="text-xs text-gray-500 mt-1">Cross-platform</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiChatInput('Add authentication system');
                    handleAiChatSubmit({ preventDefault: () => {} });
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="p-2 bg-red-100 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                    <Shield className="h-6 w-6 text-red-600 mx-auto" />
                  </div>
                  <span className="text-gray-700 font-medium">Authentication</span>
                  <p className="text-xs text-gray-500 mt-1">Login & security</p>
                </button>
                
                <button
                  onClick={() => {
                    setAiChatInput('Create testing suite');
                    handleAiChatSubmit({ preventDefault: () => {} });
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="p-2 bg-yellow-100 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
                    <CheckCircle className="h-6 w-6 text-yellow-600 mx-auto" />
                  </div>
                  <span className="text-gray-700 font-medium">Testing</span>
                  <p className="text-xs text-gray-500 mt-1">Unit & integration</p>
                </button>
              </div>
            </div>

            {/* AI Capabilities Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">What I Can Create For You</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Complete project structures</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileCode className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Ready-to-use code templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">File organization & architecture</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Version control setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Deployment configurations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">Database schemas & APIs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>
            <div className="prose max-w-none">
              <h4>Getting Started</h4>
              <p>Welcome to {software.name}! This comprehensive guide will help you get started with development and customization.</p>
              
              <h4>Installation</h4>
              <p>Follow these steps to install and configure {software.name}:</p>
              <ol>
                <li>Download the latest version</li>
                <li>Run the installation wizard</li>
                <li>Configure your preferences</li>
                <li>Start development!</li>
              </ol>
              
              <h4>API Reference</h4>
              <p>Explore the comprehensive API documentation for {software.name} to understand all available features and methods.</p>
              
              <h4>Examples</h4>
              <p>Check out our example projects and tutorials to learn best practices and common use cases.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareDetail;
