const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required']
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String
  },
  seen: {
    type: Boolean,
    default: false
  },
  seenAt: {
    type: Date
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Set seenAt when message is marked as seen
messageSchema.pre('save', function(next) {
  if (this.isModified('seen') && this.seen && !this.seenAt) {
    this.seenAt = new Date();
  }
  next();
});

// Set deletedAt when message is marked as deleted
messageSchema.pre('save', function(next) {
  if (this.isModified('deleted') && this.deleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
