require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Script to mark all existing users as verified
 * Run this ONCE to migrate existing users to the new email verification system
 */

const verifyAllUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all unverified users
    const unverifiedUsers = await User.find({ isVerified: false });
    
    console.log(`\n📊 Found ${unverifiedUsers.length} unverified users`);

    if (unverifiedUsers.length === 0) {
      console.log('✅ All users are already verified!');
      process.exit(0);
    }

    console.log('\n📝 Users to be verified:');
    unverifiedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name})`);
    });

    // Update all users to verified
    const result = await User.updateMany(
      { isVerified: false },
      { 
        $set: { 
          isVerified: true,
          emailVerificationToken: undefined,
          emailVerificationExpire: undefined
        }
      }
    );

    console.log(`\n✅ Successfully verified ${result.modifiedCount} users!`);
    console.log('\n🎉 All existing users can now login without email verification.');
    console.log('📧 New registrations will still require email verification.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
verifyAllUsers();
