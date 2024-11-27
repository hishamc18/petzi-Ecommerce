const asyncHandler = require('../middlewares/asyncHandler');
const Product = require('../models/productModel');
const CustomError = require('../utils/customError');

// Get all products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// Get a single product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new CustomError('Product not found', 404);

  res.status(200).json({
    success: true,
    product,
  });
});

// Get products by category
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const products = await Product.find({ category });
  if (!products.length) throw new CustomError('No products found for this category', 404);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});



// Add a new product (admin only)
exports.addProduct = asyncHandler(async (req, res) => {
    const {
      name,
      price,
      oldPrice,
      image,
      category,
      seller,
      stock,
      description,
      ingredients,
    } = req.body;
  
    // Validate input
    if (!name || !price || !image || !category || !seller || !stock || !description || !ingredients) {
      throw new CustomError('All fields are required to add a product', 400);
    }
  
    // Create product
    const product = await Product.create({
      name,
      price,
      oldPrice,
      image,
      category,
      seller,
      stock,
      description,
      ingredients,
    });
  
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  });