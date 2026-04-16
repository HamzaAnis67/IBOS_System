const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  getMyProjects, 
  getMyInvoices, 
  getDashboardStats 
} = require('../controllers/clientController');

// All routes require authentication and client role
router.use(authMiddleware);
router.use(roleMiddleware(['client']));

// Get my projects
router.get('/projects', getMyProjects);

// Get my invoices
router.get('/invoices', getMyInvoices);

// Get dashboard stats
router.get('/dashboard', getDashboardStats);

module.exports = router;
