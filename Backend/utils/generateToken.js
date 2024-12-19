
const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (user) => {
  
  return jwt.sign(
    {
      id: user.id,      
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};



// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id }, // Minimal payload for refresh token
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Long expiration time for refresh token
  );
};

module.exports = { generateAccessToken, generateRefreshToken };