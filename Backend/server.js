require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const userOrderRoutes = require('./routes/orderRoutes')

const app = express();
app.use(cors());  // Allow all origins or specify specific origins

// Middleware
app.use(express.json());

// Connect to DataBase
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users', productRoutes);
app.use('/api/users', cartRoutes);
app.use('/api/users', wishlistRoutes);
app.use('/api/users/', userOrderRoutes);
app.use('/api/admin/products', productRoutes);



// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));