const Order = require("../models/Order");
const fs = require("fs").promises;
const path = require("path");

/**
 * @desc    Upload payment proof (for bank transfer orders)
 * @route   POST /api/orders/:orderId/payment-proof
 * @access  Private (Authenticated users)
 */
const uploadPaymentProof = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Validate order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.user && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to upload proof for this order");
    }

    // Validate payment method is bank transfer
    if (order.paymentMethod !== "bank_transfer") {
      res.status(400);
      throw new Error(
        "Payment proof upload only available for bank transfer orders",
      );
    }

    // Validate order payment status is appropriate
    if (!["PENDING", "PAYMENT_PENDING"].includes(order.paymentStatus)) {
      res.status(400);
      throw new Error("Payment proof can only be uploaded for pending orders");
    }

    // Check if file exists
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }

    // Validate file type (PDF, images only)
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      res.status(400);
      throw new Error("Only PDF and image files are allowed");
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      await fs.unlink(req.file.path);
      res.status(400);
      throw new Error("File size must not exceed 5MB");
    }

    // Update order with payment proof
    order.paymentProof = {
      filename: req.file.filename,
      url: `/uploads/payment-proofs/${req.file.filename}`,
      uploadedAt: new Date(),
    };
    order.paymentProofStatus = "PENDING_VERIFICATION";
    order.paymentStatus = "PAYMENT_PENDING";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment proof uploaded successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        paymentProofStatus: order.paymentProofStatus,
        paymentProof: order.paymentProof,
      },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

/**
 * @desc    Admin: Approve payment proof
 * @route   PUT /api/orders/:orderId/approve-payment
 * @access  Admin only
 */
const approvePaymentProof = async (req, res, next) => {
  try {
    // Verify admin role
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only admins can approve payments");
    }
    const { orderId } = req.params;
    const { notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.paymentProofStatus !== "PENDING_VERIFICATION") {
      res.status(400);
      throw new Error("Only pending payment proofs can be approved");
    }

    // Update payment status
    order.paymentProofStatus = "APPROVED";
    order.paymentStatus = "PAID";
    order.orderStatus = "PAID";
    order.paidAt = new Date();
    order.verifiedByAdmin = req.user._id;
    order.verifiedAt = new Date();
    order.paymentVerificationNotes = notes || "Payment approved by admin";

    await order.save();

    // TODO: Emit real-time notification to user
    const io = req.app.get("io");
    if (io && order.user) {
      io.to(`user-${order.user}`).emit("paymentApproved", {
        orderId: order._id,
        orderNumber: order.orderNumber,
        message: "Your payment has been approved",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment approved successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Reject payment proof
 * @route   PUT /api/orders/:orderId/reject-payment
 * @access  Admin only
 */
const rejectPaymentProof = async (req, res, next) => {
  try {
    // Verify admin role
    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only admins can reject payments");
    }
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400);
      throw new Error("Rejection reason is required");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.paymentProofStatus !== "PENDING_VERIFICATION") {
      res.status(400);
      throw new Error("Only pending payment proofs can be rejected");
    }

    // Update payment status - keep as pending for resubmission
    order.paymentProofStatus = "REJECTED";
    order.paymentStatus = "PENDING";
    order.verifiedByAdmin = req.user._id;
    order.verifiedAt = new Date();
    order.paymentVerificationNotes = reason;

    await order.save();

    // TODO: Emit real-time notification to user
    const io = req.app.get("io");
    if (io && order.user) {
      io.to(`user-${order.user}`).emit("paymentRejected", {
        orderId: order._id,
        orderNumber: order.orderNumber,
        reason: reason,
        message: "Your payment proof was rejected. Please resubmit.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment rejected",
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get payment proof details
 * @route   GET /api/orders/:orderId/payment-proof
 * @access  Private
 */
const getPaymentProof = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Check authorization
    if (
      order.user &&
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to view this payment proof");
    }

    res.status(200).json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentProofStatus: order.paymentProofStatus,
      paymentProof: order.paymentProof,
      paymentVerificationNotes: order.paymentVerificationNotes,
      verifiedAt: order.verifiedAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPaymentProof,
  approvePaymentProof,
  rejectPaymentProof,
  getPaymentProof,
};
