require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models');
const jwt = require('jsonwebtoken');

const getAdminToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Generate a token for the admin user
    const admin = await User.findOne({ email: 'admin2@heckto.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    const token = jwt.sign(
      { userId: admin._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    console.log('Admin Token:');
    console.log(token);
    console.log('\nUser ID:', admin._id);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getAdminToken();
