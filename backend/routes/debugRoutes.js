const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/sanity-check', protect, adminOnly, async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    
    // Sample one document from each
    const sampleProduct = await Product.findOne();
    const sampleUser = await User.findOne();

    res.json({
      database: mongoose.connection.name,
      collections: collections.map(c => c.name),
      counts: {
        products: productCount,
        users: userCount,
        orders: orderCount
      },
      samples: {
        product: sampleProduct ? { id: sampleProduct._id, name: sampleProduct.name } : 'None',
        user: sampleUser ? { id: sampleUser._id, name: sampleUser.name, isAdmin: sampleUser.isAdmin } : 'None'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
