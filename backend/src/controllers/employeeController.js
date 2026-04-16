const { Project, Task, User } = require('../models');

// Get projects assigned to current employee
const getMyProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter for projects where current user is assigned as employee
    const filter = { employees: req.user._id };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('client', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects'
    });
  }
};

// Get tasks assigned to current employee
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

// Submit work report
const submitReport = async (req, res) => {
  try {
    const { taskId, report, progress, attachments } = req.body;

    // Validate task exists and is assigned to current user
    const task = await Task.findOne({ _id: taskId, assignedTo: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you'
      });
    }

    // Update task with report and progress
    task.notes = report || task.notes;
    task.progress = progress || task.progress;
    
    if (attachments && attachments.length > 0) {
      task.attachments.push(...attachments);
    }

    await task.save();
    await task.populate('project', 'title');

    res.json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting report'
    });
  }
};

// Get dashboard stats for employee
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get task statistics
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get project statistics
    const projectStats = await Project.aggregate([
      { $match: { employees: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get upcoming deadlines (next 7 days)
    const upcomingDeadlines = await Task.find({
      assignedTo: userId,
      status: { $in: ['pending', 'in_progress'] },
      dueDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    .populate('project', 'title')
    .sort({ dueDate: 1 })
    .limit(5);

    // Format stats
    const formattedTaskStats = taskStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const formattedProjectStats = projectStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        taskStats: {
          pending: formattedTaskStats.pending || 0,
          in_progress: formattedTaskStats.in_progress || 0,
          completed: formattedTaskStats.completed || 0,
          cancelled: formattedTaskStats.cancelled || 0
        },
        projectStats: {
          pending: formattedProjectStats.pending || 0,
          in_progress: formattedProjectStats.in_progress || 0,
          completed: formattedProjectStats.completed || 0,
          cancelled: formattedProjectStats.cancelled || 0
        },
        upcomingDeadlines
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats'
    });
  }
};

module.exports = {
  getMyProjects,
  getMyTasks,
  submitReport,
  getDashboardStats
};
