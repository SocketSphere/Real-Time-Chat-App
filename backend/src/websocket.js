// backend/src/websocket.js - COMPLETE FIXED VERSION
import { WebSocketServer } from 'ws';

class WebSocketManager {
  constructor() {
    this.clients = new Map(); // Map to store client connections
    this.wss = null;
  }

  initialize(server) {
    const wss = new WebSocketServer({ 
      server,
      path: '/ws'  // WebSocket endpoint path
    });

    this.wss = wss;

    wss.on('connection', (ws, req) => {
      console.log('🔌 New WebSocket connection established');
      console.log('📡 Client IP:', req.socket.remoteAddress);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          console.log('📥 Received WebSocket message:', data.type);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Invalid message format' 
          }));
        }
      });

      ws.on('close', () => {
        console.log('❌ WebSocket connection closed');
        this.removeClient(ws);
      });

      ws.on('error', (error) => {
        console.error('💥 WebSocket error:', error);
        this.removeClient(ws);
      });

      // Send welcome message
      ws.send(JSON.stringify({ 
        type: 'connection', 
        message: 'Connected to WebSocket server' 
      }));
    });

    console.log('✅ WebSocket server initialized on path /ws');
  }

  handleMessage(ws, data) {
    console.log(`📨 Handling message type: ${data.type}`);
    
    switch (data.type) {
      case 'auth':
        this.handleAuth(ws, data);
        break;
      case 'ping':
        console.log('🏓 Received ping, sending pong');
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      case 'send_message':
        console.log('📤 Processing send_message:', {
          from: data.senderId,
          to: data.receiverId
        });
        this.handleSendMessage(data);
        break;
      case 'typing':
        this.handleTyping(data);
        break;
      default:
        console.log('⚠️ Unhandled message type:', data.type);
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
    
    console.log(`✅ User ${userId} authenticated via WebSocket`);
    console.log(`👥 Total connected users: ${this.clients.size}`);
    
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
        console.log(`🗑️ Removed client ${userId}`);
        console.log(`👥 Remaining connected users: ${this.clients.size}`);
        break;
      }
    }
  }

  // 🔥 CRITICAL: Add this method for sending messages
  sendMessageToUser(userId, messageData) {
    console.log(`📤 Attempting to send to user ${userId}`);
    console.log(`👥 Connected clients:`, Array.from(this.clients.keys()));
    
    const client = this.clients.get(userId);
    
    if (client) {
      console.log(`✅ Found client for user ${userId}`);
      console.log(`📊 Client readyState:`, client.readyState);
      
      if (client.readyState === 1) { // 1 = WebSocket.OPEN
        try {
          const jsonMessage = JSON.stringify(messageData);
          console.log(`📨 Sending message type: ${messageData.type}`);
          client.send(jsonMessage);
          console.log(`✅ Message sent to user ${userId}`);
          return true;
        } catch (error) {
          console.error(`❌ Error sending to user ${userId}:`, error);
          return false;
        }
      } else {
        console.log(`❌ Client for user ${userId} is not OPEN. State:`, client.readyState);
        return false;
      }
    } else {
      console.log(`❌ User ${userId} not found in connected clients`);
      console.log(`   Available users:`, Array.from(this.clients.keys()));
      return false;
    }
  }

  // Also keep the sendNotification method for compatibility
  sendNotification(userId, notificationData) {
    console.log(`📢 Sending notification to user ${userId}`);
    return this.sendMessageToUser(userId, {
      type: 'new_notification',
      data: notificationData
    });
  }

  // Handle direct send_message from WebSocket
  handleSendMessage(data) {
    console.log('🔌 handleSendMessage called:', {
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content
    });
    
    const { senderId, receiverId, content, messageId, timestamp } = data;
    
    // Check if receiver is connected
    const receiverClient = this.clients.get(receiverId);
    
    if (receiverClient && receiverClient.readyState === 1) {
      console.log('📤 Forwarding message to receiver:', receiverId);
      
      receiverClient.send(JSON.stringify({
        type: 'new_message',
        data: {
          _id: messageId,
          sender: { _id: senderId },
          receiver: { _id: receiverId },
          content: content,
          createdAt: timestamp || new Date().toISOString(),
          status: 'delivered'
        }
      }));
      
      console.log('✅ Message forwarded via WebSocket');
      
      // Send confirmation to sender
      const senderClient = this.clients.get(senderId);
      if (senderClient && senderClient.readyState === 1) {
        senderClient.send(JSON.stringify({
          type: 'message_sent',
          data: { _id: messageId, status: 'delivered' }
        }));
      }
    } else {
      console.log(`❌ Receiver ${receiverId} not connected or not open`);
    }
  }

  // Handle typing indicator
  handleTyping(data) {
    const { senderId, receiverId, isTyping } = data;
    console.log(`⌨️ Typing: ${senderId} -> ${receiverId} (${isTyping})`);
    
    const receiverClient = this.clients.get(receiverId);
    if (receiverClient && receiverClient.readyState === 1) {
      receiverClient.send(JSON.stringify({
        type: 'user_typing',
        data: { senderId, isTyping }
      }));
    }
  }

  // Method to broadcast to all clients
  broadcast(message, excludeUserId = null) {
    console.log(`📢 Broadcasting to all clients (except ${excludeUserId})`);
    for (const [userId, client] of this.clients.entries()) {
      if (userId !== excludeUserId && client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    }
  }
}

// Create a singleton instance
const webSocketManager = new WebSocketManager();

export default webSocketManager;