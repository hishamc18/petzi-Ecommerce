const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const User = require('../models/userModel');

// Middleware to protect routes and ensure the user is authenticated
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token using verify method of jwt
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        throw new CustomError('User not found', 404);
      }

      next();
    } catch (error) {
      throw new CustomError('Not authorized, token failed', 401);
    }
  }

  if (!token) {
    throw new CustomError('Not authorized, no token', 401);
  }
};

// Middleware to restrict route access to admins only
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new CustomError('Access denied, admin can only access this', 403);
  }
};

module.exports = { protect, isAdmin };