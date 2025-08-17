#!/bin/bash

# Maijjd Cloud Deployment Script
# Deploy to various cloud platforms (Heroku, Railway, Render, etc.)

set -e

echo "☁️  Starting Maijjd Cloud Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend_maijjd"
BACKEND_DIR="backend_maijjd"
CLOUD_DIR="cloud-deployment"

# Check if we're in the right directory
if [ ! -d "$FRONTEND_DIR" ] || [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Create cloud deployment directory
mkdir -p "$CLOUD_DIR"
cd "$CLOUD_DIR"

echo -e "${BLUE}📁 Preparing Cloud Deployment...${NC}"

# Create Heroku deployment files
echo -e "${YELLOW}🚀 Creating Heroku deployment files...${NC}"

# Frontend Heroku files
mkdir -p "heroku-frontend"
cat > "heroku-frontend/package.json" << 'EOF'
{
  "name": "maijjd-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "axios": "^1.4.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "engines": {
    "node": "18.x"
  },
  "buildpacks": [
    {
      "url": "https://github.com/heroku/heroku-buildpack-static"
    }
  ]
}
EOF

cat > "heroku-frontend/static.json" << 'EOF'
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  },
  "https_only": true,
  "headers": {
    "/**": {
      "Strict-Transport-Security": "max-age=31557600"
    }
  }
}
EOF

# Backend Heroku files
mkdir -p "heroku-backend"
cat > "heroku-backend/package.json" << 'EOF'
{
  "name": "maijjd-backend",
  "version": "1.0.0",
  "description": "Backend API for Maijjd software solutions",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.4",
    "compression": "^1.7.4",
    "rate-limiter-flexible": "^2.4.2"
  },
  "engines": {
    "node": "18.x"
  }
}
EOF

cat > "heroku-backend/Procfile" << 'EOF'
web: node server.js
EOF

# Railway deployment files
echo -e "${YELLOW}🚂 Creating Railway deployment files...${NC}"

mkdir -p "railway"
cat > "railway/railway.json" << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Render deployment files
echo -e "${YELLOW}🎨 Creating Render deployment files...${NC}"

mkdir -p "render"
cat > "render/render.yaml" << 'EOF'
services:
  - type: web
    name: maijjd-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

  - type: web
    name: maijjd-frontend
    env: static
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: ./build
    envVars:
      - key: REACT_APP_API_URL
        value: https://maijjd-backend.onrender.com/api
EOF

# Vercel deployment files
echo -e "${YELLOW}⚡ Creating Vercel deployment files...${NC}"

mkdir -p "vercel"
cat > "vercel/vercel.json" << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.vercel.app/api"
  }
}
EOF

# Create deployment instructions
echo -e "${BLUE}📋 Creating deployment instructions...${NC}"

cat > "DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# Maijjd Cloud Deployment Instructions

This guide will help you deploy your Maijjd application to various cloud platforms.

## 🚀 Quick Deploy Options

### 1. Heroku (Recommended for beginners)
- Free tier available
- Easy deployment
- Good for small to medium applications

**Steps:**
1. Install Heroku CLI: `brew install heroku/brew/heroku`
2. Login: `heroku login`
3. Create app: `heroku create maijjd-app`
4. Deploy backend: `cd heroku-backend && git push heroku main`
5. Deploy frontend: `cd heroku-frontend && git push heroku main`

### 2. Railway
- Modern platform
- Good free tier
- Automatic deployments

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy using the railway.json configuration

### 3. Render
- Free tier available
- Good performance
- Easy setup

**Steps:**
1. Go to [render.com](https://render.com)
2. Create new service
3. Use the render.yaml configuration

### 4. Vercel
- Excellent for frontend
- Free tier available
- Fast deployments

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in your project directory
3. Follow the prompts

## 🔧 Environment Variables

Make sure to set these environment variables in your cloud platform:

**Backend:**
- `NODE_ENV=production`
- `PORT=10000` (or your platform's port)
- `MONGODB_URI=your-mongodb-connection-string`
- `JWT_SECRET=your-secret-key`

**Frontend:**
- `REACT_APP_API_URL=https://your-backend-url.com/api`

## 📊 Monitoring

After deployment, monitor your application:
- Check health endpoint: `/api/health`
- Monitor logs in your cloud platform
- Set up alerts for downtime

## 🆘 Troubleshooting

**Common Issues:**
1. **Build fails**: Check Node.js version compatibility
2. **Environment variables**: Ensure all required vars are set
3. **Database connection**: Verify MongoDB connection string
4. **CORS errors**: Check backend CORS configuration

**Support:**
- Check platform documentation
- Review application logs
- Contact platform support if needed

## 🔄 Continuous Deployment

Set up automatic deployments:
1. Connect your GitHub repository
2. Configure build triggers
3. Set up environment variables
4. Enable automatic deployments on push

## 💰 Cost Optimization

- Use free tiers when possible
- Monitor resource usage
- Scale down during low traffic
- Use platform-specific optimizations
EOF

# Create deployment scripts
echo -e "${BLUE}📜 Creating deployment scripts...${NC}"

cat > "deploy-heroku.sh" << 'EOF'
#!/bin/bash

echo "🚀 Deploying to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   brew install heroku/brew/heroku"
    exit 1
fi

# Check if logged in
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    echo "   heroku login"
    exit 1
fi

# Create apps if they don't exist
echo "📱 Creating Heroku apps..."
heroku create maijjd-backend-$(date +%s) || echo "Backend app already exists"
heroku create maijjd-frontend-$(date +%s) || echo "Frontend app already exists"

echo "✅ Heroku deployment setup complete!"
echo "📋 Next steps:"
echo "1. Set environment variables in Heroku dashboard"
echo "2. Deploy backend: cd heroku-backend && git push heroku main"
echo "3. Deploy frontend: cd heroku-frontend && git push heroku main"
EOF

cat > "deploy-railway.sh" << 'EOF'
#!/bin/bash

echo "🚂 Deploying to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

echo "📋 Railway deployment steps:"
echo "1. Go to railway.app and create account"
echo "2. Create new project"
echo "3. Connect your GitHub repository"
echo "4. Deploy using the railway.json configuration"
echo "5. Set environment variables in Railway dashboard"
EOF

chmod +x deploy-heroku.sh
chmod +x deploy-railway.sh

# Go back to root
cd ..

echo -e "${GREEN}✅ Cloud deployment files created in $CLOUD_DIR${NC}"
echo ""
echo -e "${BLUE}📋 Available deployment options:${NC}"
echo "1. Heroku: cd $CLOUD_DIR && ./deploy-heroku.sh"
echo "2. Railway: cd $CLOUD_DIR && ./deploy-railway.sh"
echo "3. Render: Use render.yaml in $CLOUD_DIR/render"
echo "4. Vercel: Use vercel.json in $CLOUD_DIR/vercel"
echo ""
echo -e "${GREEN}🎉 Cloud deployment ready!${NC}"
