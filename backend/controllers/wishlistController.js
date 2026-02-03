const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate('product', 'name price image stock');
    
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const existingItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId
    });

    const populatedItem = await Wishlist.findById(wishlistItem._id)
      .populate('product', 'name price image stock');

    res.status(201).json(populatedItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const result = await Wishlist.deleteOne({
      user: req.user._id,
      product: productId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const item = await Wishlist.findOne({
      user: req.user._id,
      product: productId
    });

    res.json({ inWishlist: !!item });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};