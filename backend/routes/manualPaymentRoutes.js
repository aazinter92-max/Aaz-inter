const express = require('express');
const router = express.Router();
const {
  uploadPaymentProof,
  verifyPaymentProof,
  getPaymentProof,
  markWhatsAppConfirmed,
  getBankDetails,
  getWhatsAppLink
} = require('../controllers/manualPaymentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadPaymentProof: paymentProofUploader, verifyPaymentProofContent } = require('../middleware/paymentProofUpload');
const { validateObjectId } = require('../middleware/validation');

/**
 * MANUAL PAYMENT ROUTES
 * Simple payment system for non-technical businesses
 * 
 * Payment Methods:
 * 1. COD (Cash on Delivery) - No additional action required
 * 2. Bank Transfer - Upload payment proof
 * 3. WhatsApp Confirmation - Auto-filled order details
 */

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * Get Bank Account Details
 * Show customers where to transfer money
 */
router.get('/bank-details', getBankDetails);

// ============================================
// CUSTOMER ROUTES (Protected)
// ============================================

/**
 * Upload Payment Proof (Screenshot)
 * Customer uploads bank transfer receipt
 */
router.post(
  '/upload-proof/:orderId',
  protect,
  validateObjectId('orderId'),
  paymentProofUploader.single('paymentProof'),
  verifyPaymentProofContent,
  uploadPaymentProof
);

/**
 * Get Payment Proof Details
 * Check status of uploaded payment proof
 */
router.get(
  '/proof/:orderId',
  protect,
  validateObjectId('orderId'),
  getPaymentProof
);

/**
 * Get WhatsApp Confirmation Link
 * Generate WhatsApp message with order details
 */
router.get(
  '/whatsapp-link/:orderId',
  protect,
  validateObjectId('orderId'),
  getWhatsAppLink
);

/**
 * Mark WhatsApp Confirmed
 * Customer clicked/used WhatsApp confirmation
 */
router.post(
  '/whatsapp-confirm/:orderId',
  protect,
  validateObjectId('orderId'),
  markWhatsAppConfirmed
);

// ============================================
// ADMIN ROUTES (Admin Only)
// ============================================

/**
 * Verify Payment Proof
 * Admin approves or rejects payment
 */
router.put(
  '/verify/:orderId',
  protect,
  adminOnly,
  validateObjectId('orderId'),
  verifyPaymentProof
);

module.exports = router;
