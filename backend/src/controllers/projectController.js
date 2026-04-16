const { Project, User } = require('../models');
const Joi = require('joi');

// Validation schemas
const createProjectSchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(10),
  client: Joi.string().required(),
  employees: Joi.array().items(Joi.string()).optional(),
  budget: Joi.number().required().min(0),
  startDate: Joi.date().required(),
  deadline: Joi.date().required(),
  notes: Joi.string().optional()
});

const updateProjectSchema = Joi.object({
  title: Joi.string().optional().min(2).max(100),
  description: Joi.string().optional().min(10),
  client: Joi.string().optional(),
  employees: Joi.array().items(Joi.string()).optional(),
  budget: Joi.number().optional().min(0),
  startDate: Joi.date().optional(),
  deadline: Joi.date().optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
  progress: Joi.number().optional().min(0).max(100),
  notes: Joi.string().optional()
});

// Create project
const createProject = async (req, res) => {
  try {
    const { error } = createProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { title, description, client, employees, budget, startDate, deadline, notes } = req.body;

    // Validate client exists and is a client user
    const clientUser = await User.findById(client);
    if (!clientUser || clientUser.role !== 'client') {
      return res.status(400).json({
        success: false,
        message: 'Invalid client user'
      });
    }

    // Validate employees exist and are employees
    if (employees && employees.length > 0) {
      const employeeUsers = await User.find({ _id: { $in: employees }, role: 'employee' });
      if (employeeUsers.length !== employees.length) {
        return res.status(400).json({
          success: false,
          message: 'Some assigned users are not valid employees'
        });
      }
    }

    const project = new Project({
      title,
      description,
      client,
      employees: employees || [],
      budget,
      startDate,
      deadline,
      notes
    });

    await project.save();
    await project.populate('client', 'name email');
    await project.populate('employees', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating project'
    });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, client, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (client) filter.client = client;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('client', 'name email phone')
      .populate('employees', 'name email department')
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
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects'
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('client', 'name email phone')
      .populate('employees', 'name email department');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching project'
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { error } = updateProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Validate client if being updated
    if (updates.client) {
      const clientUser = await User.findById(updates.client);
      if (!clientUser || clientUser.role !== 'client') {
        return res.status(400).json({
          success: false,
          message: 'Invalid client user'
        });
      }
    }

    // Validate employees if being updated
    if (updates.employees) {
      const employeeUsers = await User.find({ _id: { $in: updates.employees }, role: 'employee' });
      if (employeeUsers.length !== updates.employees.length) {
        return res.status(400).json({
          success: false,
          message: 'Some assigned users are not valid employees'
        });
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('client', 'name email phone')
    .populate('employees', 'name email department');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating project'
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting project'
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
