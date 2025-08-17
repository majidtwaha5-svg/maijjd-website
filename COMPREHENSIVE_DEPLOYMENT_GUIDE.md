# 🚀 Maijjd Comprehensive Deployment Guide

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

## 🚀 Quick Start

### One-Command Deployment
```bash
# The fastest way to get started
chmod +x deploy-super-quick.sh && ./deploy-super-quick.sh
```

### What This Does
- ✅ Auto-detects your operating system
- ✅ Installs all dependencies
- ✅ Sets up Docker environment
- ✅ Configures services
- ✅ Opens browser automatically
- ✅ Sets up monitoring

## 💻 Local Development

### Prerequisites
- Node.js 16+ and npm
- MongoDB (optional, can use Docker)
- Redis (optional, can use Docker)

### Start Local Development
```bash
# Run the local development script
chmod +x local-dev.sh && ./local-dev.sh
```

### Manual Local Setup
```bash
# Install frontend dependencies
cd frontend_maijjd
npm install
npm start

# In another terminal, install backend dependencies
cd backend_maijjd
npm install
npm start
```

### Local Environment Variables
```bash
# Backend (.env)
NODE_ENV=development
PORT=5001
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ENV=development
```

## 🐳 Docker Deployment

### Quick Docker Setup
```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Services
- **Frontend**: React app served by Nginx (port 3000)
- **Backend**: Node.js API server (port 5001)
- **Database**: MongoDB (port 27017)
- **Cache**: Redis (port 6379)
- **Monitoring**: Prometheus + Grafana

### Docker Commands
```bash
# Build images
docker-compose build

# Start specific service
docker-compose up -d frontend

# View service status
docker-compose ps

# Access container shell
docker-compose exec backend bash
```

## 🏭 Production Deployment

### Production Script
```bash
# Production deployment with optimizations
chmod +x deploy-production.sh && ./deploy-production.sh
```

### Production Features
- ✅ SSL/TLS encryption
- ✅ Load balancing
- ✅ Rate limiting
- ✅ Security headers
- ✅ Performance optimization
- ✅ Monitoring setup

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
PORT=5001
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com
MONGO_URI=mongodb://your-mongo-uri
REDIS_URI=redis://your-redis-uri
```

## ☁️ Cloud Deployment

### Cloud Platforms Supported
- **AWS**: EC2, ECS, Lambda
- **Google Cloud**: GCE, GKE, Cloud Run
- **Azure**: VMs, AKS, App Service
- **DigitalOcean**: Droplets, App Platform
- **Heroku**: Container deployment

### Cloud Deployment Script
```bash
# Cloud-optimized deployment
chmod +x cloud-deploy.sh && ./cloud-deploy.sh
```

### Cloud Configuration
```bash
# Set cloud provider
export CLOUD_PROVIDER=aws  # or gcp, azure, digitalocean

# Set region
export CLOUD_REGION=us-east-1

# Deploy
./cloud-deploy.sh
```

## 📊 Monitoring & Health Checks

### Health Check Script
```bash
# Comprehensive system health check
chmod +x health-check.sh && ./health-check.sh
```

### What's Monitored
- ✅ Service availability
- ✅ Port conflicts
- ✅ Resource usage
- ✅ Network connectivity
- ✅ Docker status
- ✅ Database health

### Monitoring Dashboard
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Health API**: http://localhost:5001/api/health

### Custom Metrics
```bash
# View custom metrics
curl http://localhost:5001/api/metrics

# Health check
curl http://localhost:5001/api/health

# Service status
curl http://localhost:5001/api/services
```

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using a port
lsof -i :3000
lsof -i :5001

# Kill process using port
kill -9 <PID>
```

#### Docker Issues
```bash
# Reset Docker environment
docker-compose down -v
docker system prune -f
docker-compose up -d
```

#### Database Connection Issues
```bash
# Check MongoDB status
docker-compose exec mongodb mongosh

# Check Redis status
docker-compose exec redis redis-cli ping
```

#### Frontend Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View application logs
tail -f backend_maijjd/logs/app.log
```

## ⚙️ Advanced Configuration

### Nginx Configuration
```nginx
# Custom Nginx config
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://backend:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Compose Customization
```yaml
# Custom docker-compose.override.yml
version: '3.8'
services:
  backend:
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
```

### Environment-Specific Configs
```bash
# Development
cp .env.example .env.development

# Staging
cp .env.example .env.staging

# Production
cp .env.example .env.production
```

## 📱 Mobile App Deployment

### Mobile App Setup
```bash
# Open mobile app in browser
open mobile-app.html

# Or serve it
python3 -m http.server 8080
```

### Progressive Web App Features
- ✅ Offline support
- ✅ Push notifications
- ✅ App-like experience
- ✅ Cross-platform compatibility

## 🔐 Security Configuration

### SSL/TLS Setup
```bash
# Generate SSL certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Configure Nginx with SSL
# See nginx.conf for full configuration
```

### Security Headers
```nginx
# Security headers in Nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

### Rate Limiting
```nginx
# Rate limiting configuration
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## 📈 Performance Optimization

### Frontend Optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Bundle analysis

### Backend Optimization
- ✅ Connection pooling
- ✅ Caching strategies
- ✅ Database indexing
- ✅ Load balancing

### Monitoring Performance
```bash
# Performance metrics
curl http://localhost:5001/api/metrics/performance

# Resource usage
docker stats

# Application profiling
node --inspect backend_maijjd/server.js
```

## 🚀 Deployment Strategies

### Blue-Green Deployment
```bash
# Deploy new version alongside old
./deploy-blue-green.sh

# Switch traffic to new version
./switch-traffic.sh
```

### Rolling Updates
```bash
# Rolling update deployment
docker-compose up -d --no-deps --build backend
```

### Canary Deployment
```bash
# Deploy to subset of users
./deploy-canary.sh --percentage 10
```

## 📚 Additional Resources

### Documentation
- [Installation Guides](INSTALLATION_GUIDES.md)
- [Cloud Deployment Guide](CLOUD_DEPLOYMENT_GUIDE.md)
- [Custom Domain Setup](CUSTOM_DOMAIN_SETUP.md)
- [Perfect Deployment Guide](PERFECT_DEPLOYMENT_GUIDE.md)

### Scripts Reference
- `deploy-super-quick.sh` - Fastest deployment
- `deploy-production.sh` - Production-ready setup
- `cloud-deploy.sh` - Cloud platform deployment
- `health-check.sh` - System health monitoring
- `local-dev.sh` - Local development setup

### Support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides and examples
- **Community**: Discord, Reddit, Twitter

---

## 🎯 Next Steps

1. **Choose your deployment method** based on your needs
2. **Run the appropriate script** for your environment
3. **Configure your domain** and SSL certificates
4. **Set up monitoring** and health checks
5. **Deploy to production** when ready

## 🆘 Need Help?

If you encounter any issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Run the health check script: `./health-check.sh`
3. Review the logs: `docker-compose logs -f`
4. Check the [GitHub issues](https://github.com/maijd/issues)

---

**Happy Deploying! 🚀**

*Built with ❤️ by the Maijd Team*
