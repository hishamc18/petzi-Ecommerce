const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {protect} = require('../middlewares/authMiddleware');

// Add product to cart
router.post('/:id/cart', protect, cartController.addToCart);

// Get user's cart
router.get('/:id/cart', protect, cartController.getCart);

// Remove item from cart
router.delete('/:id/cart/:productId', protect, cartController.removeItemFromCart);

// Clear the cart
router.delete('/:id/cart', protect, cartController.clearCart);

// // Update quantity of a product in the cart
// router.put('/:id/cart/:productId', protect, cartController.updateQuantity);

// Increase product quantity in cart
router.put('/:id/cart/:productId/increase', protect, cartController.increaseQuantity);

// Decrease product quantity in cart
router.put('/:id/cart/:productId/decrease', protect, cartController.decreaseQuantity);

module.exports = router;