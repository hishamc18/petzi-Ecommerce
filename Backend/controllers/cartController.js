// const Cart = require('../models/cartModel');
// const asyncHandler = require('../middlewares/asyncHandler');

// // Add product to cart
// exports.addToCart = asyncHandler(async (req, res) => {
//   const { id } = req.params; // user ID
//   const { productId, quantity } = req.body;

//   let cart = await Cart.findOne({ userId: id });
//   if (!cart) {
//     cart = new Cart({ userId: id, items: [] });
//   }

//   const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
//   if (itemIndex > -1) {
//     cart.items[itemIndex].quantity += quantity;
//   } else {
//     cart.items.push({ productId, quantity });
//   }

//   await cart.save();
//   res.status(200).json({ success: true, cart });
// });

// // Get cart for a user
// exports.getCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const cart = await Cart.findOne({ userId: id }).populate('items.productId');

//   if (!cart) {
//     return res.status(404).json({ success: false, message: 'Cart not found' });
//   }

//   res.status(200).json({ success: true, cart });
// });

// // Remove product from cart
// exports.removeItemFromCart = asyncHandler(async (req, res) => {
//   const { id, productId } = req.params;

//   const cart = await Cart.findOne({ userId: id });
//   if (cart) {
//     cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
//     await cart.save();
//   }

//   res.status(200).json({ success: true, cart });
// });

// // Clear the entire cart
// exports.clearCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const cart = await Cart.findOne({ userId: id });
//   if (cart) {
//     cart.items = [];
//     await cart.save();
//   }

//   res.status(200).json({ success: true, cart });
// });

// // Update quantity of a product in the cart
// exports.updateQuantity = asyncHandler(async (req, res) => {
//   const { id, productId } = req.params;
//   const { quantity } = req.body;

//   const cart = await Cart.findOne({ userId: id });
//   if (cart) {
//     const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity = quantity;
//       await cart.save();
//     }
//   }

//   res.status(200).json({ success: true, cart });
// });






const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const asyncHandler = require('../middlewares/asyncHandler');
const CustomError = require('../utils/customError');

// Add product to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { id } = req.params; // User ID
  const { productId, quantity } = req.body;

  // Fetch the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  // Validate stock availability
  if (quantity > product.stock) {
    throw new CustomError('Insufficient stock available', 400);
  }

  // Fetch or initialize the user's cart
  let cart = await Cart.findOne({ userId: id });
  if (!cart) {
    cart = new Cart({ userId: id, items: [] });
  }

  // Check if the product already exists in the cart
  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

  if (itemIndex > -1) {
    // Update the quantity if the product exists
    const updatedQuantity = cart.items[itemIndex].quantity + quantity;
    if (updatedQuantity > product.stock) {
      throw new CustomError('Insufficient stock for the updated quantity', 400);
    }
    cart.items[itemIndex].quantity = updatedQuantity;
  } else {
    // Add new product to the cart
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.status(200).json({ success: true, cart });
});

// Get cart for a user
exports.getCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the user's cart and populate product details
  const cart = await Cart.findOne({ userId: id }).populate('items.productId', 'name price stock');
  if (!cart) {
    throw new CustomError('Cart not found', 404);
  }

  res.status(200).json({ success: true, cart });
});

// Remove a product from the cart
exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (!cart) {
    throw new CustomError('Cart not found', 404);
  }

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  await cart.save();

  res.status(200).json({ success: true, cart });
});

// Clear the entire cart
exports.clearCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (!cart) {
    throw new CustomError('Cart not found', 404);
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({ success: true, cart });
});

// Increase product quantity in the cart
exports.increaseQuantity = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const cart = await Cart.findOne({ userId: id });
  if (!cart) {
    throw new CustomError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex === -1) {
    throw new CustomError('Product not found in cart', 404);
  }

  const updatedQuantity = cart.items[itemIndex].quantity + 1;
  if (updatedQuantity > product.stock) {
    throw new CustomError('Insufficient stock for the updated quantity', 400);
  }

  cart.items[itemIndex].quantity = updatedQuantity;
  await cart.save();

  res.status(200).json({ success: true, cart });
});

// Decrease product quantity in the cart
exports.decreaseQuantity = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (!cart) {
    throw new CustomError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex === -1) {
    throw new CustomError('Product not found in cart', 404);
  }

  if (cart.items[itemIndex].quantity > 1) {
    cart.items[itemIndex].quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1); // Remove product if quantity becomes 0
  }

  await cart.save();
  res.status(200).json({ success: true, cart });
});