import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import apiService from '../services/api';

const AIChatWidget = ({ isOpen, onClose, onToggle, software }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [aiModel, setAiModel] = useState('gpt-4');
  const [chatHistory, setChatHistory] = useState([]);
  const [answerMode, setAnswerMode] = useState('guidance'); // 'guidance' | 'code'
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationGoalRef = useRef(null);
  const stepCounterRef = useRef(0);

  // Initialize with welcome message and setup
  useEffect(() => {
    if (isOpen) {
      initializeChat();
      loadChatHistory();
    }
  }, [isOpen, software]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat-only mode: no call, no voice auto behavior

  // Initialize chat with welcome message
  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `Hello! I'm your MJND assistant for ${software?.name || 'Maijjd Software'}. I can help you with:

🤖 **MJND-Powered Support**
• Getting started and tutorials
• Feature explanations and best practices
• Troubleshooting and problem resolution
• Integration and customization help

🎯 **Voice & Chat Support**
• Text chat for detailed questions
• Voice calls for hands-free assistance
• Natural language processing
• Multi-language support

How can I help you today?`,
      timestamp: new Date().toISOString(),
      metadata: {
        aiModel: aiModel,
        confidence: 0.95,
        responseTime: 'instant'
      }
    };
    setMessages([welcomeMessage]);
    generateSuggestions();
  };

  // Voice recognition disabled in chat-only mode

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem('maijjd_chat_history');
      if (saved) {
        const history = JSON.parse(saved);
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Derive a proactive follow-up to keep the call progressing toward a goal
  const buildFollowUpPrompt = (lastAssistantText) => {
    const text = (lastAssistantText || '').toLowerCase();
    if (text.includes('feature') || text.includes('tutorial') || text.includes('support')) {
      return 'Would you like me to take action now? For example, say: "Generate complete project", or tell me the exact goal and I will continue until it is done.';
    }
    if (text.includes('create') || text.includes('build') || text.includes('generate')) {
      return 'Shall I proceed to generate the full project now? You can specify framework, name, and key features. I will continue step-by-step until complete.';
    }
    return 'How would you like to proceed? You can say your goal (e.g., "Create a React app for learning English") and I will keep going until it is finished.';
  };

  // Save chat history to localStorage
  const saveChatHistory = (newMessage) => {
    try {
      const updatedHistory = [...chatHistory, newMessage].slice(-50); // Keep last 50 messages
      setChatHistory(updatedHistory);
      localStorage.setItem('maijjd_chat_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Generate contextual suggestions
  const generateSuggestions = () => {
    const baseSuggestions = [
      'How do I get started?',
      'What are the main features?',
      'How do I configure settings?',
      'Can you show me examples?',
      'What are best practices?',
      'How do I integrate with other tools?',
      'What are the system requirements?',
      'How do I get support?'
    ];

    const softwareSpecificSuggestions = {
      'Maijjd AI Hub': [
        'How do I set up AI models?',
        'How do I create automation workflows?',
        'How do I monitor AI performance?',
        'How do I integrate with external AI services?'
      ],
      'Maijjd CRM Pro': [
        'How do I manage customer data?',
        'How do I create sales pipelines?',
        'How do I generate reports?',
        'How do I set up email marketing?'
      ],
      'Maijjd Analytics Suite': [
        'How do I create dashboards?',
        'How do I import data sources?',
        'How do I set up alerts?',
        'How do I create custom reports?'
      ]
    };

    const specificSuggestions = softwareSpecificSuggestions[software?.name] || [];
    setSuggestions([...baseSuggestions, ...specificSuggestions].slice(0, 8));
  };

  // Process user message and generate AI response
  const processMessage = async (message) => {
    // Normalize short affirmations into actionable follow-ups
    const normalizeAffirmativeFollowUp = (raw) => {
      const t = (raw || '').trim().toLowerCase();
      const affirmations = ['yes','yep','yeah','ok','okay','sure','please','continue','go ahead','start','let\'s start','let us start'];
      const isAffirm = affirmations.some(a => t === a || t.startsWith(a));
      if (!isAffirm) return raw;
      const lastAssistant = [...messages].reverse().find(m => m.type === 'assistant' && typeof m.content === 'string');
      if (lastAssistant && lastAssistant.content.includes('Quick Start Process')) {
        return 'Please start Step 1: Access. Give me the exact navigation path in the app (menu and page), what to click, and what I should see. Then wait for my confirmation before Step 2.';
      }
      return 'Please proceed with the next step with specific, actionable instructions, and wait for my confirmation before continuing.';
    };

    const outgoing = normalizeAffirmativeFollowUp(message);
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: outgoing,
      timestamp: new Date().toISOString(),
      metadata: {
        inputMethod: 'text',
        software: software?.name
      }
    };

    setMessages(prev => [...prev, userMessage]);
    saveChatHistory(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      // No autopilot in chat-only mode

      // Send to AI backend for processing
      const aiResponse = await getAIResponse(outgoing, software);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        metadata: {
          aiModel: aiResponse.model || aiModel,
          confidence: aiResponse.confidence || 0.9,
          responseTime: aiResponse.responseTime || '2s',
          suggestions: aiResponse.suggestions || []
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      saveChatHistory(assistantMessage);

      // Update suggestions if AI provides new ones
      if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
        setSuggestions(aiResponse.suggestions);
      }

      // Mark as not yet spoken; a separate effect will speak latest assistant replies during calls
      // assistantMessage.metadata.spoken will be set there to avoid repeats

    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString(),
        metadata: {
          error: true,
          errorType: error.message
        }
      };
      setMessages(prev => [...prev, errorMessage]);
      saveChatHistory(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  // Get AI response from backend
  const getAIResponse = async (message, software) => {
    try {
      // Use the new aiChat method that automatically handles authentication
      const response = await apiService.aiChat(message, software?.name, {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: Date.now().toString(),
        aiModel: aiModel,
        mode: answerMode
      });

      return response.data || response;
    } catch (error) {
      console.error('AI Chat error:', error);
      // Fallback to local AI processing if backend fails
      return {
        content: generateFallbackResponse(message, software),
        model: 'local-fallback',
        confidence: 0.8,
        responseTime: '1s'
      };
    }
  };

  // Generate fallback response if AI backend is unavailable
  const generateFallbackResponse = (message, software) => {
    const lowerMessage = message.toLowerCase();
    const softwareName = software?.name || 'this software';

    if (answerMode === 'code') {
      if (lowerMessage.includes('react')) {
        return `// React component example\nexport default function Example(){\n  return <div>Hello from ${softwareName}</div>;\n}`;
      }
      if (lowerMessage.includes('python')) {
        return `# Python example\nprint('Hello from ${softwareName}')`;
      }
      return `// Code example\nconsole.log('Hello from ${softwareName}');`;
    }

    if (lowerMessage.includes('get started') || lowerMessage.includes('start')) {
      return `Let me help you get started with ${softwareName}! 

**Quick Start Guide:**
1. **Access**: Navigate to the main dashboard
2. **Setup**: Complete the initial configuration wizard
3. **Explore**: Try the interactive tutorial mode
4. **Customize**: Adjust settings to match your preferences
5. **Practice**: Use the demo data to familiarize yourself

Would you like me to walk you through any specific step in detail?`;
    }

    if (lowerMessage.includes('feature') || lowerMessage.includes('capability')) {
      return `${softwareName} offers powerful capabilities designed to enhance your productivity:

**Core Features:**
• Intelligent automation and workflows
• Advanced analytics and reporting
• Secure data management
• Multi-platform integration
• Real-time collaboration tools

**AI-Powered Capabilities:**
• Smart suggestions and recommendations
• Predictive analytics and insights
• Automated problem detection
• Natural language processing
• Intelligent workflow optimization

Which specific feature would you like to explore further?`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return `I'm here to provide comprehensive support for ${softwareName}!

**How I Can Help:**
• **Tutorials**: Step-by-step guides for all features
• **Troubleshooting**: Quick solutions to common issues
• **Best Practices**: Optimization tips and recommendations
• **Integration**: Help with connecting other tools
• **Customization**: Tailoring the software to your needs

**Support Options:**
• **24/7 AI Assistant**: That's me! Always available
• **Documentation**: Comprehensive guides and references
• **Community**: Connect with other users
• **Direct Support**: Escalate to human experts when needed

What specific help do you need today?`;
    }

    // Default response
    return `Thank you for your question about "${message}" and ${softwareName}. 

I'm here to provide intelligent, AI-powered assistance. While I'm processing your request, here are some ways I can help:

**Immediate Assistance:**
• Feature explanations and tutorials
• Configuration and setup guidance
• Troubleshooting and problem resolution
• Best practices and optimization tips

**Advanced Support:**
• Integration and customization help
• Performance optimization
• Security and compliance guidance
• Training and onboarding support

Could you provide more details about what you'd like to know? I'm here to help make your experience with ${softwareName} as smooth and productive as possible.`;
  };

  // No TTS or call in chat-only mode

  // Add system message
  const addSystemMessage = (content) => {
    const systemMessage = {
      id: Date.now(),
      type: 'system',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  // No auto-follow ups in chat-only mode

  // AutoPilot: if there is a defined goal and user stays silent, advance to next step automatically
  // No autopilot in chat-only mode

  // Speak latest assistant message automatically during active calls
  // No TTS loop in chat-only mode

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

  // Format call duration
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:right-4 sm:left-auto z-50 w-full sm:w-96 max-h-[70vh] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg">MJND Assistant</h3>
            <p className="text-xs sm:text-sm text-blue-100">
              {software?.name || 'Maijjd Software'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2 mr-2">
            <label className="text-xs text-white/80">Answer:</label>
            <select
              value={answerMode}
              onChange={(e)=>setAnswerMode(e.target.value)}
              className="text-xs bg-white/10 border border-white/20 text-white rounded px-2 py-1 focus:outline-none"
              title="Answer type"
            >
              <option value="guidance">Guidance</option>
              <option value="code">Code</option>
            </select>
          </div>
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
          {/* Chat-only: no call controls */}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                  {message.metadata && (
                    <div className="text-xs mt-1 opacity-70">
                      {message.metadata.aiModel && `MJND: ${message.metadata.aiModel}`}
                      {message.metadata.confidence && ` • ${Math.round(message.metadata.confidence * 100)}% confidence`}
                      {message.metadata.responseTime && ` • ${message.metadata.responseTime}`}
                    </div>
                  )}
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
                    <span className="text-sm text-gray-600">Thinking...</span>
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
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              
              {/* No voice buttons in chat-only mode */}
              
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Voice status indicator */}
            {false && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak now</span>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default AIChatWidget;
