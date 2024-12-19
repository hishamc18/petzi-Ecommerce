const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const User = require('../models/userModel');

// Protect middleware
const protect = async (req, res, next) => {
  let token;

  try {
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new CustomError('Not authorized, no token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    // setting user data to the req object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      throw new CustomError('User not found', 404);
    }

    next();
  } catch (err) {
    
    if (err.name === 'TokenExpiredError') {
      throw new CustomError('Access token expired, please refresh your token', 401);
    } else {
      throw new CustomError('Not authorized, token invalid', 401);
    }
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new CustomError('Access denied, only admins can access this', 403);
  }
};

module.exports = { protect, isAdmin };