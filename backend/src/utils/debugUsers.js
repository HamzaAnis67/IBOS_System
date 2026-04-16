require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models');

const debugUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('All users:');
    users.forEach(user => {
      console.log(`ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Active: ${user.isActive}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugUsers();
