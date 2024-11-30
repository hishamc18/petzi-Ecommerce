const Wishlist = require('../models/wishlistModel');
const asyncHandler = require('../middlewares/asyncHandler');

// Add product to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: id });
    if (!wishlist) {
        wishlist = new Wishlist({ userId: id, items: [] });
    }

    const exists = wishlist.items.some((item) => item.productId.toString() === productId);
    if (exists) {
        return res.status(400).json({ success: false, message: 'Product is already in the wishlist' });
    }
    wishlist.items.push({ productId });
    await wishlist.save();
    res.status(200).json({ success: true, message: "item added to the wishlist", wishlist: wishlist.items.slice().reverse() });
});

// Get full wishlist of a user
exports.getWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let wishlist = await Wishlist.findOne({ userId: id }).populate('items.productId', 'name price stock');

    if (!wishlist) {
        // return res.status(404).json({ success: false, message: 'Wishlist not found' });
        // empty array for new user
        wishlist = new Wishlist({ userId: id, items: [] });
        await wishlist.save();
    }

    res.status(200).json({ success: true, count: `${wishlist.items.length} items`, wishlist });
});

// delete product from wishlist
exports.removeItemFromWishlist = asyncHandler(async (req, res) => {
    const { id, productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: id });
    if (wishlist) {
        wishlist.items = wishlist.items.filter((item) => item.productId.toString() !== productId);
        await wishlist.save();
    }

    res.status(200).json({ success: true, message: `${productId} is deleted`, wishlist });
});

// clear wishlist
exports.clearWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const wishlist = await Wishlist.findOne({ userId: id });
    if (wishlist) {
        wishlist.items = [];
        await wishlist.save();
    }

    res.status(200).json({ success: true, message: "All items deleted", wishlist });
});