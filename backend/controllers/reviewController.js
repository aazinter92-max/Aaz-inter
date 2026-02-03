const Review = require("../models/Review");
const mongoose = require("mongoose");

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { product, rating, comment } = req.body;

    const review = await Review.create({
      product,
      user: req.user._id,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name",
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    if (error.code === 11000) {
      const err = new Error("You have already reviewed this product");
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};

// @desc    Get review stats for a product
// @route   GET /api/reviews/:productId/stats
// @access  Public
const getReviewStats = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const result = stats[0] || { averageRating: 0, totalReviews: 0 };
    res.json(result);
  } catch (error) {
    console.error("Review stats error:", error);
    next(error);
  }
};

module.exports = {
  getProductReviews,
  addReview,
  getReviewStats,
};
