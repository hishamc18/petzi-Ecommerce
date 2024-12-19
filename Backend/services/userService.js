// const User = require('../models/userModel');
// const CustomError = require('../utils/customError');
// const generateToken = require('../utils/generateToken');

// // register service
// exports.registerUserService = async ({ username, email, password }) => {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) throw new CustomError('Email already registered', 400);

//     try {
//         const user = await User.create({ username, email, password });

//         // Return only the necessary user details
//         return { id: user._id, username: user.username, email: user.email, role: user.role };
//     } catch (err) {
//         // Handle MongoDB duplicate key error
//         if (err.code === 11000) {
//             const field = Object.keys(err.keyPattern)[0]; // Get the field causing the error
//             throw new CustomError(`The ${field} "${err.keyValue[field]}" is already taken. Please use a different one.`, 400);
//         }
//         throw err; // Re-throw other errors
//     }
// };

// // login
// exports.loginUserService = async ({ email, password }) => {

//     const user = await User.findOne({ email });
//     if (!user) throw new CustomError('Invalid email or password', 401);

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) throw new CustomError('Invalid email or password', 401);

//     const token = generateToken(user._id);

//     return {
//         token,
//         user: { id: user._id, username: user.username, email: user.email, role: user.role },
//     };
// };




const User = require('../models/userModel');
const CustomError = require('../utils/customError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// Register Service
exports.registerUserService = async ({ username, email, password }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new CustomError('Email already registered', 400);

    try {
        // Create a new user
        const user = await User.create({ username, email, password });

        // Return only necessary user details
        return { id: user._id, username: user.username, email: user.email, role: user.role };
    } catch (err) {
        // Handle MongoDB duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0]; // Get the field causing the error
            throw new CustomError(`The ${field} "${err.keyValue[field]}" is already taken. Please use a different one.`, 400);
        }
        throw err; // Re-throw other errors
    }
};

// Login Service
exports.loginUserService = async ({ email, password }) => {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Invalid email or password', 401);

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new CustomError('Invalid email or password', 401);

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role, email: user.email });

    return {
        accessToken,
        refreshToken,
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
    };
};