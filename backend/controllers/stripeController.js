const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Create Stripe Payment Intent
 * @route POST /api/stripe/create-payment-intent
 * @access Public
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Fetch order
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if payment already exists
    if (order.stripePaymentIntentId) {
      res.status(400);
      throw new Error('Payment already initiated for this order');
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'pkr', // Pakistani Rupee
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.email
      },
      description: `Order ${order.orderNumber} - ${order.customerName}`,
      receipt_email: order.email
    });

    // Save payment intent ID to order
    order.stripePaymentIntentId = paymentIntent.id;
    order.paymentStatus = 'PAYMENT_PENDING';
    await order.save();

    console.log(`💳 Stripe Payment Intent created: ${paymentIntent.id} for Order ${order.orderNumber}`);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    next(error);
  }
};

/**
 * Confirm Payment Success
 * @route POST /api/stripe/confirm-payment
 * @access Public
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error('Payment not successful');
    }

    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Update order status
    order.paymentStatus = 'PAID';
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentVerified = true;
    order.orderStatus = 'PROCESSING'; // Move to processing after payment
    order.stripePaymentIntentId = paymentIntentId;

    // Reduce stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.stock < item.quantity) {
          res.status(400);
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        product.stock -= item.quantity;
        await product.save();
      }
    }

    await order.save();

    // Real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus
      });
      io.emit('analyticsUpdate');
    }

    console.log(`✅ Payment confirmed for Order ${order.orderNumber}`);

    res.json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    next(error);
  }
};

/**
 * Stripe Webhook Handler
 * @route POST /api/stripe/webhook
 * @access Public (Stripe only)
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);
      
      // Update order
      const orderId = paymentIntent.metadata.orderId;
      const order = await Order.findById(orderId);
      
      if (order && !order.isPaid) {
        order.paymentStatus = 'PAID';
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentVerified = true;
        order.orderStatus = 'PROCESSING';
        
        // Reduce stock
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          if (product && product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
        
        await order.save();
        
        // Real-time notification
        const io = req.app.get('io');
        if (io) {
          io.emit('orderStatusUpdate', {
            orderId: order._id,
            status: order.orderStatus,
            paymentStatus: order.paymentStatus
          });
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log(`❌ PaymentIntent failed: ${failedPayment.id}`);
      
      // Update order to failed
      const failedOrderId = failedPayment.metadata.orderId;
      const failedOrder = await Order.findById(failedOrderId);
      
      if (failedOrder) {
        failedOrder.paymentStatus = 'FAILED';
        await failedOrder.save();
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * Get Stripe Publishable Key
 * @route GET /api/stripe/config
 * @access Public
 */
const getStripeConfig = (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getStripeConfig
};
