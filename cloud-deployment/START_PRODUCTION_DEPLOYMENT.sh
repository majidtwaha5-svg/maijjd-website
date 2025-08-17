#!/bin/bash

# Maijjd Production Deployment Quick Start
# This script will guide you through the production deployment process

set -e

echo "🚀 Welcome to Maijjd Production Deployment!"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}=============================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}=============================================${NC}"
    echo ""
}

# Function to print step
print_step() {
    echo -e "${YELLOW}📋 Step $1: $2${NC}"
    echo ""
}

# Function to wait for user input
wait_for_user() {
    echo -e "${CYAN}Press Enter when you're ready to continue...${NC}"
    read -r
}

# Function to check if environment files exist
check_environment_files() {
    if [ ! -f "production.env" ] || [ ! -f "frontend.env" ]; then
        echo -e "${RED}❌ Environment files not found!${NC}"
        echo "Please run ./production-setup.sh first to create the necessary files."
        exit 1
    fi
}

# Function to check if environment is configured
check_environment_configuration() {
    echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
    
    # Check for placeholder values
    if grep -q "your-" production.env || grep -q "your-" frontend.env; then
        echo -e "${YELLOW}⚠️  Warning: Some environment variables still have placeholder values.${NC}"
        echo ""
        echo "Required updates:"
        echo "- MONGODB_URI in production.env"
        echo "- REDIS_URI in production.env"
        echo "- JWT_SECRET in production.env"
        echo "- REACT_APP_API_URL in frontend.env"
        echo ""
        echo -e "${RED}Please update these values before proceeding with deployment.${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Environment configuration looks good!${NC}"
        return 0
    fi
}

