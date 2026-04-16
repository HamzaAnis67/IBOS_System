require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./src/models');

const testPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@heckto.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    console.log('Testing password comparison for admin user...');
    const isMatch = await admin.comparePassword('admin123');
    console.log(`Password match: ${isMatch}`);

    // Test with wrong password
    const isWrongMatch = await admin.comparePassword('wrongpassword');
    console.log(`Wrong password match: ${isWrongMatch}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPassword();
