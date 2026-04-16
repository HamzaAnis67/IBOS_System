require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models');
const jwt = require('jsonwebtoken');

const getClientToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Generate a token for the client user
    const client = await User.findOne({ email: 'john@example.com' });
    if (!client) {
      console.log('Client user not found');
      return;
    }

    const token = jwt.sign(
      { userId: client._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    console.log('Client Token:');
    console.log(token);
    console.log('\nUser ID:', client._id);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getClientToken();
