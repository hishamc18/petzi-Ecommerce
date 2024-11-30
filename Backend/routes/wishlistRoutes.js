const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const {protect} = require('../middlewares/authMiddleware')

// add product to wishlist
router.post('/:id/wishlist', protect, wishlistController.addToWishlist);

// get user wishlist
router.get('/:id/wishlist', protect, wishlistController.getWishlist);

// delete individual item from wishlist
router.delete('/:id/wishlist/:productId', protect, wishlistController.removeItemFromWishlist);

// clear wishlist
router.delete('/:id/wishlist', protect, wishlistController.clearWishlist);

module.exports = router;