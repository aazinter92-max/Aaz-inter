const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  getPaymentStatus,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validation');

/**
 * SECURE PAYMENT ROUTES
 * 
 * IMPORTANT SECURITY NOTES:
 * - Webhook endpoint MUST be RAW BODY (not JSON parsed)
 * - All other endpoints require authentication
 * - Payment confirmation comes from webhook only
 */

// ============================================
// WEBHOOK ENDPOINT (Must come BEFORE express.json())
// ============================================
// This is handled separately in server.js with raw body

// ============================================
// AUTHENTICATED PAYMENT ENDPOINTS
// ============================================

/**
 * Create Payment Intent
 * User initiates payment, get client secret for Stripe
 */
router.post('/create-payment-intent', protect, createPaymentIntent);

/**
 * Confirm Payment (Client-side feedback only)
 * NOT the source of truth - webhook is
 */
router.post('/confirm-payment', protect, confirmPayment);

/**
 * Get Payment Status
 * Check payment status for an order
 */
router.get('/status/:orderId', protect, validateObjectId('orderId'), getPaymentStatus);

/**
 * Webhook Handler (Stripe -> Server)
 * THIS IS THE SOURCE OF TRUTH FOR PAYMENT CONFIRMATION
 * Do NOT apply protect middleware - Stripe needs access
 */
router.post('/webhook', handleStripeWebhook);

module.exports = router;
