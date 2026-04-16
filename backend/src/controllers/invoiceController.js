const { Invoice, Project, User } = require('../models');
const QRCode = require('qrcode');
const Joi = require('joi');

// Validation schemas
const createInvoiceSchema = Joi.object({
  project: Joi.string().required(),
  client: Joi.string().required(),
  amount: Joi.number().required().min(0),
  tax: Joi.number().optional().min(0),
  paymentMethod: Joi.string().valid('cash', 'bank_transfer', 'credit_card', 'paypal', 'other').optional(),
  dueDate: Joi.date().required(),
  items: Joi.array().items(Joi.object({
    description: Joi.string().required(),
    quantity: Joi.number().required().min(1),
    unitPrice: Joi.number().required().min(0),
    total: Joi.number().required().min(0)
  })).optional(),
  notes: Joi.string().optional()
});

// Create invoice
const createInvoice = async (req, res) => {
  try {
    const { error } = createInvoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { project, client, amount, tax, paymentMethod, dueDate, items, notes } = req.body;

    // Validate project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(400).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Validate client exists and is a client user
    const clientUser = await User.findById(client);
    if (!clientUser || clientUser.role !== 'client') {
      return res.status(400).json({
        success: false,
        message: 'Invalid client user'
      });
    }

    // Calculate total
    const total = amount + (tax || 0);

    const invoice = new Invoice({
      project,
      client,
      amount,
      tax: tax || 0,
      total,
      paymentMethod: paymentMethod || 'bank_transfer',
      dueDate,
      items: items || [],
      notes
    });

    await invoice.save();

    // Generate QR code for payment
    const paymentLink = `${process.env.FRONTEND_URL}/invoices/${invoice._id}/pay`;
    const qrCodeDataUrl = await QRCode.toDataURL(paymentLink);
    invoice.qrCode = qrCodeDataUrl;
    await invoice.save();

    await invoice.populate('project', 'title');
    await invoice.populate('client', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        invoice
      }
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating invoice'
    });
  }
};

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, project, client, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (project) filter.project = project;
    if (client) filter.client = client;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const invoices = await Invoice.find(filter)
      .populate('project', 'title')
      .populate('client', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching invoices'
    });
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('project', 'title description budget')
      .populate('client', 'name email phone address');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: {
        invoice
      }
    });
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching invoice'
    });
  }
};

// Update invoice status
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('project', 'title')
    .populate('client', 'name email phone');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: {
        invoice
      }
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating invoice status'
    });
  }
};

// Get invoices for current client
const getMyInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter for current user's invoices
    const filter = { client: req.user._id };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const invoices = await Invoice.find(filter)
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching invoices'
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  getMyInvoices
};
