const express = require('express');
const router = express.Router();
const { 
  loginAdmin, 
  loginUser, 
  registerUser, 
  getMe, 
  verifyEmail,
  resendVerificationEmail,
  getSecurityQuestion,
  verifySecurityAnswer,
  resetPasswordWithSecurity
} = require('../controllers/authController');
const { protect, protectAllowUnverified } = require('../middleware/authMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// ============================================
// SECURE AUTHENTICATION ROUTES
// ============================================

// Get current user (protected, allows unverified users to access profile)
router.get('/me', protectAllowUnverified, getMe);

// Admin login (rate limited + validated)
router.post('/admin/login', 
  authLimiter,           // 5 attempts per 15 min
  validateLogin,         // Input validation
  loginAdmin
);

// User login (rate limited + validated)
router.post('/login', 
  authLimiter,           // 5 attempts per 15 min
  validateLogin,         // Input validation
  loginUser
);

// User registration (rate limited + validated)
router.post('/register', 
  authLimiter,           // Prevent spam registrations
  validateRegistration,  // Input validation & sanitization
  registerUser
);

// Email verification via link (token in URL)
router.get('/verify-email/:token', 
  authLimiter,
  verifyEmail
);

// Resend verification email (for logged in but unverified users)
router.post('/resend-verification',
  authLimiter,
  protectAllowUnverified,  // Must be logged in (but can be unverified)
  resendVerificationEmail
);

// Forgot password - Step 1: Get Question
router.post('/forgot-password/question', 
  passwordResetLimiter,
  getSecurityQuestion
);

// Forgot password - Step 2: Verify Answer
router.post('/forgot-password/verify-answer', 
  passwordResetLimiter,
  verifySecurityAnswer
);

// Forgot password - Step 3: Reset
router.post('/forgot-password/reset', 
  passwordResetLimiter,
  resetPasswordWithSecurity
);

module.exports = router;
