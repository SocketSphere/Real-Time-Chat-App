// src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
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

  const connect = useCallback(() => {
    if (!isLogin || !user) return;

    try {
      // Close existing socket if any
      if (socketRef.current) {
        socketRef.current.close();
      }

      // console.log('Attempting to connect to WebSocket...');
      socketRef.current = new WebSocket('ws://localhost:5000/ws');

      socketRef.current.onopen = () => {
        // console.log('WebSocket connected');
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
          
          if (data.type === 'new_notification') {
            // Increment the notification count
            dispatch(incrementNotificationCount());
          } else if (data.type === 'pong') {
            // Handle pong response for heartbeat
            console.log('Received pong');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socketRef.current.onclose = () => {
        // console.log('WebSocket disconnected:', event.code, event.reason);
        
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
        console.error('WebSocket error:', error);
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
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Optional: Return a function to manually reconnect
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  return { reconnect };
};

export default useWebSocket;