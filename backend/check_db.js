const mongoose = require('mongoose');
const User = require('./models/User');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management';

async function check() {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to DB:', dbURI);
    const users = await User.find({});
    console.log('Total Users:', users.length);
    console.log('Users:');
    users.forEach(u => {
      console.log(`- Email: "${u.email}", Role: "${u.role}", isActive: ${u.isActive}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
