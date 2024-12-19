const express = require('express');
const {
  productController,
} = require('../controllers/productController');

const router = express.Router();

// user
router.get('/products', productController); // Get all products
router.get('/products/:id', productController); // Get product by ID
// router.get('/products/category/:category', productController); // Get products by category

module.exports = router;