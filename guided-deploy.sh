#!/bin/bash

echo "🚀 Maijjd Guided Deployment Script"
echo "=================================="
echo "This script will guide you through deploying to Railway and Vercel"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if user is logged in
check_railway_login() {
    if railway whoami &> /dev/null; then
        return 0
    else
        return 1
    fi
}

check_vercel_login() {
    if vercel whoami &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to deploy backend
deploy_backend() {
    print_status "🚂 Starting Backend Deployment to Railway..."
    
    cd backend_maijjd
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in backend_maijjd directory"
        return 1
    fi
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        return 1
    fi
    
    # Run tests
    print_status "Running backend tests..."
    npm test
    if [ $? -ne 0 ]; then
        print_warning "Backend tests failed, but continuing with deployment..."
    fi
    
    # Build project
    print_status "Building backend project..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Backend build failed"
        return 1
    fi
    
    # Deploy to Railway
    print_status "Deploying to Railway..."
    railway up
    if [ $? -ne 0 ]; then
        print_error "Railway deployment failed"
        return 1
    fi
    
    # Get deployment URL
    print_status "Getting Railway deployment URL..."
    DEPLOY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$DEPLOY_URL" ]; then
        print_success "Backend deployed successfully to Railway!"
        print_success "Backend URL: $DEPLOY_URL"
        echo "$DEPLOY_URL" > ../RAILWAY_BACKEND_URL.txt
    else
        print_warning "Could not retrieve Railway URL. Check Railway dashboard."
    fi
    
    cd ..
    return 0
}

# Function to deploy frontend
deploy_frontend() {
    print_status "🎯 Starting Frontend Deployment to Vercel..."
    
    cd frontend_maijjd
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend_maijjd directory"
        return 1
    fi
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        return 1
    fi
    
    # Run tests
    print_status "Running frontend tests..."
    npm test -- --watchAll=false
    if [ $? -ne 0 ]; then
        print_warning "Frontend tests failed, but continuing with deployment..."
    fi
    
    # Build project
    print_status "Building frontend project..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Frontend build failed"
        return 1
    fi
    
    # Update vercel.json with backend URL if available
    if [ -f "../RAILWAY_BACKEND_URL.txt" ]; then
        BACKEND_URL=$(cat ../RAILWAY_BACKEND_URL.txt)
        print_status "Updating vercel.json with backend URL: $BACKEND_URL"
        
        # Update vercel.json
        sed -i.bak "s|your-railway-backend-url.railway.app|${BACKEND_URL#https://}|g" vercel.json
        sed -i.bak "s|https://your-railway-backend-url.railway.app|$BACKEND_URL|g" vercel.json
        
        print_success "Updated vercel.json with backend URL"
    else
        print_warning "Backend URL not found. Please update vercel.json manually."
    fi
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod
    if [ $? -ne 0 ]; then
        print_error "Vercel deployment failed"
        return 1
    fi
    
    # Get deployment URL
    print_status "Getting Vercel deployment URL..."
    DEPLOY_URL=$(vercel ls --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$DEPLOY_URL" ]; then
        print_success "Frontend deployed successfully to Vercel!"
        print_success "Frontend URL: $DEPLOY_URL"
        echo "$DEPLOY_URL" > ../VERCEL_FRONTEND_URL.txt
    else
        print_warning "Could not retrieve Vercel URL. Check Vercel dashboard."
    fi
    
    cd ..
    return 0
}

# Main deployment process
main() {
    print_status "Starting guided deployment process..."
    echo ""
    
    # Check Railway login
    print_status "Checking Railway login status..."
    if ! check_railway_login; then
        print_warning "You need to log in to Railway first."
        echo "Please run: railway login"
        echo "Then run this script again."
        exit 1
    else
        print_success "✅ Logged in to Railway"
    fi
    
    # Check Vercel login
    print_status "Checking Vercel login status..."
    if ! check_vercel_login; then
        print_warning "You need to log in to Vercel first."
        echo "Please run: vercel login"
        echo "Then run this script again."
        exit 1
    else
        print_success "✅ Logged in to Vercel"
    fi
    
    echo ""
    print_status "Both accounts are logged in. Starting deployment..."
    echo ""
    
    # Deploy backend first
    if deploy_backend; then
        print_success "✅ Backend deployment completed successfully!"
    else
        print_error "❌ Backend deployment failed!"
        print_warning "Please fix backend issues before continuing with frontend deployment."
        exit 1
    fi
    
    echo ""
    print_status "Waiting 30 seconds for backend to stabilize..."
    sleep 30
    
    # Deploy frontend
    if deploy_frontend; then
        print_success "✅ Frontend deployment completed successfully!"
    else
        print_error "❌ Frontend deployment failed!"
        exit 1
    fi
    
    echo ""
    print_success "🎉 Complete deployment successful!"
    echo ""
    
    # Display final URLs
    if [ -f "RAILWAY_BACKEND_URL.txt" ]; then
        BACKEND_URL=$(cat RAILWAY_BACKEND_URL.txt)
        print_success "Backend API: $BACKEND_URL"
        print_success "Health Check: $BACKEND_URL/api/health"
        print_success "API Docs: $BACKEND_URL/api-docs"
    fi
    
    if [ -f "VERCEL_FRONTEND_URL.txt" ]; then
        FRONTEND_URL=$(cat VERCEL_FRONTEND_URL.txt)
        print_success "Frontend App: $FRONTEND_URL"
    fi
    
    echo ""
    print_status "Next steps:"
    echo "1. Test your backend API endpoints"
    echo "2. Test your frontend application"
    echo "3. Verify API integration is working"
    echo "4. Set up custom domains if needed"
    echo ""
    print_warning "IMPORTANT: Set environment variables in Railway dashboard:"
    echo "  - MONGODB_URI, JWT_SECRET, SMTP_USER, SMTP_PASS, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN"
    echo ""
    print_success "Deployment completed! 🚀"
}

# Run main function
main "$@"
