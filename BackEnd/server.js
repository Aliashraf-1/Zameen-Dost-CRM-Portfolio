const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Response-Time'],
};

app.use(cors(corsOptions));

// ✅ Helmet with cross-origin settings
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath, stat) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Cache images for 1 day
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// ✅ Routes
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ✅ Building Routes
const buildingRoutes = require('./src/routes/buildings');
app.use('/api/buildings', buildingRoutes);

// ✅ Employee Routes
const employeeRoutes = require('./src/routes/employees');
app.use('/api/employees', employeeRoutes);

// ✅ Lead Routes
const leadRoutes = require('./src/routes/leads');
app.use('/api/leads', leadRoutes);

// ✅ Revenue Routes
const revenueRoutes = require('./src/routes/revenue');
app.use('/api/revenue', revenueRoutes);

// ✅ Dashboard Routes
const dashboardRoutes = require('./src/routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// ✅ Customer Routes
const customerRoutes = require('./src/routes/customers');
app.use('/api/customers', customerRoutes);

// ✅ Reports Routes
const reportsRoutes = require('./src/routes/reports');
app.use('/api/reports', reportsRoutes);

// ✅ Settings Routes
const settingsRoutes = require('./src/routes/settings');
app.use('/api/settings', settingsRoutes);

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!' 
  });
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// ✅ Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  });
};

startServer();