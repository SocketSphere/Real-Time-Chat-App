// frontend/src/components/ChatPage.jsx - WITHOUT STATUS PANEL
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Phone, Video, Trash2 } from "lucide-react";
import useWebSocket from "../hooks/useWebSocket.jsx";

const ChatPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [friendTyping, setFriendTyping] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const friendTypingTimeoutRef = useRef(null);

  // Get auth from Redux
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  
  // Use the WebSocket hook
  const { sendTyping, sendChatMessage, onMessage, isConnected } = useWebSocket();

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!userId || !friendId) return;
    
    const cleanup = onMessage(`chat_${friendId}`, (messageData) => {
      // Check if this message is for the current chat
      const isForThisChat = (
        (messageData.sender?._id === userId && messageData.receiver?._id === friendId) ||
        (messageData.sender?._id === friendId && messageData.receiver?._id === userId)
      );
      
      if (isForThisChat) {
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
  }, [userId, friendId, onMessage]);

  // Listen for typing indicators
  useEffect(() => {
    const handleTyping = (event) => {
      const { senderId, isTyping } = event.detail;
      
      if (senderId === friendId) {
        setFriendTyping(isTyping);
        
        if (friendTypingTimeoutRef.current) {
          clearTimeout(friendTypingTimeoutRef.current);
        }
        
        if (isTyping) {
          friendTypingTimeoutRef.current = setTimeout(() => {
            setFriendTyping(false);
          }, 3000);
        }
      }
    };
    
    window.addEventListener('websocket:typing', handleTyping);
    
    return () => {
      window.removeEventListener('websocket:typing', handleTyping);
      if (friendTypingTimeoutRef.current) {
        clearTimeout(friendTypingTimeoutRef.current);
      }
    };
  }, [friendId]);

  // Fetch friend's details
  const fetchFriend = useCallback(async () => {
    if (!isLogin || !friendId) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFriend(res.data);
    } catch (err) {
      console.error("Error fetching friend:", err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        navigate("/contact");
      }
    }
  }, [friendId, isLogin, token, navigate]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    if (!userId || !friendId) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/messages`, {
        params: { userId: userId, senderId: friendId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [userId, friendId, token]);

  // Load initial data
  useEffect(() => {
    if (isLogin && userId && friendId) {
      fetchFriend();
      fetchMessages();
    }
  }, [isLogin, userId, friendId, fetchFriend, fetchMessages]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!friendId || !isConnected) return;
    
    if (!isTyping) {
      sendTyping(friendId, true);
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isConnected) {
        sendTyping(friendId, false);
        setIsTyping(false);
      }
    }, 2000);
  }, [friendId, isConnected, sendTyping, isTyping]);

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (!userId || !friendId) {
      alert('Cannot send message: Missing user information');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/messages`, {
        sender: userId,
        receiver: friendId,
        content: message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const savedMessage = response.data;
      
      // Send via WebSocket for real-time delivery
      if (isConnected) {
        sendChatMessage(friendId, message, savedMessage._id);
        
        // Send typing stop
        sendTyping(friendId, false);
        setIsTyping(false);
      }
      
      // Add to local state immediately (optimistic update)
      setMessages(prev => [...prev, savedMessage]);
      setMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 50);
      
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to send message: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Delete contact
  const handleDeleteContact = async () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/delete`, {
          data: { userId, friendId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Contact deleted successfully!");
        navigate("/contact");
      } catch (err) {
        alert(err.response?.data?.msg || "Failed to delete contact");
      }
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Show loading while auth is being determined
  if (!isLogin) {
    return (
      <div className="p-6 text-center">
        <p>You need to be logged in to chat.</p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2">Loading chat...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with name + actions */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {friend.firstName?.[0]}{friend.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {friend.firstName} {friend.lastName}
            </h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <p className="text-sm text-gray-600">
                {friend.isOnline ? 'Online' : 'Offline'}
                {friendTyping && " • Typing..."}
                {!isConnected && " • Connecting..."}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => alert(`Calling ${friend.firstName}...`)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Call"
          >
            <Phone size={20} />
          </button>
          <button
            onClick={() => alert(`Video calling ${friend.firstName}...`)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="Video Call"
          >
            <Video size={20} />
          </button>
          <button
            onClick={handleDeleteContact}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Delete Contact"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Chat Box */}
      <div 
        ref={chatBoxRef} 
        className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-50 mb-4 shadow-inner"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">👋</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start a conversation with {friend.firstName}!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, index) => (
              <div
                key={m._id || index}
                className={`flex ${m.sender?._id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                    m.sender?._id === userId
                      ? "bg-blue-600 text-white rounded-br-none"
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
            ))}
            {friendTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-bl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Message ${friend.firstName}...`}
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

      {/* Minimal Connection Status (optional - can be removed) */}
      {!isConnected && (
        <div className="mt-2 text-center">
          <p className="text-xs text-yellow-600">
            Connecting to real-time chat...
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;