import React, { useState } from 'react';
import { Bot, HelpCircle, Lightbulb } from 'lucide-react';

const AIAssistantButton = ({ onOpenAssistant, currentSoftware }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onOpenAssistant) {
      onOpenAssistant(currentSoftware);
    }
  };

  const getTooltipText = () => {
    if (currentSoftware) {
      return `Get AI assistance with ${currentSoftware.name}`;
    }
    return 'Get AI assistance with any software';
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div
        className="fixed bottom-6 right-6 z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handleClick}
          className={`
            group relative flex items-center justify-center w-16 h-16 
            bg-gradient-to-r from-blue-600 to-purple-600 
            text-white rounded-full shadow-2xl 
            hover:shadow-blue-500/50 hover:scale-110 
            transition-all duration-300 ease-in-out
            ${isHovered ? 'ring-4 ring-blue-300' : ''}
          `}
          title={getTooltipText()}
        >
          {/* Main icon */}
          <Bot className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        </button>



        {/* Software indicator */}
        {currentSoftware && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            <span className="font-semibold">AI</span>
          </div>
        )}
      </div>

      {/* Quick help indicators */}
      <div className="fixed bottom-6 left-6 z-40 space-y-3">
        {/* Help button */}
        <button
          className="group relative flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Quick Help"
          onClick={() => {
            // Show quick help modal or navigate to help page
            console.log('Quick help clicked');
          }}
        >
          <HelpCircle className="h-6 w-6" />
        </button>

        {/* Tips button */}
        <button
          className="group relative flex items-center justify-center w-12 h-12 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Pro Tips"
          onClick={() => {
            // Show tips modal
            console.log('Pro tips clicked');
          }}
        >
          <Lightbulb className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};

export default AIAssistantButton;
