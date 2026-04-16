const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');
const { 
  sendMessage, 
  getConversation, 
  getConversations, 
  markAsSeen, 
  deleteMessage 
} = require('../controllers/messageController');

// All routes require authentication
router.use(authMiddleware);

// Send message
router.post('/send', sendMessage);

// Get conversation with specific user
router.get('/conversation/:userId', getConversation);

// Get all conversations
router.get('/conversations', getConversations);

// Mark message as seen
router.put('/:messageId/seen', markAsSeen);

// Delete message
router.delete('/:messageId', deleteMessage);

module.exports = router;
