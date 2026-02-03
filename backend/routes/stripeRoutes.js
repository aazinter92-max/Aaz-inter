const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getStripeConfig
} = require('../controllers/stripeController');

// Get Stripe publishable key (public)
router.get('/config', getStripeConfig);

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', confirmPayment);

// Stripe webhook (raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
