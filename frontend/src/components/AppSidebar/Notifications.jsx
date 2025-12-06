import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  Bell, 
  MessageCircle, 
  Users, 
  UserPlus, 
  CheckCircle,
  Trash2,
  Check,
  Mail,
  UserCheck,
  Loader2,
  Eye,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { setNotificationCount, decrementNotificationCount } from '../../redux/notificationSlice.js';
import toast from 'react-hot-toast';
import { API_URL } from "../../config.js";  // Add this import

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  const dispatch = useDispatch();
  
  const fetchNotifications = async () => {
    if (!isLogin || !userId) return;
    
    try {
      const [notifsRes, countRes] = await Promise.all([
        axios.get(`${API_URL}/api/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`${API_URL}/api/notifications/${userId}/unread`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);
      
      setNotifications(notifsRes.data);
      const count = countRes.data.count;
      setUnreadCount(count);
      dispatch(setNotificationCount(count));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${userId}/read`, {
        notificationId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotifications(prev => prev.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      dispatch(decrementNotificationCount());
      toast.success('Marked as read');
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error('Failed to mark as read');
    }
  };
  
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await axios.put(`${API_URL}/api/notifications/${userId}/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      dispatch(setNotificationCount(0));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error("Error marking all as read:", err);
      toast.error('Failed to mark all as read');
    }
  };
  
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
        data: { userId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const deletedNotif = notifications.find(notif => notif._id === notificationId);
      
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      if (deletedNotif && !deletedNotif.isRead) {
        const newCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newCount);
        dispatch(decrementNotificationCount());
      }
      
      toast.success('Notification deleted');
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error('Failed to delete notification');
    }
  };
  
  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    
    if (!window.confirm('Are you sure you want to clear all notifications?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/notifications/${userId}/clear`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotifications([]);
      setUnreadCount(0);
      dispatch(setNotificationCount(0));
      toast.success('All notifications cleared');
    } catch (err) {
      console.error("Error clearing notifications:", err);
      toast.error('Failed to clear notifications');
    }
  };
  
  useEffect(() => {
    if (isLogin && userId) {
      fetchNotifications();
      
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLogin, userId, token]);
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'group_message':
        return <Users className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'contact_request':
        return <UserPlus className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      case 'group_invite':
        return <Users className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-red-500 dark:text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
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
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });
  
  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Bell className="w-16 h-16 text-blue-500 dark:text-blue-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Notifications</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
          Please login to view your notifications
        </p>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading notifications...</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with your latest activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors duration-300"
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>
        
        {/* Stats & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              unreadCount > 0 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {unreadCount} unread
            </div>
            <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium">
              {notifications.length} total
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'unread'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'read'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Read
            </button>
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="max-w-4xl mx-auto">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {filter === 'all' 
                ? "You'll see notifications here when you receive messages or invites." 
                : `You have no ${filter} notifications at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 md:p-5 rounded-xl border transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800 ${
                  notification.isRead 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${
                          notification.isRead 
                            ? 'text-gray-800 dark:text-gray-200' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>
                        )}
                      </div>
                      <p className={`${
                        notification.isRead 
                          ? 'text-gray-600 dark:text-gray-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      {notification.metadata?.content && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic line-clamp-1">
                          "{notification.metadata.content}..."
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors duration-200"
                        title="Mark as read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
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
        
        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <button
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;