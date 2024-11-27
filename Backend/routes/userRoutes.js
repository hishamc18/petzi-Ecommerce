const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (example)
// router.get('/profile', protect, (req, res) => {
//   res.status(200).json({ message: 'User profile', user: req.user });
// });

module.exports = router;