import React from 'react';

const NotificationsSettings = ({ notifications, setNotifications }) => {
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ 
      ...prev, 
      [key]: !prev[key] 
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Message Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'messages', label: 'New Messages', description: 'Notify me about new direct messages' },
            { key: 'groups', label: 'Group Messages', description: 'Notify me about new group messages' },
            { key: 'calls', label: 'Voice/Video Calls', description: 'Notify me about incoming calls' },
            { key: 'email', label: 'Email Notifications', description: 'Send notifications to my email' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationToggle(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Sound & Alert</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Message Sound</p>
              <p className="text-sm text-gray-500">Play sound for new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.soundEnabled}
                onChange={() => setNotifications({...notifications, soundEnabled: !notifications.soundEnabled})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Sound</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Default</option>
              <option>Chime</option>
              <option>Bell</option>
              <option>Note</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;