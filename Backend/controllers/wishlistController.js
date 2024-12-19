
const wishlistService = require('../services/wishlistService');
const asyncHandler = require('../middlewares/asyncHandler');

// Add a product to the wishlist
const addProductToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const wishlist = await wishlistService.addToWishlist(userId, productId);
  res.status(200).json({
    message: 'Product added to wishlist',
    wishlist,
  });
});

// Remove a product from the wishlist
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;

  const wishlist = await wishlistService.removeFromWishlist(userId, productId);
  res.status(200).json({
    message: 'Product removed from wishlist',
    wishlist,
  });
});

// Get the user's wishlist
const getUserWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const wishlist = await wishlistService.getWishlist(userId);
  res.status(200).json({
    message: 'Wishlist fetched successfully',
    wishlist,
  });
});

// Clear the user's wishlist
const clearUserWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.user; // Access userId from req.user

  const wishlist = await wishlistService.clearWishlist(userId);
  res.status(200).json({
    message: 'Wishlist cleared successfully',
    wishlist,
  });
});

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
  clearUserWishlist,
};