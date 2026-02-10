require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Script to mark a user as UNVERIFIED for testing email verification flow
 */

const unverifyUser = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = await question('Enter user email to mark as UNVERIFIED: ');
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log(`\n❌ User with email "${email}" not found.`);
      rl.close();
      process.exit(1);
    }

    console.log(`\n📧 Found user: ${user.name} (${user.email})`);
    console.log(`Current verification status: ${user.isVerified ? '✅ VERIFIED' : '❌ UNVERIFIED'}`);

    if (!user.isVerified) {
      console.log('\n⚠️  User is already unverified!');
      rl.close();
      process.exit(0);
    }

    const confirm = await question('\n⚠️  Mark this user as UNVERIFIED for testing? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled.');
      rl.close();
      process.exit(0);
    }

    user.isVerified = false;
    await user.save();

    console.log('\n✅ User marked as UNVERIFIED!');
    console.log('📧 This user will now:');
    console.log('   - Be blocked from logging in');
    console.log('   - Be blocked from placing orders');
    console.log('   - See verification section in Profile page');
    console.log('   - Be able to request verification email resend\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

// Run the script
unverifyUser();
