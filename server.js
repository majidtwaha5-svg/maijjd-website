// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

// Load swagger document
let swaggerDocument;
try {
  swaggerDocument = require('./swagger.json');
} catch (error) {
  console.warn('⚠️  Swagger file not found; using minimal OpenAPI stub');
  swaggerDocument = {
    openapi: '3.0.0',
    info: { title: 'Maijjd API', version: '2.0.0' },
    paths: {}
  };
}

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

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

// Basic API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Maijjd Backend API',
    version: '2.0.0',
    status: 'running',
    endpoints: [
      '/health',
      '/api/health',
      '/api-docs'
    ]
  });
});

// API Documentation (Swagger/OpenAPI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Maijjd API Documentation'
}));

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
  console.log(`📚 Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
