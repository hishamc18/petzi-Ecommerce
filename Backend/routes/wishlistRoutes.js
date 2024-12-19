// const express = require('express');
// const router = express.Router();
// const wishlistController = require('../controllers/wishlistController');
// const {protect} = require('../middlewares/authMiddleware')

// // add product to wishlist
// router.post('/wishlist/:productId', protect, wishlistController.addToWishlist);

// // get user wishlist
// router.get('/wishlist', protect, wishlistController.getWishlist);

// // delete individual item from wishlist
// router.delete('/wishlist/:productId', protect, wishlistController.removeItemFromWishlist);

// // clear wishlist
// router.delete('/wishlist', protect, wishlistController.clearWishlist);

// module.exports = router;




// routes/wishlistRoute.js
const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

// Add a product to the wishlist
router.post('/wishlist/:productId', protect, wishlistController.addProductToWishlist);

// Remove a product from the wishlist
router.delete('/wishlist/:productId', protect, wishlistController.removeProductFromWishlist);

// Get the user's wishlist
router.get('/wishlist', protect, wishlistController.getUserWishlist);

// Clear the user's wishlist
router.delete('/wishlist/clear', protect, wishlistController.clearUserWishlist); // New route to clear wishlist

module.exports = router;
