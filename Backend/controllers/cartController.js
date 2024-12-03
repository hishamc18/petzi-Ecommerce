const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const asyncHandler = require('../middlewares/asyncHandler');
const CustomError = require('../utils/customError');

// // Add product to cart
// exports.addToCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { productId, quantity } = req.body;

//   // Fetch the product
//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new CustomError('Product not found', 404);
//   }

//   // Validate stock availability
//   if (quantity > product.stock) {
//     throw new CustomError('Insufficient stock available', 400);
//   }

//   // Fetch or initialize the user's cart
//   let cart = await Cart.findOne({ userId: id });
//   if (!cart) {
//     cart = new Cart({ userId: id, items: [] });
//   }

//   // Checking product that exist in cart
//   const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

//   if (itemIndex > -1) {
//     // Updating qty
//     const updatedQuantity = cart.items[itemIndex].quantity + quantity;
//     if (updatedQuantity > product.stock) {
//       throw new CustomError('Insufficient stock for the updated quantity', 400);
//     }
//     cart.items[itemIndex].quantity = updatedQuantity;
//   } else {
//     // Adding new product to the cart
//     cart.items.push({ productId, quantity });
//   }

//   await cart.save();
//   res.status(200).json({ success: true, message: "item added to the cart", cart : cart.items.slice().reverse() });
// });

// Add product to cart
exports.addToCart = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        throw new CustomError('Product not found', 404);
    }

    if (product.stock < 1) {
        throw new CustomError('Insufficient stock available', 400);
    }

    let cart = await Cart.findOne({ userId: id });
    if (!cart) {
        cart = new Cart({ userId: id, items: [] });
    }

    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
        // Incrementing quantity for an existing product
        const updatedQuantity = cart.items[itemIndex].quantity + 1;
        if (updatedQuantity > product.stock) {
            throw new CustomError('Insufficient stock for the updated quantity', 400);
        }
        cart.items[itemIndex].quantity = updatedQuantity;
    } else {
        cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({
        success: true,
        message: 'Item added to the cart',
        cart: cart.items.slice().reverse(),
    });
});

// Get cart for a user
exports.getCart = asyncHandler(async (req, res) => {
    const id = req.user._id;

    // Fetching user cart and populate the products
    let cart = await Cart.findOne({ userId: id }).populate('items.productId', 'name price stock');

    if (!cart) {
        // empty array for new user
        cart = new Cart({ userId: id, items: [] });
        await cart.save();
    }
    res.status(200).json({ success: true, count: `${cart.items.length} items`, cart: cart.items.slice().reverse() });
});

// Remove a product from the cart
exports.removeItemFromCart = asyncHandler(async (req, res) => {
    const id = req.user._id
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
        throw new CustomError('Cart not found', 404);
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, message: `${productId} is deleted`, cart });
});

// Clear the entire cart
exports.clearCart = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
        throw new CustomError('Cart not found', 404);
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "All items cleared", cart });
});

// Increase product quantity in the cart
exports.increaseQuantity = asyncHandler(async (req, res) => {
    const id = req.user._id
    const { productId } = req.params;

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
    const id = req.user._id
    const { productId } = req.params;

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
        cart.items.splice(itemIndex, 1); // delete product if qty become 0
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
});