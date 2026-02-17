const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 100 to 500 to accommodate SPA behavior
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for development
    return process.env.NODE_ENV === 'development' && req.ip === '::1';
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 login attempts per window (Relaxed for testing)
  message: {
    error: 'Too many login attempts from this IP, please try again in a minute.',
    security: 'Multiple failed attempts detected.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // TEMPORARY: Increased for development (was 3)
  message: {
    error: 'Too many password reset requests. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit uploads
  message: {
    error: 'Too many uploads from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin action rate limiter (stricter)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Increased from 50 to 200 for better admin experience
  message: {
    error: 'Too many admin requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  adminLimiter
};
