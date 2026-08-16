/**
 * Student Expense Tracker - Backend Server
 *
 * Technologies: Node.js, Express.js, REST API architecture
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection attempt (safe fallback if MONGO_URI is unset)
connectDB();

// Core Middlewares
app.use(cors({
  origin: '*', // Allows requests from any origin during development (e.g. Vite on port 5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Student Expense Tracker API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Mount Expense Routes
app.use('/api/expenses', expenseRoutes);

// Catch-all route for unhandled endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Global Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Expense Tracker Backend Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api/expenses`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

module.exports = app;
