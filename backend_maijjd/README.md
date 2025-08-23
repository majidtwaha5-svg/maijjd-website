# Maijjd Backend API

A robust, production-ready backend API for the Maijjd platform, optimized for Railway deployment and designed to power modern web applications.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **CORS Support** - Cross-origin resource sharing enabled
- **Security Headers** - Helmet.js for enhanced security
- **Health Checks** - Railway-compatible health monitoring
- **Environment Variables** - Flexible configuration management
- **Error Handling** - Comprehensive error management
- **API Documentation** - Built-in API information endpoints

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Railway Account** (for deployment)

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend_maijjd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **For development with auto-restart:**
   ```bash
   npm run dev
   ```

### Production Deployment

This backend is optimized for Railway deployment:

1. **Connect to Railway:**
   - Link your GitHub repository
   - Set root directory to `backend_maijjd`
   - Railway will auto-detect Node.js

2. **Environment Variables:**
   - Set `PORT` (Railway provides this automatically)
   - Set `NODE_ENV=production`
   - Add any additional environment variables

3. **Deploy:**
   - Railway will automatically deploy on push to main branch
   - Health checks will verify deployment success

## 📡 API Endpoints

### Health & Status
- `GET /` - Root endpoint with basic info
- `GET /health` - Health check endpoint
- `GET /api/health` - API health check
- `GET /api` - API information
- `GET /api/info` - Detailed API information

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot` - Password reset request
- `POST /api/auth/reset` - Password reset
- `GET /api/auth/profile` - Get user profile

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `GET /api/services/:id` - Get specific service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Software
- `GET /api/software` - Get all software
- `POST /api/software` - Create new software
- `GET /api/software/:id` - Get specific software
- `PUT /api/software/:id` - Update software
- `DELETE /api/software/:id` - Delete software

### MNJD, MJ, and Team Integration
- `POST /api/ai/chat` - MNJD, MJ, and Team chat (authenticated)
- `POST /api/ai/demo/chat` - MNJD, MJ, and Team chat (demo)
- `POST /api/ai/voice` - MNJD, MJ, and Team voice processing
- `GET /api/ai/models` - Get available MNJD, MJ, and Team models

### Contact & Support
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions

### Payments
- `GET /api/payments/config` - Get payment plans
- `POST /api/payments/checkout` - Start checkout
- `GET /api/payments/public-key` - Get Stripe public key
- `POST /api/payments/portal` - Open billing portal

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database (if using)
DATABASE_URL=your_database_url

# JWT Secret
JWT_SECRET=your_jwt_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# MNJD, MJ, and Team Configuration
AI_API_KEY=your_mnjd_mj_and_team_api_key

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

### Railway Configuration

The `railway.json` file configures:
- Health check endpoints
- Build commands
- Environment variables
- Deployment settings

## 📦 Dependencies

### Production Dependencies
- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **dotenv** - Environment variables

### Development Dependencies
- **nodemon** - Auto-restart on file changes
- **jest** - Testing framework
- **supertest** - API testing

## 🏗️ Project Structure

```
backend_maijjd/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── railway.json           # Railway deployment config
├── env.example            # Environment variables template
├── .railwayignore         # Files to exclude from Railway
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   └── validation.js     # Input validation
├── routes/               # API routes
│   ├── auth.js          # Authentication routes
│   ├── services.js      # Services routes
│   ├── software.js      # Software routes
│   ├── ai-integration.js # MNJD, MJ, and Team integration routes
│   └── contact.js       # Contact routes
├── services/             # Business logic
│   └── twilio.js        # Twilio integration
├── test/                 # Test files
│   └── api.test.js      # API tests
└── README.md            # This file
```

## 🌐 Railway Deployment

### Automatic Deployment
1. **Connect Repository:**
   - Link your GitHub repository to Railway
   - Railway will auto-detect the Node.js project

2. **Configure Settings:**
   - Set root directory to `backend_maijjd`
   - Configure environment variables
   - Set up custom domain (optional)

3. **Deploy:**
   - Railway automatically deploys on push to main branch
   - Health checks verify deployment success
   - Automatic rollback on failure

### Manual Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy
railway up
```

## 📊 Health Checks

Railway automatically monitors:
- **Endpoint**: `GET /api/health`
- **Expected Response**: `200 OK` with health status
- **Timeout**: 300 seconds
- **Retry Policy**: 3 attempts on failure
- **Frequency**: Every 30 seconds

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "version": "2.0.0"
}
```

## 🔒 Security

### Security Headers (Helmet.js)
- **X-Frame-Options** - Prevent clickjacking
- **X-Content-Type-Options** - Prevent MIME sniffing
- **X-XSS-Protection** - XSS protection
- **Strict-Transport-Security** - HTTPS enforcement
- **Content-Security-Policy** - Content security

### CORS Configuration
- **Origin**: Configurable via environment variables
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: Supported for authenticated requests

### Input Validation
- Request body validation
- Query parameter sanitization
- SQL injection prevention
- XSS protection

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### API Testing
```bash
# Test API endpoints
npm run test:api

# Test specific endpoint
npm run test:api -- --grep "health"
```

## 📈 Monitoring & Logging

### Logging
- Request/response logging
- Error logging with stack traces
- Performance monitoring
- Health check logging

### Metrics
- Response time tracking
- Error rate monitoring
- Request volume tracking
- Uptime monitoring

## 🚨 Error Handling

### Error Types
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource not found)
- **500** - Internal Server Error (server errors)

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

## 🔄 API Versioning

The API supports versioning through URL prefixes:
- **Current Version**: `/api/v1/`
- **Legacy Support**: `/api/` (redirects to v1)
- **Future Versions**: `/api/v2/`, `/api/v3/`, etc.

## 📚 API Documentation

### Swagger/OpenAPI
- Interactive API documentation
- Request/response examples
- Authentication documentation
- Available at `/api/docs` (if enabled)

### Postman Collection
- Pre-configured API requests
- Environment variables
- Test scripts
- Available in project repository

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new features**
5. **Submit a pull request**

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new endpoints
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the development team

### Common Issues
- **Port already in use**: Change PORT in .env
- **CORS errors**: Check CORS_ORIGIN configuration
- **Authentication fails**: Verify JWT_SECRET
- **Railway deployment fails**: Check health check endpoint

## 🔗 Links

- **Live API**: https://maijjd-backend-production-ad65.up.railway.app
- **Health Check**: https://maijjd-backend-production-ad65.up.railway.app/api/health
- **Frontend**: https://maijjd-frontend.vercel.app
- **GitHub Repository**: [Your Repository URL]
- **Railway Dashboard**: [Your Railway Project URL]

---

**Built with ❤️ by the Maijjd Development Team**