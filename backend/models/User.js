const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    securityQuestion: {
      type: String,
      required: [true, 'Please provide a security question']
    },
    securityAnswer: {
      type: String,
      required: [true, 'Please provide a security answer']
    },
    emailVerificationToken: {
      type: String
    },
    emailVerificationExpire: {
      type: Date
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Match user entered security answer to hashed answer in database
userSchema.methods.matchSecurityAnswer = async function (enteredAnswer) {
  // Safety check: if user doesn't have a security answer (old accounts), return false
  if (!this.securityAnswer) {
    console.warn(`⚠️ User ${this.email} does not have a security answer set`);
    return false;
  }
  return await bcrypt.compare(enteredAnswer, this.securityAnswer);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (30 minutes)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken; // Return unhashed token to send
};

// Encrypt password and security answer using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isModified('securityAnswer')) {
    next();
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('securityAnswer')) {
    const salt = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

