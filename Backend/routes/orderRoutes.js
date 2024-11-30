const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {protect} = require('../middlewares/authMiddleware');

// order routes
router.post('/orders', protect, orderController.createOrder); 
router.get('/orders', protect, orderController.getUserOrders);

module.exports = router;