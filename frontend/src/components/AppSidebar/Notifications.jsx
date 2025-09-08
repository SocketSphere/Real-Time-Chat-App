import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Bell, 
  MessageCircle, 
  Users, 
  UserPlus, 
  CheckCircle,
  Trash2,
  Check
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id;
  // src/components/Notifications.jsx

// Update the fetchNotifications function
const fetchNotifications = async () => {
  if (!isLogin || !userId) return;
  
  try {
    const [notifsRes, countRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/notifications/${userId}`),
      axios.get(`http://localhost:5000/api/notifications/${userId}/unread`)
    ]);
    
    setNotifications(notifsRes.data);
    setUnreadCount(countRes.data.count);
  } catch (err) {
    console.error("Error fetching notifications:", err);
  } finally {
    setLoading(false);
  }
};

// Update the markAsRead function
const markAsRead = async (notificationId) => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/${userId}/read`, {
      notificationId
    });
    
    // Update local state
    setNotifications(prev => prev.map(notif => 
      notif._id === notificationId ? { ...notif, isRead: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

// Update the markAllAsRead function
const markAllAsRead = async () => {
  try {
    await axios.put(`http://localhost:5000/api/notifications/${userId}/read-all`);
    
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    setUnreadCount(0);
  } catch (err) {
    console.error("Error marking all as read:", err);
  }
};

// Update the deleteNotification function
const deleteNotification = async (notificationId) => {
  try {
    await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
      data: { userId }
    });
    
    setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    // Update unread count if notification was unread
    const deletedNotif = notifications.find(notif => notif._id === notificationId);
    if (deletedNotif && !deletedNotif.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  } catch (err) {
    console.error("Error deleting notification:", err);
  }
};

// Update the clearAllNotifications function
const clearAllNotifications = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/notifications/${userId}/clear`);
    
    setNotifications([]);
    setUnreadCount(0);
  } catch (err) {
    console.error("Error clearing notifications:", err);
  }
};

  useEffect(() => {
    if (isLogin && userId) {
      fetchNotifications();
      
      // Set up polling for new notifications (every 30 seconds)
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLogin, userId]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'group_message':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'contact_request':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'group_invite':
        return <Users className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
  };

  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <Bell className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Please login to view notifications</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No notifications yet</p>
          <p className="text-sm text-gray-500 mt-1">
            You'll see notifications here when you receive messages or invites
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    {notification.metadata?.content && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        "{notification.metadata.content}..."
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;