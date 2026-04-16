const { Project, Invoice, User } = require('../models');

// Get projects for current client
const getMyProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter for current user's projects
    const filter = { client: req.user._id };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
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
    console.error('Get my projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects'
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

// Get dashboard stats for client
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get project statistics
    const projectStats = await Project.aggregate([
      { $match: { client: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get invoice statistics
    const invoiceStats = await Invoice.aggregate([
      { $match: { client: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    // Get recent projects
    const recentProjects = await Project.find({ client: userId })
      .populate('employees', 'name email department')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get unpaid invoices
    const unpaidInvoices = await Invoice.find({
      client: userId,
      status: { $in: ['draft', 'sent'] }
    })
    .populate('project', 'title')
    .sort({ dueDate: 1 });

    // Format stats
    const formattedProjectStats = projectStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const formattedInvoiceStats = invoiceStats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount
      };
      return acc;
    }, {});

    // Calculate total unpaid amount
    const totalUnpaid = unpaidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

    res.json({
      success: true,
      data: {
        projectStats: {
          pending: formattedProjectStats.pending || 0,
          in_progress: formattedProjectStats.in_progress || 0,
          completed: formattedProjectStats.completed || 0,
          cancelled: formattedProjectStats.cancelled || 0
        },
        invoiceStats: {
          draft: formattedInvoiceStats.draft || { count: 0, totalAmount: 0 },
          sent: formattedInvoiceStats.sent || { count: 0, totalAmount: 0 },
          paid: formattedInvoiceStats.paid || { count: 0, totalAmount: 0 },
          overdue: formattedInvoiceStats.overdue || { count: 0, totalAmount: 0 }
        },
        recentProjects,
        unpaidInvoices: {
          invoices: unpaidInvoices,
          totalAmount: totalUnpaid
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats'
    });
  }
};

module.exports = {
  getMyProjects,
  getMyInvoices,
  getDashboardStats
};
