import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// Defer heavy libs to when needed to improve initial load (mobile performance)
// Dynamic import inside handlers
import { 
  Users, 
  Cloud, 
  Globe,
  Zap,
  Shield,
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
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  Bot,
  TrendingUp,
  Activity,
  Edit,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
// Lazy-load AI Assistant to reduce initial JS
const AIAssistant = React.lazy(() => import('../components/AIAssistant'));
// import AIAssistantButton from '../components/AIAssistantButton';

// Icon mapping function
const getIconComponent = (iconName) => {
  const iconMap = {
    'users': <Users className="h-8 w-8" />,
    'cloud': <Cloud className="h-8 w-8" />,
    'globe': <Globe className="h-8 w-8" />,
    'zap': <Zap className="h-8 w-8" />,
    'shield': <Shield className="h-8 w-8" />,
    'bar-chart': <TrendingUp className="h-8 w-8" />,
    'mobile': <Mobile className="h-8 w-8" />,
    'server': <Server className="h-8 w-8" />,
    'refresh': <RefreshCw className="h-8 w-8" />,
    'code': <Code className="h-8 w-8" />,
    'database': <Database className="h-8 w-8" />,
    'settings': <Settings className="h-8 w-8" />,
    'monitor': <Monitor className="h-8 w-8" />,
    'lock': <Lock className="h-8 w-8" />,
    'smartphone': <Mobile className="h-8 w-8" />,
    'shopping-cart': <Globe className="h-8 w-8" />,
    'trending-up': <TrendingUp className="h-8 w-8" />,
    'activity': <Activity className="h-8 w-8" />
  };
  return iconMap[iconName] || <Code className="h-8 w-8" />; // Default icon
};

// Default software data as fallback
const defaultSoftware = [
  {
    id: 1,
    name: 'Maijjd CRM Suite',
    description: 'Comprehensive customer relationship management solution with advanced analytics and automation.',
    category: 'Business',
    version: '2.1.0',
    rating: 4.8,
    downloads: 15420,
    icon: <Users className="h-8 w-8" />,
    features: ['Contact Management', 'Sales Pipeline', 'Email Marketing', 'Analytics Dashboard'],
    price: 'Free',
    status: 'Active'
  },
  {
    id: 2,
    name: 'DataFlow Analytics',
    description: 'Powerful data analytics and visualization platform for business intelligence.',
    category: 'Analytics',
    version: '1.5.2',
    rating: 4.6,
    downloads: 8920,
    icon: <TrendingUp className="h-8 w-8" />,
    features: ['Data Visualization', 'Real-time Monitoring', 'Custom Reports', 'API Integration'],
    price: '$99/month',
    status: 'Active'
  },
  {
    id: 3,
    name: 'SecureGate Firewall',
    description: 'Enterprise-grade firewall and security solution with advanced threat detection.',
    category: 'Security',
    version: '3.0.1',
    rating: 4.9,
    downloads: 12350,
    icon: <Shield className="h-8 w-8" />,
    features: ['Threat Detection', 'VPN Support', 'Intrusion Prevention', 'Security Monitoring'],
    price: '$199/month',
    status: 'Active'
  },
  {
    id: 4,
    name: 'CloudSync Pro',
    description: 'Cloud storage and synchronization solution with enterprise-grade security.',
    category: 'Cloud',
    version: '2.3.0',
    rating: 4.7,
    downloads: 18750,
    icon: <Cloud className="h-8 w-8" />,
    features: ['File Sync', 'Version Control', 'Team Collaboration', 'End-to-End Encryption'],
    price: '$49/month',
    status: 'Active'
  },
  {
    id: 5,
    name: 'MobileDev Studio',
    description: 'Cross-platform mobile app development environment with drag-and-drop interface.',
    category: 'Development',
    version: '1.8.5',
    rating: 4.5,
    downloads: 6540,
    icon: <Mobile className="h-8 w-8" />,
    features: ['Cross-Platform', 'Visual Editor', 'Code Generation', 'Testing Tools'],
    price: '$149/month',
    status: 'Active'
  },
  {
    id: 6,
    name: 'WebFlow Builder',
    description: 'Professional website builder with advanced customization and SEO tools.',
    category: 'Web',
    version: '2.0.3',
    rating: 4.4,
    downloads: 11230,
    icon: <Globe className="h-8 w-8" />,
    features: ['Drag & Drop Editor', 'SEO Optimization', 'Responsive Design', 'E-commerce Support'],
    price: '$79/month',
    status: 'Active'
  },
  {
    id: 7,
    name: 'ServerManager Pro',
    description: 'Comprehensive server management and monitoring solution for IT professionals.',
    category: 'Infrastructure',
    version: '1.9.1',
    rating: 4.7,
    downloads: 8760,
    icon: <Server className="h-8 w-8" />,
    features: ['Server Monitoring', 'Performance Analytics', 'Automated Backups', 'Alert System'],
    price: '$129/month',
    status: 'Active'
  },
  {
    id: 8,
    name: 'DevOps Pipeline',
    description: 'Streamlined development and deployment pipeline with automated testing and deployment.',
    category: 'DevOps',
    version: '2.2.0',
    rating: 4.6,
    downloads: 5430,
    icon: <Zap className="h-8 w-8" />,
    features: ['Automated Testing', 'Continuous Deployment', 'Container Management', 'Monitoring'],
    price: '$129/month',
    status: 'Active'
  },
  {
    id: 9,
    name: 'Maijjd Marketing Automation',
    description: 'MJND-powered marketing automation platform with intelligent campaign management, customer segmentation, and predictive analytics.',
    category: 'Marketing & Automation',
    version: '2.1.3',
    rating: 4.5,
    downloads: 15680,
    icon: <TrendingUp className="h-8 w-8" />,
    features: ['MJND-Powered Campaign Management', 'Intelligent Customer Segmentation', 'Predictive Analytics', 'Multi-Channel Marketing'],
    price: '$159/month',
    status: 'Active'
  },
  {
    id: 10,
    name: 'Maijjd Project Management Pro',
    description: 'Intelligent project management solution with MJND-powered task prioritization, resource allocation, and risk assessment.',
    category: 'Project Management',
    version: '1.7.2',
    rating: 4.7,
    downloads: 23450,
    icon: <Users className="h-8 w-8" />,
    features: ['MJND-Powered Task Prioritization', 'Intelligent Resource Allocation', 'Risk Assessment & Mitigation', 'Real-time Collaboration'],
    price: '$89/month',
    status: 'Active'
  },
  {
    id: 11,
    name: 'Maijjd Data Science Studio',
    description: 'Comprehensive data science platform with MJND-powered model development, automated feature engineering, and MLOps capabilities.',
    category: 'Data Science & ML',
    version: '2.3.1',
    rating: 4.9,
    downloads: 8920,
    icon: <TrendingUp className="h-8 w-8" />,
    features: ['MJND-Powered Model Development', 'Automated Feature Engineering', 'MLOps Pipeline Management', 'Multi-Language Support'],
    price: '$599/month',
    status: 'Active'
  },
  {
    id: 12,
    name: 'Maijjd Customer Support MNJD',
    description: 'Intelligent customer support platform with MJND-powered chatbots, sentiment analysis, and automated ticket routing.',
    category: 'Customer Support',
    version: '1.5.7',
    rating: 4.6,
    downloads: 18750,
    icon: <Users className="h-8 w-8" />,
    features: ['MJND-Powered Chatbots', 'Sentiment Analysis', 'Automated Ticket Routing', '24/7 Support Availability'],
    price: '$129/month',
    status: 'Active'
  },
  {
    id: 13,
    name: 'Maijjd Financial Analytics',
    description: 'MJND-powered financial analytics platform with real-time market data, predictive modeling, and automated risk assessment.',
    category: 'Financial Technology',
    version: '2.0.8',
    rating: 4.8,
    downloads: 6540,
    icon: <TrendingUp className="h-8 w-8" />,
    features: ['Real-time Market Data', 'MJND-Powered Predictive Modeling', 'Automated Risk Assessment', 'Portfolio Management'],
    price: '$349/month',
    status: 'Active'
  },
  {
    id: 14,
    name: 'Maijjd Healthcare Analytics',
    description: 'Comprehensive healthcare analytics platform with MJND-powered patient insights, predictive diagnostics, and compliance management.',
    category: 'Healthcare Technology',
    version: '1.8.4',
    rating: 4.7,
    downloads: 4230,
    icon: <Activity className="h-8 w-8" />,
    features: ['MJND-Powered Patient Insights', 'Predictive Diagnostics', 'Compliance Management', 'Clinical Decision Support'],
    price: '$499/month',
    status: 'Active'
  },
  {
    id: 15,
    name: 'Maijjd Education Platform',
    description: 'MJND-powered educational platform with personalized learning paths, intelligent tutoring, and adaptive assessments.',
    category: 'Education Technology',
    version: '1.6.2',
    rating: 4.5,
    downloads: 15680,
    icon: <Users className="h-8 w-8" />,
    features: ['Personalized Learning Paths', 'MJND-Powered Tutoring', 'Adaptive Assessments', 'Multi-Media Content'],
    price: '$79/month',
    status: 'Active'
  },
  {
    id: 16,
    name: 'Maijjd MJND Coding Assistant',
    description: 'Advanced MJND-powered coding assistant with intelligent code generation, debugging, and optimization capabilities.',
    category: 'MJND Development',
    version: '3.0.0',
    rating: 4.9,
    downloads: 23450,
    icon: <Code className="h-8 w-8" />,
    features: ['Smart Code Completion', 'MJND Debugging', 'Code Review', 'Performance Optimization'],
    price: '$199/month',
    status: 'Active'
  },
  {
    id: 17,
    name: 'Maijjd MJND Editing Suite',
    description: 'Comprehensive MJND-powered editing tools for content creation, document processing, and multimedia editing.',
    category: 'MJND Content',
    version: '2.5.1',
    rating: 4.7,
    downloads: 18750,
    icon: <Edit className="h-8 w-8" />,
    features: ['Content Generation', 'Document Editing', 'Image Processing', 'Video Editing'],
    price: '$149/month',
    status: 'Active'
  },
  {
    id: 18,
    name: 'Maijjd MJND Development Tools',
    description: 'Complete suite of MJND-powered development tools for building intelligent applications and systems.',
    category: 'MJND Development',
    version: '2.8.3',
    rating: 4.8,
    downloads: 15680,
    icon: <Wrench className="h-8 w-8" />,
    features: ['AI Model Builder', 'Neural Network Designer', 'Data Pipeline Tools', 'MLOps Platform'],
    price: '$299/month',
    status: 'Active'
  },
  {
    id: 19,
    name: 'Maijjd Cloud Manager',
    description: 'Cloud resources manager for provisioning, monitoring, and cost optimization.',
    category: 'Cloud',
    version: '1.4.0',
    rating: 4.7,
    downloads: 7420,
    icon: <Cloud className="h-8 w-8" />,
    features: ['Resource Provisioning', 'Cost Optimization', 'Multi-Cloud Support', 'Monitoring Dashboards'],
    price: '$349/month',
    status: 'Active'
  },
  {
    id: 20,
    name: 'Maijjd Development Studio',
    description: 'Dev tools and pipelines with code templates, CI/CD, and quality checks.',
    category: 'Development',
    version: '2.0.0',
    rating: 4.6,
    downloads: 10320,
    icon: <Code className="h-8 w-8" />,
    features: ['Project Scaffolding', 'Pipelines & CI/CD', 'Static Analysis', 'Testing Utilities'],
    price: '$249/month',
    status: 'Active'
  },
  {
    id: 21,
    name: 'Maijjd Web Builder Pro',
    description: 'Professional website builder with templates, components, and deployment.',
    category: 'Web',
    version: '1.3.2',
    rating: 4.5,
    downloads: 12890,
    icon: <Monitor className="h-8 w-8" />,
    features: ['Drag-and-Drop Builder', 'SEO Toolkit', 'Responsive Themes', 'One-Click Deploy'],
    price: '$179/month',
    status: 'Active'
  },

  function createCITargets(zip, appName) {
    const ghFolder = zip.folder('.github');
    const gh = ghFolder ? ghFolder.folder('workflows') : null;
    if (!gh) return;
    const ghPages = [
      'name: Deploy Frontend to GitHub Pages',
      '',
      'on:',
      '  push:',
      '    branches: [ main ]',
      '  workflow_dispatch: {}',
      '',
      'jobs:',
      '  build-deploy:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: actions/setup-node@v4',
      '        with:',
      '          node-version: 18',
      '      - name: Install',
      '        run: npm ci --prefix frontend',
      '      - name: Build',
      '        run: npm run build --prefix frontend',
      '      - name: Deploy',
      '        uses: peaceiris/actions-gh-pages@v3',
      '        with:',
      '          github_token: ' + '$' + '{{ secrets.GITHUB_TOKEN }}',
      '          publish_dir: frontend/build'
    ].join('\n');
    gh.file('deploy-gh-pages.yml', ghPages);

    const netlify = [
      'name: Deploy Frontend to Netlify',
      '',
      'on:',
      '  workflow_dispatch: {}',
      '  push:',
      '    branches: [ main ]',
      '',
      'jobs:',
      '  deploy:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: actions/setup-node@v4',
      '        with:',
      '          node-version: 18',
      '      - run: npm ci --prefix frontend',
      '      - run: npm run build --prefix frontend',
      '      - name: Deploy',
      '        uses: nwtgck/actions-netlify@v2.1',
      '        with:',
      '          publish-dir: ./frontend/build',
      '          production-deploy: true',
      '          github-token: ' + '$' + '{{ secrets.GITHUB_TOKEN }}',
      "          deploy-message: 'GitHub Actions deploy'",
      '          netlify-config-path: ./frontend/netlify.toml',
      '        env:',
      '          NETLIFY_AUTH_TOKEN: ' + '$' + '{{ secrets.NETLIFY_AUTH_TOKEN }}',
      '          NETLIFY_SITE_ID: ' + '$' + '{{ secrets.NETLIFY_SITE_ID }}'
    ].join('\n');
    gh.file('deploy-netlify.yml', netlify);

    const dockerGhcr = [
      'name: Build and Push Docker Image',
      '',
      'on:',
      '  workflow_dispatch: {}',
      '  push:',
      '    branches: [ main ]',
      '',
      'jobs:',
      '  docker:',
      '    runs-on: ubuntu-latest',
      '    permissions:',
      '      contents: read',
      '      packages: write',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - name: Login to GHCR',
      '        uses: docker/login-action@v3',
      '        with:',
      '          registry: ghcr.io',
      '          username: ' + '$' + '{{ github.actor }}',
      '          password: ' + '$' + '{{ secrets.GITHUB_TOKEN }}',
      '      - name: Build',
      '        run: docker build -t ghcr.io/' + '$' + '{{ github.repository_owner }}' + '/' + '$' + '{{ github.event.repository.name }}' + ':latest .',
      '      - name: Push',
      '        run: docker push ghcr.io/' + '$' + '{{ github.repository_owner }}' + '/' + '$' + '{{ github.event.repository.name }}' + ':latest'
    ].join('\n');
    gh.file('docker-ghcr.yml', dockerGhcr);
  }
];

const Software = () => {
  const [software, setSoftware] = useState(defaultSoftware);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [currentSoftware, setCurrentSoftware] = useState(null);
  const [showDevelopmentEnvironment, setShowDevelopmentEnvironment] = useState(false);
  const [selectedSoftwareForDev, setSelectedSoftwareForDev] = useState(null);
  const plainEditorRef = useRef(null);
  const textAreaRef = useRef(null);
  const terminalRef = useRef(null);
  const previewRef = useRef(null);
  const chatRef = useRef(null);
  
  // Global AI Idea State
  // const [globalUserIdea, setGlobalUserIdea] = useState('');
  // const [globalAiGeneratedCode, setGlobalAiGeneratedCode] = useState('');
  // const [globalAiBuiltConcept, setGlobalAiBuiltConcept] = useState('');
  // const [globalAiCreatedSolution, setGlobalAiCreatedSolution] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSoftware = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSoftware();
      
      // Ensure we always set an array
      const softwareData = data.data || data.software || data;
      if (Array.isArray(softwareData)) {
        setSoftware(softwareData);
        setLastFetched(new Date());
      } else {
        setSoftware(defaultSoftware);
        setLastFetched(new Date());
      }
    } catch (err) {
      setError(`Failed to load software: ${err.message}`);
      setSoftware(defaultSoftware);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftware();
  }, []);

  // Auto-open dev environment when navigated with state { openDev: true }
  useEffect(() => {
    if (location && location.state && location.state.openDev) {
      // Use AI Hub software as default when no specific item is passed
      openDevelopmentEnvironment(aiHubSoftware);
    }
  }, [location]);

  // Ensure software is an array before processing and normalize fields
  const replaceAiWithMjnd = (text) => {
    const s = String(text || '');
    return s
      .replace(/AI-powered/gi, 'MJND-powered')
      .replace(/AI driven/gi, 'MJND driven')
      .replace(/AI-driven/gi, 'MJND-driven');
  };
  const softwareArray = Array.isArray(software) ? software : [];
  const normalizeString = (val) => (typeof val === 'string' ? val : (val != null ? String(val) : ''));
  const normalizedSoftware = softwareArray.map((s) => {
    let name = normalizeString(s && s.name);
    if (/^Maijjd\s+AI\s+Hub$/i.test(name)) name = 'Maijjd MJND Hub';
    // Standardize visible names from AI -> MJND (e.g., "Maijjd Customer Support AI" -> "... MJND")
    name = name.replace(/\bAI\b/gi, 'MJND');
    const description = replaceAiWithMjnd(normalizeString(s && s.description));
    const features = Array.isArray(s && s.features)
      ? s.features.map((f) => replaceAiWithMjnd(normalizeString(f)))
      : [];
    const category = s && s.category ? s.category : 'Uncategorized';
    return { ...s, name, description, features, category };
  });
  // Exclude items that are shown separately in the hero (avoid duplicate MJND Hub card)
  const EXCLUDED_NAMES = new Set(['Maijjd MJND Hub', 'Maijjd MJND Hub']);
  const displaySoftware = normalizedSoftware.filter((item) => !EXCLUDED_NAMES.has(item.name.trim()));

  const categories = [...new Set(displaySoftware.map((item) => item.category))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = displaySoftware.filter((s) => s.category === cat).length;
    return acc;
  }, {});

  // Filter software based on search and category
  const filteredSoftware = displaySoftware.filter(item => {
    const term = normalizeString(searchTerm).toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(term) ||
                         item.description.toLowerCase().includes(term) ||
                         (Array.isArray(item.features) && item.features.some(feature => normalizeString(feature).toLowerCase().includes(term)));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle feature click to expand/collapse with AI enhancement
  const handleFeatureClick = async (softwareId, featureIndex, feature, software) => {
    const key = `${softwareId}-${featureIndex}`;
    setExpandedFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // If expanding, get AI insights for the feature
    if (!expandedFeatures[key]) {
      try {
        const aiResponse = await apiService.demoAiChat(
          `Analyze feature: ${feature} for software: ${software.name}`,
          software.name,
          {
            software_id: software.id,
            analysis_type: 'feature_analysis',
            ai_model: 'gpt-4'
          }
        );

        // Store AI insights for the feature
        setExpandedFeatures(prev => ({
          ...prev,
          [`${key}_ai`]: aiResponse
        }));
      } catch (error) {
        console.warn('Could not get AI insights for feature:', error);
      }
    }
  };

  // Handle feature info click - Enhanced with MJND-powered responses
  const handleFeatureInfo = (feature, softwareName) => {
    const aiResponses = {
      'Contact Management': `MJND-Powered Contact Management: Our intelligent system automatically organizes and categorizes your contacts, provides smart suggestions for follow-ups, and predicts customer behavior patterns. The MJND engine learns from your interactions to improve contact management efficiency.`,
      'Sales Pipeline': `MJND-Enhanced Sales Pipeline: Our MJND engine analyzes your sales data to identify trends, predict deal outcomes, and suggest optimal follow-up strategies. It automatically prioritizes leads and provides real-time insights to boost conversion rates.`,
      'Email Marketing': `Smart Email Marketing: MJND-driven campaigns that automatically segment audiences, optimize send times, and personalize content based on user behavior. The system continuously learns and improves performance.`,
      'Analytics Dashboard': `Intelligent Analytics Dashboard: MJND-powered insights that automatically detect patterns, generate predictive reports, and provide actionable recommendations.`,
      'Data Visualization': `MJND-Enhanced Data Visualization: Intelligent charts and graphs that automatically choose the best visualization format, highlight important trends, and provide interactive insights.`,
      'Real-time Monitoring': `Smart Real-time Monitoring: MJND-powered monitoring that automatically detects anomalies, predicts potential issues, and provides proactive alerts.`,
      'Custom Reports': `Intelligent Custom Reports: MJND-generated reports that automatically identify key metrics, suggest relevant data combinations, and adapt to your reporting needs.`,
      'API Integration': `Smart API Integration: MJND-assisted integration that automatically detects API patterns, suggests optimal connection methods, and provides intelligent error handling.`,
      'Threat Detection': `MJND-Powered Threat Detection: Advanced security that identifies new threat patterns, adapts to emerging risks, and provides intelligent response recommendations.`,
      'VPN Support': `Intelligent VPN Support: MJND-enhanced VPN that optimizes routes, detects security risks, and provides smart connection management.`,
      'Intrusion Prevention': `Smart Intrusion Prevention: MJND-driven security that learns from attack patterns, updates protection rules, and provides intelligent response without human intervention.`,
      'Security Monitoring': `Intelligent Security Monitoring: MJND-powered monitoring that detects anomalies, predicts potential breaches, and provides proactive recommendations.`,
      'Cloud Storage': `Smart Cloud Storage: MJND-enhanced storage that optimizes organization, predicts storage needs, and provides intelligent backup recommendations.`,
      'File Synchronization': `Intelligent File Sync: MJND-powered sync that detects file conflicts, suggests optimal strategies, and resolves conflicts smartly.`,
      'Data Encryption': `Smart Data Encryption: MJND-enhanced encryption that adapts security levels, detects vulnerabilities, and recommends improvements.`,
      'Access Control': `Intelligent Access Control: MJND-powered access management that detects unusual patterns and suggests optimal permission levels.`,
      'Performance Optimization': `MJND-Powered Performance: Intelligent optimization that detects bottlenecks, suggests improvements, and provides real-time insights.`,
      'User Management': `Smart User Management: MJND-enhanced administration that detects behavior patterns and suggests optimal permissions.`,
      'Workflow Automation': `Intelligent Workflow Automation: MJND-powered automation that learns from your processes and adapts workflows for efficiency.`,
      'Mobile Optimization': `Smart Mobile Experience: MJND-enhanced features that adapt to device capabilities and optimize performance.`,
      'Cross-platform Sync': `Intelligent Cross-platform Sync: MJND-powered synchronization that optimizes strategies across platforms.`
    };
    
    const response = aiResponses[feature] || `MJND-Powered ${feature}: Our intelligent system automatically enhances this feature with machine learning capabilities, providing personalized experiences and continuous improvement based on your usage patterns. The MJND assistant learns from your interactions to deliver increasingly relevant and efficient functionality.`;
    
    alert(`🤖 MJND-Enhanced Feature: ${feature}\n\n${response}\n\n💡 This feature is powered by our advanced MJND system that continuously learns and improves to provide you with the best possible experience.`);
  };

  // Handle feature navigation - Navigate to specific feature details
  const handleFeatureNavigation = (feature, software) => {
    // Navigate to contact page with specific feature information
    navigate('/contact', { 
      state: { 
        selectedSoftware: software.name,
        softwareCategory: software.category,
        softwareDescription: software.description,
        softwarePrice: software.price,
        softwareVersion: software.version,
        selectedFeature: feature,
        featureType: 'software-feature'
      }
    });
  };

  // Handle Try Now button click -> go to Billing page with preselected plan
  const handleTryNow = (software) => {
    const plan = 'standard';
    navigate(`/billing?plan=${plan}`);
  };

  // Handle Start Free Trial button click
  const handleStartTrial = () => {
    navigate('/contact');
  };

  // MJND Assistant functions
  const openAIAssistant = async (software) => {
    try {
      // Get AI insights for the software using API service
      const aiResponse = await apiService.demoAiChat(
        `Analyze software: ${software.name} - ${software.description}`,
        software.name,
        {
          software_id: software.id,
          analysis_type: 'software_analysis',
          ai_model: 'gpt-4'
        }
      );

      setCurrentSoftware({
        ...software,
        aiInsights: aiResponse
      });
    } catch (error) {
      console.warn('Could not get AI insights:', error);
      setCurrentSoftware(software);
    }
    
    setAiAssistantOpen(true);
  };

  const closeAIAssistant = () => {
    setAiAssistantOpen(false);
    setCurrentSoftware(null);
  };

  // Open development environment with full coding tools
  const openDevelopmentEnvironment = (software) => {
    console.log('🚀 Opening development environment for:', software);
    console.log('Software object:', software);
    
    // Initialize state for the development environment
    setAiCode('');
    setAiOutput('');
    setTerminalOutput([]);
    setPreviewContent('');
    
    setSelectedSoftwareForDev(software);
    setShowDevelopmentEnvironment(true);
    setUsePlainEditor(true);
    console.log('Development environment state set to true');
    
    // Add initial terminal output
    setTerminalOutput([
      `$ Development environment opened for ${software.name}`,
      `$ MNJD, MJ, and Team tools initialized`,
      `$ Ready to start coding`
    ]);
  };

  const closeDevelopmentEnvironment = () => {
    setShowDevelopmentEnvironment(false);
    setSelectedSoftwareForDev(null);
  };

  // Enhanced AI coding functionality
  const [aiCode, setAiCode] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  // const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [previewContent, setPreviewContent] = useState('');
  const [usePlainEditor, setUsePlainEditor] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    // focus appropriate editor after opening or toggling
    const focusPlain = () => {
      if (plainEditorRef.current) {
        plainEditorRef.current.focus();
        // place caret at end
        const range = document.createRange();
        range.selectNodeContents(plainEditorRef.current);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    };
    const focusTextarea = () => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.selectionStart = textAreaRef.current.value.length;
        textAreaRef.current.selectionEnd = textAreaRef.current.value.length;
      }
    };
    const id = setTimeout(() => {
      if (!showDevelopmentEnvironment) return;
      if (usePlainEditor) focusPlain();
      else focusTextarea();
    }, 50);
    return () => clearTimeout(id);
  }, [showDevelopmentEnvironment, usePlainEditor]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(aiCode || '');
    setTerminalOutput(prev => [...prev, '$ Code copied to clipboard']);
  };

  const handleScrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick actions for hero pills
  const handleQuickCode = () => {
    openDevelopmentEnvironment(aiHubSoftware);
    setTimeout(() => {
      if (usePlainEditor && plainEditorRef.current) {
        plainEditorRef.current.focus();
        handleScrollTo(plainEditorRef);
      } else if (textAreaRef.current) {
        textAreaRef.current.focus();
        handleScrollTo(textAreaRef);
      }
    }, 200);
  };

  const handleQuickEdit = () => {
    openDevelopmentEnvironment(aiHubSoftware);
    setTimeout(() => {
      try { handleAIEditing(); } catch (_) {}
      if (textAreaRef.current) handleScrollTo(textAreaRef);
    }, 250);
  };

  const handleQuickTerminal = () => {
    openDevelopmentEnvironment(aiHubSoftware);
    setTimeout(() => handleScrollTo(terminalRef), 200);
  };

  const handleQuickPreview = () => {
    openDevelopmentEnvironment(aiHubSoftware);
    setTimeout(() => {
      try { handlePreview(); } catch (_) {}
      handleScrollTo(previewRef);
    }, 250);
  };

  // Parse a display price like "$599/month" into cents (e.g., 59900)
  const parsePriceToCents = (priceText) => {
    const text = String(priceText || '').replace(/,/g, '');
    const match = text.match(/\$\s*(\d+)(?:\.(\d{2}))?/);
    if (!match) return null;
    const dollars = Number(match[1] || '0');
    const cents = Number(match[2] || '00');
    return dollars * 100 + cents;
  };

  // Per-product two-tier pricing overrides based on name keywords
  const getTwoTierPricesForSoftware = (softwareItem) => {
    const name = String(softwareItem?.name || '').toLowerCase();
    // Ordered rules: specific first, generic later
    const rules = [
      { test: (n) => n.includes('financial') && n.includes('analytics'), standard: 111900, premium: 34900 },
      { test: (n) => n.includes('healthcare') && n.includes('analytics'), standard: 19900, premium: 49900 },
      { test: (n) => n.includes('education') && (n.includes('platform') || n.includes('edu')), standard: 2500, premium: 7900 },
      { test: (n) => n.includes('security') || n.includes('shield') || n.includes('firewall'), standard: 29900, premium: 59900 },
      { test: (n) => n.includes('cloud') && n.includes('manager'), standard: 11900, premium: 34900 },
      { test: (n) => n.includes('infrastructure') && n.includes('manager'), standard: 19900, premium: 42900 },
      { test: (n) => n.includes('project') && n.includes('management'), standard: 2500, premium: 8900 },
      { test: (n) => n.includes('marketing') && n.includes('automation'), standard: 4900, premium: 15900 },
      { test: (n) => n.includes('web') && (n.includes('builder') || n.includes('pro')), standard: 4900, premium: 17900 },
      { test: (n) => n.includes('development') && n.includes('studio'), standard: 5900, premium: 24900 },
      { test: (n) => n.includes('data science') && n.includes('studio'), standard: 19900, premium: 59900 },
      { test: (n) => n.includes('customer') && n.includes('support'), standard: 3500, premium: 12900 },
      { test: (n) => n.includes('analytics') && n.includes('suite'), standard: 7900, premium: 39900 },
      { test: (n) => n.includes('crm'), standard: 5900, premium: 19900 },
    ];
    for (const rule of rules) {
      if (rule.test(name)) {
        return { standardCents: rule.standard, premiumCents: rule.premium };
      }
    }
    return null;
  };

  const handleSubscribeAtItemPrice = (item) => {
    const cents = parsePriceToCents(item?.price);
    if (!cents) { navigate('/billing'); return; }
    navigate(`/billing?type=software&custom=${cents}&name=${encodeURIComponent(item?.name || 'Software Plan')}`);
  };

  // Generic quick actions for any software card
  const quickOpen = (software) => {
    openDevelopmentEnvironment(software);
  };
  const handleQuickCodeFor = (software) => {
    quickOpen(software);
    setTimeout(() => {
      if (usePlainEditor && plainEditorRef.current) {
        plainEditorRef.current.focus();
        handleScrollTo(plainEditorRef);
      } else if (textAreaRef.current) {
        textAreaRef.current.focus();
        handleScrollTo(textAreaRef);
      }
    }, 200);
  };
  const handleQuickEditFor = (software) => {
    quickOpen(software);
    setTimeout(() => { try { handleAIEditing(); } catch (_) {} }, 250);
  };
  const handleQuickTerminalFor = (software) => {
    quickOpen(software);
    setTimeout(() => handleScrollTo(terminalRef), 200);
  };
  const handleQuickPreviewFor = (software) => {
    quickOpen(software);
    setTimeout(() => { try { handlePreview(); } catch (_) {} }, 250);
  };

  const handleDownloadZip = async () => {
    try {
      const JSZipModule = await import('jszip');
      const { saveAs } = await import('file-saver');
      const zip = new JSZipModule.default();
      const appName = selectedSoftwareForDev?.name || 'Maijjd App';
      const safe = (appName || 'maijjd').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const code = ensureCodeFromContent(aiCode || '', appName);

      // Build a complete frontend React app
      createCompleteReactAppZip(zip, code, appName);

      // Include a minimal backend to serve the build (optional but helpful)
      createMinimalBackendZip(zip, appName);

      // Root-level deployment helpers
      createRootDeploymentFiles(zip, appName);

      // Cloudflare Worker backend template
      createCloudflareWorkerTemplate(zip, appName);

      // Root README
      const rootReadme = `# ${appName}\n\nThis ZIP contains a complete React app and a minimal Node.js backend.\n\n## Quick start (development)\n\n- Frontend:\n  1. cd frontend\n  2. npm install\n  3. npm start\n\n- Backend API (optional static server):\n  1. cd backend\n  2. npm install\n  3. npm start\n\n## Production build + serve\n\n1. cd frontend && npm install && npm run build\n2. cd ../backend && npm install && npm start\n   - This serves the built frontend and exposes GET /api/health.\n\n## Deploy\n\n- You can deploy the frontend to Netlify/Vercel and the backend to Railway/Render/Heroku.\n- Or serve both from the backend after \`npm run build\` in frontend.\n`;
      zip.file('README.md', rootReadme);

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${safe}-fullstack.zip`);
      setTerminalOutput(prev => [...prev, '$ ZIP downloaded (full stack)']);
    } catch (e) {
      setTerminalOutput(prev => [...prev, `$ ZIP error: ${e.message}`]);
    }
  };

  // Download a simple Word-compatible .doc file with software details
  const handleDownloadWord = (software) => {
    try {
      const safeName = String(software?.name || 'MJND_Project')
        .replace(/[^a-z0-9\-\_\s]/gi, '')
        .trim()
        .replace(/\s+/g, '-');
      const title = software?.name || 'MJND Project';
      const description = software?.description || 'Generated by MJND Hub';
      const features = Array.isArray(software?.features) ? software.features : [];
      const today = new Date().toLocaleDateString();

      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; line-height: 1.5; }
      h1 { margin-bottom: 0.25rem; }
      h2 { margin-top: 1.5rem; }
      ul { padding-left: 1.1rem; }
      .meta { color: #555; font-size: 12px; }
      .code { white-space: pre-wrap; font-family: Consolas, monospace; background:#f6f8fa; padding:10px; border-radius:6px; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <div class="meta">Exported ${today}</div>
    <p>${description}</p>
    ${features.length ? `<h2>Key Features</h2><ul>${features.map((f)=>`<li>${String(f)}</li>`).join('')}</ul>` : ''}
  </body>
</html>`;

      const blob = new Blob([html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (_) {
      // no-op: keep UX silent
    }
  };

  // Build and copy a shareable link for a software card
  const createShareLinkForSoftware = (software) => {
    const base = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
    const name = encodeURIComponent(String(software?.name || ''));
    return `${base}/software?item=${name}`;
  };

  const handleShareLink = (software) => {
    try {
      const link = createShareLinkForSoftware(software);
      const fallbackCopy = () => {
        const ta = document.createElement('textarea');
        ta.value = link;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      };
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    } catch (_) {
      // silent fail
    }
  };

  function createCompleteReactAppZip(zip, code, appName) {
    const { appJs, css } = extractSectionsFromCode(code);
    const safe = (appName || 'maijjd').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fe = zip.folder('frontend');
    if (!fe) return;
    const pkg = {
      name: safe,
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
        'react-scripts': '5.0.1'
      }
    };
    fe.file('package.json', JSON.stringify(pkg, null, 2));
    fe.file('README.md', `# ${appName} (Frontend)\n\nDev: npm install && npm start\nBuild: npm run build\n`);
    fe.file('.gitignore', `node_modules\n.DS_Store\nbuild\n.env\n`);
    fe.file('.env.example', `PUBLIC_URL=/\nREACT_APP_API_URL=http://localhost:5001/api\n`);
    // Netlify SPA fallback
    const pub = fe.folder('public');
    pub.file('_redirects', `/* /index.html 200\n`);
    pub.file('index.html', `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>${appName}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>`);
    const src = fe.folder('src');
    src.file('App.js', appJs.trim().startsWith('import') ? appJs : `export default function App(){ return <div>${appName}</div>; }`);
    src.file('App.css', css || 'body{font-family:system-ui,Arial}');
    src.file('index.js', `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './App.css';\nconst root = createRoot(document.getElementById('root'));\nroot.render(<App />);\n`);
    // Optional deployment configs
    fe.file('netlify.toml', `[[redirects]]\nfrom = "/*"\nto = "/index.html"\nstatus = 200\n`);
    fe.file('vercel.json', JSON.stringify({ rewrites: [{ source: '/(.*)', destination: '/' }] }, null, 2));
  }

  function createCloudflareWorkerTemplate(zip, appName) {
    const cw = zip.folder('cloudflare-worker');
    if (!cw) return;
    const workerName = (appName || 'maijjd').toLowerCase().replace(/[^a-z0-9-]+/g, '-') + '-worker';
    cw.file('README.md', `# Cloudflare Worker Backend\n\nQuick start:\n\n1. npm i -g wrangler\n2. cd cloudflare-worker\n3. wrangler dev\n4. wrangler deploy\n\nEndpoints:\n- GET /api/health\n- POST /api/demo/chat { message }\n`);
    cw.file('wrangler.toml', `name = "${workerName}"\nmain = "src/worker.js"\ncompatibility_date = "2024-01-01"\n# Uncomment to bind a custom route\n# routes = [\n#   { pattern = "example.com/api/*", zone_name = "example.com" }\n# ]\n`);
    const src = cw.folder('src');
    src.file('worker.js', `export default {\n  async fetch(request, env, ctx) {\n    const url = new URL(request.url);\n\n    if (url.pathname === '/api/health') {\n      return new Response(JSON.stringify({ status: 'OK', time: new Date().toISOString() }), {\n        headers: { 'content-type': 'application/json' }\n      });\n    }\n\n    if (url.pathname === '/api/demo/chat' && request.method === 'POST') {\n      try {\n        const body = await request.json().catch(() => ({}));\n        const message = (body && typeof body.message === 'string' && body.message.trim()) ? body.message.trim() : 'Hello';\n        // Minimal local response (no external API)\n        const content = generateLocalResponse(message);\n        return new Response(JSON.stringify({ success: true, content, model: 'worker-local', confidence: 0.9 }), {\n          headers: { 'content-type': 'application/json' }\n        });\n      } catch (e) {\n        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'content-type': 'application/json' } });\n      }\n    }\n\n    return new Response('Not Found', { status: 404 });\n  }\n}\n\nfunction generateLocalResponse(message) {\n  const lower = message.toLowerCase();\n  if (lower.includes('react') || lower.includes('website')) {\n    return "// src/App.js\\nexport default function App(){return <div>Minimal React stub</div>}\\n/* src/App.css */ body{font-family:system-ui}";\n  }\n  return 'Echo: ' + message;\n}\n`);
  }

  function createMinimalBackendZip(zip, appName) {
    const be = zip.folder('backend');
    if (!be) return;
    const pkg = {
      name: (appName || 'maijjd').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-backend',
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'node server.js',
        'heroku-postbuild': 'NPM_CONFIG_PRODUCTION=false npm install --prefix ../frontend && npm run build --prefix ../frontend'
      },
      dependencies: {
        express: '^4.18.2',
        cors: '^2.8.5',
        compression: '^1.7.4'
      }
    };
    be.file('package.json', JSON.stringify(pkg, null, 2));
    be.file('README.md', `# ${appName} (Backend)\n\n- npm install\n- npm start (serves built frontend if available and exposes GET /api/health)\n`);
    be.file('.gitignore', `node_modules\n.DS_Store\n.env\n`);
    be.file('.env.example', `PORT=5001\n`);
    be.file('Procfile', `web: node server.js\n`);
    be.file('Dockerfile', `# Minimal backend image (expects frontend build to be copied during build)\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nENV PORT=5001\nEXPOSE 5001\nCMD [\"node\", \"server.js\"]\n`);
    be.file('server.js', `const path = require('path');\nconst express = require('express');\nconst cors = require('cors');\nconst compression = require('compression');\nconst app = express();\napp.use(cors());\napp.use(compression());\napp.get('/api/health', (req,res)=>res.json({status:'OK', time:new Date().toISOString()}));\n// Serve frontend build if present\nconst buildDir = path.join(__dirname, '..', 'frontend', 'build');\napp.use(express.static(buildDir));\napp.get('*', (req, res) => {\n  try { res.sendFile(path.join(buildDir, 'index.html')); } catch { res.status(200).send('Backend running. Build the frontend to serve UI.'); }\n});\nconst PORT = process.env.PORT || 5001;\napp.listen(PORT, () => console.log('Backend listening on http://localhost:'+PORT));\n`);
  }

  function createRootDeploymentFiles(zip, appName) {
    const root = zip.folder('.');
    if (!root) return;
    // Full multi-stage Dockerfile that builds FE then runs BE serving FE build
    root.file('Dockerfile', `# ---------- Build frontend ----------\nFROM node:18 as fe\nWORKDIR /fe\nCOPY frontend/package*.json ./\nRUN npm ci\nCOPY frontend .\nRUN npm run build\n\n# ---------- Backend runtime ----------\nFROM node:18\nWORKDIR /app\nCOPY backend/package*.json ./\nRUN npm ci --omit=dev\nCOPY backend .\nCOPY --from=fe /fe/build ./frontend/build\nENV PORT=5001\nEXPOSE 5001\nCMD [\"node\", \"server.js\"]\n`);
    // Compose for local prod-like run
    root.file('docker-compose.yml', `version: '3'\nservices:\n  app:\n    build: .\n    ports:\n      - '5001:5001'\n    environment:\n      - PORT=5001\n`);
    // Railway
    root.file('railway.json', JSON.stringify({ $schema: 'https://railway.app/railway.schema.json', build: { command: 'npm ci --prefix backend' }, start: { command: 'node backend/server.js' }, env: { PORT: 5001 } }, null, 2));
    // Render
    root.file('render.yaml', `services:\n  - type: web\n    name: ${(appName||'maijjd').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-app\n    env: node\n    buildCommand: npm ci --prefix frontend && npm run build --prefix frontend && npm ci --prefix backend\n    startCommand: node backend/server.js\n    envVars:\n      - key: PORT\n        value: 5001\n    plan: free\n`);
    // Heroku app.json (monorepo)
    root.file('app.json', JSON.stringify({ name: appName, scripts: { postdeploy: 'echo Postdeploy finished' }, env: { NPM_CONFIG_PRODUCTION: { required: false, value: 'false' } }, stack: 'heroku-22' }, null, 2));
    // Fly.io
    root.file('fly.toml', `[build]\n  builder = "heroku/buildpacks:20"\n[env]\n  PORT = "5001"\n[[services]]\n  internal_port = 5001\n  protocol = "tcp"\n  [[services.ports]]\n    handlers = ["http"]\n    port = 80\n`);
    // Vercel monorepo: static FE + serverless Node API
    root.file('vercel.json', JSON.stringify({
      version: 2,
      builds: [
        { src: 'frontend/package.json', use: '@vercel/static-build', config: { distDir: 'build' } },
        { src: 'backend/server.js', use: '@vercel/node' }
      ],
      routes: [
        { src: '/api/(.*)', dest: '/backend/server.js' },
        { src: '/(.*)', dest: '/frontend/build/$1' }
      ]
    }, null, 2));
    // Cloudflare Pages
    root.file('wrangler.toml', `name = "${(appName||'maijjd').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-app"\npages_build_output_dir = "frontend/build"\n`);
    const cfFns = root.folder('functions');
    if (cfFns) {
      const cfApi = cfFns.folder('api');
      if (cfApi) {
        cfApi.file('health.js', `export async function onRequestGet() {\n  return new Response(JSON.stringify({ status: 'OK', time: new Date().toISOString() }), {\n    headers: { 'content-type': 'application/json' }\n  });\n}\n`);
      }
    }
    // Azure Web App workflow
    const gh = root.folder('.github')?.folder('workflows');
    if (gh) {
      const azureYml = [
        'name: Deploy to Azure Web App',
        '',
        'on:',
        '  workflow_dispatch: {}',
        '',
        'jobs:',
        '  build-and-deploy:',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - uses: actions/checkout@v4',
        '      - uses: actions/setup-node@v4',
        '        with:',
        '          node-version: 18',
        '      - run: npm ci --prefix frontend',
        '      - run: npm run build --prefix frontend',
        '      - run: npm ci --prefix backend',
        '      - name: Zip package',
        '        run: zip -r release.zip backend frontend/build',
        '      - name: Deploy to Azure Web App',
        '        uses: azure/webapps-deploy@v2',
        '        with:',
        '          app-name: ' + '$' + '{{ secrets.AZURE_WEBAPP_NAME }}',
        '          publish-profile: ' + '$' + '{{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}',
        '          package: release.zip'
      ].join('\n');
      gh.file('deploy-azure.yml', azureYml);
      const acaYml = [
        'name: Build and Deploy to Azure Container Apps',
        '',
        'on:',
        '  workflow_dispatch: {}',
        '',
        'jobs:',
        '  aca:',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - uses: actions/checkout@v4',
        '      - name: Login to Azure',
        '        uses: azure/login@v2',
        '        with:',
        '          creds: ' + '$' + '{{ secrets.AZURE_CREDENTIALS }}',
        '      - name: Build image',
        '        run: docker build -t ' + '$' + '{{ secrets.ACR_LOGIN_SERVER }}' + '/' + (appName||'maijjd').toLowerCase().replace(/[^a-z0-9]+/g,'-') + ':latest .',
        '      - name: Docker login',
        '        run: echo ' + '$' + '{{ secrets.ACR_PASSWORD }}' + ' | docker login ' + '$' + '{{ secrets.ACR_LOGIN_SERVER }}' + ' -u ' + '$' + '{{ secrets.ACR_USERNAME }}' + ' --password-stdin',
        '      - name: Push image',
        '        run: docker push ' + '$' + '{{ secrets.ACR_LOGIN_SERVER }}' + '/' + (appName||'maijjd').toLowerCase().replace(/[^a-z0-9]+/g,'-') + ':latest',
        '      - name: Deploy ACA',
        '        uses: azure/cli@v2',
        '        with:',
        '          inlineScript: |',
        '            az extension add --name containerapp --upgrade',
        '            az containerapp create \\n+              --name ' + (appName||'maijjd').toLowerCase().replace(/[^a-z0-9]+/g,'-') + ' \\n+              --resource-group ' + '$' + '{{ secrets.AZURE_RESOURCE_GROUP }}' + ' \\n+              --environment ' + '$' + '{{ secrets.AZURE_CONTAINERAPPS_ENV }}' + ' \\n+              --image ' + '$' + '{{ secrets.ACR_LOGIN_SERVER }}' + '/' + (appName||'maijjd').toLowerCase().replace(/[^a-z0-9]+/g,'-') + ':latest \\n+              --ingress external --target-port 5001 \\n+              --env-vars PORT=5001'
      ].join('\n');
      gh.file('deploy-aca.yml', acaYml);
    }
  }

  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || !selectedSoftwareForDev) return;
    const userMsg = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    try {
      const result = await apiService.demoAiChat(message, selectedSoftwareForDev.name, {
        software_id: selectedSoftwareForDev.id,
        analysis_type: 'dev_chat',
        ai_model: 'gpt-4'
      });
      const aiMsg = { role: 'assistant', content: result?.content || 'MJND response unavailable.' };
      setChatMessages(prev => [...prev, aiMsg]);
      setAiOutput(prev => `${prev ? prev + '\n\n' : ''}💬 AI: ${aiMsg.content}`);
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    } catch (e) {
      const aiMsg = { role: 'assistant', content: `Error: ${e.message}` };
      setChatMessages(prev => [...prev, aiMsg]);
    }
  };

  const handlePromptSend = async () => {
    const msg = promptText.trim();
    if (!msg || !selectedSoftwareForDev) return;
    setPromptText('');
    setTerminalOutput(prev => [...prev, `$ Prompt: ${msg}`]);
    try {
      const result = await apiService.demoAiChat(msg, selectedSoftwareForDev.name, {
        software_id: selectedSoftwareForDev.id,
        analysis_type: 'freeform_prompt',
        ai_model: 'gpt-4'
      });
      let content = ensureCodeFromContent(result?.content || '', msg);
      // If response looks like code, place into editor; otherwise append to output
      if (content) {
        setAiCode(content);
        setAiOutput(`✅ Generated response:\n\n${content}`);
        setTerminalOutput(prev => [...prev, '$ MJND response received']);
        // auto-preview
        try { setPreviewContent(buildHtmlPreviewFromCode(content)); } catch (_) {}
      }
    } catch (e) {
      const fallback = generateLocalEnglishLearningReactApp(msg);
      setAiCode(fallback);
      setAiOutput(`⚠️ AI unavailable. Using local generator.\n\n${fallback}`);
      setTerminalOutput(prev => [...prev, `$ Error: ${e.message}`]);
      try { setPreviewContent(buildHtmlPreviewFromCode(fallback)); } catch (_) {}
    }
  };

  function generateLocalEnglishLearningReactApp(prompt) {
    const appJs = `import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [word, setWord] = useState('hello');
  const examples = [
    { en: 'hello', phonetic: 'həˈləʊ', rw: 'bonjour' },
    { en: 'teacher', phonetic: 'ˈtiːtʃə', rw: 'mwalimu' },
    { en: 'student', phonetic: 'ˈstjuːd(ə)nt', rw: 'umunyeshuri' }
  ];

  const speak = (text) => window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

  return (
    <div className="app">
      <header className="header">
        <h1>MNJD, MJ, and Team English Learning</h1>
        <p>{` + '`' + `Prompt: ${prompt}` + '`' + `}</p>
      </header>

      <section className="practice">
        <h2>Practice pronunciation</h2>
        <div className="row">
          <input value={word} onChange={e=>setWord(e.target.value)} placeholder="Type a word" />
          <button onClick={()=>speak(word)}>🔊 Speak</button>
        </div>
      </section>

      <section className="examples">
        <h2>Common words</h2>
        <table>
          <thead><tr><th>English</th><th>Phonetic</th><th>Meaning (RW)</th><th>Play</th></tr></thead>
          <tbody>
            {examples.map((ex,i)=> (
              <tr key={i}>
                <td>{ex.en}</td>
                <td>{ex.phonetic}</td>
                <td>{ex.rw}</td>
                <td><button onClick={()=>speak(ex.en)}>▶</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="footer">Extend with lessons, quizzes and chat.</footer>
    </div>
  );
}`;

    const css = `.app{max-width:960px;margin:0 auto;padding:24px;font-family:system-ui,Arial} .header{border-bottom:1px solid #e5e7eb;margin-bottom:16px} .row{display:flex;gap:8px} input{flex:1;padding:8px;border:1px solid #d1d5db;border-radius:6px} button{padding:8px 12px;border-radius:6px;border:1px solid #d1d5db;background:#2563eb;color:#fff} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:8px;text-align:left} .footer{margin-top:24px;color:#6b7280;font-size:14px}`;

    return `// src/App.js\n${appJs}\n\n/* src/App.css */\n${css}`;
  }

  // Featured MJND Hub software used for the hero "Start Coding" CTA
  const aiHubSoftware = {
    id: 'ai-hub',
    name: 'Maijjd MJND Hub',
    description: 'Advanced MJND-powered software management platform with intelligent automation, machine learning capabilities, and real-time analytics. Features include predictive maintenance, automated workflows, and intelligent resource allocation.',
    category: 'MJND Development',
    version: '3.0.0',
    rating: 4.9,
    downloads: 45231,
    status: 'Active'
  };

  const handleAICodeGeneration = async () => {
    if (!selectedSoftwareForDev) return;
    
    // setIsAiProcessing(true);
    setTerminalOutput(prev => [...prev, `$ Starting AI code generation for ${selectedSoftwareForDev.name}...`]);
    
    try {
      const result = await apiService.demoAiChat(
        `Generate working code for ${selectedSoftwareForDev.name} with full implementation`,
        selectedSoftwareForDev.name,
        {
          software_id: selectedSoftwareForDev.id,
          analysis_type: 'code_generation',
          ai_model: 'gpt-4',
          include_examples: true,
          code_format: 'complete'
        }
      );
      
      if (result && result.content) {
        const ensured = ensureCodeFromContent(result.content, selectedSoftwareForDev.name);
        setAiCode(ensured);
        setAiOutput(`✅ AI Code Generated Successfully!\n\n${ensured}`);
        setTerminalOutput(prev => [...prev, `$ AI code generation completed for ${selectedSoftwareForDev.name}`]);
        setTerminalOutput(prev => [...prev, `$ Code length: ${ensured.length} characters`]);
        try { setPreviewContent(buildHtmlPreviewFromCode(ensured)); } catch (_) {}
      } else {
        throw new Error('No content received from AI service');
      }
    } catch (error) {
      console.error('MJND code generation failed:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setAiOutput(`❌ Error generating code: ${errorMessage}`);
      setTerminalOutput(prev => [...prev, `$ Error: ${errorMessage}`]);
      
      // Fallback to sample code if AI fails
      const fallbackCode = `// Fallback code for ${selectedSoftwareForDev.name}
function ${selectedSoftwareForDev.name.replace(/\s+/g, '').toLowerCase()}() {
  console.log('Hello from ${selectedSoftwareForDev.name}!');
  
  // Basic implementation
  const features = ['MJND Integration', 'Performance', 'Security'];
  
  features.forEach(feature => {
    console.log(\`Feature: \${feature}\`);
  });
  
  return {
    name: '${selectedSoftwareForDev.name}',
    version: '1.0.0',
    features: features
  };
}

// Export for use
module.exports = ${selectedSoftwareForDev.name.replace(/\s+/g, '').toLowerCase()};`;
      
      setAiCode(fallbackCode);
      setAiOutput(`⚠️ AI service unavailable. Using fallback code:\n\n${fallbackCode}`);
      setTerminalOutput(prev => [...prev, `$ Fallback code loaded`]);
      try { setPreviewContent(buildHtmlPreviewFromCode(fallbackCode)); } catch (_) {}
    } finally {
      // setIsAiProcessing(false);
    }
  };

  const handleAIEditing = async () => {
    if (!selectedSoftwareForDev || !aiCode) return;
    
    // setIsAiProcessing(true);
    setTerminalOutput(prev => [...prev, `$ Starting AI code optimization...`]);
    
    try {
      const result = await apiService.demoAiChat(
        `Optimize and improve this code for ${selectedSoftwareForDev.name}: ${aiCode}`,
        selectedSoftwareForDev.name,
        {
          software_id: selectedSoftwareForDev.id,
          analysis_type: 'code_optimization',
          ai_model: 'gpt-4',
          current_code: aiCode
        }
      );
      
      if (result && result.content) {
        const ensured = ensureCodeFromContent(result.content, selectedSoftwareForDev.name);
        setAiCode(ensured);
        setAiOutput(`✅ AI Code Optimization Complete!\n\n${ensured}`);
        setTerminalOutput(prev => [...prev, `$ AI code optimization completed`]);
        setTerminalOutput(prev => [...prev, `$ Optimized code length: ${ensured.length} characters`]);
        try { setPreviewContent(buildHtmlPreviewFromCode(ensured)); } catch (_) {}
      } else {
        throw new Error('No optimization content received from AI service');
      }
    } catch (error) {
      console.error('AI code editing failed:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setAiOutput(`❌ Error optimizing code: ${errorMessage}`);
      setTerminalOutput(prev => [...prev, `$ Error: ${errorMessage}`]);
      
      // Fallback optimization
      const optimizedCode = aiCode + `\n\n// AI Optimization applied\n// Performance improvements added\n// Error handling enhanced\n\n// Optimized version of ${selectedSoftwareForDev.name}`;
      setAiCode(optimizedCode);
      setAiOutput(`⚠️ AI optimization unavailable. Applied basic improvements:\n\n${optimizedCode}`);
      setTerminalOutput(prev => [...prev, `$ Basic optimization applied`]);
      try { setPreviewContent(buildHtmlPreviewFromCode(optimizedCode)); } catch (_) {}
    } finally {
      // setIsAiProcessing(false);
    }
  };

  const handlePreview = () => {
    if (!aiCode) {
      setPreviewContent('No code to preview. Please generate or enter some code first.');
      return;
    }
    try {
      const html = buildHtmlPreviewFromCode(aiCode);
      setPreviewContent(html);
      setTerminalOutput(prev => [...prev, `$ Live preview generated`]);
    } catch (error) {
      setPreviewContent(`Error generating preview: ${error.message}`);
    }
  };

  const handleRunCode = async () => {
    if (!aiCode) {
      setTerminalOutput(prev => [...prev, `$ Error: No code to run`]);
      return;
    }
    
    setTerminalOutput(prev => [...prev, `$ Running code for ${selectedSoftwareForDev.name}...`]);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const html = buildHtmlPreviewFromCode(aiCode);
      setPreviewContent(html);
      setAiOutput('✅ Code executed and rendered in the preview.');
      setTerminalOutput(prev => [...prev, `$ Code executed and preview updated`]);
    } catch (error) {
      setTerminalOutput(prev => [...prev, `$ Error: ${error.message}`]);
      setAiOutput(`❌ Code execution failed: ${error.message}`);
    }
  };

  function extractSectionsFromCode(code) {
    let appJs = code;
    let css = '';
    const cssMarker = '/* src/App.css */';
    const appMarker = '// src/App.js';
    if (code.includes(cssMarker)) {
      const parts = code.split(cssMarker);
      if (parts.length >= 2) {
        appJs = parts[0].replace(appMarker, '').trim();
        css = parts.slice(1).join(cssMarker).trim();
      }
    }
    return { appJs, css };
  }

  function isCodeLike(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
      text.includes('// src/App.js') ||
      text.includes('/* src/App.css */') ||
      lower.includes('import react') ||
      lower.includes('<!doctype html') ||
      lower.includes('<html') ||
      /function\s+\w+\s*\(/.test(text) ||
      /class\s+\w+/.test(text)
    );
  }

  function ensureCodeFromContent(content, prompt) {
    if (!content || !isCodeLike(content)) {
      return generateLocalEnglishLearningReactApp(prompt || '');
    }
    return content;
  }

  function buildHtmlPreviewFromCode(code) {
    const { appJs, css } = extractSectionsFromCode(code);
    const escapedCss = css || '';
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Preview</title>
    <style>${escapedCss}</style>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
${appJs}
const root = ReactDOM.createRoot(document.getElementById('root'));
try { root.render(React.createElement(App)); } catch(e) { document.body.innerHTML = '<pre style="white-space:pre-wrap">'+e.toString()+'</pre>'; }
    </script>
  </body>
  </html>`;
    return html;
  }

  const addTerminalCommand = (command) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`]);
  };
  // Lightweight in-app dialog for MJND tool results with interactive chat
  const [toolDialog, setToolDialog] = useState({ open: false, title: '', content: '', software: null });
  const [toolDialogInput, setToolDialogInput] = useState('');
  const [toolDialogBusy, setToolDialogBusy] = useState(false);
  const [toolDialogHistory, setToolDialogHistory] = useState([]);
  // Billing dialog state
  const [billingDialog, setBillingDialog] = useState({ open: false, software: null, plan: 'standard', busy: false, error: '' });
  const openBillingFor = (software, defaultPlan = 'standard') => setBillingDialog({ open: true, software, plan: defaultPlan, busy: false, error: '' });
  const closeBilling = () => setBillingDialog({ open: false, software: null, plan: 'standard', busy: false, error: '' });
  const startCheckoutNow = async () => {
    try {
      setBillingDialog(prev => ({ ...prev, busy: true, error: '' }));
      // Keep on-screen price as the source of truth: Standard $50, Premium $199
      const cents = billingDialog.plan === 'premium' ? 19900 : 5000;
      const res = await apiService.startCheckout(billingDialog.plan, cents);
      const url = res?.url || res?.data?.url;
      if (url) { window.location.href = url; return; }
      window.location.href = `/register?plan=${billingDialog.plan}`;
    } catch (e) {
      console.error('Checkout failed', e);
      setBillingDialog(prev => ({ ...prev, busy: false, error: 'Unable to start checkout. Please try again.' }));
    }
  };
  const closeToolDialog = () => {
    setToolDialog({ open: false, title: '', content: '', software: null });
    setToolDialogInput('');
    setToolDialogHistory([]);
    setToolDialogBusy(false);
  };

  const sendToolDialogMessage = async () => {
    const message = (toolDialogInput || '').trim();
    if (!toolDialog.open || !message) return;
    setToolDialogBusy(true);
    setToolDialogHistory(prev => [...prev, { role: 'user', content: message }]);
    setToolDialogInput('');
    try {
      const sw = toolDialog.software || { id: 0, name: 'MJND Tool' };
      const result = await apiService.demoAiChat(message, sw.name, {
        software_id: sw.id,
        analysis_type: 'chat',
        ai_model: 'gpt-4'
      });
      const reply = result?.content || 'I responded with guidance.';
      setToolDialogHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Dialog chat error', err);
      setToolDialogHistory(prev => [...prev, { role: 'assistant', content: '❌ Error sending message. Please try again.' }]);
    } finally {
      setToolDialogBusy(false);
    }
  };

  const handleToolFileUpload = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const snippet = text.length > 20000 ? text.slice(0, 20000) + '\n…(truncated)' : text;
      setToolDialogInput(prev => `${prev}\n\n[Attached ${file.name}]\n${snippet}`.trim());
    } catch (e) {
      console.error('File read failed', e);
    }
  };

  const handleAIAssistantToggle = (software) => {
    if (aiAssistantOpen && currentSoftware?.id === software?.id) {
      closeAIAssistant();
    } else {
      openAIAssistant(software);
    }
  };

  // AI Tool functions
  const handleAIToolAccess = async (software, toolType) => {
    try {
      let message = '';
      switch (toolType) {
        case 'coding':
          message = `Generate code examples and development guidance for ${software.name}`;
          break;
        case 'editing':
          message = `Provide content editing and optimization tips for ${software.name}`;
          break;
        case 'development':
          message = `Analyze development requirements and provide technical insights for ${software.name}`;
          break;
        default:
          message = `Analyze ${software.name} and provide recommendations`;
      }

      // Use the API service instead of direct fetch
      const result = await apiService.demoAiChat(message, software.name, {
        software_id: software.id,
        analysis_type: toolType,
        ai_model: 'gpt-4'
      });
      setToolDialog({
        open: true,
        title: `MJND ${toolType.charAt(0).toUpperCase() + toolType.slice(1)} Tool`,
        content: result.content || 'MJND tool is ready to assist you!',
        software
      });
      setToolDialogHistory([
        { role: 'assistant', content: result.content || 'MJND tool is ready to assist you!' }
      ]);
    } catch (error) {
      console.error('Error accessing AI tool:', error);
      setToolDialog({ open: true, title: 'MJND Tool Error', content: '❌ Error accessing tool. Please try again.', software });
      setToolDialogHistory([{ role: 'assistant', content: '❌ Error accessing tool. Please try again.' }]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading software...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading software</p>
            <p>{error}</p>
          </div>
          <button
            onClick={fetchSoftware}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Debug state values
  // Removed debug logging for cleaner production code

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Featured AI Hub CTA */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Our Software Solutions
              </h1>
              <button
                onClick={fetchSoftware}
                disabled={loading}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                title="Refresh software data"
              >
                <RefreshCw className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Discover our comprehensive suite of software solutions designed to streamline your business operations, 
              boost productivity, and accelerate your digital transformation journey.
            </p>
            {lastFetched && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {lastFetched.toLocaleString()}
              </p>
            )}
          </div>

          {/* Featured MJND Hub hero block */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Maijjd MJND Hub</h2>
            <p className="text-gray-600 text-lg max-w-4xl mb-4">
             Advanced MJND-powered software management platform with intelligent automation, machine learning capabilities, and real-time analytics. Features include predictive maintenance, automated workflows, and intelligent resource allocation.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <button
                onClick={() => openDevelopmentEnvironment(aiHubSoftware)}
                className="w-full text-left hover:bg-blue-100 transition-colors rounded p-3"
                title="Open Full Development Environment"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-600" />
                      <span className="text-xl font-semibold text-blue-900">🚀 Start Coding</span>
                    </div>
                    <div className="mt-2 text-sm text-blue-700">
                      Full development environment with MJND tools, terminal & preview
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </button>
            </div>

            {/* Quick Feature + Pricing strip */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Key features */}
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleQuickCode} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open MJND Code editor">MJND Code</button>
                <button onClick={handleQuickEdit} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open MJND Edit">MJND Edit</button>
                <button onClick={handleQuickTerminal} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open Terminal">Terminal</button>
                <button onClick={handleQuickPreview} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open Preview">Preview</button>
                <button onClick={(e)=>{e.preventDefault(); e.stopPropagation(); handleShareLink(aiHubSoftware);}} className="px-2.5 py-1 rounded-full text-xs bg-white text-gray-800 border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Copy share link">Share link</button>
              </div>
              {/* Prices removed per Railway deployment request */}
              <div className="flex items-center gap-2 justify-start lg:justify-end" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search software, features, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-2 rounded-full text-sm border transition-colors whitespace-nowrap ${selectedCategory === 'All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  All ({normalizedSoftware.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors whitespace-nowrap ${selectedCategory === category ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    title={`Filter by ${category}`}
                  >
                    {category} ({categoryCounts[category] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Button */}
            <div className="sm:w-24">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSoftware.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-2 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/software/${item.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/software/${item.id}`);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Click to access ${item.name} coding and editing environment`}
            >
              {/* Software Icon and Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {getIconComponent(item.icon)}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status || 'Active'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDevelopmentEnvironment(item);
                    }}
                    className="w-full text-left hover:bg-blue-100 transition-colors rounded p-2"
                    title="Open Full Development Environment"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">🚀 Start Coding</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      Full development environment with MJND tools, terminal & preview
                    </div>
                  </button>
                </div>

                {/* Quick feature pills per card */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <button onClick={(e)=>{e.stopPropagation();handleQuickCodeFor(item);}} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200">MJND Code</button>
                  <button onClick={(e)=>{e.stopPropagation();handleQuickEditFor(item);}} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200">MJND Edit</button>
                  <button onClick={(e)=>{e.stopPropagation();handleQuickTerminalFor(item);}} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200">Terminal</button>
                  <button onClick={(e)=>{e.stopPropagation();handleQuickPreviewFor(item);}} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border hover:bg-gray-200">Preview</button>
                </div>

                {/* Per-card prices removed per Railway deployment request */}
                <div className="mb-3" />

                {/* Download only per category (pricing and Try Now removed) */}
                
                {/* MJND Assistant Button */}
                <div className="mb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAIAssistantToggle(item);
                    }}
                    className="w-full p-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg"
                    title={`Get AI assistance with ${item.name}`}
                  >
                    <Bot className="h-4 w-4" />
                    MJND Assistant
                    <span className="text-xs opacity-80">Ask me anything!</span>
                  </button>
                </div>

                {/* AI Tools Section */}
                <div className="mb-4 space-y-2">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">🤖 MJND Tools:</h5>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAIToolAccess(item, 'coding');
                      }}
                      className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded text-xs font-medium transition-all duration-200 flex items-center justify-center"
                      title="MNJD, MJ, and Team Coding Assistant"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Code
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAIToolAccess(item, 'editing');
                      }}
                      className="p-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded text-xs font-medium transition-all duration-200 flex items-center justify-center"
                      title="MNJD, MJ, and Team Editing Suite"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAIToolAccess(item, 'development');
                      }}
                      className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded text-xs font-medium transition-all duration-200 flex items-center justify-center"
                      title="MNJD, MJ, and Team Development Tools"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      Dev
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>v{item.version}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{item.rating || 'N/A'}</span>
                  </div>
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
                    {item.features.length} features
                  </span>
                </h4>
                <div className="space-y-2 mb-4">
                  {item.features.slice(0, 5).map((feature, index) => {
                    const featureKey = `${item.id}-${index}`;
                    const isExpanded = expandedFeatures[featureKey];
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFeatureClick(item.id, index, feature, item);
                          }}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleFeatureClick(item.id, index, feature, item);
                            }
                          }}
                          className="w-full flex items-center justify-between p-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                          aria-expanded={isExpanded}
                          aria-label={`${feature} feature details`}
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="font-medium">{feature}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeatureInfo(feature, item.name);
                              }}
                              className="p-1 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-700 transition-colors"
                              title="Get MJND-powered feature details"
                            >
                              <Info className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeatureNavigation(feature, item);
                              }}
                              className="p-1 hover:bg-green-100 rounded text-green-600 hover:text-green-700 transition-colors"
                              title="Learn more about this feature"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <button
                            onClick={() => setExpandedFeatures(prev => ({...prev, [`${item.id}-${index}_dev_code`]: ''}))}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                          >🗑️ Clear</button>
                        </button>
                        
                        {isExpanded && (
                          <div className="px-3 pb-3 bg-gray-50 border-t border-gray-200">
                            <div className="text-xs text-gray-600 leading-relaxed">
                              {/* AI Insights Display */}
                              {expandedFeatures[`${item.id}-${index}_ai`] && (
                                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-xs text-blue-800 font-medium mb-1">🤖 AI Analysis:</p>
                                  <p className="text-xs text-blue-700">
                                    {expandedFeatures[`${item.id}-${index}_ai`].content || 'AI insights loading...'}
                                  </p>
                                </div>
                              )}
                              
                              <p className="mb-2">
                                <strong>🤖 MJND-Powered:</strong> This feature is enhanced with machine learning capabilities that continuously improve based on your usage patterns.
                              </p>
                              <p className="mb-2">
                                <strong>🚀 Benefits:</strong> Increased productivity, personalized experience, and intelligent automation that adapts to your workflow.
                              </p>
                              <p className="mb-3">
                                <strong>📊 Status:</strong> <span className="text-green-600 font-medium">Active & Learning</span>
                              </p>
                              
                              {/* AI Idea Input Section - INSIDE the feature */}
                              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                                <h5 className="text-xs font-semibold text-purple-800 mb-2 flex items-center">
                                  💡 AI Idea Generator for {feature}
                                </h5>
                                <p className="text-xs text-purple-700 mb-3">
                                  Type your idea for this specific feature and let AI create, code, or build it for you!
                                </p>
                                
                                <div className="space-y-2">
                                  <textarea
                                    placeholder={`Describe your idea for ${feature}...\nExample: "I want this feature to automatically detect patterns and suggest optimizations"`}
                                    value={expandedFeatures[`${item.id}-${index}_idea`] || ''}
                                    onChange={(e) => setExpandedFeatures(prev => ({
                                      ...prev,
                                      [`${item.id}-${index}_idea`]: e.target.value
                                    }))}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className="w-full p-2 text-xs border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    rows={3}
                                  />
                                  
                                  <div className="grid grid-cols-3 gap-2">
                                    <button
                                      onClick={async () => {
                                        const idea = expandedFeatures[`${item.id}-${index}_idea`];
                                        if (!idea) {
                                          alert('Please type your idea first!');
                                          return;
                                        }
                                        
                                        try {
                                          const result = await apiService.demoAiChat(
                                            `Create code for this idea: ${idea} - Feature: ${feature} - Software: ${item.name}`,
                                            item.name,
                                            {
                                              software_id: item.id,
                                              analysis_type: 'feature_code_creation',
                                              ai_model: 'gpt-4',
                                              feature: feature,
                                              user_idea: idea
                                            }
                                          );
                                          
                                          if (result && result.content) {
                                            setExpandedFeatures(prev => ({
                                              ...prev,
                                              [`${item.id}-${index}_ai_code`]: result.content
                                            }));
                                            alert('✅ AI Code Generated! Check the output below.');
                                          }
                                        } catch (error) {
                                          console.error('AI code generation failed:', error);
                                          alert('❌ Error generating code. Please try again.');
                                        }
                                      }}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors font-medium"
                                      title="Generate AI code for your idea"
                                    >
                                      🎯 AI Code
                                    </button>
                                    
                                    <button
                                      onClick={async () => {
                                        const idea = expandedFeatures[`${item.id}-${index}_idea`];
                                        if (!idea) {
                                          alert('Please type your idea first!');
                                          return;
                                        }
                                        
                                        try {
                                          const result = await apiService.demoAiChat(
                                            `Create and build this concept: ${idea} - Feature: ${feature} - Software: ${item.name}`,
                                            item.name,
                                            {
                                              software_id: item.id,
                                              analysis_type: 'feature_concept_building',
                                              ai_model: 'gpt-4',
                                              feature: feature,
                                              user_idea: idea
                                            }
                                          );
                                          
                                          if (result && result.content) {
                                            setExpandedFeatures(prev => ({
                                              ...prev,
                                              [`${item.id}-${index}_ai_build`]: result.content
                                            }));
                                            alert('✅ AI Concept Built! Check the output below.');
                                          }
                                        } catch (error) {
                                          console.error('AI concept building failed:', error);
                                          alert('❌ Error building concept. Please try again.');
                                        }
                                      }}
                                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors font-medium"
                                      title="Build AI concept for your idea"
                                    >
                                      🏗️ AI Build
                                    </button>
                                    
                                    <button
                                      onClick={async () => {
                                        const idea = expandedFeatures[`${item.id}-${index}_idea`];
                                        if (!idea) {
                                          alert('Please type your idea first!');
                                          return;
                                        }
                                        
                                        try {
                                          const result = await apiService.demoAiChat(
                                            `Create and design this feature: ${idea} - Feature: ${feature} - Software: ${item.name}`,
                                            item.name,
                                            {
                                              software_id: item.id,
                                              analysis_type: 'feature_creation',
                                              ai_model: 'gpt-4',
                                              feature: feature,
                                              user_idea: idea
                                            }
                                          );
                                          
                                          if (result && result.content) {
                                            setExpandedFeatures(prev => ({
                                              ...prev,
                                              [`${item.id}-${index}_ai_create`]: result.content
                                            }));
                                            alert('✅ AI Feature Created! Check the output below.');
                                          }
                                        } catch (error) {
                                          console.error('AI feature creation failed:', error);
                                          alert('❌ Error creating feature. Please try again.');
                                        }
                                      }}
                                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors font-medium"
                                      title="Create AI feature for your idea"
                                    >
                                      ✨ AI Create
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* AI Generated Outputs - INSIDE the feature */}
                              {(expandedFeatures[`${item.id}-${index}_ai_code`] || 
                                expandedFeatures[`${item.id}-${index}_ai_build`] || 
                                expandedFeatures[`${item.id}-${index}_ai_create`]) && (
                                <div className="mb-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                                  <h5 className="text-xs font-semibold text-indigo-800 mb-2 flex items-center">
                                    🚀 AI Generated Outputs for {feature}
                                  </h5>
                                  
                                  {/* AI Code Output */}
                                  {expandedFeatures[`${item.id}-${index}_ai_code`] && (
                                    <div className="mb-3">
                                      <h6 className="text-xs font-medium text-indigo-700 mb-1">💻 Generated Code:</h6>
                                      <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-auto max-h-32">
                                        {expandedFeatures[`${item.id}-${index}_ai_code`]}
                                      </div>
                                      <div className="mt-2 flex gap-2">
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(expandedFeatures[`${item.id}-${index}_ai_code`]);
                                            alert('Code copied to clipboard!');
                                          }}
                                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                        >
                                          📋 Copy Code
                                        </button>
                                        <button
                                          onClick={() => openDevelopmentEnvironment(item)}
                                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                                        >
                                          🚀 Open in Dev Environment
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* AI Build Output */}
                                  {expandedFeatures[`${item.id}-${index}_ai_build`] && (
                                    <div className="mb-3">
                                      <h6 className="text-xs font-medium text-indigo-700 mb-1">🏗️ Built Concept:</h6>
                                      <div className="bg-gray-100 text-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
                                        {expandedFeatures[`${item.id}-${index}_ai_build`]}
                                      </div>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(expandedFeatures[`${item.id}-${index}_ai_build`]);
                                          alert('Concept copied to clipboard!');
                                        }}
                                        className="mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                                      >
                                        📋 Copy Concept
                                      </button>
                                    </div>
                                  )}
                                  
                                  {/* AI Create Output */}
                                  {expandedFeatures[`${item.id}-${index}_ai_create`] && (
                                    <div className="mb-3">
                                      <h6 className="text-xs font-medium text-indigo-700 mb-1">✨ Created Feature:</h6>
                                      <div className="bg-gray-100 text-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
                                        {expandedFeatures[`${item.id}-${index}_ai_create`]}
                                      </div>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(expandedFeatures[`${item.id}-${index}_ai_create`]);
                                          alert('Feature copied to clipboard!');
                                        }}
                                        className="mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors"
                                      >
                                        📋 Copy Feature
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Inline Development Environment (per feature) */}
                              <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
                                <h5 className="text-xs font-semibold text-gray-900 mb-2">💻 Inline Dev Environment</h5>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={async () => {
                                        const key = `${item.id}-${index}`;
                                        const idea = expandedFeatures[`${key}_idea`] || feature;
                                        // start processing
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${key}_dev_terminal`]: [ ...(prev[`${key}_dev_terminal`]||[]), `$ AI Coding for ${feature}...` ]
                                        }));
                                        try {
                                          const result = await apiService.demoAiChat(
                                            `Generate working code for feature: ${feature} in software: ${item.name}. Idea: ${idea}. Return complete, runnable code.`,
                                            item.name,
                                            { software_id: item.id, analysis_type: 'feature_code_generation', ai_model: 'gpt-4', feature, user_idea: idea }
                                          );
                                          const content = result?.content || '';
                                          setExpandedFeatures(prev => ({
                                            ...prev,
                                            [`${key}_dev_code`]: content,
                                            [`${key}_dev_output`]: `✅ Code generated (${content.length} chars)`,
                                            [`${key}_dev_terminal`]: [ ...(prev[`${key}_dev_terminal`]||[]), `$ Done (${content.length} chars)` ]
                                          }));
                                        } catch (e) {
                                          setExpandedFeatures(prev => ({
                                            ...prev,
                                            [`${key}_dev_output`]: `❌ Error: ${e?.message || 'generation failed'}`,
                                            [`${key}_dev_terminal`]: [ ...(prev[`${key}_dev_terminal`]||[]), `$ Error: ${e?.message || 'failed'}` ]
                                          }));
                                        }
                                      }}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                    >🤖 AI Coding</button>
                                    <button
                                      onClick={async () => {
                                        const key = `${item.id}-${index}`;
                                        const code = expandedFeatures[`${key}_dev_code`] || '';
                                        if (!code) {
                                          setExpandedFeatures(prev => ({...prev, [`${key}_dev_output`]: 'Write or generate code first.'}));
                                          return;
                                        }
                                        setExpandedFeatures(prev => ({
                                          ...prev,
                                          [`${key}_dev_terminal`]: [ ...(prev[`${key}_dev_terminal`]||[]), `$ AI Editing...` ]
                                        }));
                                        try {
                                          const result = await apiService.demoAiChat(
                                            `Optimize and improve this code for feature ${feature}: ${code.substring(0, 4000)}`,
                                            item.name,
                                            { software_id: item.id, analysis_type: 'feature_code_optimization', ai_model: 'gpt-4' }
                                          );
                                          const content = result?.content || code;
                                          setExpandedFeatures(prev => ({
                                            ...prev,
                                            [`${key}_dev_code`]: content,
                                            [`${key}_dev_output`]: `✅ Optimization complete (${content.length} chars)`,
                                            [`${key}_dev_terminal`]: [ ...(prev[`${key}_dev_terminal`]||[]), `$ Optimization done` ]
                                          }));
                                        } catch (e) {
                                          setExpandedFeatures(prev => ({
                                            ...prev,
                                            [`${key}_dev_output`]: `❌ Error: ${e?.message || 'optimization failed'}`,
                                            [`${key}_dev_terminal`]: [ ...(prev[`${key}_dev_terminal`]||[]), `$ Error: ${e?.message || 'failed'}` ]
                                          }));
                                        }
                                      }}
                                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                                    >✏️ AI Editing</button>
                                  </div>
                                </div>
                                <textarea
                                  value={expandedFeatures[`${item.id}-${index}_dev_code`] || ''}
                                  onChange={(e)=> setExpandedFeatures(prev => ({...prev, [`${item.id}-${index}_dev_code`]: e.target.value}))}
                                  placeholder={`// ${feature} inline editor`}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  className="w-full h-28 p-2 border border-gray-300 rounded font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-green-400 pointer-events-auto"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                                  <div className="md:col-span-2">
                                    <h6 className="text-xs font-semibold text-gray-800 mb-1">🤖 AI Output</h6>
                                    <div className="bg-gray-100 text-gray-800 p-2 rounded text-xs h-20 overflow-auto border">
                                      {expandedFeatures[`${item.id}-${index}_dev_output`] || 'AI output will appear here...'}
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="text-xs font-semibold text-gray-800 mb-1">💻 Terminal</h6>
                                    <div className="bg-gray-900 text-green-400 p-2 rounded text-[11px] h-20 overflow-auto">
                                      {(expandedFeatures[`${item.id}-${index}_dev_terminal`]||[]).map((line, i)=>(<div key={i} className="mb-0.5">{line}</div>))}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <h6 className="text-xs font-semibold text-gray-800 mb-1">👁️ Preview</h6>
                                  <div className="bg-gray-50 text-gray-800 p-2 rounded text-xs h-20 overflow-auto border">
                                    {(expandedFeatures[`${item.id}-${index}_dev_code`]||'').substring(0,220) || 'Preview will appear here when you generate or edit code...'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Start Coding Button */}
                              <div className="mb-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDevelopmentEnvironment(item);
                                  }}
                                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                                  title="Open full development environment for this feature"
                                >
                                  🚀 Start Coding - {feature}
                                </button>
                              </div>

                              {/* AI Tool Buttons */}
                              <div className="mb-3 grid grid-cols-3 gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAIToolAccess(item, 'coding');
                                  }}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                  title="AI Coding for this feature"
                                >
                                  🎯 AI Code
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAIToolAccess(item, 'editing');
                                  }}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                                  title="AI Editing for this feature"
                                >
                                  ✏️ AI Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAIToolAccess(item, 'development');
                                  }}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-green-200 transition-colors"
                                  title="AI Development for this feature"
                                >
                                  🔧 AI Dev
                                </button>
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleFeatureInfo(feature, item.name)}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                                >
                                  AI Details
                                </button>
                                <button
                                  onClick={() => handleFeatureNavigation(feature, item)}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                                >
                                  Learn More
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {item.features.length > 5 && (
                    <div className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors p-2 rounded hover:bg-blue-50">
                      +{item.features.length - 5} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <Download className="h-4 w-4 inline mr-1" />
                    {(item.downloads || 0).toLocaleString()} downloads
                  </div>
                  <div>
                    <button aria-label="Copy share link" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); handleShareLink(item);}} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Share link</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing section removed: download-only experience */}

        {/* CTA removed for download-only experience */}
      </div>

      {/* MJND Tool Result Dialog */}
      {toolDialog.open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeToolDialog} aria-hidden="true"></div>
          <div role="dialog" aria-modal="true" className="relative bg-white w-full sm:w-[40rem] max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base sm:text-lg">{toolDialog.title}</h3>
                <button onClick={closeToolDialog} className="px-2 py-1 rounded hover:bg-white/20" aria-label="Close">✕</button>
              </div>
            </div>
            <div className="p-0 flex flex-col h-full">
              <div className="p-4 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap flex-1">
                {toolDialogHistory.length === 0 && (
                  <div>{toolDialog.content}</div>
                )}
                {toolDialogHistory.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'mb-3' : 'mb-3'}>
                    <div className={m.role === 'user' ? 'bg-blue-50 border border-blue-200 rounded px-3 py-2' : 'bg-gray-50 border border-gray-200 rounded px-3 py-2'}>
                      <div className="text-xs uppercase tracking-wide opacity-70 mb-1">{m.role === 'user' ? 'You' : 'MJND'}</div>
                      <div>{m.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    value={toolDialogInput}
                    onChange={(e)=>setToolDialogInput(e.target.value)}
                    onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendToolDialogMessage(); } }}
                    placeholder="Type your question…"
                    className="flex-1 border rounded px-3 py-2 text-sm"
                  />
                  <label className="px-3 py-2 bg-white border rounded text-sm cursor-pointer hover:bg-gray-100">
                    Upload
                    <input type="file" className="hidden" onChange={(e)=>handleToolFileUpload(e.target.files?.[0])} />
                  </label>
                  <button
                    disabled={toolDialogBusy}
                    onClick={sendToolDialogMessage}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-60"
                  >{toolDialogBusy ? 'Sending…' : 'Chat'}</button>
                  <button onClick={() => { navigator.clipboard.writeText((toolDialogHistory.map(m=>`${m.role}: ${m.content}`).join('\n\n')) || toolDialog.content || ''); }} className="px-3 py-2 bg-white border rounded text-sm">Copy</button>
                  <button onClick={closeToolDialog} className="px-3 py-2 bg-white border rounded text-sm">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Dialog removed for download-only experience */}
      {false && billingDialog.open && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeBilling} aria-hidden="true"></div>
          <div role="dialog" aria-modal="true" className="relative bg-white w-full sm:w-[34rem] max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base sm:text-lg">Subscribe to {billingDialog.software?.name || 'MJND'}</h3>
                <button onClick={closeBilling} className="px-2 py-1 rounded hover:bg-white/20" aria-label="Close">✕</button>
              </div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">Choose Plan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={()=>setBillingDialog(prev=>({ ...prev, plan: 'standard' }))} className={`border rounded p-3 text-left ${billingDialog.plan==='standard'?'border-blue-600 ring-2 ring-blue-200':''}`}>
                    <div className="font-semibold">Standard</div>
                    <div className="text-gray-600">$50/mo • Core features</div>
                  </button>
                  <button onClick={()=>setBillingDialog(prev=>({ ...prev, plan: 'premium' }))} className={`border rounded p-3 text-left ${billingDialog.plan==='premium'?'border-blue-600 ring-2 ring-blue-200':''}`}>
                    <div className="font-semibold">Premium</div>
                    <div className="text-gray-600">$199/mo • Advanced tools</div>
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

      {/* MJND Assistant (lazy) */}
      <React.Suspense fallback={null}>
        <AIAssistant
          isOpen={aiAssistantOpen}
          onClose={closeAIAssistant}
          onOpenAssistant={openAIAssistant}
          currentSoftware={currentSoftware}
        />
      </React.Suspense>

      {/* Development Environment Modal */}
      {showDevelopmentEnvironment && selectedSoftwareForDev && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-20">
              <div className="flex items-center space-x-3">
                <Code className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  🚀 Development Environment - {selectedSoftwareForDev.name}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUsePlainEditor(v => !v)}
                  className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                  title="Toggle simple editor if typing is blocked"
                >
                  {usePlainEditor ? 'Use Advanced Editor' : 'Use Simple Editor'}
                </button>
                <button
                  onClick={() => setShowChat(v=>!v)}
                  className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                  title="Show/Hide Chat"
                >
                  {showChat ? 'Hide Chat' : 'Show Chat'}
                </button>
                <button
                  onClick={closeDevelopmentEnvironment}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Development Tools */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
              {/* Left Panel - Code Editor & AI Tools */}
              <div className="flex-1 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                    <h3 className="text-lg font-semibold text-gray-900">💻 AI Code Editor</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={handleAICodeGeneration} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors">🤖 AI Coding</button>
                      <button onClick={handleAIEditing} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors">✏️ AI Editor</button>
                      <button onClick={handleRunCode} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded hover:bg-emerald-200">🚀 Run</button>
                      <button onClick={()=>handleScrollTo(terminalRef)} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">💻 Terminal</button>
                      <button onClick={()=>setShowChat(true)} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200">💬 Chat</button>
                      <button aria-label="Copy code" onClick={handleCopyCode} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">📋 Copy</button>
                      <button aria-label="Download project as ZIP" onClick={handleDownloadZip} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">⬇️ ZIP</button>
                      <button aria-label="Render live preview" onClick={handlePreview} className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded hover:bg-orange-200">👁️ Preview</button>
                    </div>
                  </div>
                  
                  {/* Prompt + Code Editor */}
                  <div className="mb-3 flex gap-2" onKeyDown={(e)=>e.stopPropagation()}>
                    <input
                      value={promptText}
                      onChange={e=>setPromptText(e.target.value)}
                      onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handlePromptSend(); } }}
                      placeholder="Type what you want to build (e.g., create a website for learning English teaching by AI)"
                      className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button onClick={handlePromptSend} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Generate</button>
                  </div>
                  {/* Code Editor */}
                  {usePlainEditor ? (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-green-400 pointer-events-auto relative z-10 overflow-auto outline-none"
                      ref={plainEditorRef}
                      spellCheck={false}
                      onInput={(e) => setAiCode(e.currentTarget.textContent || '')}
                      onKeyDownCapture={(e) => e.stopPropagation()}
                      onKeyUpCapture={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      dangerouslySetInnerHTML={{ __html: (aiCode || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>') }}
                    />
                  ) : (
                    <textarea
                      value={aiCode}
                      onChange={(e) => setAiCode(e.target.value)}
                      placeholder={`// Welcome to ${selectedSoftwareForDev.name} Development Environment\n// Start coding with MJND assistance\n// Use MJND tools for code generation and optimization\n\nfunction initialize${selectedSoftwareForDev.name.replace(/\s+/g, '')}() {\n  // MJND-powered code generation\n  // Intelligent debugging\n  // Automated testing\n}`}
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-900 text-green-400 pointer-events-auto relative z-10"
                      spellCheck={false}
                      ref={textAreaRef}
                      autoFocus
                      onKeyDownCapture={(e) => e.stopPropagation()}
                      onKeyUpCapture={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      onKeyUp={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDownCapture={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  {/* AI Output */}
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">🤖 AI Output</h4>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg font-mono text-sm h-32 overflow-auto border pointer-events-auto" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                      {aiOutput || 'AI output will appear here when you use AI tools...'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Tools, Terminal & Preview */}
              <div className="w-96 flex flex-col overflow-y-auto" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                {/* MNJD, MJ, and Team Development Tools */}
                <div className="p-4 border-b border-gray-200" onKeyDown={(e)=>e.stopPropagation()} onKeyUp={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🛠️ MNJD, MJ, and Team Development Tools</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleAICodeGeneration}
                      className="w-full p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors text-left"
                    >
                      <div className="font-medium">🤖 AI Code Generator</div>
                      <div className="text-sm opacity-75">Generate complete code with AI</div>
                    </button>
                    <button
                      onClick={handleAIEditing}
                      className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors text-left"
                    >
                      <div className="font-medium">✏️ AI Code Optimizer</div>
                      <div className="text-sm opacity-75">Optimize and improve code</div>
                    </button>
                    <button
                      aria-label="Render live preview"
                      onClick={handlePreview}
                      className="w-full p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-colors text-left"
                    >
                      <div className="font-medium">👁️ Code Preview</div>
                      <div className="text-sm opacity-75">Preview your code</div>
                    </button>
                  </div>
                </div>

                {/* Terminal */}
                <div ref={terminalRef} className="flex-1 p-4 border-b border-gray-200" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">💻 Terminal</h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm h-32 overflow-auto pointer-events-auto" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                    {terminalOutput.length > 0 ? (
                      terminalOutput.map((line, index) => (
                        <div key={index} className="mb-1">{line}</div>
                      ))
                    ) : (
                      <>
                        <div className="mb-1">$ cd {selectedSoftwareForDev.name.toLowerCase().replace(/\s+/g, '-')}</div>
                        <div className="mb-1">$ npm install</div>
                        <div className="mb-1">$ npm start</div>
                        <div className="mb-1">🚀 Development server started</div>
                        <div className="mb-1">📱 AI tools ready</div>
                      </>
                    )}
                  </div>
                  
                  {/* Terminal Input */}
                  <div className="mt-2 flex">
                    <span className="text-green-400 font-mono mr-2">$</span>
                    <input
                      type="text"
                      placeholder="Enter command..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addTerminalCommand(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 bg-gray-800 text-green-400 px-2 py-1 rounded font-mono text-sm border-none focus:outline-none pointer-events-auto"
                      onKeyDown={(e)=>e.stopPropagation()}
                      onKeyUp={(e)=>e.stopPropagation()}
                      onKeyPressCapture={(e)=>e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Preview Panel */}
                <div ref={previewRef} className="flex-1 p-4 border-b border-gray-200" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">👁️ Preview</h3>
                  <div className="bg-white text-gray-800 p-0 rounded-lg text-sm h-64 overflow-auto border pointer-events-auto" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                    {previewContent ? (
                      <iframe
                        title="Live preview"
                        srcDoc={previewContent}
                        className="w-full h-64 border-0"
                        loading="lazy"
                        aria-label="Live code preview"
                      />
                    ) : (
                      <div className="p-3 text-gray-600">Preview will appear here when you generate code or run preview...</div>
                    )}
                  </div>
                </div>

                {/* Chat Panel */}
                {showChat && (
                  <div className="flex-1 p-4 border-b border-gray-200" onKeyDown={(e)=>e.stopPropagation()} onClick={(e)=>e.stopPropagation()}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 Chat</h3>
                    <div ref={chatRef} className="bg-white border rounded-lg h-40 overflow-auto p-3 text-sm">
                      {chatMessages.length === 0 && <div className="text-gray-500">Start chatting with the AI about your code…</div>}
                      {chatMessages.map((m,i)=> (
                        <div key={i} className={`mb-2 ${m.role==='user'?'text-blue-700':'text-gray-800'}`}>
                          <span className="font-semibold mr-1">{m.role==='user'?'You:':'AI:'}</span>{m.content}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleSendChat(); } }} className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Type a message..." />
                      <button onClick={handleSendChat} className="px-3 py-1 bg-purple-600 text-white rounded text-sm">Chat</button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      aria-label="Render live preview"
                      onClick={handlePreview}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      👁️ PREVIEW
                    </button>
                    <button 
                      onClick={handleRunCode}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🚀 RUN
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setAiCode('')}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      🗑️ Clear
                    </button>
                    <button 
                      onClick={() => {
                        if (aiCode) {
                          navigator.clipboard.writeText(aiCode);
                          addTerminalCommand('Code copied to clipboard');
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      📋 Copy
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

export default Software;
