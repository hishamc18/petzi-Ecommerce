const express = require('express');
const router = express.Router();
const {isAdmin, protect} = require('../middlewares/authMiddleware')
const adminController = require('../controllers/adminController')

router.get('/users', protect, isAdmin, adminController.getAllUsers)
router.post('/add', protect, isAdmin, adminController.addProduct);


module.exports = router