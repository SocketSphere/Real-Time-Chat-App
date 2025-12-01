// frontend/src/components/ChatPage.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Phone, Video, Trash2 } from "lucide-react";

const ChatPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [friendTyping, setFriendTyping] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const friendTypingTimeoutRef = useRef(null);

  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isLogin || !userId) return;
    
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:5000/ws');
    
    ws.onopen = () => {
      // console.log('WebSocket connected for chat');
      // Authenticate the WebSocket connection
      ws.send(JSON.stringify({
        type: 'auth',
        userId: userId
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          // Add the new message to the chat
          setMessages(prev => [...prev, data.data]);
          
          // Scroll to bottom
          setTimeout(() => {
            if (chatBoxRef.current) {
              chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
          }, 100);
        } else if (data.type === 'user_typing') {
          // Handle typing indicator from friend
          if (data.data.senderId === friendId) {
            setFriendTyping(data.data.isTyping);
            
            // Clear previous timeout
            if (friendTypingTimeoutRef.current) {
              clearTimeout(friendTypingTimeoutRef.current);
            }
            
            // Auto-hide typing indicator after 3 seconds if no follow-up
            if (data.data.isTyping) {
              friendTypingTimeoutRef.current = setTimeout(() => {
                setFriendTyping(false);
              }, 3000);
            }
          }
        } else if (data.type === 'message_sent') {
          // Update message status if needed
          setMessages(prev => prev.map(msg => 
            msg._id === data.data._id 
              ? { ...msg, status: data.data.status }
              : msg
          ));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      // console.log('WebSocket disconnected');
    };
    
    setSocket(ws);
    
    // Cleanup on unmount
    return () => {
      if (ws) ws.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (friendTypingTimeoutRef.current) clearTimeout(friendTypingTimeoutRef.current);
    };
  }, [isLogin, userId, friendId]);

  // Fetch friend's details
  const fetchFriend = useCallback(async () => {
    if (!isLogin) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${friendId}`);
      setFriend(res.data);
    } catch (err) {
      console.log("Error fetching friend:", err);
      // Redirect if friend doesn't exist
      navigate("/contact");
    }
  }, [friendId, isLogin, navigate]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages`, {
        params: { userId: userId, senderId: friendId },
      });
      setMessages(res.data);
    } catch (err) {
      console.log("Error fetching messages:", err);
    }
  }, [userId, friendId]);

  useEffect(() => {
    if (isLogin) {
      fetchFriend();
      fetchMessages();
    }
  }, [isLogin, fetchFriend, fetchMessages]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !friendId) return;
    
    // Send typing start
    if (!isTyping) {
      socket.send(JSON.stringify({
        type: 'typing',
        senderId: userId,
        receiverId: friendId,
        isTyping: true
      }));
      setIsTyping(true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to send typing stop after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'typing',
          senderId: userId,
          receiverId: friendId,
          isTyping: false
        }));
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
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    try {
      // First save to database
      const response = await axios.post(`http://localhost:5000/api/messages`, {
        sender: userId,
        receiver: friendId,
        content: message,
      });
      
      const savedMessage = response.data;
      
      // Send via WebSocket for real-time delivery
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'send_message',
          senderId: userId,
          receiverId: friendId,
          content: message,
          messageId: savedMessage._id,
          timestamp: new Date().toISOString()
        }));
      }
      
      // Send typing stop
      socket.send(JSON.stringify({
        type: 'typing',
        senderId: userId,
        receiverId: friendId,
        isTyping: false
      }));
      setIsTyping(false);
      
      // Optimistically add to local state
      setMessages(prev => [...prev, savedMessage]);
      setMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 100);
      
    } catch (err) {
      console.log(err);
      alert('Failed to send message');
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

  if (!friend) return <p className="p-6">Loading chat...</p>;

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
            {messages.map((m) => (
              <div
                key={m._id}
                className={`flex ${m.sender._id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                    m.sender._id === userId
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  <p className="break-words">{m.content}</p>
                  <div className={`flex justify-between items-center mt-1 ${
                    m.sender._id === userId ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {m.sender._id === userId && (
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
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <div>
          {socket && socket.readyState === WebSocket.OPEN ? (
            <span className="text-green-600">● Connected</span>
          ) : socket && socket.readyState === WebSocket.CONNECTING ? (
            <span className="text-yellow-600">● Connecting...</span>
          ) : (
            <span className="text-red-600">● Disconnected</span>
          )}
        </div>
        <div>
          {isTyping && <span className="text-blue-600">You are typing...</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;