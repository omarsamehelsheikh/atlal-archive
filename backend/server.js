require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const connectDB = require('./src/config/db'); // 1. Import the DB config
const logger = require('./src/middlewares/logger');

// Import the Master Router
const apiRoutes = require('./src/routes/index');

const app = express();

// 2. Execute Database Connection
connectDB();

// --- Middleware ---
app.use(logger);
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static folder for uploaded assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Root Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Atlal Archive Backend API is active',
    version: '1.0.0'
  });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${req.method} ${req.path}:`, err.stack);

  res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`--------------------------------------------------`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📂 API Base: http://localhost:${PORT}/api`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`--------------------------------------------------`);
});