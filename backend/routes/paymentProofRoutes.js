const express = require("express");
const router = express.Router();
const {
  uploadPaymentProof,
  approvePaymentProof,
  rejectPaymentProof,
  getPaymentProof,
} = require("../controllers/paymentProofController");
const { protect } = require("../middleware/authMiddleware");
const { paymentProofUpload } = require("../middleware/paymentProofUpload");

/**
 * Payment Proof Routes
 *
 * User Routes:
 * - POST /api/payment-proofs/:orderId - Upload payment proof
 * - GET /api/payment-proofs/:orderId - Get payment proof status
 *
 * Admin Routes:
 * - PUT /api/payment-proofs/:orderId/approve - Approve payment proof
 * - PUT /api/payment-proofs/:orderId/reject - Reject payment proof
 */

// User: Upload payment proof
router.post(
  "/:orderId",
  protect,
  paymentProofUpload.single("paymentProof"),
  uploadPaymentProof,
);

// User: Get payment proof status
router.get("/:orderId", protect, getPaymentProof);

// Admin: Approve payment proof
router.put("/:orderId/approve", protect, approvePaymentProof);

// Admin: Reject payment proof
router.put("/:orderId/reject", protect, rejectPaymentProof);

module.exports = router;