# Main deployment flow
main() {
    print_section "Production Deployment Quick Start"
    
    echo -e "${GREEN}This script will guide you through deploying your Maijjd application to production.${NC}"
    echo ""
    echo "What we'll accomplish:"
    echo "1. 🗄️  Set up MongoDB Atlas database"
    echo "2. 🔄 Set up Redis Cloud cache"
    echo "3. 🚂 Deploy backend to Railway"
    echo "4. ⚡ Deploy frontend to Vercel"
    echo "5. 🔗 Integrate all services"
    echo "6. 🧪 Test production deployment"
    echo ""
    
    wait_for_user
    
    # Check environment files
    check_environment_files
    
    # Check environment configuration
    if ! check_environment_configuration; then
        print_section "Environment Configuration Required"
        echo -e "${YELLOW}Before we can proceed with deployment, you need to configure your environment variables.${NC}"
        echo ""
        echo "Please:"
        echo "1. Edit production.env with your MongoDB and Redis connection details"
        echo "2. Edit frontend.env with your backend API URL"
        echo "3. Generate a strong JWT secret"
        echo ""
        echo "After updating the files, run this script again."
        echo ""
        echo -e "${BLUE}Need help? See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions.${NC}"
        exit 1
    fi
    
    print_section "Phase 1: Database Setup"
    
    print_step "1" "MongoDB Atlas Setup"
    echo -e "${CYAN}Let's start by setting up your MongoDB Atlas database:${NC}"
    echo ""
    echo "1. Visit: https://mongodb.com/atlas"
    echo "2. Create a free account"
    echo "3. Create a new cluster (FREE tier)"
    echo "4. Set up database access (username: maijjd_admin)"
    echo "5. Configure network access (0.0.0.0/0)"
    echo "6. Get your connection string"
    echo ""
    echo -e "${YELLOW}Important: Update production.env with your MONGODB_URI${NC}"
    echo ""
    
    wait_for_user
    
    print_step "2" "Redis Cloud Setup"
    echo -e "${CYAN}Now let's set up your Redis Cloud cache:${NC}"
    echo ""
    echo "1. Visit: https://redis.com/try-free"
    echo "2. Create a free account"
    echo "3. Create a new database (FREE plan)"
    echo "4. Get your connection details"
    echo "5. Note the endpoint, port, and password"
    echo ""
    echo -e "${YELLOW}Important: Update production.env with your REDIS_URI${NC}"
    echo ""
    
    wait_for_user
    
    print_section "Phase 2: Backend Deployment"
    
    print_step "3" "Railway Backend Setup"
    echo -e "${CYAN}Let's deploy your backend to Railway:${NC}"
    echo ""
    echo "1. Visit: https://railway.app"
    echo "2. Sign up with GitHub"
    echo "3. Create new project"
    echo "4. Connect your GitHub repository"
    echo "5. Set root directory to 'backend_maijjd'"
    echo "6. Add all environment variables from production.env"
    echo ""
    echo -e "${YELLOW}Important: Note your Railway backend URL${NC}"
    echo ""
    
    wait_for_user
    
    print_step "4" "Update Frontend Configuration"
    echo -e "${CYAN}Now update your frontend environment with the backend URL:${NC}"
    echo ""
    echo "1. Edit frontend.env"
    echo "2. Update REACT_APP_API_URL with your Railway backend URL"
    echo "3. Example: REACT_APP_API_URL=https://your-backend.railway.app/api"
    echo ""
    
    wait_for_user
    
    print_section "Phase 3: Frontend Deployment"
    
    print_step "5" "Vercel Frontend Setup"
    echo -e "${CYAN}Let's deploy your frontend to Vercel:${NC}"
    echo ""
    echo "1. Visit: https://vercel.com"
    echo "2. Sign up with GitHub"
    echo "3. Create new project"
    echo "4. Import your GitHub repository"
    echo "5. Set root directory to 'frontend_maijjd'"
    echo "6. Framework preset: Create React App"
    echo "7. Add all environment variables from frontend.env"
    echo "8. Deploy"
    echo ""
    echo -e "${YELLOW}Important: Note your Vercel frontend URL${NC}"
    echo ""
    
    wait_for_user
    
    print_section "Phase 4: Service Integration"
    
    print_step "6" "Update Backend Configuration"
    echo -e "${CYAN}Now update your backend environment with the frontend URL:${NC}"
    echo ""
    echo "1. Edit production.env"
    echo "2. Update FRONTEND_URL with your Vercel frontend URL"
    echo "3. Example: FRONTEND_URL=https://your-project.vercel.app"
    echo ""
    
    wait_for_user
    
    print_step "7" "Redeploy Services"
    echo -e "${CYAN}Now let's redeploy with the updated configuration:${NC}"
    echo ""
    echo "1. Push your changes to GitHub"
    echo "2. Railway will auto-deploy your backend"
    echo "3. Vercel will auto-deploy your frontend"
    echo "4. Wait for deployment to complete"
    echo ""
    
    wait_for_user
    
    print_section "Phase 5: Testing & Verification"
    
    print_step "8" "Test Production Deployment"
    echo -e "${CYAN}Let's verify everything is working:${NC}"
    echo ""
    echo "1. Test backend health: curl your-backend-url/api/health"
    echo "2. Test frontend: Visit your Vercel URL"
    echo "3. Test user registration/login"
    echo "4. Test API endpoints"
    echo "5. Test database operations"
    echo "6. Test cache functionality"
    echo ""
    
    wait_for_user
    
    print_section "Deployment Complete!"
    
    echo -e "${GREEN}🎉 Congratulations! Your Maijjd application is now deployed to production!${NC}"
    echo ""
    echo "What you've accomplished:"
    echo "✅ Set up MongoDB Atlas database"
    echo "✅ Set up Redis Cloud cache"
    echo "✅ Deployed backend to Railway"
    echo "✅ Deployed frontend to Vercel"
    echo "✅ Integrated all services"
    echo "✅ Tested production deployment"
    echo ""
    
    echo -e "${BLUE}📊 Monitor your production deployment:${NC}"
    echo "./monitor-production.sh"
    echo ""
    
    echo -e "${BLUE}🔧 Useful commands:${NC}"
    echo "./deploy-production.sh - Detailed deployment guide"
    echo "./quick-deploy.sh - Quick deployment after configuration"
    echo "./monitor-production.sh - Check production status"
    echo ""
    
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "PRODUCTION_DEPLOYMENT_GUIDE.md - Complete guide"
    echo "DEPLOYMENT_INSTRUCTIONS.md - Platform-specific instructions"
    echo ""
    
    echo -e "${GREEN}🚀 Your Maijjd application is now accessible worldwide!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set up custom domains (optional)"
    echo "2. Configure monitoring and alerts"
    echo "3. Set up backup procedures"
    echo "4. Plan for scaling"
    echo ""
    
    echo -e "${PURPLE}Need help? Check the documentation or run the monitoring script!${NC}"
}

# Run main function
main
