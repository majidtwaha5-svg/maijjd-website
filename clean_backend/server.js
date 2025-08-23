// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5003;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Maijjd Backend is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Maijjd API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Mount API routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const usersRoutes = require('./routes/users');
const softwareRoutes = require('./routes/software');
const servicesRoutes = require('./routes/services');
const aiIntegrationRoutes = require('./routes/ai-integration');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/ai', aiIntegrationRoutes);

// Basic API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Maijjd Backend API',
    version: '2.0.0',
    status: 'running',
    endpoints: [
      '/api/auth',
      '/api/contact',
      '/api/users',
      '/api/software',
      '/api/services',
      '/api/ai'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Maijjd Backend running on port ${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});

module.exports = app;
