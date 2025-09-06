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
          response = await axios.get(`http://localhost:5000/api/users/${userId}`);
          setProfile(response.data);
          break;
        case 'appearance':
          response = await axios.get(`http://localhost:5000/api/appearance/${userId}`);
          setAppearance(response.data);
          break;
        case 'notifications':
          response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
          setNotifications(response.data);
          break;
        case 'privacy':
          response = await axios.get(`http://localhost:5000/api/privacy/${userId}`);
          setPrivacy(response.data);
          break;
        case 'security':
          response = await axios.get(`http://localhost:5000/api/security/${userId}`);
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
        await axios.put(`http://localhost:5000${endpoint}`, data);
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



// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Save, Bell, Lock, User, Palette, Shield, 
//   Moon, Sun, Globe, MessageSquare, Volume2, 
//   Eye, EyeOff, Download, Upload, Trash2,
//   Loader,
//   Check,
//   X,
//   Camera
// } from 'lucide-react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// // import { response } from 'express';
// // import { updateUser } from "../../redux/authSlice.js";

// const Setting = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [uploadingAvatar, setUploadingAvatar] = useState(false);
//   const fileInputRef = useRef(null);
  
//   const { user, isLogin } = useSelector((state) => state.auth);
//   const userId = user?._id;

//   // State for all settings
//   const [profile, setProfile] = useState({
//     firstName: '',
//     lastName: '',
//     profileImage: '',
//     loginId: '',
//     bio: ''
//   });

//   const [appearance, setAppearance] = useState({
//     theme: 'light',
//     language: 'english',
//     fontSize: 'medium',
//     messageBubbleStyle: 'default',
//     accentColor: '#3B82F6',
//     reduceAnimations: false,
//     highContrast: false
//   });

//   const [notifications, setNotifications] = useState({
//     messages: true,
//     groups: true,
//     calls: true,
//     email: false,
//     soundEnabled: true
//   });

//   const [privacy, setPrivacy] = useState({
//     onlineStatus: true,
//     readReceipts: true,
//     profileVisibility: 'contacts',
//     lastSeen: true,
//     profilePhoto: 'everyone'
//   });

//   const [security, setSecurity] = useState({
//     twoFactorEnabled: false,
//     activeSessions: []
//   });

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'appearance', label: 'Appearance', icon: Palette },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     { id: 'privacy', label: 'Privacy', icon: Shield },
//     { id: 'security', label: 'Security', icon: Lock },
//     { id: 'data', label: 'Data & Storage', icon: Download }
//   ];

//   // Fetch settings when tab changes or user logs in
//   useEffect(() => {
//     if (isLogin && userId) {
//       fetchSettings();
//     }
//   }, [activeTab, isLogin, userId]);

//   const fetchSettings = async () => {
//     if (!userId) return;

//     setLoading(true);
//     try {
//       switch (activeTab) {
//         case 'profile': {
//           const profileRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
//           setProfile(profileRes.data);
//           break;
//         }
//         case 'appearance': {
//           const appearanceRes = await axios.get(`http://localhost:5000/api/appearance/${userId}`);
//           setAppearance(appearanceRes.data);
//           break;
//         }
//         case 'notifications': {
//           const notificationsRes = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
//           setNotifications(notificationsRes.data);
//           break;
//         }
//         case 'privacy': {
//           const privacyRes = await axios.get(`http://localhost:5000/api/privacy/${userId}`);
//           setPrivacy(privacyRes.data);
//           break;
//         }
//         case 'security': {
//           const securityRes = await axios.get(`http://localhost:5000/api/security/${userId}`);
//           setSecurity(securityRes.data);
//           break;
//         }
//         default:
//           break;
//       }
//     } catch (error) {
//       console.error(`Error fetching ${activeTab} settings:`, error);
//       toast.error('Failed to load settings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!userId) {
//       toast.error('Please login to save settings');
//       return;
//     }

//     setSaving(true);
//     try {
//       let endpoint = '';
//       let data = {};

//       switch (activeTab) {
//         case 'profile':
//           endpoint = `/api/users/${userId}`;
//           data = profile;
//           break;
//         case 'appearance':
//           endpoint = `/api/appearance/${userId}`;
//           data = appearance;
//           break;
//         case 'notifications':
//           endpoint = `/api/notifications/${userId}`;
//           data = notifications;
//           break;
//         case 'privacy':
//           endpoint = `/api/privacy/${userId}`;
//           data = privacy;
//           break;
//         case 'security':
//           endpoint = `/api/security/${userId}`;
//           data = security;
//           break;
//         default:
//           break;
//       }

//       if (endpoint) {
//         await axios.put(`http://localhost:5000${endpoint}`, data);
//         toast.success('Settings saved successfully!');
//       }
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       toast.error('Failed to save settings');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleAvatarUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type and size
//     const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     const maxSize = 5 * 1024 * 1024; // 5MB

