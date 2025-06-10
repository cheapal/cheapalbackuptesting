// server/utils/socket.js
import { Server } from 'socket.io';

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  console.log('🔌 Socket.IO initialized...');

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Sent by ChatPage.js
    const chatId = socket.handshake.query.chatId; // Sent by ChatPage.js

    console.log(`🔌 New client connected: ${socket.id}. UserID: ${userId}, ChatID: ${chatId}`);

    // Join user-specific room (for general notifications, if any)
    if (userId) {
      const userRoom = `user_${userId}`;
      socket.join(userRoom);
      console.log(`Socket ${socket.id} (User: ${userId}) joined user room: ${userRoom}`);
    }

    // Join chat-specific room (for receiving messages for this chat)
    if (chatId) {
      const chatRoom = `chat_${chatId}`;
      socket.join(chatRoom);
      console.log(`Socket ${socket.id} (User: ${userId}) joined chat room: ${chatRoom} for ChatID: ${chatId}`);
    } else {
      console.warn(`Socket ${socket.id} (User: ${userId}) connected without a specific ChatID in query.`);
    }
    
    // Example: Join room based on orderId (if still needed for other features)
    socket.on('joinOrderRoom', (orderId) => {
      if (orderId) {
        const orderRoomName = `order_${orderId}`; // Consistent room naming
        socket.join(orderRoomName);
        console.log(`Socket ${socket.id} joined order room: ${orderRoomName}`);
      }
    });

    // IMPORTANT: Handling new messages emission
    // The 'newMessage' event listener below is likely NOT how your ChatPage.js sends messages.
    // ChatPage.js uses an HTTP request via `chatService.sendMessage` to send a message.
    // After your backend API route (e.g., POST /api/chats/:chatId/messages) successfully saves a message,
    // THAT route handler should use `getIO().to('chat_YOUR_CHAT_ID').emit('messageReceived', savedMessage);`
    // to broadcast the message to other clients in the specific chat room.

    /*
    // This listener might be for a different type of socket message, or is redundant
    // if messages are sent via HTTP API and then broadcasted by the server.
    socket.on('newMessage', (message) => {
      // If this is intended for direct socket-to-socket relay without DB save first,
      // ensure the client is emitting 'newMessage' with the correct structure.
      // For a typical chat app, this is handled by the HTTP endpoint.
      if (message && message.chat) { 
        const targetRoom = `chat_${message.chat._id || message.chat}`;
        console.log(`Relaying 'newMessage' event to room ${targetRoom}:`, message);
        // Emitting to the room. Consider if sender should also receive this or if client handles optimistically.
        io.to(targetRoom).emit('messageReceived', message); 
      } else {
        console.warn('Received "newMessage" socket event without chat ID or message content:', message);
      }
    });
    */

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id}. UserID: ${userId}, ChatID: ${chatId}. Reason: ${reason}`);
      // Server automatically handles leaving rooms on disconnect.
      // You can add custom cleanup here if needed.
    });

    socket.on('connect_error', (err) => {
        console.error(`Socket connection error for ${socket.id}: ${err.message}`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initializeSocket(httpServer) first.');
  }
  return io;
};

export { initializeSocket, getIO };
