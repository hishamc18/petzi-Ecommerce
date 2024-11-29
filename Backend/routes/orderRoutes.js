const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {protect} = require('../middlewares/authMiddleware');

// order routes
router.post('/', protect, orderController.createOrder); 
router.get('/', protect, orderController.getUserOrders);
// router.get('/:id', protect, orderController.getOrderById);

module.exports = router;