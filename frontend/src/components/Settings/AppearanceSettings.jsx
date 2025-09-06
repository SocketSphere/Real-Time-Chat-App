import React from 'react';
import { Sun, Moon, Globe, Check } from 'lucide-react';

const AppearanceSettings = ({ appearance, setAppearance }) => {
  const handleThemeChange = (newTheme) => {
    setAppearance(prev => ({ ...prev, theme: newTheme }));
  };

  const handleLanguageChange = (newLanguage) => {
    setAppearance(prev => ({ ...prev, language: newLanguage }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
            { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
            { value: 'auto', label: 'Auto', icon: Globe, description: 'Follow system settings' }
          ].map((themeOption) => (
            <div 
              key={themeOption.value}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                appearance.theme === themeOption.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThemeChange(themeOption.value)}
            >
              <themeOption.icon className="w-8 h-8 mb-2" />
              <p className="font-medium">{themeOption.label}</p>
              <p className="text-sm text-gray-500">{themeOption.description}</p>
              {appearance.theme === themeOption.value && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Language</h3>
        <select 
          value={appearance.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="japanese">Japanese</option>
          <option value="chinese">Chinese</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Accent Color</h3>
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={appearance.accentColor}
            onChange={(e) => setAppearance({...appearance, accentColor: e.target.value})}
            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            {appearance.accentColor}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Font Size</h3>
          <select 
            value={appearance.fontSize}
            onChange={(e) => setAppearance({...appearance, fontSize: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Message Style</h3>
          <select 
            value={appearance.messageBubbleStyle}
            onChange={(e) => setAppearance({...appearance, messageBubbleStyle: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="rounded">Rounded</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Reduce Animations</p>
            <p className="text-sm text-gray-500">Minimize motion and animations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={appearance.reduceAnimations}
              onChange={() => setAppearance({...appearance, reduceAnimations: !appearance.reduceAnimations})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">High Contrast Mode</p>
            <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={appearance.highContrast}
              onChange={() => setAppearance({...appearance, highContrast: !appearance.highContrast})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;