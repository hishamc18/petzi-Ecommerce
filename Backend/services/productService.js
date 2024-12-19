const Product = require('../models/productModel');
const CustomError = require('../utils/customError');
const mongoose = require('mongoose')

// Unified service to handle all product fetching logic
exports.getProductsService = async ({ id, category, page, limit, name }) => {
    const skip = (page - 1) * limit;

    limit = limit

    let match = { isDeleted: false };

    //search based on name
    if (name) {
        match.name = { $regex: name, $options: 'i' };
    }

    if (category) {
        match.category = { $regex: category, $options: 'i' }; // Case-insensitive match
    }



    //product id
    if (id) {
        match._id = new mongoose.Types.ObjectId(id);
    }

    //aggregation pipeline
    const pipeline = [
        { $match: match },
        { $skip: skip },
        { $limit: limit },
    ];

    const products = await Product.aggregate(pipeline);

    // If 'id' is provided, return the product directly
    if (id && products.length === 0) {
        throw new CustomError('Product not found or is deleted', 404);
    }

    // If no id is provided, return all matching products
    const total = await Product.countDocuments({ isDeleted: false, ...match });

    return { products, total };
};