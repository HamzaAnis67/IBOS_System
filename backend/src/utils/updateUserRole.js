require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models');

const updateRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update the new user to admin role
    const result = await User.updateOne(
      { email: 'admin2@heckto.com' },
      { role: 'admin' }
    );

    console.log(`Updated ${result.modifiedCount} user(s) to admin role`);

    // Verify the update
    const admin = await User.findOne({ email: 'admin2@heckto.com' });
    console.log(`User ${admin.name} now has role: ${admin.role}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateRole();
