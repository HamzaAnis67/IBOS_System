const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  createTask, 
  getTasks, 
  updateTask, 
  getMyTasks 
} = require('../controllers/taskController');

// All routes require authentication
router.use(authMiddleware);

// Create task (admin only)
router.post('/', roleMiddleware(['admin']), createTask);

// Get all tasks (admin only)
router.get('/', roleMiddleware(['admin']), getTasks);

// Update task (admin or assigned employee)
router.put('/:id', updateTask);

// Get my tasks (employee only)
router.get('/my-tasks', roleMiddleware(['employee']), getMyTasks);

module.exports = router;
