const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Create user
router.post('/create', createUser);

// Get all users with pagination and filtering
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
