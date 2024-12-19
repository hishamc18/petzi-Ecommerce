// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/userController');

// const router = express.Router();

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// module.exports = router;





const express = require('express');
const { registerUser, loginUser, refreshToken } = require('../controllers/userController');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Refresh token route (to obtain a new access token using refresh token)
router.post('/refresh-token', refreshToken);

module.exports = router;