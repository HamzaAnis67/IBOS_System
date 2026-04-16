require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./src/models');

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@heckto.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'System Administrator',
      email: 'admin@heckto.com',
      password: hashedPassword,
      role: 'admin',
      department: 'Management',
      phone: '+1234567890'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@heckto.com');
    console.log('Password: admin123');

    // Create an employee user for testing
    const employeeSalt = await bcrypt.genSalt(12);
    const employeePassword = await bcrypt.hash('employee123', employeeSalt);

    const employee = new User({
      name: 'Test Employee',
      email: 'employee@heckto.com',
      password: employeePassword,
      role: 'employee',
      department: 'Development',
      phone: '+1234567892'
    });

    await employee.save();
    console.log('Employee user created successfully');
    console.log('Email: employee@heckto.com');
    console.log('Password: employee123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
