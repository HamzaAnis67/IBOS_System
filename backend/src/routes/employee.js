const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  getMyProjects, 
  getMyTasks, 
  submitReport, 
  getDashboardStats 
} = require('../controllers/employeeController');

// All routes require authentication and employee role
router.use(authMiddleware);
router.use(roleMiddleware(['employee']));

// Get my projects
router.get('/projects', getMyProjects);

// Get my tasks
router.get('/tasks', getMyTasks);

// Submit work report
router.post('/reports/submit', submitReport);

// Get dashboard stats
router.get('/dashboard', getDashboardStats);

module.exports = router;
