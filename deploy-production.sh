#!/bin/bash

# Maijjd Production Deployment Script
# This script deploys the full-stack application to production

set -e

echo "🚀 Starting Maijjd Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend_maijjd"
BACKEND_DIR="backend_maijjd"
BUILD_DIR="build"
DIST_DIR="dist"

# Check if we're in the right directory
if [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Building Frontend...${NC}"
cd "$FRONTEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Create production build
echo -e "${YELLOW}🔨 Creating production build...${NC}"
npm run build

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build completed successfully!${NC}"

# Go back to root
cd ..

echo -e "${BLUE}📁 Building Backend...${NC}"
cd "$BACKEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Create production build directory
if [ ! -d "$DIST_DIR" ]; then
    mkdir -p "$DIST_DIR"
fi

# Copy necessary files
echo -e "${YELLOW}📋 Copying backend files...${NC}"
cp -r package*.json "$DIST_DIR/"
cp -r server.js "$DIST_DIR/"
cp -r routes "$DIST_DIR/"
cp -r .env "$DIST_DIR/" 2>/dev/null || echo "No .env file found"

# Go back to root
cd ..

# Create production deployment package
echo -e "${BLUE}📦 Creating production package...${NC}"
PRODUCTION_DIR="maijjd-production-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$PRODUCTION_DIR"

# Copy frontend build
cp -r "$FRONTEND_DIR/$BUILD_DIR" "$PRODUCTION_DIR/frontend"

# Copy backend
cp -r "$BACKEND_DIR/$DIST_DIR" "$PRODUCTION_DIR/backend"

# Copy deployment files
cp docker-compose.yml "$PRODUCTION_DIR/"
cp nginx.conf "$PRODUCTION_DIR/"
cp -r monitoring "$PRODUCTION_DIR/"

# Create production environment file
cat > "$PRODUCTION_DIR/.env" << EOF
# Production Environment Variables
NODE_ENV=production
PORT=5001
FRONTEND_PORT=3000

# Database (update these for your production environment)
MONGODB_URI=mongodb://your-production-mongodb-uri

# JWT Secret (change this in production!)
JWT_SECRET=your-production-jwt-secret-key

# API Keys (add your production API keys here)
# STRIPE_SECRET_KEY=your-stripe-secret-key
# SENDGRID_API_KEY=your-sendgrid-api-key
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=your-s3-bucket-name

# Domain Configuration
DOMAIN=your-domain.com
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
EOF

# Create production start script
cat > "$PRODUCTION_DIR/start-production.sh" << 'EOF'
#!/bin/bash

echo "🚀 Starting Maijjd Production Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services
echo "📦 Starting services with Docker Compose..."
docker-compose up -d

echo "✅ Production environment started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo "📊 Monitoring: http://localhost:3001"

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  Update services: docker-compose pull && docker-compose up -d"
EOF

chmod +x "$PRODUCTION_DIR/start-production.sh"

# Create production README
cat > "$PRODUCTION_DIR/README.md" << 'EOF'
# Maijjd Production Deployment

This directory contains the production-ready version of the Maijjd application.

## Quick Start

1. **Configure Environment Variables**
   - Edit `.env` file with your production values
   - Update database URIs, API keys, and domain settings

2. **Start Services**
   ```bash
   chmod +x start-production.sh
   ./start-production.sh
   ```

3. **Access Your Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Monitoring: http://localhost:3001

## Production Checklist

- [ ] Update `.env` file with production values
- [ ] Configure domain and SSL certificates
- [ ] Set up production database
- [ ] Configure monitoring and logging
- [ ] Set up backup and recovery procedures
- [ ] Configure CI/CD pipeline
- [ ] Set up monitoring alerts

## Deployment Options

### Option 1: Docker Compose (Recommended for small-medium deployments)
```bash
./start-production.sh
```

### Option 2: Manual Deployment
```bash
# Start backend
cd backend && npm start

# Start frontend (in another terminal)
cd frontend && npm start
```

### Option 3: Cloud Deployment
See `CLOUD_DEPLOYMENT_GUIDE.md` for detailed cloud deployment instructions.

## Monitoring

- **Grafana Dashboard**: http://localhost:3001
- **Health Check**: http://localhost:5001/api/health
- **API Documentation**: http://localhost:5001/

## Support

For production support, contact:
- Email: support@maijjd.com
- Phone: +1 (872) 312-2293
- Emergency: +1 (415) 555-0124
EOF

echo -e "${GREEN}✅ Production package created: $PRODUCTION_DIR${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Review and update $PRODUCTION_DIR/.env"
echo "2. Deploy to your production server"
echo "3. Run: cd $PRODUCTION_DIR && ./start-production.sh"
echo ""
echo -e "${GREEN}🎉 Deployment package ready!${NC}"