//     if (!validTypes.includes(file.type)) {
//       toast.error('Please select a valid image file (JPG, PNG, or GIF)');
//       return;
//     }

//     if (file.size > maxSize) {
//       toast.error('File size must be less than 5MB');
//       return;
//     }

//     setUploadingAvatar(true);
//     try {
//       const formData = new FormData();
//       formData.append('avatar', file);

//       const response = await axios.post(
//         `http://localhost:5000/api/users/${userId}/avatar`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       // Update profile with new image
//       setProfile(prev => ({ ...prev, profileImage: response.data.profileImage }));
//       toast.success('Avatar updated successfully!');
      
//       // Clear the file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     } catch (error) {
//       console.error('Error uploading avatar:', error);
//       toast.error('Failed to upload avatar');
//     } finally {
//       setUploadingAvatar(false);
//     }
//   };

//   const handleThemeChange = async (newTheme) => {
//     setAppearance(prev => ({ ...prev, theme: newTheme }));
//   };

//   const handleLanguageChange = async (newLanguage) => {
//     setAppearance(prev => ({ ...prev, language: newLanguage }));
//   };

//   const handleNotificationToggle = (key) => {
//     setNotifications(prev => ({ 
//       ...prev, 
//       [key]: !prev[key] 
//     }));
//   };

//   const handlePrivacyToggle = (key) => {
//     setPrivacy(prev => ({ 
//       ...prev, 
//       [key]: !prev[key] 
//     }));
//   };

//   const toggleTwoFactorAuth = async () => {
//     try {
//       const newState = !security.twoFactorEnabled;
//         await axios.put(`http://localhost:5000/api/security/${userId}/two-factor`, {
//         // console.log('twoFactorEnabled:', response);
//         enabled: newState
//       });
      
//       setSecurity(prev => ({ 
//         ...prev, 
//         twoFactorEnabled: newState 
//       }));
      
//       toast.success(newState ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
//     } catch (error) {
//       console.error('Error toggling two-factor auth:', error);
//       toast.error('Failed to update two-factor authentication');
//     }
//   };

//   const terminateSession = async (sessionId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/security/${userId}/sessions/${sessionId}`);
//       setSecurity(prev => ({
//         ...prev,
//         activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
//       }));
//       toast.success('Session terminated');
//     } catch (error) {
//       console.error('Error terminating session:', error);
//       toast.error('Failed to terminate session');
//     }
//   };

//   const exportData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/data/${userId}/export`, {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `chat-data-${new Date().toISOString()}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       toast.success('Data exported successfully');
//     } catch (error) {
//       console.error('Error exporting data:', error);
//       toast.error('Failed to export data');
//     }
//   };

//   const clearData = async () => {
//     if (!window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5000/api/data/${userId}/clear`);
//       toast.success('All data cleared successfully');
//     } catch (error) {
//       console.error('Error clearing data:', error);
//       toast.error('Failed to clear data');
//     }
//   };

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center py-20">
//           <Loader className="w-8 h-8 animate-spin text-blue-600" />
//         </div>
//       );
//     }

//     if (!isLogin) {
//       return (
//         <div className="text-center py-20">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//             <h3 className="text-lg font-medium text-yellow-800 mb-2">Authentication Required</h3>
//             <p className="text-yellow-600">Please log in to view and modify your settings.</p>
//           </div>
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case 'profile':
//         return (
//           <div className="space-y-6">
//             <div className="flex items-center space-x-6">
//               <div className="relative">
//                 {profile.profileImage ? (
//                   <img
//                     src={profile.profileImage}
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                     {profile.firstName?.[0]}{profile.lastName?.[0]}
//                   </div>
//                 )}
//                 {uploadingAvatar && (
//                   <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
//                     <Loader className="w-6 h-6 animate-spin text-white" />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleAvatarUpload}
//                   accept="image/jpeg,image/png,image/gif"
//                   className="hidden"
//                   disabled={uploadingAvatar}
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   disabled={uploadingAvatar}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//                 >
//                   <Camera className="w-4 h-4" />
//                   <span>{uploadingAvatar ? 'Uploading...' : 'Change Avatar'}</span>
//                 </button>
//                 <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                 <input
//                   type="text"
//                   value={profile.firstName}
//                   onChange={(e) => setProfile({...profile, firstName: e.target.value})}
//                   className="w-full px-4 bg-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                 <input
//                   type="text"
//                   value={profile.lastName}
//                   onChange={(e) => setProfile({...profile, lastName: e.target.value})}
//                   className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email/Username</label>
//               <input
//                 type="text"
//                 value={profile.loginId}
//                 onChange={(e) => setProfile({...profile, loginId: e.target.value})}
//                 className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
//               <textarea
//                 value={profile.bio}
//                 onChange={(e) => setProfile({...profile, bio: e.target.value})}
//                 rows={3}
//                 className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Tell us about yourself..."
//               />
//             </div>
//           </div>
//         );

