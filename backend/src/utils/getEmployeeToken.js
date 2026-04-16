require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models');
const jwt = require('jsonwebtoken');

const getEmployeeToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Generate a token for the employee user
    const employee = await User.findOne({ email: 'employee2@heckto.com' });
    if (!employee) {
      console.log('Employee user not found');
      return;
    }

    const token = jwt.sign(
      { userId: employee._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    console.log('Employee Token:');
    console.log(token);
    console.log('\nUser ID:', employee._id);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getEmployeeToken();
