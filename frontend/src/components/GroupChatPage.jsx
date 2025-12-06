import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useWebSocket from "../hooks/useWebSocket.jsx";
import { Users, Send, Loader2 } from "lucide-react";
 import { API_URL } from "../config.js";  // Add this import

const GroupChatPage = () => {
  const { groupId } = useParams();
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const chatBoxRef = useRef(null);
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const typingTimeoutRef = useRef(null);

  // Use the WebSocket hook - only destructure what we need
  const { send, onMessage, isConnected } = useWebSocket();

  // Handle incoming WebSocket messages for groups
  useEffect(() => {
    if (!userId || !groupId) return;
    
    const cleanup = onMessage(`group_${groupId}`, (messageData) => {
      console.log('🎉 Group chat message received:', messageData);
      
      // Check if this message is for the current group
      if (messageData.group?._id === groupId || messageData.group === groupId) {
        setMessages(prev => [...prev, messageData]);
        
        // Scroll to bottom
        setTimeout(() => {
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
          }
        }, 50);
      }
    });
    
    return cleanup;
  }, [userId, groupId, onMessage]);

  // Fetch group details
  const fetchGroup = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroup(res.data);
      console.log('✅ Group loaded:', res.data.name);
    } catch (err) {
      console.error("Error fetching group:", err);
    }
  }, [groupId, token]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages`, {
        params: { groupId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Group messages loaded:', res.data.length);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId, token]);

  // Handle typing indicator for group
  const handleTyping = useCallback(() => {
    if (!groupId || !isConnected) return;
    
    if (!isTyping) {
      // Send group typing indicator
      send({
        type: 'group_typing',
        senderId: userId,
        groupId: groupId,
        isTyping: true
      });
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isConnected) {
        send({
          type: 'group_typing',
          senderId: userId,
          groupId: groupId,
          isTyping: false
        });
        setIsTyping(false);
      }
    }, 2000);
  }, [groupId, isConnected, send, userId, isTyping]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !userId || !groupId) return;

    // Create optimistic message
    const optimisticMsg = {
      _id: `temp_${Date.now()}`, // temporary id
      sender: { 
        _id: userId, 
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || `${user.firstName} ${user.lastName}` 
      },
      group: groupId,
      content: message,
      createdAt: new Date().toISOString(),
    };
    
    // Add optimistically
    setMessages(prev => [...prev, optimisticMsg]);
    setMessage("");
    scrollToBottom();

    // Send to backend
    try {
      const response = await axios.post(`${API_URL}/api/messages`, {
        sender: userId,
        group: groupId,
        content: message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const savedMessage = response.data;
      console.log('✅ Group message saved:', savedMessage._id);
      
      // Send via WebSocket for real-time
      if (isConnected) {
        send({
          type: 'send_group_message',
          senderId: userId,
          groupId: groupId,
          content: message,
          messageId: savedMessage._id,
          timestamp: new Date().toISOString()
        });
        
        // Send typing stop
        send({
          type: 'group_typing',
          senderId: userId,
          groupId: groupId,
          isTyping: false
        });
        setIsTyping(false);
      }
      
      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => 
        msg._id === optimisticMsg._id ? savedMessage : msg
      ));
      
      scrollToBottom();
      
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMsg._id));
      alert('Failed to send message: ' + (err.response?.data?.error || err.message));
    }
  };

  // Fetch group and messages on load
  useEffect(() => {
    if (isLogin && groupId) {
      fetchGroup();
      fetchMessages();
    }
  }, [groupId, isLogin, fetchGroup, fetchMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading group chat...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-6 text-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Group not found or you don't have access.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Group Header */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow dark:shadow-gray-900 transition-colors duration-300">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center flex-shrink-0">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {group.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {group.description || "No description available"}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? 'Real-time active' : 'Connecting...'}
                  {isTyping && ' • You are typing...'}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {group.members?.length || 0} members
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Members:</p>
          <div className="flex flex-wrap gap-2">
            {group.members?.map(member => (
              <div 
                key={member._id} 
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                  member._id === userId 
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  member._id === userId ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className={`text-sm ${
                  member._id === userId 
                    ? 'text-blue-700 dark:text-blue-400 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {member.firstName} {member.lastName}
                  {member._id === userId && ' (You)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Box */}
      <div
        ref={chatBoxRef}
        className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 h-[500px] overflow-y-auto bg-white dark:bg-gray-800 mb-4 shadow-inner transition-colors duration-300"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-6xl mb-4">👋</div>
            <p className="text-lg dark:text-gray-300 mb-2">Welcome to {group.name}!</p>
            <p className="text-sm dark:text-gray-400 text-center">
              Be the first to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m._id}
                className={`${m.sender?._id === userId ? 'text-right' : ''}`}
              >
                <div className="inline-block max-w-xs lg:max-w-md">
                  {m.sender?._id !== userId && (
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 ml-1">
                      {m.sender?.firstName} {m.sender?.lastName}
                    </p>
                  )}
                  <div
                    className={`p-4 rounded-2xl transition-all duration-200 ${
                      m.sender?._id === userId
                        ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-none ml-auto shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <p className="break-words">{m.content}</p>
                    <div className={`flex justify-between items-center mt-2 ${
                      m.sender?._id === userId ? 'text-blue-200 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span className="text-xs">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {m.sender?._id === userId && (
                        <span className="text-xs ml-2">
                          {m.status === 'read' ? '✓✓' : m.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow dark:shadow-gray-900 transition-colors duration-300">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Message ${group.name}...`}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
            message.trim() 
              ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Connecting to real-time chat service...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatPage;