import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
 import { API_URL } from "../../config.js";  // Add this import

const SecuritySettings = ({ security, setSecurity, userId }) => {
  const [loading, setLoading] = useState(false);

  const toggleTwoFactorAuth = async () => {
    try {
      setLoading(true);
      const newState = !security.twoFactorEnabled;
      await axios.put(`${API_URL}/api/security/${userId}/two-factor`, {
        enabled: newState
      });
      
      setSecurity(prev => ({ 
        ...prev, 
        twoFactorEnabled: newState 
      }));
      
      toast.success(newState ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
    } catch (error) {
      console.error('Error toggling two-factor auth:', error);
      toast.error('Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      await axios.delete(`${API_URL}/api/security/${userId}/sessions/${sessionId}`);
      setSecurity(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
      }));
      toast.success('Session terminated');
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">
              {security.twoFactorEnabled 
                ? 'Extra security is enabled for your account' 
                : 'Add an extra layer of security to your account'
              }
            </p>
          </div>
          <button 
            onClick={toggleTwoFactorAuth}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium ${
              security.twoFactorEnabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Processing...' : (security.twoFactorEnabled ? 'Disable' : 'Enable')} 2FA
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Active Sessions</h3>
        <div className="space-y-4">
          {security.activeSessions.length > 0 ? (
            security.activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{session.device}</p>
                  <p className="text-sm text-gray-500">
                    {session.location} • {session.ipAddress} • {session.lastActive}
                  </p>
                </div>
                {session.current && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
                {!session.current && (
                  <button 
                    onClick={() => terminateSession(session.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Log out
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No active sessions found</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Password</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;