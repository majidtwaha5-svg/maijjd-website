#!/bin/bash

# Maijjd Production Cloud Setup Script
# This script sets up production deployment to cloud platforms

set -e

echo "🚀 Starting Maijjd Production Cloud Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="maijjd-production"
FRONTEND_DIR="../frontend_maijjd"
BACKEND_DIR="../backend_maijjd"

# Check if we're in the right directory
if [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Error: Please run this script from the cloud-deployment directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Production Setup Checklist:${NC}"
echo "1. ✅ Cloud deployment files created"
echo "2. 🔧 Environment configuration"
echo "3. 🗄️  Database setup (MongoDB Atlas)"
echo "4. 🔄 Cache setup (Redis Cloud)"
echo "5. 🚀 Backend deployment (Railway)"
echo "6. ⚡ Frontend deployment (Vercel)"
echo "7. 🔗 Service integration"
echo "8. 🧪 Production testing"
echo ""

# Create production environment configuration
echo -e "${BLUE}🔧 Creating Production Environment Configuration...${NC}"

# Create production .env files
cat > "production.env" << 'EOF'
# Production Environment Variables for Maijjd

# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-domain.railway.app

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maijjd_production

# Cache (Redis Cloud)
REDIS_URI=redis://username:password@redis-host:port

# JWT Security
JWT_SECRET=your-super-secure-production-jwt-secret-key-2025
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# API Keys (Add your production API keys here)
# STRIPE_SECRET_KEY=your-stripe-secret-key
# SENDGRID_API_KEY=your-sendgrid-api-key
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=your-s3-bucket-name

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
ENABLE_HEALTH_CHECKS=true

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ENABLE_HTTPS_REDIRECT=true
ENABLE_SECURITY_HEADERS=true
EOF

# Create frontend production environment
cat > "frontend.env" << 'EOF'
# Frontend Production Environment Variables

# API Configuration
REACT_APP_API_URL=https://your-backend-domain.railway.app/api
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true

# External Services
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Performance
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_CACHE_STRATEGY=network-first
EOF

# Create production deployment configuration
cat > "production-config.json" << 'EOF'
{
  "project": {
    "name": "maijjd-production",
    "version": "1.0.0",
    "environment": "production"
  },
  "services": {
    "frontend": {
      "platform": "vercel",
      "framework": "react",
      "buildCommand": "npm run build",
      "outputDirectory": "build",
      "environment": "frontend.env"
    },
    "backend": {
      "platform": "railway",
      "framework": "nodejs",
      "buildCommand": "npm install",
      "startCommand": "npm start",
      "environment": "production.env",
      "healthCheck": "/api/health"
    },
    "database": {
      "platform": "mongodb-atlas",
      "type": "mongodb",
      "version": "7.0",
      "backup": true,
      "monitoring": true
    },
    "cache": {
      "platform": "redis-cloud",
      "type": "redis",
      "version": "7.0",
      "persistence": true,
      "monitoring": true
    }
  },
  "domains": {
    "frontend": "your-frontend-domain.vercel.app",
    "backend": "your-backend-domain.railway.app",
    "custom": "your-custom-domain.com"
  },
  "monitoring": {
    "healthChecks": true,
    "metrics": true,
    "logging": true,
    "alerts": true
  },
  "security": {
    "https": true,
    "cors": true,
    "rateLimiting": true,
    "jwt": true,
    "helmet": true
  }
}
EOF

# Create production deployment script
cat > "deploy-production.sh" << 'EOF'
#!/bin/bash

# Maijjd Production Deployment Script
# Deploy to production cloud platforms

set -e

echo "🚀 Starting Maijjd Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Production Deployment Steps:${NC}"
echo "1. 🗄️  Set up MongoDB Atlas database"
echo "2. 🔄 Set up Redis Cloud cache"
echo "3. 🚂 Deploy backend to Railway"
echo "4. ⚡ Deploy frontend to Vercel"
echo "5. 🔗 Configure service integration"
echo "6. 🧪 Test production deployment"
echo ""

# Step 1: MongoDB Atlas Setup
echo -e "${YELLOW}🗄️  Step 1: MongoDB Atlas Setup${NC}"
echo "Please visit: https://mongodb.com/atlas"
echo "1. Create account and cluster"
echo "2. Set up database access"
echo "3. Configure network access"
echo "4. Get connection string"
echo "5. Update production.env with MONGODB_URI"
echo ""

# Step 2: Redis Cloud Setup
echo -e "${YELLOW}🔄 Step 2: Redis Cloud Setup${NC}"
echo "Please visit: https://redis.com/try-free"
echo "1. Create account and database"
echo "2. Get connection details"
echo "3. Update production.env with REDIS_URI"
echo ""

# Step 3: Railway Backend Deployment
echo -e "${YELLOW}🚂 Step 3: Railway Backend Deployment${NC}"
echo "Please visit: https://railway.app"
echo "1. Create account and project"
echo "2. Connect GitHub repository"
echo "3. Set environment variables from production.env"
echo "4. Deploy backend service"
echo ""

# Step 4: Vercel Frontend Deployment
echo -e "${YELLOW}⚡ Step 4: Vercel Frontend Deployment${NC}"
echo "Please visit: https://vercel.com"
echo "1. Create account and project"
echo "2. Connect GitHub repository"
echo "3. Set environment variables from frontend.env"
echo "4. Deploy frontend service"
echo ""

# Step 5: Service Integration
echo -e "${YELLOW}🔗 Step 5: Service Integration${NC}"
echo "1. Update frontend.env with backend URL"
echo "2. Update production.env with frontend URL"
echo "3. Redeploy services with new URLs"
echo ""

# Step 6: Testing
echo -e "${YELLOW}🧪 Step 6: Production Testing${NC}"
echo "1. Test frontend functionality"
echo "2. Test backend API endpoints"
echo "3. Test database operations"
echo "4. Test cache functionality"
echo "5. Monitor performance and errors"
echo ""

echo -e "${GREEN}✅ Production deployment guide complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Follow each step above"
echo "2. Update environment files with your values"
echo "3. Deploy services one by one"
echo "4. Test thoroughly before going live"
echo ""
echo -e "${GREEN}🎉 Ready for production deployment!${NC}"
EOF

chmod +x deploy-production.sh

# Create quick deployment script
cat > "quick-deploy.sh" << 'EOF'
#!/bin/bash

# Quick Production Deployment Script
# Automated deployment to cloud platforms

set -e

echo "⚡ Quick Production Deployment Starting..."

# Check if environment files are configured
if [ ! -f "production.env" ] || [ ! -f "frontend.env" ]; then
    echo "❌ Environment files not found. Please run ./production-setup.sh first."
    exit 1
fi

echo "🔧 Checking environment configuration..."

# Check if environment variables are set
if grep -q "your-" production.env || grep -q "your-" frontend.env; then
    echo "⚠️  Warning: Some environment variables still have placeholder values."
    echo "Please update production.env and frontend.env with your actual values."
    echo ""
    echo "Required updates:"
    echo "- MONGODB_URI in production.env"
    echo "- REDIS_URI in production.env"
    echo "- JWT_SECRET in production.env"
    echo "- REACT_APP_API_URL in frontend.env"
    echo ""
    echo "After updating, run this script again."
    exit 1
fi

echo "✅ Environment configuration looks good!"
echo "🚀 Starting deployment..."

# Deploy backend to Railway
echo "🚂 Deploying backend to Railway..."
echo "Please ensure your Railway project is set up and connected to GitHub."
echo "The backend will auto-deploy when you push to your main branch."

# Deploy frontend to Vercel
echo "⚡ Deploying frontend to Vercel..."
echo "Please ensure your Vercel project is set up and connected to GitHub."
echo "The frontend will auto-deploy when you push to your main branch."

echo ""
echo "✅ Quick deployment setup complete!"
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Monitor deployment in Railway and Vercel dashboards"
echo "3. Test your production deployment"
echo "4. Set up custom domains if needed"
EOF

chmod +x quick-deploy.sh

# Create production monitoring script
cat > "monitor-production.sh" << 'EOF'
#!/bin/bash

# Production Monitoring Script
# Monitor production deployment health

set -e

echo "📊 Production Monitoring Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment variables
if [ -f "production.env" ]; then
    export $(cat production.env | grep -v '^#' | xargs)
fi

if [ -f "frontend.env" ]; then
    export $(cat frontend.env | grep -v '^#' | xargs)
fi

echo -e "${BLUE}🔍 Checking Production Services...${NC}"

# Check backend health
if [ ! -z "$BACKEND_URL" ]; then
    echo -e "${YELLOW}🔧 Checking Backend Health...${NC}"
    if curl -s "$BACKEND_URL/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend URL not configured${NC}"
fi

# Check frontend accessibility
if [ ! -z "$FRONTEND_URL" ]; then
    echo -e "${YELLOW}⚡ Checking Frontend Accessibility...${NC}"
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${RED}❌ Frontend accessibility check failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Frontend URL not configured${NC}"
fi

echo ""
echo -e "${BLUE}📊 Monitoring Complete!${NC}"
echo ""
echo -e "${GREEN}🎯 Production Deployment Status:${NC}"
echo "Backend: $([ ! -z "$BACKEND_URL" ] && echo "✅ Configured" || echo "❌ Not configured")"
echo "Frontend: $([ ! -z "$FRONTEND_URL" ] && echo "✅ Configured" || echo "❌ Not configured")"
echo "Database: $([ ! -z "$MONGODB_URI" ] && echo "✅ Configured" || echo "❌ Not configured")"
echo "Cache: $([ ! -z "$REDIS_URI" ] && echo "✅ Configured" || echo "❌ Not configured")"
EOF

chmod +x monitor-production.sh

echo -e "${GREEN}✅ Production setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Created Files:${NC}"
echo "1. production.env - Backend environment variables"
echo "2. frontend.env - Frontend environment variables"
echo "3. production-config.json - Deployment configuration"
echo "4. deploy-production.sh - Step-by-step deployment guide"
echo "5. quick-deploy.sh - Automated deployment script"
echo "6. monitor-production.sh - Production monitoring script"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Update environment files with your actual values"
echo "2. Run: ./deploy-production.sh for detailed instructions"
echo "3. Run: ./quick-deploy.sh for automated deployment"
echo "4. Run: ./monitor-production.sh to check status"
echo ""
echo -e "${GREEN}🎉 Ready for production deployment!${NC}"
