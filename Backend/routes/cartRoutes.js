const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {protect} = require('../middlewares/authMiddleware');

// Add product to cart
router.post('/cart/:productId', protect, cartController.addToCart);

// Get user's cart
router.get('/cart', protect, cartController.getCart);

// Remove item from cart
router.delete('/cart/:productId', protect, cartController.removeItemFromCart);

// Clear the cart
router.delete('/cart', protect, cartController.clearCart);

// Increase product quantity in cart
router.put('/cart/:productId/increase', protect, cartController.increaseQuantity);

// Decrease product quantity in cart
router.put('/cart/:productId/decrease', protect, cartController.decreaseQuantity);

module.exports = router;