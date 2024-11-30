const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/userModel');
const { registerValidation, loginValidation } = require('../utils/validators');
const CustomError = require('../utils/customError');
const generateToken = require('../utils/generateToken')


exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate input using joi
  const { error } = registerValidation.validate({ username, email, password, confirmPassword });
  if (error) throw new CustomError(error.details[0].message, 400);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new CustomError('Email already registered', 400);

    // Create an user
    const user = await User.create({ username, email, password });

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

  // Validate input using joi
  const { error } = loginValidation.validate({ email, password });
  if (error) throw new CustomError(error.details[0].message, 400);

  // finding for the user is exist in db
  const user = await User.findOne({ email });
  if (!user) throw new CustomError('Invalid email or password', 401);

  // Verifying password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new CustomError('Invalid email or password', 401);

  // Generating JWT token
  const token = generateToken(user._id);


  res.status(200).json({
    message: 'Login successful',
    token,
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
  });
});