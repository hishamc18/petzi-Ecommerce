const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/userModel');
const { registerValidation, loginValidation } = require('../utils/validators');
const CustomError = require('../utils/customError');


const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Required to detect MongoDB errors

exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate input
  const { error } = registerValidation.validate({ username, email, password, confirmPassword });
  if (error) throw new CustomError(error.details[0].message, 400);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new CustomError('Email already registered', 400);

    // Create user with role: 'user'
    const user = await User.create({ username, email, password });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User registered successfully',
      token, // Include token in the response
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    //err code 11000 indicates duplicate key error in mongoDB
    if (err.code === 11000) {  
      const field = Object.keys(err.keyPattern)[0]; // used to get the error occuring field
      throw new CustomError(`The ${field} "${err.keyValue[field]}" is already taken. Please use a different one.`, 400);
    }
    throw err; // Re-throw other errors
  }
});


// Login 
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const { error } = loginValidation.validate({ email, password });
  if (error) throw new CustomError(error.details[0].message, 400);

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) throw new CustomError('Invalid email or password', 401);

  // Verify password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new CustomError('Invalid email or password', 401);

  // Generate JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({
    message: 'Login successful',
    token, // Include token in the response
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
  });
});