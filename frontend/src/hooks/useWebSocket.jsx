// src/hooks/useWebSocket.jsx - UPDATED VERSION
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { incrementNotificationCount } from '../redux/notificationSlice.js';
import { useSelector } from "react-redux";

const useWebSocket = () => {
  const dispatch = useDispatch();
  const { user, isLogin } = useSelector(state => state.auth);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  // Store message handlers
  const messageHandlersRef = useRef(new Map());

  const connect = useCallback(() => {
    if (!isLogin || !user) return;

    try {
      // Close existing socket if any
      if (socketRef.current) {
        socketRef.current.close();
      }

      console.log('🔌 Attempting to connect to WebSocket...');
      socketRef.current = new WebSocket('ws://localhost:5000/ws');

      socketRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        reconnectAttemptsRef.current = 0;
        
        // Authenticate the WebSocket connection
        socketRef.current.send(JSON.stringify({
          type: 'auth',
          userId: user._id
        }));
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 WebSocket message received:', data.type);
          
          if (data.type === 'new_notification') {
            // Increment the notification count
            dispatch(incrementNotificationCount());
          } else if (data.type === 'pong') {
            console.log('🏓 Received pong');
          } else if (data.type === 'new_message') {
            // 🔥 Handle chat messages - broadcast to all handlers
            console.log('💬 Chat message received:', data.data.content);
            
            // Call all registered message handlers
            messageHandlersRef.current.forEach((handler) => {
              try {
                handler(data.data);
              } catch (error) {
                console.error('Error in message handler:', error);
              }
            });
          } else if (data.type === 'user_typing') {
            // 🔥 Handle typing indicators
            console.log('⌨️ Typing indicator:', data.data);
            
            // Broadcast typing events
            const typingEvent = new CustomEvent('websocket:typing', {
              detail: data.data
            });
            window.dispatchEvent(typingEvent);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socketRef.current.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason);
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff
          console.log(`Attempting to reconnect in ${timeout / 1000} seconds... (Attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, timeout);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('💥 WebSocket error:', error);
        // The onclose will be called after this
      };

      // Set up heartbeat
      const heartbeatInterval = setInterval(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // Send ping every 30 seconds

      // Store the interval to clear it later
      socketRef.current.heartbeatInterval = heartbeatInterval;

    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [isLogin, user, dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Clear heartbeat interval
      if (socketRef.current.heartbeatInterval) {
        clearInterval(socketRef.current.heartbeatInterval);
      }
      
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Clear all message handlers
    messageHandlersRef.current.clear();
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Register a message handler
  const onMessage = useCallback((handlerId, handler) => {
    messageHandlersRef.current.set(handlerId, handler);
    console.log(`📝 Registered message handler: ${handlerId}`);
    
    // Return cleanup function
    return () => {
      messageHandlersRef.current.delete(handlerId);
      console.log(`🗑️ Removed message handler: ${handlerId}`);
    };
  }, []);

  // Send message via WebSocket
  const send = useCallback((data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        const jsonData = JSON.stringify(data);
        console.log('📤 Sending via WebSocket:', data.type);
        socketRef.current.send(jsonData);
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      console.log('⚠️ WebSocket not connected, cannot send');
      return false;
    }
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((receiverId, isTyping) => {
    return send({
      type: 'typing',
      senderId: user?._id,
      receiverId,
      isTyping
    });
  }, [send, user]);

  // Send chat message
  const sendChatMessage = useCallback((receiverId, content, messageId) => {
    return send({
      type: 'send_message',
      senderId: user?._id,
      receiverId,
      content,
      messageId: messageId || `temp_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }, [send, user]);

  // Get connection status
  const getStatus = useCallback(() => {
    if (!socketRef.current) return 'disconnected';
    
    const states = ['connecting', 'open', 'closing', 'closed'];
    return states[socketRef.current.readyState] || 'unknown';
  }, []);

  // Manual reconnect
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  // Public API
  const api = useMemo(() => ({
    send,
    sendTyping,
    sendChatMessage,
    onMessage,
    getStatus,
    reconnect,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN
  }), [send, sendTyping, sendChatMessage, onMessage, getStatus, reconnect]);

  return api;
};

export default useWebSocket;