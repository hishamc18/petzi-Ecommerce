



// // Add a new product (admin only)
// exports.addProduct = asyncHandler(async (req, res) => {
//     const {
//       name,
//       price,
//       oldPrice,
//       image,
//       category,
//       seller,
//       stock,
//       description,
//       ingredients,
//       iseDeleted
//     } = req.body;
  
//     // Validate input
//     if (!name || !price || !image || !category || !seller || !stock || !description || !ingredients || !iseDeleted) {
//       throw new CustomError('All fields are required to add a product', 400);
//     }
  
//     // Create product
//     const product = await Product.create({
//       name,
//       price,
//       oldPrice,
//       image,
//       category,
//       seller,
//       stock,
//       description,
//       ingredients,
//       iseDeleted,
//     });
  
//     res.status(201).json({
//       success: true,
//       message: 'Product added successfully',
//       product,
//     });
//   });










const asyncHandler = require('../middlewares/asyncHandler');
const { getProductsService } = require('../services/productService');

// Unified Controller for Product Functions
exports.productController = asyncHandler(async (req, res) => {    
  const { id } = req.params;
  const { page = 1, limit = 12, name, category } = req.query;

  // Call the service to get products based on the filters and pagination
  const { products, total } = await getProductsService({
    id,
    category,
    page: parseInt(page),
    limit: parseInt(limit),
    name,
  });

  return res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    products,
  });
});
