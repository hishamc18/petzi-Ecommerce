const Order = require('../models/orderModel');
const CustomError = require('../utils/customError');
const asyncHandler = require('../middlewares/asyncHandler');

// Create a new order
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    throw new CustomError('No items in the cart to create an order', 400);
  }

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

// Get order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('items.productId', 'name price')
    .populate('userId', 'username email');

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  res.status(200).json({
    success: true,
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