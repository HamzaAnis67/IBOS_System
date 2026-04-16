const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { uploadMultiple } = require('../middlewares/upload');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');

// All routes require authentication
router.use(authMiddleware);

// Create project (admin only)
router.post('/', roleMiddleware(['admin']), createProject);

// Get all projects (admin, employee, client)
router.get('/', getProjects);

// Get project by ID (admin, employee, client)
router.get('/:id', getProjectById);

// Update project (admin only)
router.put('/:id', roleMiddleware(['admin']), updateProject);

// Delete project (admin only)
router.delete('/:id', roleMiddleware(['admin']), deleteProject);

module.exports = router;
