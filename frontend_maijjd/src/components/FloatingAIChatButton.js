import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, MessageCircle, Phone, Mic, Settings, Sparkles, Zap, HelpCircle } from 'lucide-react';
import AIChatWidget from './AIChatWidget';

const FloatingAIChatButton = ({ 
  position = 'bottom-right',
  theme = 'default',
  software = null,
  showNotifications = true,
  autoHide = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  const buttonRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && !isOpen && !isHovered) {
      hideTimeoutRef.current = setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.opacity = '0.3';
          buttonRef.current.style.transform = 'scale(0.8)';
        }
      }, 5000);
    } else {
      if (buttonRef.current) {
        buttonRef.current.style.opacity = '1';
        buttonRef.current.style.transform = 'scale(1)';
      }
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [autoHide, isOpen, isHovered]);

  // Simulate typing indicator for demo
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const typingInterval = setInterval(() => {
        setIsTyping(prev => !prev);
      }, 2000);
      
      return () => clearInterval(typingInterval);
    }
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
    setLastInteraction(Date.now());
    setNotificationCount(0);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setLastInteraction(Date.now());
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    setLastInteraction(Date.now());
  };

  // Position classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'center-right':
        return 'top-1/2 right-6 transform -translate-y-1/2';
      case 'center-left':
        return 'top-1/2 left-6 transform -translate-y-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  // Theme-based styling
  const getThemeClasses = () => {
    switch (theme) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600';
      case 'dark':
        return 'bg-gray-800 hover:bg-gray-700';
      case 'light':
        return 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-300';
      case 'neon':
        return 'bg-black border-2 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-400/50';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600';
    }
  };

  const getIconColor = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-800';
      case 'neon':
        return 'text-cyan-400';
      default:
        return 'text-white';
    }
  };

  return (
    <>
      {/* Enhanced Floating AI Chat Button */}
      <div 
        ref={buttonRef}
        className={`fixed ${getPositionClasses()} z-50 transition-all duration-500 ease-in-out ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={toggleChat}
          className={`
            group relative ${getThemeClasses()} p-4 rounded-full shadow-2xl 
            hover:shadow-3xl transition-all duration-300 transform hover:scale-110 
            hover:rotate-3 focus:outline-none focus:ring-4 focus:ring-blue-300/50
            ${theme === 'light' ? 'hover:shadow-blue-200' : ''}
            ${theme === 'neon' ? 'hover:shadow-cyan-400/50' : ''}
          `}
          title="MJND Assistant - Get help anytime!"
        >
          {/* Main Icon */}
          <Bot className={`h-6 w-6 ${getIconColor()}`} />
          
          {/* Pulse animation */}
          <div className={`absolute inset-0 rounded-full ${theme === 'light' ? 'bg-blue-400' : 'bg-white'} animate-ping opacity-20`}></div>
          
          {/* Enhanced notification badge */}
          {showNotifications && notificationCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
              <span className="text-xs font-bold">{notificationCount > 99 ? '99+' : notificationCount}</span>
            </div>
          )}
          
          {/* AI indicator */}
          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            <Sparkles className="h-3 w-3" />
          </div>
          
          {/* Enhanced hover tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="h-4 w-4 text-blue-400" />
              <span className="font-semibold">MJND Assistant</span>
              <Zap className="h-3 w-3 text-yellow-400" />
            </div>
            <div className="text-xs text-gray-300 mb-2">
              {software ? `Get help with ${software.name}` : 'Get instant help and support'}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <HelpCircle className="h-3 w-3" />
              <span>Click to start chatting</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
          
          {/* Typing indicator when chat is open */}
          {isOpen && isTyping && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs">AI is typing...</span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* AI Chat Widget */}
      {isOpen && (
        <AIChatWidget
          isOpen={isOpen}
          onClose={closeChat}
          onToggle={toggleMinimize}
          software={software}
        />
      )}

      {/* Enhanced Quick Actions Menu (when minimized) */}
      {isOpen && isMinimized && (
        <div className={`fixed ${getPositionClasses()} z-50`}>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 space-y-3 min-w-[200px]">
            <div className="text-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Quick Actions</h3>
              <p className="text-xs text-gray-500">Choose your preferred way to interact</p>
            </div>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              title="Open chat"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium">Open Chat</span>
                <p className="text-xs text-gray-500">Continue conversation</p>
              </div>
            </button>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-green-50 rounded-lg transition-all duration-200 group"
              title="Start voice call"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium">Voice Call</span>
                <p className="text-xs text-gray-500">Hands-free assistance</p>
              </div>
            </button>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
              title="Voice input"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Mic className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium">Voice Input</span>
                <p className="text-xs text-gray-500">Speak your questions</p>
              </div>
            </button>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
              title="Settings"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <span className="text-sm font-medium">Settings</span>
                <p className="text-xs text-gray-500">Customize experience</p>
              </div>
            </button>
            
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={closeChat}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <X className="h-4 w-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChatButton;
