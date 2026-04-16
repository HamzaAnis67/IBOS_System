const { Message, User } = require('../models');
const jwt = require('jsonwebtoken');

// Socket.io chat handler
const chatHandler = (io) => {
  // Store connected users
  const connectedUsers = new Map();

  // Authentication middleware for socket connections
  const authenticateSocket = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  };

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);
    
    // Store user socket mapping
    connectedUsers.set(socket.user._id.toString(), socket.id);
    
    // Join user to their own room for private messages
    socket.join(socket.user._id.toString());

    // Send online users list to all connected users
    const onlineUsers = Array.from(connectedUsers.keys());
    io.emit('users_online', onlineUsers);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiver, message, file } = data;
        
        // Validate receiver exists
        const receiverUser = await User.findById(receiver);
        if (!receiverUser) {
          socket.emit('error', { message: 'Receiver not found' });
          return;
        }

        // Don't allow sending message to self
        if (receiver === socket.user._id.toString()) {
          socket.emit('error', { message: 'Cannot send message to yourself' });
          return;
        }

        // Create and save message
        const newMessage = new Message({
          sender: socket.user._id,
          receiver,
          message,
          file: file || null
        });

        await newMessage.save();
        await newMessage.populate('sender', 'name email profileImage');
        await newMessage.populate('receiver', 'name email profileImage');

        // Send message to both sender and receiver
        io.to(socket.user._id.toString()).emit('receive_message', newMessage);
        io.to(receiver).emit('receive_message', newMessage);

        // Send notification to receiver if they're online
        const receiverSocket = connectedUsers.get(receiver);
        if (receiverSocket) {
          io.to(receiver).emit('new_message_notification', {
            message: newMessage,
            sender: socket.user
          });
        }

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle marking messages as seen
    socket.on('mark_seen', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findOneAndUpdate(
          { _id: messageId, receiver: socket.user._id },
          { seen: true },
          { new: true }
        )
        .populate('sender', 'name email')
        .populate('receiver', 'name email');

        if (message) {
          // Notify sender that message was seen
          io.to(message.sender._id.toString()).emit('message_seen', message);
        }

      } catch (error) {
        console.error('Mark seen error:', error);
        socket.emit('error', { message: 'Failed to mark message as seen' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { receiver } = data;
      io.to(receiver).emit('user_typing', {
        userId: socket.user._id,
        userName: socket.user.name,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { receiver } = data;
      io.to(receiver).emit('user_typing', {
        userId: socket.user._id,
        userName: socket.user.name,
        isTyping: false
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.user._id})`);
      
      // Remove user from connected users
      connectedUsers.delete(socket.user._id.toString());
      
      // Send updated online users list
      const onlineUsers = Array.from(connectedUsers.keys());
      io.emit('users_online', onlineUsers);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = chatHandler;
