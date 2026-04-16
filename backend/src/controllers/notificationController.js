const { Notification } = require('../models');
const Joi = require('joi');

// Validation schemas
const createNotificationSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  message: Joi.string().required().min(1).max(500),
  user: Joi.string().required(),
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'task', 'project', 'invoice', 'message').optional(),
  relatedTo: Joi.string().valid('project', 'task', 'invoice', 'message', 'user').optional(),
  relatedId: Joi.string().optional(),
  actionUrl: Joi.string().optional()
});

// Create notification (admin only)
const createNotification = async (req, res) => {
  try {
    const { error } = createNotificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const notification = new Notification(req.body);
    await notification.save();
    await notification.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: {
        notification
      }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating notification'
    });
  }
};

// Get notifications for current user
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read, type } = req.query;
    const skip = (page - 1) * limit;

    // Build filter for current user
    const filter = { user: req.user._id };
    if (read !== undefined) filter.read = read === 'true';
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const currentUserId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: currentUserId },
      { read: true },
      { new: true }
    ).populate('user', 'name email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification
      }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking notification as read'
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    await Notification.updateMany(
      { user: currentUserId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking all notifications as read'
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const currentUserId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: currentUserId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting notification'
    });
  }
};

// Get notification count
const getNotificationCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const unreadCount = await Notification.countDocuments({
      user: currentUserId,
      read: false
    });

    res.json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get notification count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notification count'
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount
};
