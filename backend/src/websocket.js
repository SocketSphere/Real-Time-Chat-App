// src/websocket.js
import { WebSocketServer } from 'ws';

class WebSocketManager {
  constructor() {
    this.clients = new Map(); // Map to store client connections
  }

  initialize(server) {
    const wss = new WebSocketServer({ 
      server,
      path: '/ws'  // WebSocket endpoint path
    });

    wss.on('connection', (ws, req) => {
      // console.log('New WebSocket connection established');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Invalid message format' 
          }));
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.removeClient(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.removeClient(ws);
      });

      // Send welcome message
      ws.send(JSON.stringify({ 
        type: 'connection', 
        message: 'Connected to WebSocket server' 
      }));
    });

    console.log('WebSocket server initialized');
    this.wss = wss;
  }

  // backend/src/websocket.js
// Add this to the handleMessage method
handleMessage(ws, data) {
  switch (data.type) {
    case 'auth':
      this.handleAuth(ws, data);
      break;
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;
    case 'send_message': // NEW: Handle sending messages via WebSocket
      this.handleSendMessage(data);
      break;
    case 'typing': // Optional: Typing indicators
      this.handleTyping(data);
      break;
    default:
      console.log('Unhandled message type:', data.type);
  }
}

// NEW: Handle sending messages
handleSendMessage(data) {
  const { senderId, receiverId, content, messageId, timestamp } = data;
  
  // Broadcast to receiver
  const receiverClient = this.clients.get(receiverId);
  if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
    receiverClient.send(JSON.stringify({
      type: 'new_message',
      data: {
        _id: messageId,
        sender: { _id: senderId },
        receiver: { _id: receiverId },
        content: content,
        createdAt: timestamp,
        status: 'delivered'
      }
    }));
    console.log(`Message sent via WebSocket to user ${receiverId}`);
  }
  
  // Also send back to sender for confirmation
  const senderClient = this.clients.get(senderId);
  if (senderClient && senderClient.readyState === WebSocket.OPEN) {
    senderClient.send(JSON.stringify({
      type: 'message_sent',
      data: {
        _id: messageId,
        status: 'delivered'
      }
    }));
  }
}

// NEW: Typing indicator handler (optional)
handleTyping(data) {
  const { senderId, receiverId, isTyping } = data;
  const receiverClient = this.clients.get(receiverId);
  if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
    receiverClient.send(JSON.stringify({
      type: 'user_typing',
      data: { senderId, isTyping }
    }));
  }
}

  handleAuth(ws, data) {
    const { userId } = data;
    
    if (!userId) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'User ID required for authentication' 
      }));
      return;
    }

    // Store the client connection with user ID
    this.clients.set(userId, ws);
    
    // console.log(`User ${userId} authenticated via WebSocket`);
    
    ws.send(JSON.stringify({ 
      type: 'auth_success', 
      message: 'Authentication successful' 
    }));
  }

  removeClient(ws) {
    // Remove client from the map
    for (const [userId, client] of this.clients.entries()) {
      if (client === ws) {
        this.clients.delete(userId);
        console.log(`Removed client ${userId}`);
        break;
      }
    }
  }

  sendNotification(userId, notificationData) {
    const client = this.clients.get(userId);
    
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'new_notification',
        data: notificationData
      }));
      console.log(`Notification sent to user ${userId}`);
      return true;
    }
    
    return false;
  }

  // Method to broadcast to all clients
  broadcast(message, excludeUserId = null) {
    for (const [userId, client] of this.clients.entries()) {
      if (userId !== excludeUserId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }

  // Add this method to your WebSocketManager class
sendMessageToUser(userId, messageData) {
  const client = this.clients.get(userId);
  
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({
      type: 'new_message',
      data: messageData
    }));
    console.log(`Message sent to user ${userId}`);
    return true;
  }
  
  console.log(`User ${userId} is not connected via WebSocket`);
  return false;
}
}

// Create a singleton instance
const webSocketManager = new WebSocketManager();

export default webSocketManager;