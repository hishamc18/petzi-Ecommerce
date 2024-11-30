const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('../middlewares/asyncHandler');

// Create new order
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    throw new CustomError('No items in the cart to create an order', 400);
  }

  // stock managing
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new CustomError(`Product with ID ${item.productId} not found`, 404);
    }
    if (product.stock < item.quantity) {
      throw new CustomError(
        `Insufficient stock for product: ${product.name}. Available stock: ${product.stock}`,
        400
      );
    }
    //stock reducing if order is accepted
    product.stock -= item.quantity;
    await product.save();
  }

  // Creating the order after stock validation and reduction
  const order = await Order.create({
    userId: req.user.id,
    items,
    shippingAddress,
    paymentMethod,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
});


// Get orders for a user
exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});