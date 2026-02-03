const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

/**
 * SECURE AUTHENTICATION MIDDLEWARE
 * Implements defense-in-depth for token validation
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        // Verify token hasn't been tampered with
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check token age (additional security)
        const tokenAge = Date.now() - decoded.iat * 1000;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (tokenAge > maxAge) {
          res.status(401);
          throw new Error('Token expired. Please login again.');
        }

        // Try to find admin first
        req.admin = await Admin.findById(decoded.id).select('-password');
        
        // If not admin, try regular user
        if (!req.admin) {
          req.user = await User.findById(decoded.id).select('-password -otp -resetPasswordToken');
          
          // Verify user account isverified
          if (req.user && !req.user.isVerified) {
            res.status(403);
            throw new Error('Account not verified. Please verify your email.');
          }
        }

        // If neither found, token is invalid
        if (!req.admin && !req.user) {
          res.status(401);
          throw new Error('User no longer exists.');
        }

        next();
      } catch (jwtError) {
        console.error('JWT Verification Error:', jwtError.message);
        res.status(401);
        
        // Generic error message (don't reveal why token failed)
        throw new Error('Authentication failed. Please login again.');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized. No token provided.');
    }
  } catch (error) {
    // Ensure we don't send headers twice
    if (!res.headersSent) {
      res.status(401);
    }
    next(error);
  }
};

/**
 * ADMIN-ONLY MIDDLEWARE
 * Must be used AFTER protect()
 * Implements role-based access control (RBAC)
 */
const adminOnly = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.admin && !req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    // Check if user has admin privileges
    if (!req.admin) {
      // Log unauthorized access attempt
      console.warn(`⚠️ SECURITY: Unauthorized admin access attempt by user ${req.user?._id}`);
      
      res.status(403);
      throw new Error('Access denied. Admin privileges required.');
    }

    // Admin verified, proceed
    next();
  } catch (error) {
    if (!res.headersSent) {
      res.status(403);
    }
    next(error);
  }
};

/**
 * VERIFIED USER ONLY
 * Ensures email is verified before allowing access
 */
const verifiedOnly = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (!req.user.isVerified) {
      res.status(403);
      throw new Error('Please verify your email address to continue');
    }

    next();
  } catch (error) {
    if (!res.headersSent) {
      res.status(403);
    }
    next(error);
  }
};

/**
 * OPTIONAL AUTHENTICATION
 * For routes that work for both guests and logged-in users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password -otp -resetPasswordToken');
      } catch (err) {
        // Invalid token, but that's OK for optional auth
        console.log('Optional auth: Invalid token, continuing as guest');
      }
    }
    
    next();
  } catch (err) {
    // Don't fail the request, just continue as guest
    next();
  }
};

module.exports = { 
  protect, 
  adminOnly, 
  verifiedOnly,
  optionalAuth 
};
