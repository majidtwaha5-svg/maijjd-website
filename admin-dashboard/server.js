const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const userTrackingRoutes = require('./routes/userTracking');
const customerFeedbackRoutes = require('./routes/customerFeedback');
const invoiceRoutes = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

// Import services
const { initializeDatabase } = require('./services/database');
const { initializeAnalytics } = require('./services/analytics');
const { initializeSocketHandlers } = require('./services/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(requestLogger);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/reports', express.static(path.join(__dirname, 'reports')));
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/tracking', userTrackingRoutes);
app.use('/api/feedback', customerFeedbackRoutes);
app.use('/api/invoices', authenticateToken, invoiceRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Real-time analytics endpoint
app.post('/api/track', (req, res) => {
  const { event, data, sessionId, userId } = req.body;
  
  // Emit real-time event to admin dashboard
  io.emit('analytics-event', {
    event,
    data,
    sessionId,
    userId,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(200).json({ success: true });
});

// Error handling
app.use(errorHandler);

// Serve admin dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize services
async function initializeServices() {
  try {
    await initializeDatabase();
    await initializeAnalytics();
    initializeSocketHandlers(io);
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 5004;
server.listen(PORT, () => {
  console.log(`🚀 Admin Dashboard Server running on port ${PORT}`);
  console.log(`📊 Analytics Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api/docs`);
});

// Initialize services after server starts
initializeServices();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { app, server, io };
