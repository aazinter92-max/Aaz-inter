const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const verifyUserByEmail = async (email) => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find and verify user
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.error(`❌ User not found: ${normalizedEmail}`);
      process.exit(1);
    }

    if (user.isVerified) {
      console.log(`✅ User ${normalizedEmail} is already verified!`);
      process.exit(0);
    }

    // Verify the user
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    console.log(`✅ Successfully verified user: ${normalizedEmail}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🎉 You can now login!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node verifyUser.js your@email.com');
  process.exit(1);
}

verifyUserByEmail(email);
