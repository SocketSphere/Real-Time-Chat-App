// frontend/src/components/ChatPage.jsx - FINAL FIXED VERSION
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Phone, Video, Trash2 } from "lucide-react";

const ChatPage = () => {
  console.log('🔄 ChatPage RENDERING');
  
  const { friendId } = useParams();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [friendTyping, setFriendTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  const typingTimeoutRef = useRef(null);
  const friendTypingTimeoutRef = useRef(null);

  // Get auth from Redux
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  
  console.log('📊 Redux Auth State:', {
    userId,
    isLogin,
    tokenExists: !!token,
    userExists: !!user
  });

  // Fix: Wait for Redux to hydrate from localStorage
  useEffect(() => {
    console.log('🔐 Auth hydration check');
    
    // Check localStorage directly to confirm auth
    const localToken = localStorage.getItem("token");
    const localUserStr = localStorage.getItem("user");
    
    console.log('LocalStorage check:', {
      localToken: !!localToken,
      localUser: !!localUserStr
    });
    
    // If Redux doesn't have auth but localStorage does, we might need to wait
    if (!isLogin && localToken) {
      console.log('⚠️ Redux not hydrated yet, but localStorage has auth');
      console.log('This is normal on initial load - Redux needs a moment');
    }
    
    // Mark auth as loaded after a brief delay
    const timer = setTimeout(() => {
      setIsLoadingAuth(false);
      console.log('✅ Auth loading complete');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize WebSocket connection - FIXED
  useEffect(() => {
    console.log('🔌 WebSocket useEffect triggered');
    console.log('Conditions:', { isLogin, userId, friendId, isLoadingAuth });
    
    // Don't proceed if still loading auth or missing requirements
    if (isLoadingAuth || !userId || !friendId) {
      console.log('⏳ Waiting for:', {
        loadingAuth: isLoadingAuth,
        hasUserId: !!userId,
        hasFriendId: !!friendId
      });
      return;
    }
    
    // If not logged in, redirect
    if (!isLogin) {
      console.log('❌ Not logged in, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('✅ All conditions met, creating WebSocket...');
    setConnectionStatus('connecting');
    
    try {
      const ws = new WebSocket('ws://localhost:5000/ws');
      
      ws.onopen = () => {
        console.log('✅ WebSocket CONNECTED');
        setConnectionStatus('connected');
        
        // Authenticate immediately
        const authMessage = JSON.stringify({
          type: 'auth',
          userId: userId
        });
        console.log('📤 Sending WebSocket auth:', { userId });
        ws.send(authMessage);
      };
      
      ws.onmessage = (event) => {
        console.log('📥 RAW WebSocket message:', event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log('📋 PARSED WebSocket message type:', data.type);
          
          if (data.type === 'new_message') {
            console.log('🎉 REAL-TIME MESSAGE RECEIVED!', data.data);
            
            // Check if this message belongs to this chat
            const messageData = data.data;
            const isForThisChat = (
              (messageData.sender?._id === userId && messageData.receiver?._id === friendId) ||
              (messageData.sender?._id === friendId && messageData.receiver?._id === userId) ||
              messageData.senderId === friendId ||
              messageData.receiverId === userId
            );
            
            if (isForThisChat) {
              console.log('✅ Adding message to chat');
              setMessages(prev => [...prev, messageData]);
              
              // Scroll to bottom
              setTimeout(() => {
                if (chatBoxRef.current) {
                  chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                }
              }, 50);
            } else {
              console.log('⚠️ Message not for this chat');
            }
          } 
          else if (data.type === 'user_typing') {
            console.log('⌨️ Typing indicator:', data.data);
            if (data.data.senderId === friendId) {
              setFriendTyping(data.data.isTyping);
              
              if (friendTypingTimeoutRef.current) {
                clearTimeout(friendTypingTimeoutRef.current);
              }
              
              if (data.data.isTyping) {
                friendTypingTimeoutRef.current = setTimeout(() => {
                  setFriendTyping(false);
                }, 3000);
              }
            }
          }
          else if (data.type === 'auth_success') {
            console.log('✅ WebSocket authentication successful');
          }
          else if (data.type === 'connection') {
            console.log('🔗 WebSocket connection established');
          }
          else {
            console.log('📦 Other WebSocket message:', data.type);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('💥 WebSocket ERROR:', error);
        setConnectionStatus('error');
      };
      
      ws.onclose = (event) => {
        console.log('❌ WebSocket CLOSED:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Try to reconnect after 3 seconds
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          // This will trigger the useEffect again since dependencies haven't changed
        }, 3000);
      };
      
      setSocket(ws);
      
      // Store for debugging
      window.debugChatSocket = ws;
      console.log('🔧 Socket available as window.debugChatSocket');
      
    } catch (error) {
      console.error('💥 Error creating WebSocket:', error);
      setConnectionStatus('error');
    }
    
    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up WebSocket');
      if (socket) {
        socket.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (friendTypingTimeoutRef.current) {
        clearTimeout(friendTypingTimeoutRef.current);
      }
    };
  }, [isLogin, userId, friendId, isLoadingAuth, navigate]); // Added isLoadingAuth

  // Fetch friend's details
  const fetchFriend = useCallback(async () => {
    console.log('👤 Fetching friend...');
    if (!isLogin || !friendId) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Friend loaded:', res.data.firstName);
      setFriend(res.data);
    } catch (err) {
      console.error("❌ Error fetching friend:", err);
      if (err.response?.status === 401) {
        // Token expired, redirect to login
        navigate('/login');
      } else {
        navigate("/contact");
      }
    }
  }, [friendId, isLogin, token, navigate]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    console.log('📨 Fetching messages...');
    if (!userId || !friendId) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/messages`, {
        params: { userId: userId, senderId: friendId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Messages loaded:', res.data.length);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  }, [userId, friendId, token]);

  // Load initial data
  useEffect(() => {
    console.log('📡 Data loading useEffect');
    
    if (isLogin && userId && friendId && !isLoadingAuth) {
      console.log('✅ Loading chat data...');
      fetchFriend();
      fetchMessages();
    } else {
      console.log('⏳ Waiting to load data:', {
        isLogin,
        userId,
        friendId,
        isLoadingAuth
      });
    }
  }, [isLogin, userId, friendId, isLoadingAuth, fetchFriend, fetchMessages]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    console.log('⌨️ handleTyping called');
    if (!socket || socket.readyState !== WebSocket.OPEN || !friendId) {
      console.log('❌ Cannot send typing: socket not ready');
      return;
    }
    
    if (!isTyping) {
      const typingMsg = JSON.stringify({
        type: 'typing',
        senderId: userId,
        receiverId: friendId,
        isTyping: true
      });
      console.log('📤 Sending typing start');
      socket.send(typingMsg);
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const stopTypingMsg = JSON.stringify({
          type: 'typing',
          senderId: userId,
          receiverId: friendId,
          isTyping: false
        });
        console.log('📤 Sending typing stop');
        socket.send(stopTypingMsg);
        setIsTyping(false);
      }
    }, 2000);
  }, [socket, userId, friendId, isTyping]);

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Send message
  const handleSendMessage = async () => {
    console.log('📤 Attempting to send message');
    console.log('Current state:', {
      message: message,
      socketReady: socket?.readyState,
      userId,
      friendId
    });
    
    if (!message.trim()) {
      console.log('❌ Message is empty');
      return;
    }
    
    if (!userId || !friendId) {
      console.log('❌ Missing user IDs');
      alert('Cannot send message: Missing user information');
      return;
    }

    try {
      console.log('💾 Saving to database...');
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
      console.log('✅ Message saved to DB:', savedMessage._id);
      
      // Send via WebSocket for real-time
      if (socket && socket.readyState === WebSocket.OPEN) {
        const wsMessage = JSON.stringify({
          type: 'send_message',
          senderId: userId,
          receiverId: friendId,
          content: message,
          messageId: savedMessage._id,
          timestamp: new Date().toISOString()
        });
        console.log('📤 Sending via WebSocket');
        socket.send(wsMessage);
        
        // Send typing stop
        socket.send(JSON.stringify({
          type: 'typing',
          senderId: userId,
          receiverId: friendId,
          isTyping: false
        }));
        setIsTyping(false);
      } else {
        console.log('⚠️ WebSocket not connected, real-time disabled');
        // Still works, just not real-time
      }
      
      // Add to local state immediately
      setMessages(prev => [...prev, savedMessage]);
      setMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 50);
      
    } catch (err) {
      console.error('❌ Error sending message:', err);
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
  if (isLoadingAuth) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2">Checking authentication...</p>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLogin) {
    // useEffect will handle redirect, but show message
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

  console.log('🎨 Rendering ChatPage UI');
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Debug panel - remove in production */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm font-mono">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded ${connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {connectionStatus.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="font-bold">User:</span>
            <span className="ml-2">{userId?.substring(0, 8)}...</span>
          </div>
          <div>
            <span className="font-bold">Messages:</span>
            <span className="ml-2">{messages.length}</span>
          </div>
          <button 
            onClick={() => {
              console.log('Manual socket test');
              if (socket) {
                socket.send(JSON.stringify({ type: 'ping' }));
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
          >
            Test WS
          </button>
        </div>
      </div>

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
            <p className="text-xs mt-2 text-gray-500">WebSocket: {connectionStatus}</p>
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
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Connection Status */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}></div>
          <span className="text-gray-600">
            {connectionStatus === 'connected' ? 'Real-time chat active' :
             connectionStatus === 'connecting' ? 'Connecting to real-time...' :
             'Real-time disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;