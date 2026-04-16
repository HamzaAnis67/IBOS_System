const { Task, Project, User } = require('../models');
const Joi = require('joi');

// Validation schemas
const createTaskSchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(10),
  project: Joi.string().required(),
  assignedTo: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  dueDate: Joi.date().required(),
  notes: Joi.string().optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional().min(2).max(100),
  description: Joi.string().optional().min(10),
  assignedTo: Joi.string().optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
  progress: Joi.number().optional().min(0).max(100),
  notes: Joi.string().optional()
});

// Create task
const createTask = async (req, res) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { title, description, project, assignedTo, priority, dueDate, notes } = req.body;

    // Validate project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Validate assigned user exists and is an employee
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Invalid assigned employee'
      });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      priority: priority || 'medium',
      dueDate,
      notes
    });

    await task.save();
    await task.populate('project', 'title');
    await task.populate('assignedTo', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task'
    });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, project, assignedTo, status, priority, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('project', 'title')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks'
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Validate assigned user if being updated
    if (updates.assignedTo) {
      const assignedUser = await User.findById(updates.assignedTo);
      if (!assignedUser || assignedUser.role !== 'employee') {
        return res.status(400).json({
          success: false,
          message: 'Invalid assigned employee'
        });
      }
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('project', 'title')
    .populate('assignedTo', 'name email department');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task'
    });
  }
};

// Get tasks for current employee
const getMyTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter for current user's tasks
    const filter = { assignedTo: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  getMyTasks
};
