const mongoose = require("mongoose");

const WishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [WishlistItemSchema],
});

WishlistSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(item => item.productId.toString() !== productId);
};

WishlistSchema.methods.clearWishlist = function () {
  this.items = [];
};

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;