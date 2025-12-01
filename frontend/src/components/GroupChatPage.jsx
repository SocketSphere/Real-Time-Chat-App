// frontend/src/components/GroupChatPage.jsx - WITH WEBSOCKET (FIXED)
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useWebSocket from "../hooks/useWebSocket.jsx";

const GroupChatPage = () => {
  const { groupId } = useParams();
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const chatBoxRef = useRef(null);
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
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
      const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`, {
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
      const res = await axios.get(`http://localhost:5000/api/messages`, {
        params: { groupId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Group messages loaded:', res.data.length);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
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
      const response = await axios.post("http://localhost:5000/api/messages", {
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

  if (!group) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2">Loading group chat...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Group Header */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold">Group: {group.name}</h2>
        <p className="text-gray-600 mt-2">{group.description || "No description"}</p>
        <div className="mt-3 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <p className="text-sm text-gray-600">
            {isConnected ? 'Real-time chat active' : 'Connecting to real-time...'}
            {isTyping && ' • You are typing...'}
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Members:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {group.members?.map(member => (
              <div key={member._id} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">
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
        className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-50 mb-4 shadow-inner"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">👋</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation in {group.name}!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m._id}
                className={`${m.sender?._id === userId ? 'text-right' : ''}`}
              >
                <div className="inline-block max-w-xs lg:max-w-md">
                  {m.sender?._id !== userId && (
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {m.sender?.firstName} {m.sender?.lastName}
                    </p>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      m.sender?._id === userId
                        ? "bg-blue-600 text-white rounded-br-none ml-auto"
                        : "bg-white text-gray-800 rounded-bl-none border"
                    }`}
                  >
                    <p className="break-words">{m.content}</p>
                    <div className={`flex justify-between items-center mt-1 ${
                      m.sender?._id === userId ? 'text-blue-200' : 'text-gray-500'
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
      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Message ${group.name}...`}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 rounded-lg border bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            message.trim() 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChatPage;