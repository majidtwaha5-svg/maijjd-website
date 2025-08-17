import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const AIAssistant = ({ software, isOpen, onClose, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (software) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `Hello! I'm your AI assistant for ${software.name}. I can help you with:
        
• Getting started with ${software.name}
• Understanding features and capabilities
• Troubleshooting common issues
• Best practices and optimization
• Integration with other tools
• Custom development needs

How can I help you today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      generateSuggestions(software);
    }
  }, [software]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate contextual suggestions based on software
  const generateSuggestions = (software) => {
    const baseSuggestions = [
      'How do I get started?',
      'What are the main features?',
      'How do I configure settings?',
      'Can you show me examples?',
      'What are best practices?'
    ];

    const softwareSpecificSuggestions = {
      'Maijjd CRM Suite': [
        'How do I manage contacts?',
        'How do I create sales pipelines?',
        'How do I generate reports?',
        'How do I set up email marketing?'
      ],
      'DataFlow Analytics': [
        'How do I create dashboards?',
        'How do I import data?',
        'How do I create custom reports?',
        'How do I set up alerts?'
      ],
      'SecureGate Firewall': [
        'How do I configure security rules?',
        'How do I monitor threats?',
        'How do I set up VPN?',
        'How do I generate security reports?'
      ],
      'CloudSync Pro': [
        'How do I sync files?',
        'How do I manage storage?',
        'How do I share files?',
        'How do I set up backups?'
      ],
      'MobileDev Studio': [
        'How do I create a new project?',
        'How do I test on devices?',
        'How do I deploy apps?',
        'How do I use the visual editor?'
      ],
      'WebFlow Builder': [
        'How do I create a new website?',
        'How do I customize templates?',
        'How do I optimize for SEO?',
        'How do I publish my site?'
      ],
      'ServerManager Pro': [
        'How do I monitor servers?',
        'How do I set up alerts?',
        'How do I manage backups?',
        'How do I configure monitoring?'
      ],
      'DevOps Pipeline': [
        'How do I set up CI/CD?',
        'How do I configure testing?',
        'How do I manage deployments?',
        'How do I monitor pipelines?'
      ]
    };

    const specificSuggestions = softwareSpecificSuggestions[software?.name] || [];
    setSuggestions([...baseSuggestions, ...specificSuggestions].slice(0, 8));
  };

  // Process user message and generate AI response
  const processMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate intelligent response based on message content and software context
      const aiResponse = generateAIResponse(message, software);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate intelligent AI responses
  const generateAIResponse = (message, software) => {
    const lowerMessage = message.toLowerCase();
    const softwareName = software?.name || 'this software';

    // Software-specific responses
    if (lowerMessage.includes('get started') || lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      return `Great! Let's get you started with ${softwareName}. Here's a step-by-step guide:

1. **Installation**: ${softwareName} is ready to use - no installation required!
2. **First Steps**: Navigate to the main dashboard and explore the interface
3. **Quick Setup**: Configure your preferences in the settings panel
4. **Tutorial**: Use the built-in tutorial mode for guided learning
5. **Support**: I'm here 24/7 to help with any questions

Would you like me to walk you through any specific feature or setting?`;
    }

    if (lowerMessage.includes('feature') || lowerMessage.includes('capability') || lowerMessage.includes('what can')) {
      return `${softwareName} offers powerful capabilities including:

${software.features?.slice(0, 6).map(feature => `• ${feature}`).join('\n')}

${software.features?.length > 6 ? `\n...and ${software.features.length - 6} more features!` : ''}

Each feature is designed to enhance your productivity and workflow. Which specific feature would you like to learn more about?`;
    }

    if (lowerMessage.includes('configure') || lowerMessage.includes('setting') || lowerMessage.includes('setup')) {
      return `Configuring ${softwareName} is straightforward:

**Basic Configuration:**
• Access settings via the gear icon (⚙️) in the top right
• Customize your dashboard layout and preferences
• Set up user roles and permissions
• Configure integrations with other tools

**Advanced Settings:**
• API configuration for developers
• Custom workflows and automation
• Performance tuning options
• Security and compliance settings

Would you like me to guide you through any specific configuration?`;
    }

    if (lowerMessage.includes('example') || lowerMessage.includes('demo') || lowerMessage.includes('show me')) {
      return `Here are some practical examples of how to use ${softwareName}:

**Common Use Cases:**
• Creating your first project or workspace
• Setting up user management and collaboration
• Configuring automated workflows
• Generating reports and analytics
• Integrating with external services

**Real-world Scenarios:**
• Team collaboration on complex projects
• Data analysis and visualization
• Security monitoring and threat response
• Performance optimization and scaling

Would you like me to demonstrate any specific scenario?`;
    }

    if (lowerMessage.includes('best practice') || lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      return `Here are the best practices for using ${softwareName} effectively:

**Performance Optimization:**
• Regular data cleanup and maintenance
• Efficient workflow design
• Proper resource allocation
• Regular backups and updates

**Security Best Practices:**
• Use strong authentication methods
• Regular security audits
• Keep software updated
• Monitor access logs

**Collaboration Best Practices:**
• Clear role definitions
• Consistent naming conventions
• Regular team training
• Documentation maintenance

Would you like me to elaborate on any of these areas?`;
    }

    if (lowerMessage.includes('troubleshoot') || lowerMessage.includes('problem') || lowerMessage.includes('error') || lowerMessage.includes('issue')) {
      return `I'm here to help troubleshoot any issues with ${softwareName}. Let me guide you:

**Common Issues & Solutions:**
• **Performance Issues**: Check system resources and clear cache
• **Connection Problems**: Verify network settings and firewall rules
• **Data Sync Issues**: Check integration settings and permissions
• **User Access Problems**: Verify role assignments and permissions

**Troubleshooting Steps:**
1. Check the status dashboard for system alerts
2. Review recent activity logs
3. Verify your configuration settings
4. Test with a simple operation

Can you describe the specific issue you're experiencing? I'll provide targeted solutions.`;
    }

    if (lowerMessage.includes('integration') || lowerMessage.includes('connect') || lowerMessage.includes('api')) {
      return `${softwareName} offers powerful integration capabilities:

**Built-in Integrations:**
• Popular development tools and platforms
• Cloud services (AWS, Azure, Google Cloud)
• Communication tools (Slack, Teams, Discord)
• Project management platforms

**API Access:**
• RESTful API for custom integrations
• Webhook support for real-time updates
• SDKs for popular programming languages
• Comprehensive API documentation

**Custom Integrations:**
• Custom connector development
• Third-party service integration
• Data import/export tools
• Workflow automation

Would you like me to help you set up any specific integration?`;
    }

    // Default response for unrecognized queries
    return `I understand you're asking about "${message}" in relation to ${softwareName}. 

Let me provide some helpful information:

**General Guidance:**
• ${softwareName} is designed to be intuitive and user-friendly
• Most features can be accessed through the main navigation
• Context-sensitive help is available throughout the interface
• I'm here to provide personalized assistance

**What I Can Help With:**
• Feature explanations and tutorials
• Configuration and setup guidance
• Troubleshooting and problem resolution
• Best practices and optimization tips
• Integration and customization help

Could you rephrase your question or let me know what specific aspect you'd like to learn about?`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      processMessage(inputValue.trim());
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    processMessage(suggestion);
  };

  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-semibold text-lg">MJND Assistant</h3>
            <p className="text-sm text-blue-100">
              {software?.name || 'Software Support'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 pb-3">
              <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about this software..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
