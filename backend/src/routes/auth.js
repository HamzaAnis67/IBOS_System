const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { login, signup, refreshToken, getProfile } = require('../controllers/authController');

// Login route
router.post('/login', login);

// Signup route (for clients)
router.post('/signup', signup);

// Refresh token route
router.post('/refresh', refreshToken);

// Get current user profile (protected)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
