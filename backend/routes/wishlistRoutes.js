const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/check/:productId')
  .get(protect, checkWishlist);

router.route('/:productId')
  .delete(protect, removeFromWishlist);

module.exports = router;