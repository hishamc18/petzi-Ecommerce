const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');
const CustomError = require('../utils/customError'); 

// Add a product to the wishlist
const addToWishlist = async (userId, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new CustomError('Product not found', 404);

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    // Check if product already exists in wishlist
    if (wishlist.products.includes(productId)) {
      throw new CustomError('Product is already in your wishlist', 400);
    }

    wishlist.products.push(productId);
    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw error;
  }
};

// Remove a product from the wishlist
const removeFromWishlist = async (userId, productId) => {
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new CustomError('Wishlist not found', 404);

    const index = wishlist.products.indexOf(productId);
    if (index === -1) throw new CustomError('Product not found in wishlist', 404);

    wishlist.products.splice(index, 1);
    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw error;
  }
};

// Get the user's wishlist
const getWishlist = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) throw new CustomError('Wishlist not found', 404);
    return wishlist;
  } catch (error) {
    throw error;
  }
};

// Clear all products from the wishlist
const clearWishlist = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new CustomError('Wishlist not found', 404);

    // Clear all products from the wishlist
    wishlist.products = [];
    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
};
