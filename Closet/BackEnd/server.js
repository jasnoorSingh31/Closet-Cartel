const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection helper so Mongo is ready before serving requests
const connectDB = require('./config/db');

// Import route modules (split by concern for clarity)
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// 1) Parse JSON request bodies.
// 2) Allow the Vite dev server (http://localhost:5173) to call these APIs with cookies.
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Routes
// Keep major features on their own routers for readability and testing.
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Error handling middleware
// Centralized handler so unhandled errors still return JSON instead of crashing.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Handle undefined routes
// The catch‑all makes it obvious when the frontend calls a wrong endpoint.
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});