const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  getDashboardAnalytics, 
  getProjectReports, 
  getTaskReports, 
  getFinancialReports, 
  exportReports 
} = require('../controllers/reportController');

// All routes require authentication
router.use(authMiddleware);

// Get dashboard analytics (admin only)
router.get('/analytics', roleMiddleware(['admin']), getDashboardAnalytics);

// Get project reports (admin only)
router.get('/projects', roleMiddleware(['admin']), getProjectReports);

// Get task reports (admin only)
router.get('/tasks', roleMiddleware(['admin']), getTaskReports);

// Get financial reports (admin only)
router.get('/financial', roleMiddleware(['admin']), getFinancialReports);

// Export reports (admin only)
router.get('/export', roleMiddleware(['admin']), exportReports);

module.exports = router;
