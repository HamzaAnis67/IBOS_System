const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  createNotification, 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getNotificationCount 
} = require('../controllers/notificationController');

// All routes require authentication
router.use(authMiddleware);

// Create notification (admin only)
router.post('/', roleMiddleware(['admin']), createNotification);

// Get notifications for current user
router.get('/', getNotifications);

// Get notification count for current user
router.get('/count', getNotificationCount);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.put('/read-all', markAllAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;
