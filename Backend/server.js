require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');  // Add cookie-parser
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const userOrderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,  // Replace with the allowed client URL or '*' for all origins
  credentials: true, // Allow cookies to be sent along with requests
};

app.use(cors(corsOptions));  // Use the CORS options

// Middleware
app.use(express.json());
app.use(cookieParser());  // Use cookie-parser for handling cookies

// Connect to Database
connectDB();

// User Routes
app.use('/api/users', userRoutes);
app.use('/api/users', productRoutes);
app.use('/api/users', cartRoutes);
app.use('/api/users', wishlistRoutes);
app.use('/api/users/', userOrderRoutes);

// Admin Routes
app.use('/api/admin/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));