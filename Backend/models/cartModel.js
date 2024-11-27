const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
});

CartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(item => item.productId.toString() !== productId);
};

CartSchema.methods.clearCart = function () {
  this.items = [];
};

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;