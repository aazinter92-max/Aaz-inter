// ============================================
// STRIPE PAYMENT CONTROLLER (DISABLED)
// ============================================
// This controller is disabled but preserved for future use
// To re-enable: Uncomment the stripe initialization below and add keys to .env

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const crypto = require('crypto');

/**
 * STRIPE PAYMENT CONTROLLER (CURRENTLY DISABLED)
 * 
 * This file is preserved for future card payment integration.
 * Currently using manual payments (COD, Bank Transfer).
 * 
 * To re-enable:
 * 1. Uncomment the stripe initialization above
 * 2. Add STRIPE_SECRET_KEY to .env
 * 3. Uncomment routes in server.js
 * 4. Update Order model to include 'card' payment method
 */

/**
 * @desc    Create Payment Intent
 * @route   POST /api/payments/create-payment-intent
 * @access  Private (Authenticated users)
 * 
 * SECURITY:
 * - Amount is calculated server-side (never trust client)
 * - Idempotency key prevents duplicate payments
 * - User verification required
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Validate orderId
    if (!orderId || !/^[a-fA-F0-9]{24}$/.test(orderId)) {
      res.status(400);
      throw new Error('Invalid order ID');
    }

    // Fetch order from database
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // SECURITY: Verify order belongs to current user (IDOR prevention)
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      console.warn(`⚠️ SECURITY: User ${req.user._id} attempted to pay for order ${orderId} belonging to ${order.user}`);
      res.status(403);
      throw new Error('Not authorized to pay for this order');
    }

    // Check if order already paid
    if (order.paymentStatus === 'paid') {
      res.status(400);
      throw new Error('Order already paid');
    }

    // Check if payment method is card
    if (order.paymentMethod !== 'card') {
      res.status(400);
      throw new Error('Order payment method is not card');
    }

    // Calculate amount (SERVER-SIDE - never trust client)
    // Stripe uses smallest currency unit (cents for USD)
    const amountInCents = Math.round(order.totalAmount * 100);

    // Validate amount
    if (amountInCents < 50) { // Minimum 50 cents
      res.status(400);
      throw new Error('Order amount too low');
    }

    // Generate idempotency key to prevent duplicate charges
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${orderId}-${order.createdAt}-${order.totalAmount}`)
      .digest('hex');

    try {
      // Create Payment Intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: amountInCents,
          currency: 'usd', // Change based on your currency
          description: `Order #${orderId} - AAZ Medical`,
          metadata: {
            orderId: orderId.toString(),
            customerEmail: order.email,
            customerName: order.customerName,
          },
          // Automatic payment methods (recommended)
          automatic_payment_methods: {
            enabled: true,
          },
        },
        {
          idempotencyKey: idempotencyKey, // Prevent duplicate charges
        }
      );

      // Store Payment Intent ID in order
      order.paymentIntentId = paymentIntent.id;
      await order.save();

      console.log(`✅ Payment Intent created: ${paymentIntent.id} for order ${orderId}`);

      // Return client secret to frontend
      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: order.totalAmount,
      });
    } catch (stripeError) {
      console.error('Stripe Error:', stripeError.message);
      
      // Log security-relevant errors
      if (stripeError.code === 'idempotency_key_in_use') {
        console.warn(`⚠️ SECURITY: Duplicate payment attempt for order ${orderId}`);
      }

      res.status(500);
      throw new Error(`Payment processing error: ${stripeError.message}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm Payment (Client-initiated, but not trusted)
 * @route   POST /api/payments/confirm-payment
 * @access  Private
 * 
 * SECURITY:
 * - This endpoint is NOT the source of truth
 * - Payment confirmation comes from webhook only
 * - This is just for immediate UI feedback
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      res.status(400);
      throw new Error('Payment Intent ID required');
    }

    // Retrieve Payment Intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId });

    if (!order) {
      res.status(404);
      throw new Error('Order not found for this payment');
    }

    // SECURITY: Verify user owns this order
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Check payment status from Stripe
    if (paymentIntent.status === 'succeeded') {
      // Payment succeeded - return success (but don't mark order as paid yet)
      // Wait for webhook to confirm
      
      console.log(`ℹ️ Payment Intent ${paymentIntentId} succeeded (waiting for webhook confirmation)`);

      res.status(200).json({
        success: true,
        message: 'Payment successful! Processing your order...',
        status: 'processing',
        order: {
          orderId: order._id,
          amount: order.totalAmount,
        },
      });
    } else if (paymentIntent.status === 'requires_payment_method') {
      res.status(400);
      throw new Error('Payment failed. Please try another payment method.');
    } else if (paymentIntent.status === 'requires_action') {
      res.status(400);
      throw new Error('Payment requires additional authentication');
    } else if (paymentIntent.status === 'canceled') {
      res.status(400);
      throw new Error('Payment was canceled');
    } else {
      res.status(400);
      throw new Error(`Payment status: ${paymentIntent.status}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stripe Webhook Handler (SOURCE OF TRUTH)
 * @route   POST /api/payments/webhook
 * @access  Public (but signature verified)
 * 
 * SECURITY:
 * - Signature verification (prevents fake webhooks)
 * - This is the ONLY place where orders are marked as paid
 * - Idempotent (can handle duplicate events)
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // CRITICAL: Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`⚠️ SECURITY: Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;

    case 'payment_intent.canceled':
      await handlePaymentCanceled(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  res.status(200).json({ received: true });
};

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.error('⚠️ Payment Intent missing orderId in metadata');
      return;
    }

    const order = await Order.findById(orderId);

    if (!order) {
      console.error(`⚠️ Order ${orderId} not found for payment intent ${paymentIntent.id}`);
      return;
    }

    // IDEMPOTENCY: Check if already processed
    if (order.paymentStatus === 'paid' && order.paidAt) {
      console.log(`ℹ️ Order ${orderId} already marked as paid (idempotent handling)`);
      return;
    }

    // Extract card details (only last 4 digits and brand)
    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method
    );

    // Update order with payment details
    order.paymentStatus = 'paid';
    order.paidAt = new Date();
    order.stripePaymentId = paymentIntent.id;
    order.cardLast4 = paymentMethod.card?.last4 || null;
    order.cardBrand = paymentMethod.card?.brand || null;
    order.orderStatus = 'Processing'; // Move to next stage
    order.paymentFailureReason = null; // Clear any previous failures

    await order.save();

    console.log(`✅ PAYMENT CONFIRMED: Order ${orderId} marked as PAID`);
    console.log(`   Amount: $${order.totalAmount}`);
    console.log(`   Card: ${order.cardBrand} ending in ${order.cardLast4}`);
    console.log(`   Payment ID: ${order.stripePaymentId}`);

    // TODO: Send order confirmation email
    // TODO: Trigger order processing workflow
    // TODO: Notify admin dashboard via Socket.IO

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.error('⚠️ Payment Intent missing orderId in metadata');
      return;
    }

    const order = await Order.findById(orderId);

    if (!order) {
      console.error(`⚠️ Order ${orderId} not found for payment intent ${paymentIntent.id}`);
      return;
    }

    // Update order with failure details
    order.paymentStatus = 'failed';
    order.paymentFailureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
    order.orderStatus = 'Pending'; // Keep in pending

    await order.save();

    console.log(`❌ PAYMENT FAILED: Order ${orderId}`);
    console.log(`   Reason: ${order.paymentFailureReason}`);

    // TODO: Send payment failure email to customer
    // TODO: Notify admin of failed payment

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) return;

    const order = await Order.findById(orderId);

    if (!order) return;

    order.paymentStatus = 'failed';
    order.paymentFailureReason = 'Payment canceled by user or system';
    order.orderStatus = 'Cancelled';

    await order.save();

    console.log(`🚫 PAYMENT CANCELED: Order ${orderId}`);

  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}

/**
 * @desc    Get Payment Status
 * @route   GET /api/payments/status/:orderId
 * @access  Private
 */
const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(orderId)) {
      res.status(400);
      throw new Error('Invalid order ID');
    }

    const order = await Order.findById(orderId).select(
      'paymentStatus paymentMethod paidAt cardLast4 cardBrand totalAmount paymentFailureReason'
    );

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // SECURITY: Verify ownership
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    res.status(200).json({
      success: true,
      payment: {
        status: order.paymentStatus,
        method: order.paymentMethod,
        paidAt: order.paidAt,
        cardLast4: order.cardLast4,
        cardBrand: order.cardBrand,
        amount: order.totalAmount,
        failureReason: order.paymentFailureReason,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  getPaymentStatus,
};
