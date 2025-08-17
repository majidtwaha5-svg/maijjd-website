#!/bin/bash

# 🚄 MAIJD RAILWAY OPTIMAL DEPLOYMENT SCRIPT
# This script deploys your Maijjd Software Suite to Railway with optimal configuration

set -e

echo "🚄 Starting Maijjd Railway Optimal Deployment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️  Railway CLI not found. Installing...${NC}"
        npm install -g @railway/cli
    else
        echo -e "${GREEN}✅ Railway CLI found${NC}"
    fi
    
    # Check if logged in to Railway
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Not logged in to Railway. Please login...${NC}"
        railway login
    else
        echo -e "${GREEN}✅ Logged in to Railway${NC}"
    fi
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version too old. Please install Node.js 18+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
}

# Deploy backend
deploy_backend() {
    echo ""
    echo "🔧 Deploying Backend to Railway..."
    echo "=================================="
    
    cd backend_maijjd
    
    # Check if railway.json exists, if not create it
    if [ ! -f "railway.json" ]; then
        echo "📝 Creating railway.json for backend..."
        cat > railway.json << EOF
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
    fi
    
    # Initialize Railway project if not already done
    if [ ! -f ".railway" ]; then
        echo "🚀 Initializing Railway project..."
        railway init --name "maijjd-backend"
    fi
    
               # Set environment variables
           echo "🔐 Setting environment variables..."
           railway variables --set "NODE_ENV=production" --set "PORT=5001"
    
    # Deploy
    echo "🚀 Deploying to Railway..."
    railway up
    
    # Get the deployment URL
    BACKEND_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4 | head -1)
    echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"
    
    cd ..
}

# Deploy frontend
deploy_frontend() {
    echo ""
    echo "🎨 Deploying Frontend to Railway..."
    echo "==================================="
    
    cd frontend_maijjd
    
    # Check if railway.json exists, if not create it
    if [ ! -f "railway.json" ]; then
        echo "📝 Creating railway.json for frontend..."
        cat > railway.json << EOF
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
    fi
    
    # Build the frontend
    echo "🔨 Building frontend..."
    npm run build
    
    # Initialize Railway project if not already done
    if [ ! -f ".railway" ]; then
        echo "🚀 Initializing Railway project..."
        railway init --name "maijjd-frontend"
    fi
    
               # Set environment variables
           echo "🔐 Setting environment variables..."
           railway variables --set "NODE_ENV=production" --set "REACT_APP_API_URL=$BACKEND_URL"
    
    # Deploy
    echo "🚀 Deploying to Railway..."
    railway up
    
    # Get the deployment URL
    FRONTEND_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4 | head -1)
    echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"
    
    cd ..
}

# Setup custom domain (optional)
setup_custom_domain() {
    echo ""
    echo "🌐 Custom Domain Setup (Optional)"
    echo "================================="
    
    read -p "Do you want to set up a custom domain? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your domain (e.g., maijjd.com): " DOMAIN
        
        if [ ! -z "$DOMAIN" ]; then
            echo "🔧 Setting up custom domain: $DOMAIN"
            
            # Backend domain
            cd backend_maijjd
            railway domain $DOMAIN
            cd ..
            
            # Frontend domain
            cd frontend_maijjd
            railway domain www.$DOMAIN
            cd ..
            
            echo -e "${GREEN}✅ Custom domains configured:${NC}"
            echo "   Backend: $DOMAIN"
            echo "   Frontend: www.$DOMAIN"
        fi
    fi
}

# Health check
health_check() {
    echo ""
    echo "🏥 Running Health Checks..."
    echo "============================"
    
    # Wait a bit for deployment to stabilize
    echo "⏳ Waiting for deployment to stabilize..."
    sleep 30
    
    # Check backend health
    if [ ! -z "$BACKEND_URL" ]; then
        echo "🔍 Checking backend health..."
        if curl -f "$BACKEND_URL/api/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend is healthy${NC}"
        else
            echo -e "${RED}❌ Backend health check failed${NC}"
        fi
    fi
    
    # Check frontend health
    if [ ! -z "$FRONTEND_URL" ]; then
        echo "🔍 Checking frontend health..."
        if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is healthy${NC}"
        else
            echo -e "${RED}❌ Frontend health check failed${NC}"
        fi
    fi
}

# Final summary
final_summary() {
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "========================"
    echo ""
    echo -e "${GREEN}✅ Your Maijjd Software Suite is now live!${NC}"
    echo ""
    echo "🌐 URLs:"
    echo "   Backend: $BACKEND_URL"
    echo "   Frontend: $FRONTEND_URL"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Test your application at the frontend URL"
    echo "   2. Configure MongoDB Atlas connection"
    echo "   3. Set up monitoring and alerts"
    echo "   4. Configure custom domain (if desired)"
    echo ""
    echo "📊 Monitor your deployment:"
    echo "   railway status"
    echo "   railway logs"
    echo ""
    echo -e "${BLUE}🚀 Welcome to production!${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚄 Maijjd Railway Optimal Deployment${NC}"
    echo "================================================"
    
    check_prerequisites
    deploy_backend
    deploy_frontend
    setup_custom_domain
    health_check
    final_summary
}

# Run main function
main "$@"
