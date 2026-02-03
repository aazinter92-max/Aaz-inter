const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

dotenv.config();

const updateAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || 'your-admin@email.com';
    const password = process.env.ADMIN_PASSWORD || 'your-secure-password';

    // Find the admin
    let admin = await Admin.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (admin) {
      console.log('🔄 Admin found, updating password...');
      admin.password = password;
      await admin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('✨ Admin not found, creating new...');
      admin = await Admin.create({
        name: 'AAZ Admin',
        email: email,
        password: password,
        role: 'admin'
      });
      console.log('✅ Admin created successfully!');
    }

    console.log('-----------------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateAdmin();
