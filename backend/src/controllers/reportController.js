const { Project, Task, Invoice, User, Message } = require('../models');
const moment = require('moment');

// Get dashboard analytics for admin
const getDashboardAnalytics = async (req, res) => {
  try {
    // Get overall statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalInvoices = await Invoice.countDocuments();

    // Get user statistics by role
    const userStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get project statistics by status
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get task statistics by status
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get invoice statistics by status
    const invoiceStats = await Invoice.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    // Get revenue statistics
    const paidInvoices = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageInvoice: { $avg: '$total' }
        }
      }
    ]);

    // Get recent activities
    const recentProjects = await Project.find()
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentInvoices = await Invoice.find()
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Format statistics
    const formattedUserStats = userStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const formattedProjectStats = projectStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const formattedTaskStats = taskStats.reduce((acc, stat) => {
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

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProjects,
          totalTasks,
          totalInvoices
        },
        userStats: {
          admin: formattedUserStats.admin || 0,
          employee: formattedUserStats.employee || 0,
          client: formattedUserStats.client || 0
        },
        projectStats: {
          pending: formattedProjectStats.pending || 0,
          in_progress: formattedProjectStats.in_progress || 0,
          completed: formattedProjectStats.completed || 0,
          cancelled: formattedProjectStats.cancelled || 0
        },
        taskStats: {
          pending: formattedTaskStats.pending || 0,
          in_progress: formattedTaskStats.in_progress || 0,
          completed: formattedTaskStats.completed || 0,
          cancelled: formattedTaskStats.cancelled || 0
        },
        invoiceStats: {
          draft: formattedInvoiceStats.draft || { count: 0, totalAmount: 0 },
          sent: formattedInvoiceStats.sent || { count: 0, totalAmount: 0 },
          paid: formattedInvoiceStats.paid || { count: 0, totalAmount: 0 },
          overdue: formattedInvoiceStats.overdue || { count: 0, totalAmount: 0 }
        },
        revenue: paidInvoices[0] || { totalRevenue: 0, averageInvoice: 0 },
        recentActivities: {
          projects: recentProjects,
          tasks: recentTasks,
          invoices: recentInvoices
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard analytics'
    });
  }
};

// Get project reports
const getProjectReports = async (req, res) => {
  try {
    const { startDate, endDate, status, client } = req.query;

    // Build filter
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (client) filter.client = client;

    const projects = await Project.find(filter)
      .populate('client', 'name email')
      .populate('employees', 'name email department')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const avgBudget = projects.length > 0 ? totalBudget / projects.length : 0;

    // Project status distribution
    const statusDistribution = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    // Projects by client
    const clientDistribution = projects.reduce((acc, project) => {
      const clientName = project.client?.name || 'Unknown';
      acc[clientName] = (acc[clientName] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        projects,
        statistics: {
          total: projects.length,
          totalBudget,
          averageBudget: avgBudget,
          statusDistribution,
          clientDistribution
        }
      }
    });
  } catch (error) {
    console.error('Get project reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching project reports'
    });
  }
};

// Get task reports
const getTaskReports = async (req, res) => {
  try {
    const { startDate, endDate, status, assignedTo, priority } = req.query;

    // Build filter
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email department')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const avgProgress = tasks.length > 0 
      ? tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length 
      : 0;

    // Task status distribution
    const statusDistribution = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    // Task priority distribution
    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    // Tasks by employee
    const employeeDistribution = tasks.reduce((acc, task) => {
      const employeeName = task.assignedTo?.name || 'Unassigned';
      acc[employeeName] = (acc[employeeName] || 0) + 1;
      return acc;
    }, {});

    // Overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.dueDate < new Date() && task.status !== 'completed'
    );

    res.json({
      success: true,
      data: {
        tasks,
        statistics: {
          total: tasks.length,
          averageProgress: Math.round(avgProgress),
          overdueCount: overdueTasks.length,
          statusDistribution,
          priorityDistribution,
          employeeDistribution
        }
      }
    });
  } catch (error) {
    console.error('Get task reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task reports'
    });
  }
};

// Get financial reports
const getFinancialReports = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    // Build filter
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter)
      .populate('client', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    // Calculate financial statistics
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidAmount = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    const unpaidAmount = totalAmount - paidAmount;

    // Invoice status distribution
    const statusDistribution = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = {
        count: (acc[invoice.status]?.count || 0) + 1,
        amount: (acc[invoice.status]?.amount || 0) + invoice.total
      };
      return acc;
    }, {});

    // Monthly revenue (last 12 months)
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const month = moment().subtract(i, 'months');
      const monthStart = month.startOf('month').toDate();
      const monthEnd = month.endOf('month').toDate();

      const monthRevenue = await Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            paidDate: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
            count: { $sum: 1 }
          }
        }
      ]);

      monthlyRevenue.push({
        month: month.format('MMM YYYY'),
        revenue: monthRevenue[0]?.total || 0,
        count: monthRevenue[0]?.count || 0
      });
    }

    // Top clients by revenue
    const topClients = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: '$client',
          totalRevenue: { $sum: '$total' },
          invoiceCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'clientInfo'
        }
      },
      { $unwind: '$clientInfo' },
      {
        $project: {
          clientName: '$clientInfo.name',
          clientEmail: '$clientInfo.email',
          totalRevenue: 1,
          invoiceCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        invoices,
        statistics: {
          totalAmount,
          paidAmount,
          unpaidAmount,
          statusDistribution
        },
        monthlyRevenue,
        topClients
      }
    });
  } catch (error) {
    console.error('Get financial reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching financial reports'
    });
  }
};

// Export reports to CSV
const exportReports = async (req, res) => {
  try {
    const { type, format = 'csv' } = req.query;
    
    if (!['projects', 'tasks', 'invoices', 'users'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report type'
      });
    }

    let data;
    let filename;

    switch (type) {
      case 'projects':
        data = await Project.find()
          .populate('client', 'name email')
          .populate('employees', 'name email')
          .lean();
        filename = `projects_${Date.now()}.csv`;
        break;
      case 'tasks':
        data = await Task.find()
          .populate('assignedTo', 'name email')
          .populate('project', 'title')
          .lean();
        filename = `tasks_${Date.now()}.csv`;
        break;
      case 'invoices':
        data = await Invoice.find()
          .populate('client', 'name email')
          .populate('project', 'title')
          .lean();
        filename = `invoices_${Date.now()}.csv`;
        break;
      case 'users':
        data = await User.find({ isActive: true })
          .select('-password')
          .lean();
        filename = `users_${Date.now()}.csv`;
        break;
    }

    // Convert to CSV (simplified version)
    const csv = convertToCSV(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error('Export reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error exporting reports'
    });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
};

module.exports = {
  getDashboardAnalytics,
  getProjectReports,
  getTaskReports,
  getFinancialReports,
  exportReports
};
