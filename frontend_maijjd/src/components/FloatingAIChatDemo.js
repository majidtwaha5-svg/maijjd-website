import React, { useState } from 'react';
import FloatingAIChatButton from './FloatingAIChatButton';

const FloatingAIChatDemo = () => {
  const [activeDemos, setActiveDemos] = useState({
    'bottom-right': true,
    'bottom-left': false,
    'top-right': false,
    'top-left': false,
    'center-right': false,
    'center-left': false
  });

  const [themes, setThemes] = useState({
    'bottom-right': 'gradient',
    'bottom-left': 'dark',
    'top-right': 'light',
    'top-left': 'neon',
    'center-right': 'default',
    'center-left': 'gradient'
  });

  const toggleDemo = (position) => {
    setActiveDemos(prev => ({
      ...prev,
      [position]: !prev[position]
    }));
  };

  const changeTheme = (position, theme) => {
    setThemes(prev => ({
      ...prev,
      [position]: theme
    }));
  };

  const demoConfigs = [
    {
      position: 'bottom-right',
      title: 'Bottom Right (Default)',
      description: 'Standard position with gradient theme',
      defaultTheme: 'gradient'
    },
    {
      position: 'bottom-left',
      title: 'Bottom Left',
      description: 'Dark theme with professional look',
      defaultTheme: 'dark'
    },
    {
      position: 'top-right',
      title: 'Top Right',
      description: 'Light theme for subtle appearance',
      defaultTheme: 'light'
    },
    {
      position: 'top-left',
      title: 'Top Left',
      description: 'Neon theme with cyberpunk style',
      defaultTheme: 'neon'
    },
    {
      position: 'center-right',
      title: 'Center Right',
      description: 'Default theme for side positioning',
      defaultTheme: 'default'
    },
    {
      position: 'center-left',
      title: 'Center Left',
      description: 'Gradient theme for side positioning',
      defaultTheme: 'gradient'
    }
  ];

  const availableThemes = [
    { value: 'default', label: 'Default', color: 'from-blue-600 to-purple-600' },
    { value: 'gradient', label: 'Gradient', color: 'from-blue-600 via-purple-600 to-pink-600' },
    { value: 'dark', label: 'Dark', color: 'bg-gray-800' },
    { value: 'light', label: 'Light', color: 'bg-white border-gray-200' },
    { value: 'neon', label: 'Neon', color: 'bg-black border-cyan-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Floating AI Chat Button Showcase</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore different configurations and themes for the floating AI chat button. 
            Each button demonstrates various positioning, styling, and behavior options.
          </p>
        </div>

        {/* Showcase Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Showcase Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoConfigs.map((config) => (
              <div key={config.position} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">{config.title}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeDemos[config.position]}
                      onChange={() => toggleDemo(config.position)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Theme:</label>
                  <select
                    value={themes[config.position]}
                    onChange={(e) => changeTheme(config.position, e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableThemes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">✨ Key Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>6 different positioning options</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>5 theme variations (Default, Gradient, Dark, Light, Neon)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Auto-hide functionality with hover detection</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Enhanced tooltips with contextual information</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Quick actions menu when minimized</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Notification badges and typing indicators</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 Usage Examples</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Basic Usage:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<FloatingAIChatButton 
  position="bottom-right"
  theme="gradient"
/>`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">With Software Context:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<FloatingAIChatButton 
  position="center-right"
  theme="dark"
  software={{ name: "Maijjd CRM" }}
  autoHide={true}
/>`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Custom Styling:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<FloatingAIChatButton 
  position="top-left"
  theme="neon"
  className="custom-floating-button"
  showNotifications={false}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Live Showcase Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Live Showcase - Multiple Buttons</h2>
          <p className="text-gray-600 mb-6">
            Toggle the switches above to see different floating AI chat buttons in action. 
            Each button can have its own theme and positioning.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            {demoConfigs.map((config) => (
              <div key={config.position} className="p-4 border border-gray-200 rounded-lg">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                  activeDemos[config.position] ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <p className="text-sm font-medium text-gray-800">{config.title}</p>
                <p className="text-xs text-gray-500">{config.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render Floating Buttons Based on Active Showcase */}
      {Object.entries(activeDemos).map(([position, isActive]) => 
        isActive && (
          <FloatingAIChatButton
            key={position}
            position={position}
            theme={themes[position]}
            showNotifications={true}
            autoHide={false}
            software={position.includes('right') ? { name: 'MJND Assistant' } : null}
          />
        )
      )}
    </div>
  );
};

export default FloatingAIChatDemo;
