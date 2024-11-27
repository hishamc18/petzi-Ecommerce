const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  addProduct
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// user
router.get('/products', getAllProducts); // Get all products
router.get('/products/:id', getProductById); // Get product by ID
router.get('/products/category/:category', getProductsByCategory); // Get products by category

// admin
router.post('/add', protect, isAdmin, addProduct);

module.exports = router;