//       case 'appearance':
//         return (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Theme</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {[
//                   { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
//                   { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
//                   { value: 'auto', label: 'Auto', icon: Globe, description: 'Follow system settings' }
//                 ].map((themeOption) => (
//                   <div 
//                     key={themeOption.value}
//                     className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                       appearance.theme === themeOption.value 
//                         ? 'border-blue-500 bg-blue-50' 
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                     onClick={() => handleThemeChange(themeOption.value)}
//                   >
//                     <themeOption.icon className="w-8 h-8 mb-2" />
//                     <p className="font-medium">{themeOption.label}</p>
//                     <p className="text-sm text-gray-500">{themeOption.description}</p>
//                     {appearance.theme === themeOption.value && (
//                       <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
//                         <Check className="w-3 h-3 text-white" />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Language</h3>
//               <select 
//                 value={appearance.language}
//                 onChange={(e) => handleLanguageChange(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="english">English</option>
//                 <option value="spanish">Spanish</option>
//                 <option value="french">French</option>
//                 <option value="german">German</option>
//                 <option value="japanese">Japanese</option>
//                 <option value="chinese">Chinese</option>
//               </select>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Accent Color</h3>
//               <div className="flex items-center space-x-4">
//                 <input
//                   type="color"
//                   value={appearance.accentColor}
//                   onChange={(e) => setAppearance({...appearance, accentColor: e.target.value})}
//                   className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
//                 />
//                 <span className="text-sm text-gray-600">
//                   {appearance.accentColor}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Font Size</h3>
//                 <select 
//                   value={appearance.fontSize}
//                   onChange={(e) => setAppearance({...appearance, fontSize: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="small">Small</option>
//                   <option value="medium">Medium</option>
//                   <option value="large">Large</option>
//                 </select>
//               </div>

//               <div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-4">Message Style</h3>
//                 <select 
//                   value={appearance.messageBubbleStyle}
//                   onChange={(e) => setAppearance({...appearance, messageBubbleStyle: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="default">Default</option>
//                   <option value="minimal">Minimal</option>
//                   <option value="rounded">Rounded</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Reduce Animations</p>
//                   <p className="text-sm text-gray-500">Minimize motion and animations</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input 
//                     type="checkbox" 
//                     checked={appearance.reduceAnimations}
//                     onChange={() => setAppearance({...appearance, reduceAnimations: !appearance.reduceAnimations})}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">High Contrast Mode</p>
//                   <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input 
//                     type="checkbox" 
//                     checked={appearance.highContrast}
//                     onChange={() => setAppearance({...appearance, highContrast: !appearance.highContrast})}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>
//             </div>
//           </div>
//         );

//       case 'notifications':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Message Notifications</h3>
//               <div className="space-y-4">
//                 {[
//                   { key: 'messages', label: 'New Messages', description: 'Notify me about new direct messages' },
//                   { key: 'groups', label: 'Group Messages', description: 'Notify me about new group messages' },
//                   { key: 'calls', label: 'Voice/Video Calls', description: 'Notify me about incoming calls' },
//                   { key: 'email', label: 'Email Notifications', description: 'Send notifications to my email' }
//                 ].map((item) => (
//                   <div key={item.key} className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium">{item.label}</p>
//                       <p className="text-sm text-gray-500">{item.description}</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input 
//                         type="checkbox" 
//                         checked={notifications[item.key]}
//                         onChange={() => handleNotificationToggle(item.key)}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Sound & Alert</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">Message Sound</p>
//                     <p className="text-sm text-gray-500">Play sound for new messages</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input 
//                       type="checkbox" 
//                       checked={notifications.soundEnabled}
//                       onChange={() => setNotifications({...notifications, soundEnabled: !notifications.soundEnabled})}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Notification Sound</label>
//                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                     <option>Default</option>
//                     <option>Chime</option>
//                     <option>Bell</option>
//                     <option>Note</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'privacy':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Online Status</h3>
//               <div className="space-y-4">
//                 {[
//                   { key: 'onlineStatus', label: 'Show Online Status', description: 'Allow others to see when you\'re online' },
//                   { key: 'readReceipts', label: 'Read Receipts', description: 'Let others know when you\'ve read their messages' },
//                   { key: 'lastSeen', label: 'Last Seen', description: 'Show when you were last active' }
//                 ].map((item) => (
//                   <div key={item.key} className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium">{item.label}</p>
//                       <p className="text-sm text-gray-500">{item.description}</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input 
//                         type="checkbox" 
//                         checked={privacy[item.key]}
//                         onChange={() => handlePrivacyToggle(item.key)}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Visibility</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Who can see your profile</label>
//                   <select 
//                     value={privacy.profileVisibility}
//                     onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="everyone">Everyone</option>
//                     <option value="contacts">My Contacts</option>
//                     <option value="nobody">Nobody</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo Visibility</label>
//                   <select 
//                     value={privacy.profilePhoto}
//                     onChange={(e) => setPrivacy({...privacy, profilePhoto: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="everyone">Everyone</option>
//                     <option value="contacts">My Contacts</option>
//                     <option value="nobody">Nobody</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Blocked Users</h3>
//               <p className="text-gray-600 mb-4">Manage users you've blocked</p>
//               <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
//                 Manage Blocked Users
//               </button>
//             </div>
//           </div>
//         );

