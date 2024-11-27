const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const {protect} = require('../middlewares/authMiddleware')

// Add product to wishlist
router.post('/:id/wishlist', protect, wishlistController.addToWishlist);

// Get user's wishlist
router.get('/:id/wishlist', protect, wishlistController.getWishlist);

// Remove item from wishlist
router.delete('/:id/wishlist/:productId', protect, wishlistController.removeItemFromWishlist);

// Clear the wishlist
router.delete('/:id/wishlist', protect, wishlistController.clearWishlist);

module.exports = router;