const { required } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
    },
    oldPrice: {
      type: Number,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    seller: {
      type: String,
      required: [true, 'Seller information is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    ingredients: {
      type: [String],
      required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);