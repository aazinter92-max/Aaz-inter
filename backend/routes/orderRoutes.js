const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .post(optionalAuth, createOrder)
  .get(protect, getOrders);

router.get('/stats', protect, getDashboardStats);
router.get('/myorders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, updateOrderStatus);

module.exports = router;
