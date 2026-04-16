const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required']
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: 0
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Validate that deadline is after start date
projectSchema.pre('save', function(next) {
  if (this.deadline <= this.startDate) {
    next(new Error('Deadline must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Project', projectSchema);
