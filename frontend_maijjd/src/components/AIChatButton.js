import React, { useState } from 'react';
import { Bot, X, MessageCircle, Phone, Mic, Settings } from 'lucide-react';
import AIChatWidget from './AIChatWidget';

const AIChatButton = ({ software, position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Position classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'center-right':
        return 'top-1/2 right-4 transform -translate-y-1/2';
      case 'center-left':
        return 'top-1/2 left-4 transform -translate-y-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      <div className={`fixed ${getPositionClasses()} z-40`}>
        <button
          onClick={toggleChat}
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-3"
          title="MJND Assistant - Get help anytime!"
        >
          <Bot className="h-6 w-6" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          
          {/* Notification badge */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            <span className="text-xs font-bold">AI</span>
          </div>
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>MJND Assistant</span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {software ? `Get help with ${software.name}` : 'Get instant help and support'}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
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

      {/* Quick Actions Menu (when minimized) */}
      {isOpen && isMinimized && (
        <div className={`fixed ${getPositionClasses()} z-50`}>
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 space-y-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Open chat"
            >
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Open Chat</span>
            </button>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
              title="Start voice call"
            >
              <Phone className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Voice Call</span>
            </button>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
              title="Voice input"
            >
              <Mic className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Voice Input</span>
            </button>
            
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatButton;
