const express = require('express');
const router = express.Router();
const { 
  loginAdmin, 
  loginUser, 
  registerUser, 
  getMe, 
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// ============================================
// SECURE AUTHENTICATION ROUTES
// ============================================

// Get current user (protected)
router.get('/me', protect, getMe);

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

// Email verification (rate limited)
router.post('/verify', 
  authLimiter,           // Prevent brute force OTP
  verifyEmail
);

// Forgot password (strict rate limiting)
router.post('/forgot-password', 
  passwordResetLimiter,  // 3 attempts per hour
  forgotPassword
);

// Reset password (rate limited)
router.post('/reset-password/:resetToken', 
  passwordResetLimiter,  // 3 attempts per hour
  resetPassword
);

module.exports = router;
