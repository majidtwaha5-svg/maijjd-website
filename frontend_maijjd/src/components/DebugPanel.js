import React from 'react';

const DebugPanel = ({ 
  showDevelopmentEnvironment, 
  selectedSoftwareForDev, 
  showAITool, 
  selectedService 
}) => {
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg z-[10000] text-xs max-w-xs">
      <h3 className="font-bold mb-2">🔍 Debug Panel</h3>
      <div className="space-y-1">
        <div>showDevelopmentEnvironment: {showDevelopmentEnvironment ? '✅ true' : '❌ false'}</div>
        <div>selectedSoftwareForDev: {selectedSoftwareForDev ? '✅ set' : '❌ null'}</div>
        <div>showAITool: {showAITool ? '✅ true' : '❌ false'}</div>
        <div>selectedService: {selectedService ? '✅ set' : '❌ null'}</div>
        {selectedSoftwareForDev && (
          <div className="mt-2 p-2 bg-gray-800 rounded">
            <div>ID: {selectedSoftwareForDev.id}</div>
            <div>Name: {selectedSoftwareForDev.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;
