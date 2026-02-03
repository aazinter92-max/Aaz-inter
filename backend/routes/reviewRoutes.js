const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:productId')
  .get(getProductReviews);

router.route('/:productId/stats')
  .get(getReviewStats);

router.route('/')
  .post(protect, addReview);

module.exports = router;