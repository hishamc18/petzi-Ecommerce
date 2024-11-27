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
const asyncHandler = require('../middlewares/asyncHandler');

// Add product to cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { id } = req.params; // user ID
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId: id });
  if (!cart) {
    cart = new Cart({ userId: id, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.status(200).json({ success: true, cart });
});

// Get cart for a user
exports.getCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findOne({ userId: id }).populate('items.productId');

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  res.status(200).json({ success: true, cart });
});

// Remove product from cart
exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (cart) {
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
  }

  res.status(200).json({ success: true, cart });
});

// Clear the entire cart
exports.clearCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({ success: true, cart });
});

// Increase product quantity in the cart
exports.increaseQuantity = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1; // Increase quantity by 1
      await cart.save();
      res.status(200).json({ success: true, cart });
    } else {
      res.status(404).json({ success: false, message: 'Product not found in cart' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Cart not found' });
  }
});

// Decrease product quantity in the cart
exports.decreaseQuantity = asyncHandler(async (req, res) => {
  const { id, productId } = req.params;

  const cart = await Cart.findOne({ userId: id });
  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // If quantity is greater than 1, decrease it by 1
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
        await cart.save();
        res.status(200).json({ success: true, cart });
      } else {
        // If quantity is 1, remove the product from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({ success: true, message: 'Product removed from cart', cart });
      }
    } else {
      res.status(404).json({ success: false, message: 'Product not found in cart' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Cart not found' });
  }
});