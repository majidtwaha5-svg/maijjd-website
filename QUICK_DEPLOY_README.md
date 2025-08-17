# 🚀 Maijjd Full Project - Quick Deploy

## Overview

The `quick-deploy.sh` script provides a one-command solution for deploying the entire Maijjd Full Project stack. It automatically sets up all necessary services, configurations, and monitoring tools.

## ✨ Features

- **One-Command Deployment**: Deploy the entire stack with a single command
- **Multiple Modes**: Development mode with hot reload or production mode
- **Automatic Setup**: Creates all necessary directories, SSL certificates, and configurations
- **Health Monitoring**: Built-in health checks for all services
- **Monitoring Stack**: Includes Prometheus and Grafana for observability
- **SSL Support**: Automatic self-signed certificate generation
- **Clean Deployment**: Option to remove existing containers for fresh deployment

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- macOS, Linux, or Windows with WSL2
- At least 4GB RAM available

### Basic Usage

```bash
# Production deployment (default)
./quick-deploy.sh

# Development mode with hot reload
./quick-deploy.sh --dev

# Clean deployment (removes existing containers)
./quick-deploy.sh --clean

# Skip system requirement checks
./quick-deploy.sh --skip-checks

# Show help
./quick-deploy.sh --help
```

## 🎯 Deployment Modes

### Production Mode (Default)
- Optimized for performance
- Production-ready configurations
- Minimal resource usage
- Suitable for staging and production environments

### Development Mode
- Hot reload enabled
- Source code mounted for live editing
- Development dependencies
- Enhanced debugging capabilities

## 🏗️ What Gets Deployed

### Core Services
- **Frontend**: React application on port 3000
- **Backend**: Node.js API on port 5000
- **Database**: MongoDB on port 27017
- **Cache**: Redis on port 6379
- **Proxy**: Nginx on ports 80/443

### Monitoring & Observability
- **Prometheus**: Metrics collection on port 9090
- **Grafana**: Dashboard on port 3001 (admin/admin)
- **Application Metrics**: Available at `/metrics` endpoints

### Infrastructure
- **SSL Certificates**: Self-signed certificates for HTTPS
- **Environment Variables**: Automatic `.env` file creation
- **Network**: Isolated Docker network
- **Volumes**: Persistent data storage

## 📊 Access URLs

After successful deployment:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:5000 | REST API endpoints |
| Nginx HTTP | http://localhost:80 | Reverse proxy |
| Nginx HTTPS | https://localhost:443 | Secure reverse proxy |
| Prometheus | http://localhost:9090 | Metrics collection |
| Grafana | http://localhost:3001 | Monitoring dashboards |

## 🔧 Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Service Management
```bash
# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Clean up everything
docker-compose down -v --remove-orphans
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend status
curl http://localhost:3000

# Application metrics
curl http://localhost:5000/metrics
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5000
   
   # Stop conflicting services
   docker-compose down
   ```

2. **Docker Not Running**
   ```bash
   # Start Docker Desktop
   # Or on Linux:
   sudo systemctl start docker
   ```

3. **Permission Issues**
   ```bash
   # Make script executable
   chmod +x quick-deploy.sh
   ```

4. **Service Not Starting**
   ```bash
   # Check logs
   docker-compose logs -f [service_name]
   
   # Check resource usage
   docker stats
   ```

### Reset Everything
```bash
# Complete cleanup
docker-compose down -v --remove-orphans
docker system prune -af
./quick-deploy.sh --clean
```

## 📁 Project Structure

```
Maijjd_Full_Project/
├── quick-deploy.sh          # This deployment script
├── docker-compose.yml       # Service definitions
├── .env                     # Environment variables (auto-created)
├── ssl/                     # SSL certificates (auto-created)
├── monitoring/              # Monitoring configs (auto-created)
├── frontend_maijjd/         # React frontend
├── backend_maijjd/          # Node.js backend
└── nginx.conf              # Nginx configuration
```

## 🔒 Security Notes

- SSL certificates are self-signed (for development only)
- JWT secret is auto-generated with timestamp
- Database credentials are default (change for production)
- Services are isolated in Docker network
- No external ports exposed by default

## 🚀 Production Deployment

For production use:

1. **Update Environment Variables**
   ```bash
   # Edit .env file
   JWT_SECRET=your-super-secure-secret
   NODE_ENV=production
   ```

2. **Use Real SSL Certificates**
   ```bash
   # Replace self-signed certificates
   cp your-cert.pem ssl/cert.pem
   cp your-key.pem ssl/key.pem
   ```

3. **Configure Monitoring**
   - Update Prometheus targets
   - Configure Grafana dashboards
   - Set up alerting

4. **Database Security**
   - Change default MongoDB credentials
   - Enable authentication
   - Configure backup strategies

## 📞 Support

- **Documentation**: Check the main README.md
- **Issues**: Review logs with `docker-compose logs -f`
- **Health**: Use built-in health check endpoints
- **Monitoring**: Access Grafana dashboards

## 🎉 Success!

Once deployment is complete, you'll see:
- ✅ All services running
- 🌐 Access URLs displayed
- 📊 Service status summary
- 🔍 Health check results
- 📝 Useful management commands

Your Maijjd Full Project is now ready for development and production use! 🚀
