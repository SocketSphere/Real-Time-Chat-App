import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {User,Palette,Bell,Shield,Lock,Download} from "lucide-react"
// Import individual setting components
import ProfileSettings from './ProfileSettings';
import AppearanceSettings from './AppearanceSettings';
import NotificationsSettings from './NotificationsSettings';
import PrivacySettings from './PrivacySettings';
import SecuritySettings from './SecuritySettings';
import DataSettings from './DataSettings';
 import { API_URL } from "../../config.js";  // Add this import

const Setting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id;

  // State for all settings
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    profileImage: '',
    loginId: '',
    bio: ''
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'english',
    fontSize: 'medium',
    messageBubbleStyle: 'default',
    accentColor: '#3B82F6',
    reduceAnimations: false,
    highContrast: false
  });

  const [notifications, setNotifications] = useState({
    messages: true,
    groups: true,
    calls: true,
    email: false,
    soundEnabled: true
  });

  const [privacy, setPrivacy] = useState({
    onlineStatus: true,
    readReceipts: true,
    profileVisibility: 'contacts',
    lastSeen: true,
    profilePhoto: 'everyone'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    activeSessions: []
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'data', label: 'Data & Storage', icon: Download }
  ];

  // Fetch settings when tab changes or user logs in
  useEffect(() => {
    if (isLogin && userId) {
      fetchSettings();
    }
  }, [activeTab, isLogin, userId]);

  const fetchSettings = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'profile':
          response = await axios.get(`${API_URL}/api/users/${userId}`);
          setProfile(response.data);
          break;
        case 'appearance':
          response = await axios.get(`${API_URL}/api/appearance/${userId}`);
          setAppearance(response.data);
          break;
        case 'notifications':
          response = await axios.get(`${API_URL}/api/notifications/${userId}`);
          setNotifications(response.data);
          break;
        case 'privacy':
          response = await axios.get(`${API_URL}/api/privacy/${userId}`);
          setPrivacy(response.data);
          break;
        case 'security':
          response = await axios.get(`${API_URL}/api/security/${userId}`);
          setSecurity(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} settings:`, error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('Please login to save settings');
      return;
    }

    setSaving(true);
    try {
      let endpoint = '';
      let data = {};

      switch (activeTab) {
        case 'profile':
          endpoint = `/api/users/${userId}`;
          data = profile;
          break;
        case 'appearance':
          endpoint = `/api/appearance/${userId}`;
          data = appearance;
          break;
        case 'notifications':
          endpoint = `/api/notifications/${userId}`;
          data = notifications;
          break;
        case 'privacy':
          endpoint = `/api/privacy/${userId}`;
          data = privacy;
          break;
        case 'security':
          endpoint = `/api/security/${userId}`;
          data = security;
          break;
        default:
          break;
      }

      if (endpoint) {
        await axios.put(`${API_URL}${endpoint}`, data);
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (!isLogin) {
      return (
        <div className="text-center py-20">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Authentication Required</h3>
            <p className="text-yellow-600">Please log in to view and modify your settings.</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            profile={profile}
            setProfile={setProfile}
            userId={userId}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings
            appearance={appearance}
            setAppearance={setAppearance}
          />
        );
      case 'notifications':
        return (
          <NotificationsSettings
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings
            privacy={privacy}
            setPrivacy={setPrivacy}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            security={security}
            setSecurity={setSecurity}
            userId={userId}
          />
        );
      case 'data':
        return (
          <DataSettings
            userId={userId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-blue-100 mt-2">Manage your account preferences and settings</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-64 bg-white border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="max-w-2xl">
                {renderContent()}
                
                {isLogin && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;





