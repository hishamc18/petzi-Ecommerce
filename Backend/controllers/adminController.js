const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/userModel");
const CustomError = require('../utils/customError')
const Product = require('../models/productModel')

//Get All users
exports.getAllUsers = asyncHandler(async (req,res)=>{
    const users = await User.find({role: "user"}).select('-password')
    res.status(200).json({success: true, count: users.length, message: "All users fetched", users})
})

//get user by id
exports.getUserById = asyncHandler()

// Add new product
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
      iseDeleted
    } = req.body;
  
    // Validate input
    if (!name || !price || !image || !category || !seller || !stock || !description || !ingredients) {
      throw new CustomError('All fields are required to add a product', 400);
    }
  
    // Create product
    try {
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
      iseDeleted,
    });
  
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
} catch (error){
    if(error.code = 11000){
        throw new CustomError('Product name must be unique, A product with same name already exist', 400);
    }
}
  });