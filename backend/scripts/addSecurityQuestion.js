const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');
const User = require('../models/User');

// Load env vars from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const addSecurityQuestion = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get user email
    const email = await question('Enter your email address: ');
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.error(`❌ User not found: ${normalizedEmail}`);
      process.exit(1);
    }

    console.log(`\n✅ Found user: ${user.name} (${user.email})`);

    // Check if user already has security question
    if (user.securityQuestion && user.securityAnswer) {
      console.log(`\n⚠️ This user already has a security question set:`);
      console.log(`   Question: ${user.securityQuestion}`);
      const overwrite = await question('\nDo you want to overwrite it? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled');
        process.exit(0);
      }
    }

    // Display available questions
    console.log('\n📋 Available Security Questions:');
    console.log('1. What was the name of your first pet?');
    console.log('2. What is your mother\'s maiden name?');
    console.log('3. What city were you born in?');
    console.log('4. What is your favorite book?');
    console.log('5. What was the name of your elementary school?');

    const questionChoice = await question('\nSelect a question (1-5): ');
    
    const questions = [
      'What was the name of your first pet?',
      'What is your mother\'s maiden name?',
      'What city were you born in?',
      'What is your favorite book?',
      'What was the name of your elementary school?'
    ];

    const selectedQuestion = questions[parseInt(questionChoice) - 1];
    
    if (!selectedQuestion) {
      console.error('❌ Invalid question selection');
      process.exit(1);
    }

    const answer = await question(`\nEnter your answer: `);

    if (!answer || answer.trim().length < 2) {
      console.error('❌ Answer is too short (minimum 2 characters)');
      process.exit(1);
    }

    // Update user
    user.securityQuestion = selectedQuestion;
    user.securityAnswer = answer.trim().toLowerCase(); // Normalize
    await user.save();

    console.log('\n✅ Security question successfully added!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`❓ Question: ${selectedQuestion}`);
    console.log(`🎉 You can now use the password reset feature!`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

addSecurityQuestion();
