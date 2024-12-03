const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
} = require('../controllers/productController');

const router = express.Router();

// user
router.get('/products', getAllProducts); // Get all products
router.get('/products/:id', getProductById); // Get product by ID
router.get('/products/category/:category', getProductsByCategory); // Get products by category


module.exports = router;