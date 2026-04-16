const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'task', 'project', 'invoice', 'message'],
    default: 'info'
  },
  relatedTo: {
    type: String,
    enum: ['project', 'task', 'invoice', 'message', 'user'],
    default: null
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  actionUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Set readAt when notification is marked as read
notificationSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
