const express = require('express');
const router = express.Router();
const {isAdmin, protect} = require('../middlewares/authMiddleware')
const adminController = require('../controllers/adminController')

router.get('/users', protect, isAdmin, adminController.getAllUsers)
router.get('/users/:id', protect, isAdmin, adminController.getUserById);
router.put('/users/:id', protect, isAdmin, adminController.blockUser);
router.post('/add', protect, isAdmin, adminController.addProduct);


module.exports = router