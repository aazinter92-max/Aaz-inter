const Order = require('../models/Order');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

/**
 * MANUAL PAYMENT CONTROLLER
 * Simple payment system for non-technical business owners
 * 
 * Methods:
 * 1. COD (Cash on Delivery)
 * 2. Bank Transfer with payment proof upload
 * 3. WhatsApp order confirmation
 */

/**
 * @desc    Upload Payment Proof
 * @route   POST /api/manual-payments/upload-proof/:orderId
 * @access  Private (Customer)
 */
const uploadPaymentProof = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // SECURITY: IDOR Protection
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    if (order.paymentMethod !== 'bank_transfer') {
      res.status(400);
      throw new Error('Payment proof only for Bank Transfers');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('Upload image required');
    }

    order.paymentProof = `/uploads/payment-proofs/${req.file.filename}`;
    order.transactionId = transactionId || null;
    order.paymentProofUploadedAt = new Date();
    
    // STATE TRANSITION
    order.paymentStatus = 'PAYMENT_PENDING';
    order.orderStatus = 'PAYMENT_PENDING';

    await order.save();
    res.status(200).json({ success: true, message: 'Proof uploaded. Pending verification.', order });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

const verifyPaymentProof = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    let { approved, adminNotes } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'PAID') {
      res.status(400);
      throw new Error('Order already paid');
    }

    if (approved) {
      // 1. TRANSACTIONAL STOCK REDUCTION (Single Source of Truth)
      // We reduce stock ONLY now, as the order is now effectively CONFIRMED by payment
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} to complete payment verification.`);
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }

      // 2. STATE TRANSITION
      order.paymentVerified = true;
      order.paymentVerifiedBy = req.admin._id;
      order.paymentVerifiedAt = new Date();
      order.paymentStatus = 'PAID';
      order.paidAt = new Date();
      order.orderStatus = 'PAID'; // Next step: Admin confirmed/Shipped
      order.adminNotes = adminNotes || 'Payment verified and stock deducted.';
      
      // TRIGGER NOTIFICATION
      console.log(`📣 NOTIFICATION: Order ${order._id} marked as PAID. Triggering WhatsApp/Email...`);
    } else {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'CREATED'; // Return to created to allow re-upload
      order.adminNotes = adminNotes || 'Payment proof rejected.';
    }

    await order.save();
    
    // TRIGER REAL-TIME ANALYTICS REFRESH
    const io = req.app.get('io');
    if (io) {
      io.emit('analyticsUpdate');
      io.emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.orderStatus
      });
    }

    res.status(200).json({ success: true, message: approved ? 'Payment confirmed & Stock updated' : 'Payment rejected', order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Payment Proof Details
 * @route   GET /api/manual-payments/proof/:orderId
 * @access  Private (Customer owns order or Admin)
 */
const getPaymentProof = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(orderId)) {
      res.status(400);
      throw new Error('Invalid order ID');
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // SECURITY: Verify ownership (customer or admin)
    const isOwner = order.user && order.user.toString() === req.user?._id?.toString();
    const isAdmin = req.admin;

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view payment proof');
    }

    res.status(200).json({
      success: true,
      paymentDetails: {
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentProof: order.paymentProof,
        transactionId: order.transactionId,
        paymentProofUploadedAt: order.paymentProofUploadedAt,
        paymentVerified: order.paymentVerified,
        paymentVerifiedAt: order.paymentVerifiedAt,
        adminNotes: order.adminNotes,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark WhatsApp Confirmation
 * @route   POST /api/manual-payments/whatsapp-confirm/:orderId
 * @access  Private (Customer)
 */
const markWhatsAppConfirmed = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(orderId)) {
      res.status(400);
      throw new Error('Invalid order ID');
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // SECURITY: Verify ownership
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    order.whatsappConfirmed = true;
    order.whatsappConfirmedAt = new Date();

    await order.save();

    console.log(`📱 WhatsApp confirmation marked for order ${orderId}`);

    res.status(200).json({
      success: true,
      message: 'WhatsApp confirmation recorded. We will contact you soon!',
      order: {
        orderId: order._id,
        whatsappConfirmed: order.whatsappConfirmed
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Business Bank Details
 * @route   GET /api/manual-payments/bank-details
 * @access  Public
 */
const getBankDetails = async (req, res, next) => {
  try {
    // These should be in environment variables or database
    const bankDetails = {
      bankName: process.env.BANK_NAME || 'Your Bank Name',
      accountTitle: process.env.ACCOUNT_TITLE || 'AAZ International',
      accountNumber: process.env.ACCOUNT_NUMBER || '1234567890',
      iban: process.env.IBAN || 'PK12BANK0000001234567890',
      branchCode: process.env.BRANCH_CODE || '1234',
      swiftCode: process.env.SWIFT_CODE || 'BANKPKKA',
      instructions: [
        '1. Transfer the exact order amount to the account above',
        '2. Take a screenshot of the payment confirmation',
        '3. Upload the screenshot on the order page',
        '4. Our team will verify and confirm your order within 24 hours',
        '5. You can also confirm your order via WhatsApp for faster processing'
      ]
    };

    res.status(200).json({
      success: true,
      bankDetails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get WhatsApp Link with Order Details
 * @route   GET /api/manual-payments/whatsapp-link/:orderId
 * @access  Private (Customer)
 */
const getWhatsAppLink = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(orderId)) {
      res.status(400);
      throw new Error('Invalid order ID');
    }

    const order = await Order.findById(orderId).populate('products.product');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // SECURITY: Verify ownership
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Format WhatsApp message
    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '923001234567'; // Without +
    
    let message = `*New Order Confirmation*\n\n`;
    message += `Order ID: ${order._id}\n`;
    message += `Customer: ${order.customerName}\n`;
    message += `Phone: ${order.phone}\n`;
    message += `Email: ${order.email}\n\n`;
    message += `*Delivery Address:*\n${order.address}, ${order.city}\n\n`;
    message += `*Order Items:*\n`;
    
    order.products.forEach((item, index) => {
      message += `${index + 1}. ${item.product?.name || 'Product'} x ${item.quantity} = Rs. ${item.price * item.quantity}\n`;
    });
    
    message += `\n*Total Amount: Rs. ${order.totalAmount}*\n`;
    message += `Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}\n\n`;
    
    if (order.paymentMethod === 'bank_transfer') {
      message += `I have transferred the payment. `;
      if (order.transactionId) {
        message += `Transaction ID: ${order.transactionId}\n`;
      }
      message += `Please confirm my order.`;
    } else {
      message += `Please confirm my order.`;
    }

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    res.status(200).json({
      success: true,
      whatsappLink,
      whatsappNumber,
      message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPaymentProof,
  verifyPaymentProof,
  getPaymentProof,
  markWhatsAppConfirmed,
  getBankDetails,
  getWhatsAppLink
};