//       case 'security':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h3>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Two-Factor Authentication</p>
//                   <p className="text-sm text-gray-500">
//                     {security.twoFactorEnabled 
//                       ? 'Extra security is enabled for your account' 
//                       : 'Add an extra layer of security to your account'
//                     }
//                   </p>
//                 </div>
//                 <button 
//                   onClick={toggleTwoFactorAuth}
//                   className={`px-4 py-2 rounded-lg font-medium ${
//                     security.twoFactorEnabled
//                       ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   } transition-colors`}
//                 >
//                   {security.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Active Sessions</h3>
//               <div className="space-y-4">
//                 {security.activeSessions.length > 0 ? (
//                   security.activeSessions.map((session) => (
//                     <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex-1">
//                         <p className="font-medium">{session.device}</p>
//                         <p className="text-sm text-gray-500">
//                           {session.location} • {session.ipAddress} • {session.lastActive}
//                         </p>
//                       </div>
//                       {session.current && (
//                         <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                           Current
//                         </span>
//                       )}
//                       {!session.current && (
//                         <button 
//                           onClick={() => terminateSession(session.id)}
//                           className="text-red-600 hover:text-red-800 text-sm font-medium"
//                         >
//                           Log out
//                         </button>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-4 text-gray-500">
//                     <p>No active sessions found</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Password</h3>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                 Change Password
//               </button>
//             </div>
//           </div>
//         );

//       case 'data':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Data Usage</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <p className="text-2xl font-bold text-blue-600">2.3 GB</p>
//                   <p className="text-sm text-gray-600">Media Storage</p>
//                 </div>
//                 <div className="p-4 bg-green-50 rounded-lg">
//                   <p className="text-2xl font-bold text-green-600">1.2 GB</p>
//                   <p className="text-sm text-gray-600">Messages</p>
//                 </div>
//                 <div className="p-4 bg-purple-50 rounded-lg">
//                   <p className="text-2xl font-bold text-purple-600">350 MB</p>
//                   <p className="text-sm text-gray-600">App Data</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Data Management</h3>
//               <div className="space-y-3">
//                 <button 
//                   onClick={exportData}
//                   className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <Download className="text-gray-400" />
//                     <span>Export Chat Data</span>
//                   </div>
//                   <span className="text-sm text-gray-500">ZIP file</span>
//                 </button>
                
//                 <button 
//                   onClick={clearData}
//                   className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <Trash2 className="text-red-400" />
//                     <span>Clear All Data</span>
//                   </div>
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Automatic Media Download</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">Wi-Fi</p>
//                     <p className="text-sm text-gray-500">Download media automatically when connected to Wi-Fi</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input 
//                       type="checkbox" 
//                       className="sr-only peer"
//                       defaultChecked
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">Mobile Data</p>
//                     <p className="text-sm text-gray-500">Download media automatically when using mobile data</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input 
//                       type="checkbox" 
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
//             <h1 className="text-3xl font-bold">Settings</h1>
//             <p className="text-blue-100 mt-2">Manage your account preferences and settings</p>
//           </div>

//           <div className="flex flex-col md:flex-row">
//             {/* Sidebar Navigation */}
//             <div className="md:w-64 bg-white border-r border-gray-200">
//               <nav className="p-4 space-y-1">
//                 {tabs.map((tab) => {
//                   const Icon = tab.icon;
//                   return (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                         activeTab === tab.id
//                           ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
//                           : 'text-gray-600 hover:bg-gray-50'
//                       }`}
//                     >
//                       <Icon size={20} />
//                       <span className="font-medium">{tab.label}</span>
//                     </button>
//                   );
//                 })}
//               </nav>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 p-6">
//               <div className="max-w-2xl">
//                 {renderContent()}
                
//                 {isLogin && (
//                   <div className="mt-8 pt-6 border-t border-gray-200">
//                     <button
//                       onClick={handleSave}
//                       disabled={saving}
//                       className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {saving ? (
//                         <Loader className="w-5 h-5 animate-spin" />
//                       ) : (
//                         <Save size={20} />
//                       )}
//                       <span>{saving ? 'Saving...' : 'Save Changes'}</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Setting;