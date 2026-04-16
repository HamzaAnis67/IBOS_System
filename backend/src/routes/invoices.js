const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { 
  createInvoice, 
  getInvoices, 
  getInvoiceById, 
  updateInvoiceStatus,
  getMyInvoices 
} = require('../controllers/invoiceController');

// All routes require authentication
router.use(authMiddleware);

// Create invoice (admin only)
router.post('/', roleMiddleware(['admin']), createInvoice);

// Get all invoices (admin only)
router.get('/', roleMiddleware(['admin']), getInvoices);

// Get invoice by ID (admin and client of the invoice)
router.get('/:id', getInvoiceById);

// Update invoice status (admin only)
router.put('/:id/status', roleMiddleware(['admin']), updateInvoiceStatus);

// Get my invoices (client only)
router.get('/my-invoices', roleMiddleware(['client']), getMyInvoices);

module.exports = router;
