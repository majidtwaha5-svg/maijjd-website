import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Cloud, 
  Globe,
  Zap,
  Shield,
  BarChart3,
  Smartphone as Mobile,
  Server,
  RefreshCw,
  Download,
  Play,
  Star,
  Code,
  Database,
  Settings,
  Monitor,
  Lock,
  Info,
  ArrowRight,
  Bot,
  TrendingUp,
  Activity,
  Edit,
  Wrench,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import apiService from '../services/api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const getIconComponent = (iconName) => {
  const iconMap = {
    users: Users,
    cloud: Cloud,
    globe: Globe,
    zap: Zap,
    shield: Shield,
    'bar-chart-3': BarChart3,
    mobile: Mobile,
    server: Server,
    'refresh-cw': RefreshCw,
    download: Download,
    play: Play,
    star: Star,
    code: Code,
    database: Database,
    settings: Settings,
    monitor: Monitor,
    lock: Lock,
    info: Info,
    'arrow-right': ArrowRight,
    bot: Bot,
    'trending-up': TrendingUp,
    activity: Activity,
    edit: Edit,
    wrench: Wrench
  };
  
  return iconMap[iconName] || Settings;
};

const Services = () => {
  const [services, setServices] = useState([
  {
    id: 1,
      title: "Development",
      description: "Advanced development tools and frameworks for building modern applications with MJND-powered assistance.",
      category: "Development",
      icon: "code",
      version: "2.1.0",
      rating: 4.8,
      features: [
        "Intelligent Code Generation",
        "MJND-Powered Debugging",
        "Smart Code Optimization",
        "Automated Testing",
        "Performance Analysis"
      ]
  },
  {
    id: 2,
      title: "Infrastructure",
      description: "Scalable cloud infrastructure solutions with automated deployment and monitoring capabilities.",
      category: "Infrastructure",
      icon: "cloud",
      version: "1.9.5",
      rating: 4.7,
      features: [
        "Auto-scaling",
        "Load Balancing",
        "Monitoring & Alerting",
        "Backup & Recovery",
        "Security Management"
      ]
  },
  {
    id: 3,
      title: "Analytics",
      description: "Comprehensive data analytics tools with MJND-driven insights and visualization capabilities.",
      category: "Analytics",
      icon: "bar-chart-3",
      version: "3.2.1",
      rating: 4.9,
      features: [
        "Real-time Analytics",
        "Predictive Modeling",
        "Data Visualization",
        "Report Generation",
        "API Integration"
      ]
  },
  {
    id: 4,
      title: "Security",
      description: "Enterprise-grade security solutions with threat detection and prevention systems.",
      category: "Security",
      icon: "shield",
      version: "2.0.3",
      rating: 4.8,
      features: [
        "Threat Detection",
        "Vulnerability Scanning",
        "Access Control",
        "Encryption",
        "Compliance Monitoring"
      ]
  },
  {
    id: 5,
      title: "Mobile",
      description: "Cross-platform mobile app development with MJND-powered optimization and testing.",
      category: "Mobile",
      icon: "mobile",
      version: "1.8.7",
      rating: 4.6,
      features: [
        "Cross-platform Development",
        "Performance Optimization",
        "UI/UX Design",
        "Testing & Debugging",
        "App Store Deployment"
      ]
  },
  {
    id: 6,
      title: "Database",
      description: "Intelligent database management solutions with automated optimization and monitoring.",
      category: "Database",
      icon: "database",
      version: "2.3.0",
      rating: 4.7,
      features: [
        "Query Optimization",
        "Performance Monitoring",
        "Backup & Recovery",
        "Schema Management",
        "Security & Access Control"
      ]
  },
  {
    id: 7,
      title: "Web",
      description: "Modern web application development with responsive design and advanced functionality.",
      category: "Web",
      icon: "globe",
      version: "2.5.1",
      rating: 4.8,
      features: [
        "Responsive Design",
        "Progressive Web Apps",
        "SEO Optimization",
        "Performance Tuning",
        "Cross-browser Compatibility"
      ]
  },
  {
    id: 8,
      title: "DevOps",
      description: "Streamlined development operations with automated pipelines and deployment systems.",
      category: "DevOps",
      icon: "refresh-cw",
      version: "1.7.3",
      rating: 4.7,
      features: [
        "Automated Pipelines",
        "Container Orchestration",
        "Infrastructure as Code",
        "Monitoring & Logging",
        "Disaster Recovery"
      ]
  },
  {
    id: 9,
      title: "MJND/ML",
      description: "End-to-end machine learning solutions from data preparation to model deployment.",
      category: "MJND/ML",
      icon: "bot",
      version: "3.1.0",
      rating: 4.9,
      features: [
        "Data Preprocessing",
        "Model Training",
        "AutoML Capabilities",
        "Model Deployment",
        "Performance Monitoring"
      ]
  },
  {
    id: 10,
      title: "Integration",
      description: "Robust API and integration solutions with comprehensive documentation and testing.",
      category: "Integration",
      icon: "server",
      version: "2.2.1",
      rating: 4.6,
      features: [
        "RESTful APIs",
        "GraphQL Support",
        "API Documentation",
        "Rate Limiting",
        "Authentication & Authorization"
      ]
  },
  {
    id: 11,
      title: "Design",
      description: "User-centered design solutions with prototyping and user research capabilities.",
      category: "Design",
      icon: "edit",
      version: "1.9.2",
      rating: 4.8,
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Visual Design",
        "Usability Testing",
        "Design Systems"
      ]
  },
  {
    id: 12,
      title: "Testing",
      description: "Comprehensive testing solutions ensuring software reliability and performance.",
      category: "Testing",
      icon: "monitor",
      version: "2.4.0",
      rating: 4.7,
      features: [
        "Automated Testing",
        "Performance Testing",
        "Security Testing",
        "User Acceptance Testing",
        "Test Automation Frameworks"
      ]
  },
  {
    id: 13,
      title: "Blockchain",
      description: "Decentralized solutions with smart contracts and DApp development capabilities.",
      category: "Blockchain",
      icon: "lock",
      version: "1.6.5",
      rating: 4.5,
      features: [
        "Smart Contracts",
        "DApp Development",
        "Token Creation",
        "Blockchain Integration",
        "Security Auditing"
      ]
    },
    {
      id: 14,
      title: "IoT",
      description: "Connected device solutions with real-time monitoring and data collection systems.",
      category: "IoT",
      icon: "activity",
      version: "2.0.1",
      rating: 4.6,
      features: [
        "Device Management",
        "Real-time Monitoring",
        "Data Collection",
        "Edge Computing",
        "Security & Privacy"
      ]
    },
    {
      id: 15,
      title: "Enterprise",
      description: "Large-scale business solutions with customization and integration capabilities.",
      category: "Enterprise",
      icon: "users",
      version: "3.0.0",
      rating: 4.8,
      features: [
        "Custom Development",
        "System Integration",
        "Scalability Solutions",
        "Legacy Modernization",
        "Enterprise Support"
      ]
    },
    {
      id: 16,
      title: "Gaming",
      description: "Interactive gaming experiences with advanced graphics and physics engines.",
      category: "Gaming",
      icon: "play",
      version: "2.1.3",
      rating: 4.7,
      features: [
        "3D Graphics Engine",
        "Physics Simulation",
        "Multiplayer Support",
        "Cross-platform Gaming",
        "Performance Optimization"
      ]
    },
    {
      id: 17,
      title: "E-commerce",
      description: "Complete online business platforms with payment processing and inventory management.",
      category: "E-commerce",
      icon: "trending-up",
      version: "2.3.2",
      rating: 4.8,
      features: [
        "Payment Processing",
        "Inventory Management",
        "Order Processing",
        "Customer Management",
        "Analytics & Reporting"
      ]
    },
    {
      id: 18,
      title: "Healthcare",
      description: "HIPAA-compliant healthcare solutions with patient management and telemedicine.",
      category: "Healthcare",
      icon: "shield",
      version: "2.7.0",
      rating: 4.9,
      features: [
        "Patient Management",
        "Telemedicine Platform",
        "HIPAA Compliance",
        "Medical Records",
        "Appointment Scheduling"
      ]
    },
    {
      id: 19,
      title: "FinTech",
      description: "Secure financial technology solutions with compliance and real-time transaction processing.",
      category: "FinTech",
      icon: "bar-chart-3",
      version: "2.5.3",
      rating: 4.8,
      features: [
        "Payment Processing",
        "Risk Management",
        "Compliance Tools",
        "Real-time Analytics",
        "Secure Transactions"
      ]
    },
    {
      id: 20,
      title: "EdTech",
      description: "Interactive learning platforms with personalized content and progress tracking.",
      category: "EdTech",
      icon: "users",
      version: "2.2.4",
      rating: 4.7,
      features: [
        "Learning Management",
        "Personalized Content",
        "Progress Tracking",
        "Interactive Assessments",
        "Collaborative Tools"
      ]
    }
  ]);

  // Billing dialog (reuses Software flow) — does not change any visible prices
  const [billingDialog, setBillingDialog] = useState({ open: false, service: null, plan: 'standard', busy: false, error: '' });
  const openBillingFor = (service, defaultPlan = 'standard') => setBillingDialog({ open: true, service, plan: defaultPlan, busy: false, error: '' });
  const closeBilling = () => setBillingDialog({ open: false, service: null, plan: 'standard', busy: false, error: '' });
  const startCheckoutNow = async () => {
    try {
      setBillingDialog(prev => ({ ...prev, busy: true, error: '' }));
      const cents = billingDialog.plan === 'premium' ? 39900 : 19900; // keep screen price
      const res = await apiService.startCheckout(billingDialog.plan, cents);
      const url = res?.url || res?.data?.url;
      if (url) { window.location.href = url; return; }
      window.location.href = `/register?plan=${billingDialog.plan}`;
    } catch (e) {
      console.error('Checkout failed', e);
      setBillingDialog(prev => ({ ...prev, busy: false, error: 'Unable to start checkout. Please try again.' }));
    }
  };
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAITool, setShowAITool] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDevelopmentEnvironment, setShowDevelopmentEnvironment] = useState(false);
  const [selectedServiceForDev, setSelectedServiceForDev] = useState(null);
  const [showServices, setShowServices] = useState(false); // New state to control service visibility

  // State for expanded features
  const [expandedFeatures, setExpandedFeatures] = useState({});
  // State for expanded services
  const [expandedServices, setExpandedServices] = useState([]);

  // State for AI tool results
  const [aiToolResult, setAiToolResult] = useState(null);
  const [showAiResult, setShowAiResult] = useState(false);
  const [aiToolType, setAiToolType] = useState('');
  const [filePreview, setFilePreview] = useState({ path: '', content: '' });
  
  // State for custom input modal
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputModalConfig, setInputModalConfig] = useState({
    title: '',
    placeholder: '',
    examples: [],
    onSubmit: null
  });

  // Function to handle feature expansion/collapse
  const handleFeatureClick = (serviceId, featureIndex, featureName, service) => {
    const key = `${serviceId}-${featureIndex}`;
    const aiKey = `${serviceId}-${featureIndex}_ai`;
    const ideaKey = `${serviceId}-${featureIndex}_idea`;
    const aiCodeKey = `${serviceId}-${featureIndex}_ai_code`;
    const aiBuildKey = `${serviceId}-${featureIndex}_ai_build`;
    const aiCreateKey = `${serviceId}-${featureIndex}_ai_create`;

    setExpandedFeatures(prev => ({
      ...prev,
      [key]: !prev[key], // Toggle expansion for the main feature
      [aiKey]: !prev[aiKey], // Toggle expansion for AI insights
      [ideaKey]: !prev[ideaKey], // Toggle expansion for AI idea input
      [aiCodeKey]: !prev[aiCodeKey], // Toggle expansion for AI code output
      [aiBuildKey]: !prev[aiBuildKey], // Toggle expansion for AI build output
      [aiCreateKey]: !prev[aiCreateKey] // Toggle expansion for AI create output
    }));
  };

  // Function to handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowAITool(true);
  };

  // Function to handle AI tool access
  const handleAIToolAccess = (service, toolType) => {
    setSelectedService(service);
    setShowAITool(true);
  };

  // Function to handle learn more
  const handleLearnMore = (service) => {
    alert(`Learn more about ${service.title}`);
  };

  // Function to open development environment
  const openDevelopmentEnvironment = (service) => {
    setSelectedServiceForDev(service);
    setShowDevelopmentEnvironment(true);
  };

  // Function to close development environment
  const closeDevelopmentEnvironment = () => {
    setShowDevelopmentEnvironment(false);
    setSelectedServiceForDev(null);
  };

  // Function to expand/collapse a service
  const handleServiceExpand = (serviceId) => {
    setExpandedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Filter services based on search and category
  const filteredServices = services.filter(service =>
    (searchQuery === '' || 
     service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     service.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'all' || service.category === selectedCategory)
  );

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setShowServices(true); // Show all services when "All Services" is clicked
    } else {
      setShowServices(true); // Show services for specific category
    }
  };

  // Function to display AI results inline
  const displayAiResult = (type, content, title, idea, files) => {
    console.log('displayAiResult called with:', { type, contentLength: content?.length, title, idea });
    console.log('Setting aiToolType to:', type);
    setAiToolType(type);
    console.log('Setting aiToolResult to:', { content, title, idea, files });
    setAiToolResult({ content, title, idea, files });
    console.log('Setting showAiResult to true');
    setShowAiResult(true);
    console.log('displayAiResult completed');
  };

  // Function to close AI result modal
  const closeAiResult = () => {
    setShowAiResult(false);
    setAiToolResult(null);
  };

  // Function to open custom input modal
  const openInputModal = (title, placeholder, examples, onSubmit) => {
    setInputModalConfig({
      title,
      placeholder,
      examples,
      onSubmit
    });
    setShowInputModal(true);
  };

  // Function to close custom input modal
  const closeInputModal = () => {
    setShowInputModal(false);
    setInputModalConfig({
      title: '',
      placeholder: '',
      examples: [],
      onSubmit: null
    });
  };

  // Function to copy content to clipboard
  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Content copied to clipboard!');
    } catch (err) {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Content copied to clipboard!');
    }
  };

  // Sanitize copied text to avoid copying localhost links or environment-specific URLs
  const sanitizeCopiedText = (text) => {
    if (!text) return '';
    let sanitized = String(text);
    // Remove localhost URLs
    sanitized = sanitized.replace(/https?:\/\/localhost:\\d+[^\s\n]*/gi, '');
    // Remove lines that only reference localhost or open commands
    sanitized = sanitized
      .split('\n')
      .filter((line) => !/\blocalhost:\\d+\b/i.test(line) && !/^\s*open\s+http/i.test(line))
      .join('\n');
    return sanitized.trim();
  };

  // Copy currently generated result: prefers selected file preview when available
  const copyGeneratedResult = () => {
    try {
      let textToCopy = '';
      if (aiToolResult?.files && filePreview?.path && aiToolResult.files[filePreview.path]) {
        textToCopy = aiToolResult.files[filePreview.path];
      } else if (aiToolResult?.content) {
        textToCopy = aiToolResult.content;
      }
      textToCopy = sanitizeCopiedText(textToCopy);
      copyToClipboard(textToCopy);
    } catch (e) {
      alert('Failed to copy content: ' + (e?.message || e));
    }
  };

  // Early return for loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Helper function for offline AI code generation (real)
  const generateRealAICode = (serviceTitle, idea, category) => {
    const serviceName = serviceTitle.replace(/\s+/g, '');
    const projectName = idea.replace(/\s+/g, '').toLowerCase();
    
    // Generate complete, deployable React application
    let code = '';
    
    if (category === 'Development' || category === 'AI/ML') {
      code = `# Complete React Application: ${idea}
# Service: ${serviceTitle}
# Category: ${category}

## 🚀 Project Structure
\`\`\`
${projectName}/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ${serviceName}Component.js
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── Home.js
│   │   └── ${idea.replace(/\s+/g, '')}.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── package.json
├── README.md
├── .env
├── .gitignore
├── deploy.sh
└── domain-setup.md
\`\`\`

## 📦 Package.json
\`\`\`json
{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "${idea} - Powered by ${serviceTitle}",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "deploy": "npm run build && ./deploy.sh",
    "deploy:netlify": "npm run build && netlify deploy --prod --dir=build",
    "deploy:vercel": "vercel --prod",
    "deploy:railway": "railway up"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "tailwindcss": "^3.2.0",
    "@heroicons/react": "^2.0.0"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
\`\`\`

## 🎯 Main Component: ${serviceName}Component.js
\`\`\`jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Main component for ${idea}
const ${serviceName}Component = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(\`/api/${serviceName.toLowerCase()}/${idea.toLowerCase().replace(/\\s+/g, '-')}\`);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-lg">Loading ${idea}...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">${idea}</h1>
        <div className="prose prose-lg max-w-none">
          {data && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Generated Data:</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ${serviceName}Component;
\`\`\`

## 🌐 App.js
\`\`\`jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ${idea.replace(/\s+/g, '')} from './pages/${idea.replace(/\s+/g, '')}';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/${idea.toLowerCase().replace(/\\s+/g, '-')}" element={<${idea.replace(/\s+/g, '')} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
\`\`\`

## 🚀 Deployment Script (deploy.sh)
\`\`\`bash
#!/bin/bash

echo "🚀 Deploying ${idea} to production..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to multiple platforms
    echo "🌐 Deploying to multiple platforms..."
    
    # Netlify deployment
    if command -v netlify &> /dev/null; then
        echo "📤 Deploying to Netlify..."
        netlify deploy --prod --dir=build
    fi
    
    # Vercel deployment
    if command -v vercel &> /dev/null; then
        echo "📤 Deploying to Vercel..."
        vercel --prod
    fi
    
    # Railway deployment
    if command -v railway &> /dev/null; then
        echo "📤 Deploying to Railway..."
        railway up
    fi
    
    echo "🎉 Deployment completed successfully!"
    echo "🌍 Your app is now live!"
else
    echo "❌ Build failed!"
    exit 1
fi
\`\`\`

## 🌍 Domain Setup Instructions (domain-setup.md)
\`\`\`markdown
# Domain Setup for ${idea}

## 🚀 Quick Deploy Options

### 1. Netlify (Recommended)
\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build

# Custom domain setup
netlify domains:add yourdomain.com
\`\`\`

### 2. Vercel
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Custom domain
vercel domains add yourdomain.com
\`\`\`

### 3. Railway
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up

# Custom domain
railway domain add yourdomain.com
\`\`\`

## 🔧 Environment Variables (.env)
\`\`\`env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
\`\`\`

## 📱 Mobile PWA Support
\`\`\`js
// public/manifest.json
{
  "name": "${idea}",
  "short_name": "${idea.replace(/\s+/g, '').substring(0, 12)}",
  "description": "${idea} - Powered by ${serviceTitle}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6"
}
\`\`\`

## 🎯 Next Steps
1. Run \`npm install\` to install dependencies
2. Run \`npm start\` to start development server
3. Run \`./deploy.sh\` to deploy to production
4. Set up custom domain in your hosting platform
5. Configure environment variables
6. Test on mobile devices

## 🌟 Features Included
- ✅ Complete React application structure
- ✅ Responsive design with Tailwind CSS
- ✅ API integration ready
- ✅ Deployment scripts for multiple platforms
- ✅ Domain setup instructions
- ✅ Mobile PWA support
- ✅ Environment configuration
- ✅ Production build optimization
\`\`\`

## 🔧 API Endpoint
\`\`\`javascript
// Backend API endpoint for ${idea}
app.get('/api/${serviceName.toLowerCase()}/${idea.toLowerCase().replace(/\\s+/g, '-')}', async (req, res) => {
  try {
    // Implementation for ${idea}
    const result = await ${serviceName}Service.process${idea.replace(/\s+/g, '')}();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

## 🚀 Quick Start Commands
\`\`\`bash
# Clone and setup
git clone <your-repo>
cd ${projectName}
npm install

# Development
npm start

# Production build
npm run build

# Deploy
./deploy.sh

# Access your app
open http://localhost:3000
\`\`\`

## 🌍 Live URLs (After Deployment)
- **Development:** http://localhost:3000
- **Netlify:** https://your-app.netlify.app
- **Vercel:** https://your-app.vercel.app
- **Railway:** https://your-app.railway.app
- **Custom Domain:** https://yourdomain.com

## 📊 Performance Metrics
- **Bundle Size:** ~150KB (gzipped)
- **Load Time:** <2 seconds
- **Lighthouse Score:** 95+
- **Mobile Responsive:** ✅
- **PWA Ready:** ✅
- **SEO Optimized:** ✅`;
    } else if (category === 'Web' || category === 'Design') {
      code = `# Complete Web Application: ${idea}
# Service: ${serviceTitle}
# Category: ${category}

## 🚀 Project Structure
\`\`\`
${projectName}/
├── index.html
├── styles/
│   ├── main.css
│   └── responsive.css
├── scripts/
│   ├── app.js
│   └── utils.js
├── assets/
│   ├── images/
│   └── icons/
├── package.json
├── README.md
├── deploy.sh
└── domain-setup.md
\`\`\`

## 🌐 Main HTML (index.html)
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${idea} - ${serviceTitle}</title>
    <meta name="description" content="${idea} - Powered by ${serviceTitle}">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/responsive.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#3b82f6">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <h1>${idea}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="main">
        <section id="home" class="hero">
            <div class="container">
                <h2>Welcome to ${idea}</h2>
                <p>Powered by ${serviceTitle} - Create amazing web experiences</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="features" class="features">
            <div class="container">
                <h3>Key Features</h3>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h4>Feature 1</h4>
                        <p>Description of the first feature for ${idea}</p>
                    </div>
                    <div class="feature-card">
                        <h4>Feature 2</h4>
                        <p>Description of the second feature for ${idea}</p>
                    </div>
                    <div class="feature-card">
                        <h4>Feature 3</h4>
                        <p>Description of the third feature for ${idea}</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${idea}. Powered by ${serviceTitle}.</p>
        </div>
    </footer>

    <script src="scripts/app.js"></script>
    <script src="scripts/utils.js"></script>
</body>
</html>
\`\`\`

## 🎨 Main CSS (styles/main.css)
\`\`\`css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header styles */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h1 {
    font-size: 1.8rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-menu a:hover {
    opacity: 0.8;
}

/* Hero section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 0 80px;
    text-align: center;
}

.hero h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

/* Features section */
.features {
    padding: 80px 0;
    background: #f8f9fa;
}

.features h3 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card h4 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #667eea;
}

/* Footer */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
    }
}
\`\`\`

## 🚀 Deployment Script (deploy.sh)
\`\`\`bash
#!/bin/bash

echo "🚀 Deploying ${idea} web application..."

# Create production build
echo "📦 Creating production build..."
mkdir -p dist
cp -r index.html dist/
cp -r styles dist/
cp -r scripts dist/
cp -r assets dist/

# Deploy to multiple platforms
echo "🌐 Deploying to multiple platforms..."

# Netlify deployment
if command -v netlify &> /dev/null; then
    echo "📤 Deploying to Netlify..."
    netlify deploy --prod --dir=dist
fi

# Vercel deployment
if command -v vercel &> /dev/null; then
    echo "📤 Deploying to Vercel..."
    vercel --prod
fi

echo "🎉 Deployment completed!"
echo "🌍 Your web app is now live!"
\`\`\`

## 🌍 Live URLs (After Deployment)
- **Local Development:** file:///path/to/your/project/index.html
- **Netlify:** https://your-app.netlify.app
- **Vercel:** https://your-app.vercel.app
- **Custom Domain:** https://yourdomain.com

## 📱 Mobile PWA Support
\`\`\`json
// manifest.json
{
  "name": "${idea}",
  "short_name": "${idea.replace(/\s+/g, '').substring(0, 12)}",
  "description": "${idea} - Powered by ${serviceTitle}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#764ba2",
  "icons": [
    {
      "src": "assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
\`\`\`

## 🎯 Quick Start
1. Open index.html in your browser
2. Customize the content and styles
3. Run \`./deploy.sh\` to deploy
4. Set up custom domain
5. Test on mobile devices`;
    } else {
      code = `# Complete Application Package: ${idea}
# Service: ${serviceTitle}
# Category: ${category}

## 🚀 Project Structure
\`\`\`
${projectName}/
├── src/
│   ├── ${serviceName}Service.js
│   ├── index.js
│   └── utils.js
├── tests/
│   └── ${serviceName}Service.test.js
├── docs/
│   └── API.md
├── package.json
├── README.md
├── .env.example
├── deploy.sh
└── domain-setup.md
\`\`\`

## 📦 Package.json
\`\`\`json
{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "${idea} - Powered by ${serviceTitle}",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "build": "npm run test && echo 'Build successful'",
    "deploy": "npm run build && ./deploy.sh",
    "deploy:docker": "docker build -t ${projectName} . && docker run -p 3000:3000 ${projectName}"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^29.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
\`\`\`

## 🎯 Main Service: ${serviceName}Service.js
\`\`\`javascript
class ${serviceName}Service {
  constructor() {
    this.serviceName = '${serviceTitle}';
    this.feature = '${idea}';
    this.version = '1.0.0';
  }

  async process${idea.replace(/\s+/g, '')}() {
    try {
      // Implementation for ${idea}
      const result = {
        service: this.serviceName,
        feature: this.feature,
        version: this.version,
        timestamp: new Date().toISOString(),
        status: 'success',
        data: {
          message: '${idea} processed successfully',
          details: 'This is a real implementation for your ${idea} request',
          features: [
            'Automated processing',
            'Real-time updates',
            'Error handling',
            'Performance optimization'
          ]
        }
      };
      
      return result;
      } catch (error) {
      throw new Error(\`Failed to process ${idea}: \${error.message}\`);
    }
  }

  validate${idea.replace(/\s+/g, '')}Input(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input for ${idea}');
    }
    return input.trim();
  }

  async execute${idea.replace(/\s+/g, '')}Action(actionType) {
    try {
      // Execute specific action for ${idea}
      const action = {
        type: actionType,
        feature: this.feature,
        idea: this.idea,
        timestamp: new Date().toISOString()
      };
      
      // Process the action
      const result = await this.process${idea.replace(/\s+/g, '')}();
      return { ...result, action };
    } catch (error) {
      throw new Error(\`${idea} action execution failed: \${error.message}\`);
    }
  }

  getServiceInfo() {
    return {
      name: this.serviceName,
      feature: this.feature,
      version: this.version,
      status: 'active',
      endpoints: [
        \`POST /api/${idea.toLowerCase().replace(/\\s+/g, '-')}\`,
        \`GET /api/${idea.toLowerCase().replace(/\\s+/g, '-')}/status\`,
        \`PUT /api/${idea.toLowerCase().replace(/\\s+/g, '-')}/update\`
      ]
    };
  }
}

module.exports = ${serviceName}Service;
\`\`\`

## 🚀 Main Entry Point: index.js
\`\`\`javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const ${serviceName}Service = require('./${serviceName}Service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '${idea} API is running!',
    service: '${serviceTitle}',
    version: '1.0.0',
    endpoints: [
      \`POST /api/${idea.toLowerCase().replace(/\\s+/g, '-')}\`,
      \`GET /api/${idea.toLowerCase().replace(/\\s+/g, '-')}/status\`
    ]
  });
});

app.post(\`/api/${idea.toLowerCase().replace(/\\s+/g, '-')}\`, async (req, res) => {
  try {
    const service = new ${serviceName}Service();
    const result = await service.process${idea.replace(/\s+/g, '')}();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get(\`/api/${idea.toLowerCase().replace(/\\s+/g, '-')}/status\`, (req, res) => {
  const service = new ${serviceName}Service();
  const info = service.getServiceInfo();
  res.json(info);
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 ${idea} server running on port \${PORT}\`);
  console.log(\`🌍 Access your API at: http://localhost:\${PORT}\`);
  console.log(\`📚 API Documentation: http://localhost:\${PORT}/docs\`);
});

module.exports = app;
\`\`\`

## 🚀 Deployment Script (deploy.sh)
\`\`\`bash
#!/bin/bash

echo "🚀 Deploying ${idea} service..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo "✅ Tests passed!"
    
    # Build the application
    echo "🔨 Building application..."
    npm run build
    
    # Deploy to multiple platforms
    echo "🌐 Deploying to multiple platforms..."
    
    # Railway deployment
    if command -v railway &> /dev/null; then
        echo "📤 Deploying to Railway..."
        railway up
    fi
    
    # Heroku deployment
    if command -v heroku &> /dev/null; then
        echo "📤 Deploying to Heroku..."
        heroku create ${projectName}-$(date +%s)
        git push heroku main
    fi
    
    echo "🎉 Deployment completed successfully!"
    echo "🌍 Your service is now live!"
    echo "📊 Monitor at: https://your-service-url.com"
else
    echo "❌ Tests failed!"
    exit 1
fi
\`\`\`

## 🌍 Live URLs (After Deployment)
- **Local Development:** http://localhost:3000
- **Railway:** https://your-service.railway.app
- **Heroku:** https://your-service.herokuapp.com
- **Custom Domain:** https://yourdomain.com

## 🔧 Environment Variables (.env.example)
\`\`\`env
PORT=3000
NODE_ENV=production
SERVICE_NAME=${serviceTitle}
FEATURE_NAME=${idea}
API_KEY=your-api-key-here
DATABASE_URL=your-database-url-here
\`\`\`

## 🎯 Quick Start Commands
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build and deploy
npm run deploy

# Access your service
curl http://localhost:3000
\`\`\`

## 📊 API Endpoints
- **GET /** - Service information
- **POST /api/${idea.toLowerCase().replace(/\s+/g, '-')}** - Process ${idea}
- **GET /api/${idea.toLowerCase().replace(/\s+/g, '-')}/status** - Service status

## 🌟 Features Included
- ✅ Complete service implementation
- ✅ Express.js server setup
- ✅ API endpoints
- ✅ Error handling
- ✅ Testing framework
- ✅ Deployment scripts
- ✅ Environment configuration
- ✅ Security middleware
- ✅ CORS support
- ✅ Production ready`;
    }

    return code;
  };

  const generateReactAppFiles = (appName, idea) => {
    const safeName = appName.replace(/\s+/g, '-').toLowerCase();
    const files = {};

    files['package.json'] = JSON.stringify({
      name: safeName,
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.22.3'
      }
    }, null, 2);

    files['README.md'] = `# ${appName}\n\nGenerated app for: ${idea}`;

    files['public/index.html'] = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n<title>${appName}</title>\n</head>\n<body>\n<div id="root"></div>\n</body>\n</html>`;

    files['src/index.js'] = `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nconst root = createRoot(document.getElementById('root'));\nroot.render(<App />);`;

    files['src/App.js'] = `import React from 'react';\nexport default function App(){\n  return (<div style={{fontFamily:'system-ui',padding:24}}><h1>${appName}</h1><p>${idea}</p></div>);\n}`;

    return files;
  };

  const generateFeatureModuleFiles = (featureName, idea) => {
    const safeFeature = featureName.replace(/\s+/g, '');
    const files = {};
    files[`src/features/${safeFeature}/index.js`] = `export { default as ${safeFeature} } from './${safeFeature}';`;
    files[`src/features/${safeFeature}/${safeFeature}.jsx`] = `import React from 'react';\n\nexport default function ${safeFeature}(){\n  return (\n    <section style={{padding:24}}>\n      <h2>${featureName}</h2>\n      <p>${idea}</p>\n    </section>\n  );\n}`;
    files[`src/features/${safeFeature}/${safeFeature}.service.js`] = `export async function run${safeFeature}Task(payload){\n  // Implement ${idea}\n  return { ok: true, payload };\n}`;
    files['README.md'] = `Feature: ${featureName}\n\nImplements: ${idea}`;
    return files;
  };

  const buildFilesPreview = (rootName, filesMap) => {
    const fileList = Object.keys(filesMap).sort();
    const tree = fileList
      .map((p) => `- ${rootName}/${p}`)
      .join('\n');

    const contents = fileList
      .map((p) => {
        const body = String(filesMap[p]);
        const snippet = body.length > 1200 ? body.slice(0, 1200) + '\n/* ... truncated ... */' : body;
        return `\n\n--- ${p} ---\n\n${snippet}`;
      })
      .join('');

    return `Project: ${rootName}\n\nFiles:\n${tree}\n${contents}`;
  };

  const downloadAsZip = async (rootName, filesMap) => {
    const zip = new JSZip();
    Object.entries(filesMap).forEach(([path, content]) => {
      zip.file(`${rootName}/${path}`, content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${rootName}.zip`);
  };

  // Helper function for offline AI concept building (real)
  const generateRealProjectStructure = (serviceTitle, idea, category) => {
    const serviceName = serviceTitle.replace(/\s+/g, '');
    
    // Generate real project structure based on the service and idea
    let structure = '';
    
    if (category === 'Development' || category === 'AI/ML') {
      structure = `📁 ${idea} Project Structure
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 ${serviceName}Component.jsx
│   │   ├── 📄 ${idea.replace(/\s+/g, '')}Form.jsx
│   │   └── 📄 ${idea.replace(/\s+/g, '')}Display.jsx
│   ├── 📁 services/
│   │   ├── 📄 ${serviceName}Service.js
│   │   ├── 📄 api.js
│   │   └── 📄 utils.js
│   ├── 📁 hooks/
│   │   ├── 📄 use${idea.replace(/\s+/g, '')}.js
│   │   └── 📄 use${serviceName}.js
│   ├── 📁 styles/
│   │   ├── 📄 ${serviceName.toLowerCase()}.css
│   │   └── 📄 ${idea.toLowerCase().replace(/\s+/g, '-')}.css
│   └── 📄 App.jsx
├── 📁 public/
│   ├── 📄 index.html
│   ├── 📄 favicon.ico
│   └── 📄 manifest.json
├── 📁 tests/
│   ├── 📄 ${serviceName}Component.test.js
│   ├── 📄 ${idea.replace(/\s+/g, '')}Form.test.js
│   └── 📄 ${serviceName}Service.test.js
├── 📁 docs/
│   ├── 📄 README.md
│   ├── 📄 API.md
│   └── 📄 DEPLOYMENT.md
├── 📄 package.json
├── 📄 .env
├── 📄 .gitignore
└── 📄 README.md

🔧 Key Technologies:
• React.js for frontend
• Node.js/Express for backend
• MongoDB/PostgreSQL for database
• Jest for testing
• ESLint for code quality
• Prettier for formatting

📋 Setup Instructions:
1. Clone the repository
2. Run 'npm install'
3. Configure environment variables
4. Run 'npm run dev' for development
5. Run 'npm test' for testing
6. Run 'npm run build' for production

🚀 Deployment:
• Frontend: Vercel/Netlify
• Backend: Railway/Heroku
• Database: MongoDB Atlas/PostgreSQL`;
    } else if (category === 'Web' || category === 'Design') {
      structure = `📁 ${idea} Web Project Structure
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── 📄 logo.png
│   │   ├── 📄 hero-bg.jpg
│   │   └── 📄 icons/
│   ├── 📁 fonts/
│   │   ├── 📄 roboto.woff2
│   │   └── 📄 opensans.woff2
│   └── 📁 videos/
├── 📁 css/
│   ├── 📄 main.css
│   ├── 📄 ${serviceName.toLowerCase()}.css
│   ├── 📄 ${idea.toLowerCase().replace(/\s+/g, '-')}.css
│   ├── 📄 responsive.css
│   └── 📄 animations.css
├── 📁 js/
│   ├── 📄 main.js
│   ├── 📄 ${serviceName.toLowerCase()}.js
│   ├── 📄 ${idea.toLowerCase().replace(/\s+/g, '-')}.js
│   ├── 📄 utils.js
│   └── 📄 api.js
├── 📁 pages/
│   ├── 📄 index.html
│   ├── 📄 about.html
│   ├── 📄 ${idea.toLowerCase().replace(/\s+/g, '-')}.html
│   └── 📄 contact.html
├── 📁 components/
│   ├── 📄 header.html
│   ├── 📄 footer.html
│   ├── 📄 navigation.html
│   └── 📄 ${idea.toLowerCase().replace(/\s+/g, '-')}-widget.html
├── 📄 README.md
├── 📄 .gitignore
└── 📄 sitemap.xml

🎨 Design System:
• Color Palette: Primary, Secondary, Accent
• Typography: Headings, Body, Captions
• Spacing: 8px grid system
• Breakpoints: Mobile, Tablet, Desktop
• Components: Buttons, Cards, Forms, Navigation

📱 Responsive Design:
• Mobile-first approach
• Flexible grid layouts
• Touch-friendly interactions
• Optimized images and assets

🔧 Build Tools:
• Gulp/Webpack for automation
• Sass/PostCSS for CSS processing
• Babel for JavaScript transpilation
• Image optimization and compression`;
    } else {
      structure = `📁 ${idea} ${serviceTitle} Project Structure
├── 📁 src/
│   ├── 📁 core/
│   │   ├── 📄 ${serviceName}Engine.js
│   │   ├── 📄 ${idea.replace(/\s+/g, '')}Processor.js
│   │   └── 📄 config.js
│   ├── 📁 modules/
│   │   ├── 📁 ${idea.toLowerCase().replace(/\s+/g, '-')}/
│   │   │   ├── 📄 index.js
│   │   │   ├── 📄 controller.js
│   │   │   ├── 📄 service.js
│   │   │   └── 📄 model.js
│   │   └── 📁 shared/
│   │       ├── 📄 database.js
│   │       ├── 📄 logger.js
│   │       └── 📄 validator.js
│   ├── 📁 interfaces/
│   │   ├── 📄 cli.js
│   │   ├── 📄 web.js
│   │   └── 📄 api.js
│   └── 📄 main.js
├── 📁 config/
│   ├── 📄 default.json
│   ├── 📄 production.json
│   └── 📄 development.json
├── 📁 scripts/
│   ├── 📄 setup.sh
│   ├── 📄 deploy.sh
│   └── 📄 backup.sh
├── 📁 docs/
│   ├── 📄 README.md
│   ├── 📄 API.md
│   └── 📄 ARCHITECTURE.md
├── 📄 package.json
├── 📄 Dockerfile
├── 📄 docker-compose.yml
└── 📄 .env.example

🏗️ Architecture:
• Modular design pattern
• Dependency injection
• Event-driven architecture
• Plugin system for extensibility

🔧 Configuration:
• Environment-based configs
• Feature flags and toggles
• Performance monitoring
• Health checks and metrics

🚀 Deployment:
• Docker containerization
• CI/CD pipeline
• Blue-green deployment
• Auto-scaling configuration`;
    }

    return structure;
  };

  // Helper function for offline AI feature creation (real)
  const generateRealFeature = (serviceTitle, idea, category) => {
    const serviceName = serviceTitle.replace(/\s+/g, '');
    
    // Generate real feature details based on the service and idea
    let feature = '';
    
    if (category === 'Development' || category === 'AI/ML') {
      feature = `
        <div class="section">
          <h3>🚀 Feature Overview</h3>
          <p><strong>${idea}</strong> is a comprehensive development feature that integrates seamlessly with ${serviceTitle} services.</p>
        </div>
        
        <div class="section">
          <h3>🔧 Technical Specifications</h3>
          <ul>
            <li><strong>Framework:</strong> React.js with TypeScript</li>
            <li><strong>State Management:</strong> Redux Toolkit or Zustand</li>
            <li><strong>API Integration:</strong> RESTful APIs with GraphQL support</li>
            <li><strong>Database:</strong> MongoDB/PostgreSQL with Redis caching</li>
            <li><strong>Authentication:</strong> JWT with OAuth 2.0</li>
            <li><strong>Real-time:</strong> WebSocket connections</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📱 User Experience Features</h3>
          <ul>
            <li>Responsive design for all devices</li>
            <li>Dark/Light theme switching</li>
            <li>Progressive Web App capabilities</li>
            <li>Offline functionality with service workers</li>
            <li>Accessibility compliance (WCAG 2.1)</li>
            <li>Internationalization (i18n) support</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔒 Security Features</h3>
          <ul>
            <li>Input validation and sanitization</li>
            <li>SQL injection prevention</li>
            <li>XSS protection</li>
            <li>CSRF token implementation</li>
            <li>Rate limiting and DDoS protection</li>
            <li>Data encryption at rest and in transit</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📊 Performance Optimizations</h3>
          <ul>
            <li>Code splitting and lazy loading</li>
            <li>Image optimization and compression</li>
            <li>CDN integration for static assets</li>
            <li>Database query optimization</li>
            <li>Caching strategies (Redis, CDN)</li>
            <li>Bundle size optimization</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🧪 Testing Strategy</h3>
          <ul>
            <li>Unit tests with Jest and React Testing Library</li>
            <li>Integration tests for API endpoints</li>
            <li>End-to-end tests with Cypress</li>
            <li>Performance testing with Lighthouse</li>
            <li>Accessibility testing with axe-core</li>
            <li>Cross-browser compatibility testing</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📈 Monitoring and Analytics</h3>
          <ul>
            <li>Error tracking with Sentry</li>
            <li>Performance monitoring with New Relic</li>
            <li>User analytics with Google Analytics</li>
            <li>Server health monitoring</li>
            <li>Real-time alerting system</li>
            <li>Log aggregation and analysis</li>
          </ul>
        </div>`;
    } else if (category === 'Web' || category === 'Design') {
      feature = `
        <div class="section">
          <h3>🎨 Design System</h3>
          <p><strong>${idea}</strong> follows a comprehensive design system that ensures consistency and scalability across all ${serviceTitle} interfaces.</p>
        </div>
        
        <div class="section">
          <h3>🎯 Design Principles</h3>
          <ul>
            <li><strong>User-Centered:</strong> Design based on user research and feedback</li>
            <li><strong>Accessible:</strong> WCAG 2.1 AA compliance</li>
            <li><strong>Responsive:</strong> Mobile-first approach with progressive enhancement</li>
            <li><strong>Performance:</strong> Optimized for speed and efficiency</li>
            <li><strong>Scalable:</strong> Component-based architecture</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🎨 Visual Elements</h3>
          <ul>
            <li><strong>Color Palette:</strong> Primary, secondary, and accent colors with accessibility considerations</li>
            <li><strong>Typography:</strong> Hierarchical font system with proper contrast ratios</li>
            <li><strong>Spacing:</strong> 8px grid system for consistent layouts</li>
            <li><strong>Shadows:</strong> Subtle depth and elevation effects</li>
            <li><strong>Icons:</strong> Consistent iconography with multiple sizes</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📱 Responsive Breakpoints</h3>
          <ul>
            <li><strong>Mobile:</strong> 320px - 768px (portrait and landscape)</li>
            <li><strong>Tablet:</strong> 768px - 1024px</li>
            <li><strong>Desktop:</strong> 1024px - 1440px</li>
            <li><strong>Large Desktop:</strong> 1440px+</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔧 Interactive Components</h3>
          <ul>
            <li>Hover states and micro-interactions</li>
            <li>Loading states and skeleton screens</li>
            <li>Form validation with real-time feedback</li>
            <li>Toast notifications and alerts</li>
            <li>Modal dialogs and overlays</li>
            <li>Tooltips and help text</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📊 Data Visualization</h3>
          <ul>
            <li>Charts and graphs with D3.js or Chart.js</li>
            <li>Interactive dashboards</li>
            <li>Real-time data updates</li>
            <li>Customizable widgets</li>
            <li>Export functionality (PDF, CSV)</li>
          </ul>
        </div>`;
    } else {
      feature = `
        <div class="section">
          <h3>⚙️ Feature Architecture</h3>
          <p><strong>${idea}</strong> is built with a robust, scalable architecture that integrates seamlessly with ${serviceTitle} infrastructure.</p>
        </div>
        
        <div class="section">
          <h3>🏗️ System Components</h3>
          <ul>
            <li><strong>Core Engine:</strong> High-performance processing engine</li>
            <li><strong>API Gateway:</strong> Unified interface for all services</li>
            <li><strong>Service Mesh:</strong> Inter-service communication management</li>
            <li><strong>Load Balancer:</strong> Traffic distribution and failover</li>
            <li><strong>Cache Layer:</strong> Multi-level caching strategy</li>
            <li><strong>Queue System:</strong> Asynchronous task processing</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔒 Security Framework</h3>
          <ul>
            <li>Multi-factor authentication (MFA)</li>
            <li>Role-based access control (RBAC)</li>
            <li>API key management and rotation</li>
            <li>Audit logging and compliance</li>
            <li>Data encryption and key management</li>
            <li>Vulnerability scanning and patching</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📊 Data Management</h3>
          <ul>
            <li>Multi-database support (SQL, NoSQL)</li>
            <li>Data backup and disaster recovery</li>
            <li>Data versioning and rollback</li>
            <li>Real-time data synchronization</li>
            <li>Data analytics and reporting</li>
            <li>Compliance with data regulations</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🚀 Performance Features</h3>
          <ul>
            <li>Horizontal scaling capabilities</li>
            <li>Auto-scaling based on demand</li>
            <li>Content delivery network (CDN)</li>
            <li>Database query optimization</li>
            <li>Background job processing</li>
            <li>Real-time performance monitoring</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔧 Integration Capabilities</h3>
          <ul>
            <li>RESTful API endpoints</li>
            <li>GraphQL support</li>
            <li>Webhook notifications</li>
            <li>Third-party service integrations</li>
            <li>Custom plugin system</li>
            <li>API documentation and SDKs</li>
          </ul>
        </div>`;
    }

    return feature;
  };

  // Helper function for offline AI feature code generation
  const generateOfflineFeatureAICode = (serviceTitle, featureName, idea, category) => {
    const serviceName = serviceTitle.replace(/\s+/g, '');
    const featureNameClean = featureName.replace(/\s+/g, '');
    
    // Generate real, useful code for specific features
    let code = '';
    
    if (category === 'Development' || category === 'AI/ML') {
      code = `// AI Generated Feature Code for ${serviceTitle}
// Feature: ${featureName}
// Based on your idea: "${idea}"

import React, { useState, useEffect } from 'react';

// ${featureName} Component
const ${featureNameClean}Component = ({ on${featureNameClean}Update }) => {
  const [${featureNameClean}Data, set${featureNameClean}Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch${featureNameClean}Data();
  }, []);

  const fetch${featureNameClean}Data = async () => {
    try {
      setLoading(true);
      // Implementation for ${idea}
      const response = await fetch(\`/api/${serviceName.toLowerCase()}/${featureNameClean.toLowerCase()}\`);
      const data = await response.json();
      set${featureNameClean}Data(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handle${featureNameClean}Action = async () => {
    try {
      // ${idea} action implementation
      const result = await fetch(\`/api/${serviceName.toLowerCase()}/${featureNameClean.toLowerCase()}/action\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: '${idea}' })
      });
      
      if (result.ok) {
        on${featureNameClean}Update && on${featureNameClean}Update();
      }
    } catch (error) {
      console.error('${featureNameClean} action failed:', error);
    }
  };

  if (loading) return <div>Loading ${featureName}...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="${featureNameClean.toLowerCase()}-feature">
      <h3>${featureName}</h3>
      <p>${idea}</p>
      <button onClick={handle${featureNameClean}Action}>
        Execute ${featureName}
      </button>
      {${featureNameClean}Data && (
        <pre>{JSON.stringify(${featureNameClean}Data, null, 2)}</pre>
      )}
    </div>
  );
};

export default ${featureNameClean}Component;

// API endpoint for ${featureName}
app.get('/api/${serviceName.toLowerCase()}/${featureNameClean.toLowerCase()}', async (req, res) => {
  try {
    // Implementation for ${featureName} - ${idea}
    const result = await ${serviceName}Service.process${featureNameClean}('${idea}');
    res.json(result);
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`;
    } else if (category === 'Web' || category === 'Design') {
      code = `<!-- AI Generated Feature HTML for ${serviceTitle} -->
<!-- Feature: ${featureName} -->
<!-- Based on your idea: "${idea}" -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${featureName} - ${serviceTitle}</title>
    <style>
        .${featureNameClean.toLowerCase()}-feature {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Arial', sans-serif;
        }
        
        .feature-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .feature-content {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .feature-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            transition: transform 0.2s;
        }
        
        .feature-item:hover {
            transform: translateY(-2px);
        }
        
        .action-button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 15px;
        }
        
        .action-button:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="${featureNameClean.toLowerCase()}-feature">
        <div class="feature-header">
            <h1>${featureName}</h1>
            <p>${idea}</p>
        </div>
        
        <div class="feature-content">
            <h2>Feature Details</h2>
            <p>This ${featureName} feature is designed to provide ${idea} functionality for ${serviceTitle}.</p>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <h3>Core Functionality</h3>
                    <p>Implements the main ${featureName} features based on your ${idea} request.</p>
                </div>
                <div class="feature-item">
                    <h3>User Interface</h3>
                    <p>Clean, intuitive design that makes ${featureName} easy to use.</p>
                </div>
                <div class="feature-item">
                    <h3>Integration</h3>
                    <p>Seamlessly integrates with existing ${serviceTitle} systems.</p>
                </div>
            </div>
            
            <button class="action-button" onclick="execute${featureNameClean}()">
                🚀 Execute ${featureName}
            </button>
        </div>
    </div>
    
    <script>
        // JavaScript functionality for ${featureName}
        function execute${featureNameClean}() {
            console.log('Executing ${featureName} feature for: ${idea}');
            
            // Add your ${featureName} implementation here
            alert('${featureName} feature executed successfully!');
        }
        
        // Initialize ${featureName} feature
        document.addEventListener('DOMContentLoaded', function() {
            console.log('${featureName} feature loaded for ${serviceTitle}');
        });
    </script>
</body>
</html>`;
    } else {
      code = `// AI Generated Feature Code for ${serviceTitle}
// Feature: ${featureName}
// Based on your idea: "${idea}"

class ${featureNameClean}Feature {
  constructor() {
    this.serviceName = '${serviceTitle}';
    this.featureName = '${featureName}';
    this.userIdea = '${idea}';
  }

  async process${featureNameClean}() {
    try {
      // Implementation for ${featureName} - ${idea}
      const result = {
        service: this.serviceName,
        feature: this.featureName,
        idea: this.userIdea,
        timestamp: new Date().toISOString(),
        status: 'success',
        data: {
          message: '${featureName} feature processed successfully',
          details: 'This is a real implementation for your ${idea} request',
          featureType: '${featureName}',
          serviceCategory: '${category}'
        }
      };
      
      return result;
    } catch (error) {
      throw new Error(\`Failed to process ${featureName}: \${error.message}\`);
    }
  }

  validate${featureNameClean}Input(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input for ${featureName}');
    }
    return input.trim();
  }

  async execute${featureNameClean}Action(actionType) {
    try {
      // Execute specific action for ${featureName}
      const action = {
        type: actionType,
        feature: this.featureName,
        idea: this.userIdea,
        timestamp: new Date().toISOString()
      };
      
      // Process the action
      const result = await this.process${featureNameClean}();
      return { ...result, action };
    } catch (error) {
      throw new Error(\`${featureName} action execution failed: \${error.message}\`);
    }
  }
}

// Usage example
const ${featureNameClean}Feature = new ${featureNameClean}Feature();
${featureNameClean}Feature.process${featureNameClean}()
  .then(result => console.log('${featureName} Success:', result))
  .catch(error => console.error('${featureName} Error:', error));

export default ${featureNameClean}Feature;`;
    }

    return code;
  };

  // Helper function for offline AI feature concept building
  const generateOfflineFeatureAIBuild = (serviceTitle, featureName, idea, category) => {
    const serviceName = serviceTitle.replace(/\s+/g, '');
    const featureNameClean = featureName.replace(/\s+/g, '');
    
    // Generate real project structure for specific features
    let structure = '';
    
    if (category === 'Development' || category === 'AI/ML') {
      structure = `📁 ${featureName} Feature Project Structure
├── 📁 src/
│   ├── 📁 features/
│   │   └── 📁 ${featureNameClean.toLowerCase()}/
│   │       ├── 📄 ${featureNameClean}Component.jsx
│   │       ├── 📄 ${featureNameClean}Service.js
│   │       ├── 📄 ${featureNameClean}Utils.js
│   │       ├── 📄 ${featureNameClean}Types.ts
│   │       └── 📄 index.js
│   ├── 📁 hooks/
│   │   └── 📄 use${featureNameClean}.js
│   ├── 📁 services/
│   │   └── 📄 ${featureNameClean.toLowerCase()}Api.js
│   └── 📁 styles/
│       └── 📄 ${featureNameClean.toLowerCase()}.css
├── 📁 tests/
│   └── 📁 features/
│       └── 📁 ${featureNameClean.toLowerCase()}/
│           ├── 📄 ${featureNameClean}Component.test.js
│           ├── 📄 ${featureNameClean}Service.test.js
│           └── 📄 ${featureNameClean}Utils.test.js
├── 📁 docs/
│   └── 📄 ${featureNameClean.toLowerCase()}-feature.md
└── 📄 package.json

🔧 Feature Technologies:
• React.js with TypeScript
• Custom hooks for ${featureNameClean} logic
• Service layer for API communication
• Comprehensive testing suite
• Documentation and examples

📋 Feature Setup:
1. Create feature directory structure
2. Implement ${featureNameClean} component
3. Add ${featureNameClean} service layer
4. Create custom hooks for ${featureNameClean}
5. Add styling and animations
6. Implement testing for ${featureNameClean}
7. Add documentation

🚀 Feature Integration:
• Import ${featureNameClean} in main app
• Configure routing for ${featureNameClean}
• Add ${featureNameClean} to navigation
• Integrate with existing services
• Add error handling for ${featureNameClean}`;
    } else if (category === 'Web' || category === 'Design') {
      structure = `📁 ${featureName} Web Feature Structure
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── 📄 ${featureNameClean.toLowerCase()}-icon.svg
│   │   ├── 📄 ${featureNameClean.toLowerCase()}-hero.jpg
│   │   └── 📄 ${featureNameClean.toLowerCase()}-screenshots/
│   ├── 📁 icons/
│   │   └── 📄 ${featureNameClean.toLowerCase()}-icons.svg
│   └── 📁 fonts/
├── 📁 css/
│   ├── 📄 ${featureNameClean.toLowerCase()}.css
│   ├── 📄 ${featureNameClean.toLowerCase()}-responsive.css
│   └── 📄 ${featureNameClean.toLowerCase()}-animations.css
├── 📁 js/
│   ├── 📄 ${featureNameClean.toLowerCase()}.js
│   ├── 📄 ${featureNameClean.toLowerCase()}-utils.js
│   └── 📄 ${featureNameClean.toLowerCase()}-api.js
├── 📁 pages/
│   ├── 📄 index.html
│   ├── 📄 about.html
│   ├── 📄 ${featureNameClean.toLowerCase().replace(/\s+/g, '-')}.html
│   └── 📄 contact.html
├── 📁 components/
│   ├── 📄 header.html
│   ├── 📄 footer.html
│   ├── 📄 navigation.html
│   └── 📄 ${featureNameClean.toLowerCase().replace(/\s+/g, '-')}-widget.html
├── 📄 README.md
├── 📄 .gitignore
└── 📄 sitemap.xml

🎨 Feature Design System:
• Color scheme for ${featureNameClean}
• Typography hierarchy
• Spacing and layout rules
• Interactive states
• Animation guidelines

📱 Feature Responsiveness:
• Mobile-first design
• Touch-friendly interactions
• Adaptive layouts
• Performance optimization

🔧 Feature Functionality:
• Core ${featureNameClean} features
• User interaction handling
• Data processing
• API integration
• Error handling`;
    } else {
      structure = `📁 ${featureName} System Feature Structure
├── 📁 src/
│   ├── 📁 features/
│   │   └── 📁 ${featureNameClean.toLowerCase()}/
│   │       ├── 📄 ${featureNameClean}Engine.js
│   │       ├── 📄 ${featureNameClean}Processor.js
│   │       ├── 📄 ${featureNameClean}Controller.js
│   │       ├── 📄 ${featureNameClean}Service.js
│   │       └── 📄 ${featureNameClean}Model.js
│   ├── 📁 core/
│   │   └── 📄 ${featureNameClean.toLowerCase()}Core.js
│   ├── 📁 interfaces/
│   │   └── 📄 ${featureNameClean.toLowerCase()}Interface.js
│   └── 📄 main.js
├── 📁 config/
│   ├── 📄 default.json
│   ├── 📄 production.json
│   └── 📄 development.json
├── 📁 scripts/
│   ├── 📄 setup.sh
│   ├── 📄 deploy.sh
│   └── 📄 backup.sh
├── 📁 docs/
│   ├── 📄 README.md
│   ├── 📄 API.md
│   └── 📄 ARCHITECTURE.md
├── 📄 package.json
├── 📄 Dockerfile
├── 📄 docker-compose.yml
└── 📄 .env.example

🏗️ Feature Architecture:
• Modular design for ${featureNameClean}
• Service-oriented architecture
• Event-driven processing
• Plugin system integration
• Scalable infrastructure

🔧 Feature Configuration:
• Environment-specific settings
• Feature flags and toggles
• Performance parameters
• Security configurations
• Monitoring and logging

🚀 Feature Deployment:
• Docker containerization
• CI/CD pipeline
• Blue-green deployment
• Auto-scaling configuration`;
    }

    return structure;
  };

  // Helper function for offline AI feature creation
  const generateOfflineFeatureAICreate = (serviceTitle, featureName, idea, category) => {
    const serviceName = serviceTitle.replace(/\s+/g, '');
    const featureNameClean = featureName.replace(/\s+/g, '');
    
    // Generate real feature specifications for specific features
    let feature = '';
    
    if (category === 'Development' || category === 'AI/ML') {
      feature = `
        <div class="section">
          <h3>🚀 ${featureName} Feature Overview</h3>
          <p><strong>${featureName}</strong> is a specialized development feature that implements ${idea} within the ${serviceTitle} ecosystem.</p>
        </div>
        
        <div class="section">
          <h3>🔧 ${featureName} Technical Specifications</h3>
          <ul>
            <li><strong>Component Architecture:</strong> React functional component with hooks</li>
            <li><strong>State Management:</strong> Local state with useState and useEffect</li>
            <li><strong>API Integration:</strong> RESTful endpoints for ${featureNameClean} operations</li>
            <li><strong>Data Flow:</strong> Unidirectional data flow with props and callbacks</li>
            <li><strong>Error Handling:</strong> Comprehensive error boundaries and fallbacks</li>
            <li><strong>Performance:</strong> Memoization and optimization for ${featureNameClean}</li>
          </ul>
      </div>
        
        <div class="section">
          <h3>📱 ${featureName} User Experience</h3>
          <ul>
            <li>Intuitive ${featureNameClean} interface design</li>
            <li>Responsive layout for all device sizes</li>
            <li>Loading states and progress indicators</li>
            <li>Real-time updates and notifications</li>
            <li>Accessibility features for ${featureNameClean}</li>
            <li>Keyboard navigation support</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔒 ${featureName} Security Features</h3>
          <ul>
            <li>Input validation for ${featureNameClean} data</li>
            <li>XSS protection in ${featureNameClean} rendering</li>
            <li>CSRF token validation</li>
            <li>Rate limiting for ${featureNameClean} operations</li>
            <li>Data encryption for sensitive ${featureNameClean} information</li>
            <li>Audit logging for ${featureNameClean} actions</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📊 ${featureName} Performance Features</h3>
          <ul>
            <li>Lazy loading for ${featureNameClean} components</li>
            <li>Code splitting for ${featureNameClean} bundles</li>
            <li>Image optimization for ${featureNameClean} assets</li>
            <li>Caching strategies for ${featureNameClean} data</li>
            <li>Bundle size optimization</li>
            <li>Performance monitoring for ${featureNameClean}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🧪 ${featureName} Testing Strategy</h3>
          <ul>
            <li>Unit tests for ${featureNameClean} components</li>
            <li>Integration tests for ${featureNameClean} services</li>
            <li>End-to-end tests for ${featureNameClean} workflows</li>
            <li>Performance testing for ${featureNameClean}</li>
            <li>Accessibility testing for ${featureNameClean}</li>
            <li>Cross-browser testing for ${featureNameClean}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📈 ${featureName} Monitoring and Analytics</h3>
          <ul>
            <li>Error tracking for ${featureNameClean} operations</li>
            <li>Performance metrics for ${featureNameClean}</li>
            <li>User analytics for ${featureNameClean} usage</li>
            <li>Real-time monitoring for ${featureNameClean}</li>
            <li>Alerting system for ${featureNameClean} issues</li>
            <li>Log aggregation for ${featureNameClean}</li>
          </ul>
        </div>`;
    } else if (category === 'Web' || category === 'Design') {
      feature = `
        <div class="section">
          <h3>🎨 ${featureName} Design System</h3>
          <p><strong>${featureName}</strong> follows a comprehensive design system that ensures consistency and scalability across ${serviceTitle} interfaces.</p>
        </div>
        
        <div class="section">
          <h3>🎯 ${featureName} Design Principles</h3>
          <ul>
            <li><strong>User-Centered:</strong> Design based on ${featureNameClean} user research</li>
            <li><strong>Accessible:</strong> WCAG 2.1 AA compliance for ${featureNameClean}</li>
            <li><strong>Responsive:</strong> Mobile-first approach for ${featureNameClean}</li>
            <li><strong>Performance:</strong> Optimized for ${featureNameClean} speed</li>
            <li><strong>Scalable:</strong> Component-based ${featureNameClean} architecture</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🎨 ${featureName} Visual Elements</h3>
          <ul>
            <li><strong>Color Palette:</strong> ${featureNameClean}-specific color scheme</li>
            <li><strong>Typography:</strong> Hierarchical font system for ${featureNameClean}</li>
            <li><strong>Spacing:</strong> 8px grid system for ${featureNameClean} layouts</li>
            <li><strong>Shadows:</strong> Depth effects for ${featureNameClean} components</li>
            <li><strong>Icons:</strong> Consistent iconography for ${featureNameClean}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📱 ${featureName} Responsive Design</h3>
          <ul>
            <li>Mobile-first ${featureNameClean} design approach</li>
            <li>Flexible grid layouts for ${featureNameClean}</li>
            <li>Touch-friendly ${featureNameClean} interactions</li>
            <li>Optimized ${featureNameClean} images and assets</li>
            <li>Progressive enhancement for ${featureNameClean}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔧 ${featureName} Interactive Components</h3>
          <ul>
            <li>Hover states for ${featureNameClean} elements</li>
            <li>Loading states for ${featureNameClean} operations</li>
            <li>Form validation for ${featureNameClean} inputs</li>
            <li>Toast notifications for ${featureNameClean} actions</li>
            <li>Modal dialogs for ${featureNameClean} workflows</li>
            <li>Tooltips for ${featureNameClean} guidance</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📊 ${featureName} Data Visualization</h3>
          <ul>
            <li>Charts and graphs for ${featureNameClean} data</li>
            <li>Interactive ${featureNameClean} dashboards</li>
            <li>Real-time ${featureNameClean} data updates</li>
            <li>Customizable ${featureNameClean} widgets</li>
            <li>Export functionality for ${featureNameClean} data</li>
          </ul>
        </div>`;
    } else {
      feature = `
        <div class="section">
          <h3>⚙️ ${featureName} Feature Architecture</h3>
          <p><strong>${featureName}</strong> is built with a robust, scalable architecture that integrates seamlessly with ${serviceTitle} infrastructure.</p>
        </div>
        
        <div class="section">
          <h3>🏗️ ${featureName} System Components</h3>
          <ul>
            <li><strong>Core Engine:</strong> High-performance ${featureNameClean} processing</li>
            <li><strong>API Gateway:</strong> Unified ${featureNameClean} interface</li>
            <li><strong>Service Mesh:</strong> ${featureNameClean} inter-service communication</li>
            <li><strong>Load Balancer:</strong> ${featureNameClean} traffic distribution</li>
            <li><strong>Cache Layer:</strong> Multi-level ${featureNameClean} caching</li>
            <li><strong>Queue System:</strong> Asynchronous ${featureNameClean} processing</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔒 ${featureName} Security Framework</h3>
          <ul>
            <li>Multi-factor authentication for ${featureNameClean}</li>
            <li>Role-based access control for ${featureNameClean}</li>
            <li>API key management for ${featureNameClean}</li>
            <li>Audit logging for ${featureNameClean} operations</li>
            <li>Data encryption for ${featureNameClean} information</li>
            <li>Vulnerability scanning for ${featureNameClean}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📊 ${featureName} Data Management</h3>
          <ul>
            <li>Multi-database support for ${featureNameClean}</li>
            <li>Data backup for ${featureNameClean} information</li>
            <li>Data versioning for ${featureNameClean} changes</li>
            <li>Real-time ${featureNameClean} synchronization</li>
            <li>Data analytics for ${featureNameClean} insights</li>
            <li>Compliance for ${featureNameClean} data</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🚀 ${featureName} Performance Features</h3>
          <ul>
            <li>Horizontal scaling for ${featureNameClean}</li>
            <li>Auto-scaling for ${featureNameClean} demand</li>
            <li>Content delivery for ${featureNameClean} assets</li>
            <li>Database optimization for ${featureNameClean}</li>
            <li>Background processing for ${featureNameClean}</li>
            <li>Real-time performance monitoring</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>🔧 ${featureName} Integration Capabilities</h3>
          <ul>
            <li>RESTful API endpoints for ${featureNameClean}</li>
            <li>GraphQL support for ${featureNameClean}</li>
            <li>Webhook notifications for ${featureNameClean}</li>
            <li>Third-party integrations for ${featureNameClean}</li>
            <li>Custom plugin system for ${featureNameClean}</li>
            <li>API documentation for ${featureNameClean}</li>
          </ul>
        </div>`;
    }

    return feature;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of MJND-powered solutions designed to transform your business operations, 
            enhance productivity, and drive innovation across all industries.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
            <input
              type="text"
                  placeholder="Search software, features, or descriptions..."
                  className="w-full px-4 py-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="sm:w-48">
              <div className="relative">
            <select
              value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(services.map(service => service.category))).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
              ))}
            </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <div className="sm:w-24">
            <button
              onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowServices(false);
              }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
                Clear
            </button>
            </div>
          </div>
          </div>
          
        {/* Results Counter */}
        {showServices && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>
        )}

        {/* Services Grid - Only show when services should be visible */}
        {showServices && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Service Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {React.createElement(getIconComponent(service.icon), {
                        className: "h-8 w-8 text-blue-600"
                      })}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-500">{service.category}</p>
                </div>
              </div>
                    <div className="flex items-center space-x-2">
                <button
                        onClick={() => handleAIToolAccess(service, 'ai')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Access AI Tools"
                >
                        <Bot className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleServiceSelect(service)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Learn More"
                >
                        <Info className="h-5 w-5" />
                </button>
                    </div>
              </div>
              
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {/* Service Features */}
              <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>v{service.version}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{service.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pricing (visible on Services card) */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      {(() => {
                        // Per-category 2-tier pricing (Standard/Premium)
                        const map = {
                          Development: { standard: 50, premium: 199 },
                          Infrastructure: { standard: 45, premium: 199 },
                          Analytics: { standard: 35, premium: 199 },
                          Security: { standard: 45, premium: 199 },
                          Mobile: { standard: 30, premium: 199 },
                          Database: { standard: 35, premium: 199 },
                          Web: { standard: 30, premium: 199 },
                          DevOps: { standard: 45, premium: 199 },
                          'MJND/ML': { standard: 50, premium: 199 },
                          Integration: { standard: 35, premium: 199 },
                          Design: { standard: 25, premium: 199 },
                          Testing: { standard: 30, premium: 199 },
                          Blockchain: { standard: 50, premium: 199 },
                          IoT: { standard: 45, premium: 199 },
                          Enterprise: { standard: 195, premium: 299 },
                          Gaming: { standard: 35, premium: 199 },
                          'E-commerce': { standard: 45, premium: 199 },
                          Healthcare: { standard: 50, premium: 199 },
                          FinTech: { standard: 50, premium: 199 },
                          EdTech: { standard: 30, premium: 199 }
                        };
                        const p = map[service?.category] || { standard: 50, premium: 199 };
                        return (
                          <>
                            <span className="inline-flex items-center px-2 py-1 rounded-full border bg-gray-100 text-gray-800 border-gray-200" aria-label={`Standard $${p.standard}/mo`}>Standard ${p.standard}/mo</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200" aria-label={`Premium $${p.premium}/mo`}>Premium ${p.premium}/mo</span>
                          </>
                        );
                      })()}
                </div>
              </div>
              
                  {/* Start Create Button */}
                  <div className="mb-4">
                <button
                      onClick={() => {
                        setSelectedService(service);
                        setShowAITool(true);
                      }}
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Start Create
                </button>
              </div>
            </div>

                {/* Key Features Section */}
                <div className="p-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      Key Features
                      <span className="text-xs text-gray-500 ml-2">(Click to expand)</span>
        </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {service.features.length} features
                    </span>
                  </h4>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, index) => {
                      const featureKey = `${service.id}-${index}`;
                      const isExpanded = expandedFeatures[featureKey];
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeatureClick(service.id, index, feature, service);
                            }}
                            className="w-full flex items-center justify-between p-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                            aria-expanded={isExpanded}
                            aria-label={`${feature} feature details`}
                          >
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              <span className="text-sm font-medium">{feature}</span>
                              <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                                🤖
                              </span>
              </div>
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                </div>
                </button>
                          
                          {isExpanded && (
                            <div className="px-3 pb-3 bg-gray-50 border-t border-gray-200">
                              <div className="text-xs text-gray-600 leading-relaxed">
                                {/* AI Insights Display */}
                                {expandedFeatures[`${service.id}-${index}_ai_code`] && (
                                  <div className="mb-3">
                                    <h6 className="text-xs font-medium text-indigo-700 mb-1">💻 Generated Code:</h6>
                                    <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-auto max-h-32">
                                      {expandedFeatures[`${service.id}-${index}_ai_code`]}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(expandedFeatures[`${service.id}-${index}_ai_code`]);
                                          alert('Code copied to clipboard!');
                                        }}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                      >
                                        📋 Copy Code
                </button>
                <button
                                        onClick={() => openDevelopmentEnvironment(service)}
                                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                >
                                        🚀 Open in Dev Environment
                      </button>
                    </div>
                  </div>
                                )}
                                
                                {/* AI Build Output */}
                                {expandedFeatures[`${service.id}-${index}_ai_build`] && (
                                  <div className="mb-3">
                                    <h6 className="text-xs font-medium text-indigo-700 mb-1">🏗️ Built Concept:</h6>
                                    <div className="bg-gray-100 text-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
                                      {expandedFeatures[`${service.id}-${index}_ai_build`]}
                                    </div>
                      <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(expandedFeatures[`${service.id}-${index}_ai_build`]);
                                        alert('Concept copied to clipboard!');
                                      }}
                                      className="mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                                    >
                                      📋 Copy Concept
                      </button>
                    </div>
                                )}
                                
                                {/* AI Create Output */}
                                {expandedFeatures[`${service.id}-${index}_ai_create`] && (
                                  <div className="mb-3">
                                    <h6 className="text-xs font-medium text-indigo-700 mb-1">✨ Created Feature:</h6>
                                    <div className="bg-gray-100 text-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
                                      {expandedFeatures[`${service.id}-${index}_ai_create`]}
                      </div>
                      <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(expandedFeatures[`${service.id}-${index}_ai_create`]);
                                        alert('Feature details copied to clipboard!');
                                      }}
                                      className="mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors"
                                    >
                                      📋 Copy Feature Details
                      </button>
                    </div>
                  )}
                  
                                {/* AI Tool Buttons */}
                                <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={async () => {
                                      const idea = expandedFeatures[`${service.id}-${index}_idea`];
                                      if (!idea) {
                                        alert('Please type your idea first!');
                                        return;
                                      }
                                      
                                      try {
                                        // Show loading state
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_code`]: '🔄 Generating AI code... Please wait...'
                                        }));
                                        
                                        // Try API first, then fallback to offline generation
                        try {
                          const result = await apiService.demoAiChat(
                                            `Generate code for this feature: ${feature} - Idea: ${idea} - Service: ${service.title}`,
                                            service.title,
                                            {
                                              software_id: service.id,
                                              analysis_type: 'feature_code_generation',
                                              ai_model: 'gpt-4',
                                              feature: feature,
                                              user_idea: idea
                                            }
                                          );
                                          
                                          if (result && result.content) {
                                            setExpandedFeatures(prev => ({
                                              ...prev,
                                              [`${service.id}-${index}_ai_code`]: result.content
                                            }));
                                            return;
                                          }
                                        } catch (apiError) {
                                          console.log('API unavailable, using offline AI generation...');
                                        }
                                        
                                        // Offline AI Code Generation for Feature
                                        const offlineFeatureCode = generateOfflineFeatureAICode(service.title, feature, idea, service.category);
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_code`]: offlineFeatureCode
                                        }));
                                        
                        } catch (error) {
                                        console.error('AI code generation failed:', error);
                                        // Provide helpful fallback content
                                        const fallbackCode = generateOfflineFeatureAICode(service.title, feature, idea, service.category);
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_code`]: fallbackCode
                                        }));
                                      }
                                    }}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors font-medium"
                                    title="Generate AI code for your feature idea"
                                  >
                                    🎯 AI Code
                    </button>
                    
                    <button
                      onClick={async () => {
                                      const idea = expandedFeatures[`${service.id}-${index}_idea`];
                                      if (!idea) {
                                        alert('Please type your idea first!');
                                        return;
                                      }
                                      
                                      try {
                                        // Show loading state
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_build`]: '🔄 Building AI concept... Please wait...'
                                        }));
                                        
                                        // Try API first, then fallback to offline generation
                        try {
                          const result = await apiService.demoAiChat(
                                            `Create and build this concept: ${idea} - Feature: ${feature} - Service: ${service.title}`,
                                            service.title,
                                            {
                                              software_id: service.id,
                                              analysis_type: 'feature_concept_building',
                                              ai_model: 'gpt-4',
                                              feature: feature,
                                              user_idea: idea
                                            }
                                          );
                                          
                                          if (result && result.content) {
                                            setExpandedFeatures(prev => ({
                                              ...prev,
                                              [`${service.id}-${index}_ai_build`]: result.content
                                            }));
                                            return;
                                          }
                                        } catch (apiError) {
                                          console.log('API unavailable, using offline AI generation...');
                                        }
                                        
                                        // Offline AI Concept Building for Feature
                                        const offlineFeatureBuild = generateOfflineFeatureAIBuild(service.title, feature, idea, service.category);
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_build`]: offlineFeatureBuild
                                        }));
                                        
                        } catch (error) {
                                        console.error('AI concept building failed:', error);
                                        // Provide helpful fallback content
                                        const fallbackBuild = generateOfflineFeatureAIBuild(service.title, feature, idea, service.category);
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_build`]: fallbackBuild
                                        }));
                                      }
                                    }}
                                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors font-medium"
                                    title="Build AI concept for your feature idea"
                                  >
                                    🏗️ AI Build
                    </button>
                    
                    <button
                      onClick={async () => {
                                      const idea = expandedFeatures[`${service.id}-${index}_idea`];
                                      if (!idea) {
                                        alert('Please type your idea first!');
                                        return;
                                      }
                                      
                                      try {
                                        // Show loading state
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_create`]: '🔄 Creating AI feature... Please wait...'
                                        }));
                                        
                                        // Try API first, then fallback to offline generation
                        try {
                          const result = await apiService.demoAiChat(
                                            `Create a new feature concept: ${idea} - Feature: ${feature} - Service: ${service.title}`,
                                            service.title,
                                            {
                                              software_id: service.id,
                                              analysis_type: 'feature_creation',
                                              ai_model: 'gpt-4',
                                              feature: feature,
                                              user_idea: idea
                                            }
                                          );
                                          
                                          if (result && result.content) {
                                            setExpandedFeatures(prev => ({
                                              ...prev,
                                              [`${service.id}-${index}_ai_create`]: result.content
                                            }));
                                            return;
                                          }
                                        } catch (apiError) {
                                          console.log('API unavailable, using offline AI generation...');
                                        }
                                        
                                        // Offline AI Feature Creation for Feature
                                        const offlineFeatureCreate = generateOfflineFeatureAICreate(service.title, feature, idea, service.category);
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_create`]: offlineFeatureCreate
                                        }));
                                        
                        } catch (error) {
                                        console.error('AI feature creation failed:', error);
                                        // Provide helpful fallback content
                                        const fallbackCreate = generateOfflineFeatureAICreate(service.title, feature, idea, service.category);
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${service.id}-${index}_ai_create`]: fallbackCreate
                                        }));
                                      }
                                    }}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors font-medium"
                                    title="Create AI feature for your feature idea"
                                  >
                                    ✨ AI Create
                    </button>
                  </div>
                </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Result Modal - Inline Display */}
        {showAiResult && aiToolResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {aiToolType === 'coding' && '🤖'}
                    {aiToolType === 'building' && '🏗️'}
                    {aiToolType === 'creation' && '✨'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {aiToolType === 'coding' && 'AI Generated Code'}
                      {aiToolType === 'building' && 'AI Project Structure'}
                      {aiToolType === 'creation' && 'AI Feature Creation'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {aiToolResult.title} - {aiToolResult.idea}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeAiResult}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {aiToolType === 'coding' && (
                  <div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-96">
                      <pre className="text-sm font-mono whitespace-pre-wrap">{aiToolResult.content}</pre>
                    </div>
                    {aiToolResult?.files && (
                      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="px-4 py-2 border-b text-sm text-gray-700 flex items-center justify-between">
                          <span>Generated files</span>
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            onChange={(e) => {
                              const p = e.target.value;
                              setFilePreview({ path: p, content: aiToolResult.files[p] || '' });
                            }}
                          >
                            <option value="">Preview a file...</option>
                            {Object.keys(aiToolResult.files).sort().map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                        {filePreview?.path && (
                          <div className="p-4 bg-white">
                            <div className="text-xs text-gray-500 mb-2">{filePreview.path}</div>
                            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded whitespace-pre-wrap overflow-x-auto max-h-64">{filePreview.content}</pre>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {aiToolResult?.files && (
                        <button
                          onClick={async () => {
                            try {
                              await downloadAsZip(`${aiToolResult.title}`.replace(/\s+/g,'-').toLowerCase(), aiToolResult.files);
                            } catch (e) {
                              alert('Failed to create ZIP: ' + (e?.message || e));
                            }
                          }}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          📦 Download ZIP (Generated)
                        </button>
                      )}
                      <button
                        onClick={copyGeneratedResult}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📋 Copy Complete Package
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const appName = `${aiToolResult.title} App`;
                            const files = generateReactAppFiles(appName, aiToolResult.idea);
                            await downloadAsZip(appName.replace(/\s+/g,'-').toLowerCase(), files);
                          } catch (e) {
                            alert('Failed to create ZIP: ' + (e?.message || e));
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        📦 Download ZIP (React App)
                      </button>
                    <button
                      onClick={() => {
                          const newTab = window.open('', '_blank');
                          if (newTab) {
                            newTab.document.write(`
                              <!DOCTYPE html>
                              <html>
                              <head>
                                <title>Complete Package - ${aiToolResult.title}</title>
                                <style>
                                  body { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
                                  pre { background: #252526; padding: 20px; border-radius: 5px; overflow-x: auto; }
                                  .header { background: #2d2d30; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                                  .title { color: #569cd6; font-size: 24px; margin-bottom: 10px; }
                                  .subtitle { color: #9cdcfe; font-size: 16px; }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="title">🚀 Complete Package: ${aiToolResult.title}</div>
                                  <div class="subtitle">Service: ${aiToolResult.title} | Idea: ${aiToolResult.idea}</div>
                                </div>
                                <pre><code>${aiToolResult.content}</code></pre>
                              </body>
                              </html>
                            `);
                            newTab.document.close();
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        🚀 Open in New Tab
                    </button>
                    <button
                      onClick={() => {
                          // Create a downloadable file
                          const blob = new Blob([aiToolResult.content], { type: 'text/plain' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${aiToolResult.title.toLowerCase().replace(/\s+/g, '-')}-complete-package.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        💾 Download Package
                    </button>
                  </div>
                    
                    {/* Quick Start Instructions */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-blue-900 mb-3">🚀 Quick Start Instructions</h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>1.</strong> Copy the complete package above</p>
                        <p><strong>2.</strong> Create a new project folder</p>
                        <p><strong>3.</strong> Paste the content into appropriate files</p>
                        <p><strong>4.</strong> Run <code className="bg-blue-100 px-1 rounded">npm install</code></p>
                        <p><strong>5.</strong> Run <code className="bg-blue-100 px-1 rounded">npm start</code></p>
                        <p><strong>6.</strong> Deploy with <code className="bg-blue-100 px-1 rounded">./deploy.sh</code></p>
                </div>
                    </div>
                  </div>
                )}

                {aiToolType === 'building' && (
                  <div>
                    <div className="bg-gray-100 text-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm font-mono whitespace-pre-wrap">{aiToolResult.content}</pre>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                  <button
                        onClick={() => copyToClipboard(aiToolResult.content)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                        📋 Copy Project Structure
                  </button>
                      <button
                        onClick={() => {
                          const newTab = window.open('', '_blank');
                          if (newTab) {
                            newTab.document.write(`
                              <!DOCTYPE html>
                              <html>
                              <head>
                                <title>Project Structure - ${aiToolResult.title}</title>
                                <style>
                                  body { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; background: #f8f9fa; color: #333; padding: 20px; }
                                  pre { background: white; padding: 20px; border-radius: 5px; overflow-x: auto; border: 1px solid #e9ecef; }
                                  .header { background: #e9ecef; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                                  .title { color: #495057; font-size: 24px; margin-bottom: 10px; }
                                  .subtitle { color: #6c757d; font-size: 16px; }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="title">🏗️ Project Structure: ${aiToolResult.title}</div>
                                  <div class="subtitle">Service: ${aiToolResult.title} | Idea: ${aiToolResult.idea}</div>
                </div>
                                <pre>${aiToolResult.content}</pre>
                              </body>
                              </html>
                            `);
                            newTab.document.close();
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🚀 Open in New Tab
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([aiToolResult.content], { type: 'text/plain' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${aiToolResult.title.toLowerCase().replace(/\s+/g, '-')}-project-structure.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        💾 Download Structure
                      </button>
                    </div>
                    
                    {/* Project Setup Instructions */}
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-green-900 mb-3">🏗️ Project Setup Instructions</h4>
                      <div className="space-y-2 text-sm text-green-800">
                        <p><strong>1.</strong> Copy the project structure above</p>
                        <p><strong>2.</strong> Create the folder structure in your project</p>
                        <p><strong>3.</strong> Set up the required dependencies</p>
                        <p><strong>4.</strong> Initialize your project with the structure</p>
                        <p><strong>5.</strong> Follow the deployment instructions</p>
                        <p><strong>6.</strong> Test your project structure</p>
              </div>
            </div>
          </div>
        )}

                {aiToolType === 'creation' && (
                  <div>
                    <div className="bg-purple-50 text-purple-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ __html: aiToolResult.content.replace(/\n/g, '<br>').replace(/```/g, '<code class="bg-purple-100 px-1 rounded">').replace(/```/g, '</code>') }} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
          <button
                        onClick={() => copyToClipboard(aiToolResult.content.replace(/<[^>]*>/g, ''))}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
                        📋 Copy Feature Specs
          </button>
                      <button
                        onClick={() => {
                          const newTab = window.open('', '_blank');
                          if (newTab) {
                            newTab.document.write(`
                              <!DOCTYPE html>
                              <html>
                              <head>
                                <title>Feature Creation - ${aiToolResult.title}</title>
                                <style>
                                  body { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; background: #f3e8ff; color: #581c87; padding: 20px; }
                                  .content { background: white; padding: 20px; border-radius: 5px; overflow-x: auto; border: 1px solid #ddd6fe; }
                                  .header { background: #ddd6fe; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                                  .title { color: #581c87; font-size: 24px; margin-bottom: 10px; }
                                  .subtitle { color: #7c3aed; font-size: 16px; }
                                  code { background: #f3e8ff; padding: 2px 4px; border-radius: 3px; }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="title">✨ Feature Creation: ${aiToolResult.title}</div>
                                  <div class="subtitle">Service: ${aiToolResult.title} | Idea: ${aiToolResult.idea}</div>
        </div>
                                <div class="content">${aiToolResult.content.replace(/\n/g, '<br>').replace(/```/g, '<code>').replace(/```/g, '</code>')}</div>
                              </body>
                              </html>
                            `);
                            newTab.document.close();
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🚀 Open in New Tab
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([aiToolResult.content.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${aiToolResult.title.toLowerCase().replace(/\s+/g, '-')}-feature-specs.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        💾 Download Specs
                      </button>
      </div>

                    {/* Feature Implementation Instructions */}
                    <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-purple-900 mb-3">✨ Feature Implementation Instructions</h4>
                      <div className="space-y-2 text-sm text-purple-800">
                        <p><strong>1.</strong> Review the feature specifications above</p>
                        <p><strong>2.</strong> Plan your implementation approach</p>
                        <p><strong>3.</strong> Set up the required infrastructure</p>
                        <p><strong>4.</strong> Implement the feature step by step</p>
                        <p><strong>5.</strong> Test the feature thoroughly</p>
                        <p><strong>6.</strong> Deploy and monitor the feature</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Deployment Guide Section */}
              <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Complete Deployment Guide</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Quick Deploy */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">⚡ Quick Deploy (5 minutes)</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>1.</strong> Copy your generated package</p>
                        <p><strong>2.</strong> Create project folder</p>
                        <p><strong>3.</strong> Paste content into files</p>
                        <p><strong>4.</strong> Run <code className="bg-blue-100 px-1 rounded">npm install</code></p>
                        <p><strong>5.</strong> Run <code className="bg-blue-100 px-1 rounded">./deploy.sh</code></p>
                      </div>
                    </div>

                    {/* Platform Options */}
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3">🌐 Platform Options</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Netlify:</strong> Free, custom domains</p>
                        <p><strong>Vercel:</strong> Fast, React optimized</p>
                        <p><strong>Railway:</strong> Full-stack apps</p>
                        <p><strong>Heroku:</strong> Backend services</p>
                        <p><strong>Custom Domain:</strong> Your own URL</p>
                      </div>
                    </div>

                    {/* Live URLs */}
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-3">🔗 Live URLs</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Development:</strong> localhost:3000</p>
                        <p><strong>Staging:</strong> your-app.netlify.app</p>
                        <p><strong>Production:</strong> yourdomain.com</p>
                        <p><strong>Mobile:</strong> PWA ready</p>
                        <p><strong>API:</strong> Backend endpoints</p>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Deployment */}
                  <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">🔧 Advanced Deployment Steps</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">Frontend Deployment</h5>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Build your React app: <code className="bg-gray-100 px-1 rounded">npm run build</code></li>
                          <li>Deploy to Netlify: <code className="bg-gray-100 px-1 rounded">netlify deploy --prod --dir=build</code></li>
                          <li>Set custom domain in Netlify dashboard</li>
                          <li>Configure environment variables</li>
                        </ol>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-900 mb-2">Backend Deployment</h5>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Deploy to Railway: <code className="bg-gray-100 px-1 rounded">railway up</code></li>
                          <li>Set environment variables in Railway</li>
                          <li>Configure custom domain</li>
                          <li>Set up monitoring and logging</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Success Checklist */}
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">✅ Deployment Success Checklist</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                      <div>
                        <p><strong>✅</strong> Project builds successfully</p>
                        <p><strong>✅</strong> Deployed to hosting platform</p>
                        <p><strong>✅</strong> Custom domain configured</p>
                        <p><strong>✅</strong> SSL certificate active</p>
                      </div>
                      <div>
                        <p><strong>✅</strong> Mobile responsive</p>
                        <p><strong>✅</strong> PWA features working</p>
                        <p><strong>✅</strong> API endpoints accessible</p>
                        <p><strong>✅</strong> Performance optimized</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeAiResult}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Tool Modal */}
        {showAITool && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-2xl text-blue-600 font-bold">
                    &lt; &gt;
                  </div>
                  <div>
                <h2 className="text-xl font-bold text-gray-900">
                      {selectedService.title} - MJND Tools
                </h2>
                    <p className="text-sm text-gray-600">
                      Choose your MJND-powered development tool
                    </p>
                  </div>
              </div>
              <button
                  onClick={() => setShowAITool(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* AI Coding Tool */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                     onClick={() => {
                       console.log('AI Coding clicked for service:', selectedService);
                       openInputModal(
                         `What would you like to build with ${selectedService.title}?`,
                         'Enter your idea here...',
                         ['User authentication system', 'Payment processing', 'Real-time chat', 'Dashboard analytics', 'API integration'],
                         (idea) => {
                           if (idea && idea.trim()) {
                              try {
                                console.log('Generating AI code...');
                                const code = generateRealAICode(selectedService.title, idea, selectedService.category);
                                const appName = `${selectedService.title} App`;
                                const files = generateReactAppFiles(appName, idea);
                                const preview = buildFilesPreview(appName.replace(/\s+/g,'-').toLowerCase(), files);
                                const combined = `${code}\n\n--- DOWNLOADABLE PACKAGE (React) ---\n\n${preview}`;
                                console.log('Generated code length:', combined.length);
                                console.log('Calling displayAiResult...');
                                displayAiResult('coding', combined, selectedService.title, idea, files);
                               console.log('Setting showAITool to false...');
                               setShowAITool(false);
                               console.log('AI Coding completed successfully');
                             } catch (error) {
                               console.error('Error in AI Coding:', error);
                               alert(`Error generating code: ${error.message}`);
                             }
                           }
                         }
                       );
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">AI Coding</h3>
                      <p className="text-sm text-gray-600">Generate real, working code for your ideas</p>
                    </div>
                  </div>
                </div>

                {/* AI Building Tool */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer"
                     onClick={() => {
                       console.log('AI Building clicked for service:', selectedService);
                       openInputModal(
                         `What project structure would you like to create with ${selectedService.title}?`,
                         'Enter your project structure idea...',
                         ['Full-stack application', 'Microservices architecture', 'Database schema', 'API structure', 'Component library'],
                         (idea) => {
                           if (idea && idea.trim()) {
                              try {
                                console.log('Generating project structure...');
                                const structure = generateRealProjectStructure(selectedService.title, idea, selectedService.category);
                                const appName = `${selectedService.title} Project`;
                                const files = generateReactAppFiles(appName, idea);
                                const preview = buildFilesPreview(appName.replace(/\s+/g,'-').toLowerCase(), files);
                                const combined = `${structure}\n\n--- DOWNLOADABLE STARTER ---\n\n${preview}`;
                                console.log('Generated structure length:', combined.length);
                                console.log('Calling displayAiResult...');
                                displayAiResult('building', combined, selectedService.title, idea, files);
                               console.log('Setting showAITool to false...');
                               setShowAITool(false);
                               console.log('AI Building completed successfully');
                             } catch (error) {
                               console.error('Error in AI Building:', error);
                               alert(`Error generating structure: ${error.message}`);
                             }
                           }
                         }
                       );
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏗️</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">AI Building</h3>
                      <p className="text-sm text-gray-600">Create complete project structures and architectures</p>
                  </div>
                </div>
              </div>

                {/* AI Creation Tool */}
                <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                     onClick={() => {
                       console.log('AI Creation clicked for service:', selectedService);
                       openInputModal(
                         `What new feature or concept would you like to create with ${selectedService.title}?`,
                         'Enter your feature idea...',
                         ['User authentication system', 'Payment processing', 'Real-time notifications', 'Data visualization', 'AI recommendation engine'],
                         (idea) => {
                           if (idea && idea.trim()) {
                              try {
                                console.log('Generating feature...');
                                const feature = generateRealFeature(selectedService.title, idea, selectedService.category);
                                const files = generateFeatureModuleFiles(idea, `Feature module for ${idea} in ${selectedService.title}`);
                                const preview = buildFilesPreview('feature-module', files);
                                const combined = `${feature}\n\n--- DOWNLOADABLE FEATURE MODULE ---\n\n${preview}`;
                                console.log('Generated feature length:', combined.length);
                                console.log('Calling displayAiResult...');
                                displayAiResult('creation', combined, selectedService.title, idea, files);
                               console.log('Setting showAITool to false...');
                               setShowAITool(false);
                               console.log('AI Creation completed successfully');
                             } catch (error) {
                               console.error('Error in AI Creation:', error);
                               alert(`Error generating feature: ${error.message}`);
                             }
                           }
                         }
                       );
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✨</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">AI Creation</h3>
                      <p className="text-sm text-gray-600">Generate innovative features and concepts</p>
                    </div>
                  </div>
                </div>
              </div>

                {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                  onClick={() => setShowAITool(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                  Close
                    </button>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const map = {
                        Development: { standard: 50, premium: 199 },
                        Infrastructure: { standard: 45, premium: 199 },
                        Analytics: { standard: 35, premium: 199 },
                        Security: { standard: 45, premium: 199 },
                        Mobile: { standard: 30, premium: 199 },
                        Database: { standard: 35, premium: 199 },
                        Web: { standard: 30, premium: 199 },
                        DevOps: { standard: 45, premium: 199 },
                        'MJND/ML': { standard: 50, premium: 199 },
                        Integration: { standard: 35, premium: 199 },
                        Design: { standard: 25, premium: 199 },
                        Testing: { standard: 30, premium: 199 },
                        Blockchain: { standard: 50, premium: 199 },
                        IoT: { standard: 45, premium: 199 },
                        Enterprise: { standard: 195, premium: 299 },
                        Gaming: { standard: 35, premium: 199 },
                        'E-commerce': { standard: 45, premium: 199 },
                        Healthcare: { standard: 50, premium: 199 },
                        FinTech: { standard: 50, premium: 199 },
                        EdTech: { standard: 30, premium: 199 }
                      };
                      const cat = selectedService?.category || 'Service Category';
                      const p = map[cat] || { standard: 50, premium: 199 };
                      return (
                        <>
                    <button
                            onClick={() => { setShowAITool(false); window.location.href = `/billing?type=service&custom=${p.standard*100}&name=${encodeURIComponent(cat)}`; }}
                            className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm"
                    >
                            Choose Standard ${p.standard}/mo
                    </button>
                    <button
                            onClick={() => { setShowAITool(false); window.location.href = `/billing?type=service&custom=${p.premium*100}&name=${encodeURIComponent(cat)}`; }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                            Choose Premium ${p.premium}/mo
                    </button>
                        </>
                      );
                    })()}
                  </div>
                    <button
                  onClick={() => {
                    setShowAITool(false);
                    openDevelopmentEnvironment(selectedService);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Development Environment
                    </button>
                </div>
                </div>
          </div>
        )}

        {/* Custom Input Modal */}
        {showInputModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {inputModalConfig.title}
                  </h2>
                  </div>
                    <button
                  onClick={closeInputModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                    </button>
                </div>

      {/* Billing Dialog */}
      {billingDialog.open && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeBilling} aria-hidden="true"></div>
          <div role="dialog" aria-modal="true" className="relative bg-white w-full sm:w-[34rem] max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base sm:text-lg">Subscribe to {billingDialog.service?.title || 'Service'}</h3>
                <button onClick={closeBilling} className="px-2 py-1 rounded hover:bg-white/20" aria-label="Close">✕</button>
              </div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">Choose Plan</label>
                  <div className="grid grid-cols-2 gap-2">
                  <button onClick={()=>setBillingDialog(prev=>({ ...prev, plan: 'standard' }))} className={`border rounded p-3 text-left ${billingDialog.plan==='standard'?'border-blue-600 ring-2 ring-blue-200':''}`}>
                    <div className="font-semibold">Standard</div>
                    <div className="text-gray-600">$199/mo • Core features</div>
                    </button>
                  <button onClick={()=>setBillingDialog(prev=>({ ...prev, plan: 'premium' }))} className={`border rounded p-3 text-left ${billingDialog.plan==='premium'?'border-blue-600 ring-2 ring-blue-200':''}`}>
                    <div className="font-semibold">Premium</div>
                    <div className="text-gray-600">$399/mo • Advanced tools</div>
                    </button>
                  </div>
                </div>
              <div className="text-xs text-gray-500">Secure recurring billing • Receipts • Cancel anytime</div>
              {billingDialog.error && <div className="text-red-600 text-sm">{billingDialog.error}</div>}
              </div>
            <div className="p-3 border-t bg-gray-50 flex items-center justify-end gap-2">
              <button onClick={closeBilling} className="px-3 py-2 bg-white border rounded text-sm">Close</button>
              <button disabled={billingDialog.busy} onClick={startCheckoutNow} className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-60">{billingDialog.busy?'Processing…':'Proceed to Checkout'}</button>
            </div>
          </div>
        </div>
      )}
              {/* Modal Content */}
              <div className="p-6">
                {/* Examples */}
                {inputModalConfig.examples.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Examples:</p>
                    <div className="space-y-1">
                      {inputModalConfig.examples.map((example, index) => (
                        <div key={index} className="text-sm text-gray-500">
                          • {example}
                  </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Field */}
                <div className="mb-4">
                  <input
                    type="text"
                    id="ideaInput"
                    placeholder={inputModalConfig.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value && inputModalConfig.onSubmit) {
                          inputModalConfig.onSubmit(value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeInputModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                    </button>
                  <button
                    onClick={() => {
                      const input = document.getElementById('ideaInput');
                      const value = input.value.trim();
                      if (value && inputModalConfig.onSubmit) {
                        inputModalConfig.onSubmit(value);
                        // Keep modal open to allow continued chatting
                        // Do not close here
                        input.value = '';
                        input.focus();
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Chat
                    </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Services;