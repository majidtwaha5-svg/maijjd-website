#!/bin/bash

echo "🚀 Starting Vercel Deployment for Maijjd Frontend..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the frontend_maijjd directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        print_error "Failed to install Vercel CLI. Please install manually:"
        echo "   npm install -g vercel"
        exit 1
    fi
fi

print_status "Checking Vercel login status..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please login:"
    vercel login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Vercel"
        exit 1
    fi
fi

print_status "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Running tests..."
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
    print_warning "Tests failed, but continuing with deployment..."
fi

print_status "Building project..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_status "Checking build output..."
if [ ! -d "build" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

print_status "Deploying to Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    print_error "Deployment failed"
    exit 1
fi

print_status "Getting deployment URL..."
DEPLOY_URL=$(vercel ls --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$DEPLOY_URL" ]; then
    print_success "Deployment successful!"
    print_success "Your frontend is available at: $DEPLOY_URL"
else
    print_warning "Could not retrieve deployment URL. Check Vercel dashboard."
fi

print_status "Updating vercel.json with backend URL..."
print_warning "IMPORTANT: Update your vercel.json with the actual Railway backend URL:"
echo ""
echo "1. Replace 'your-railway-backend-url.railway.app' in vercel.json"
echo "2. Update the REACT_APP_API_URL environment variable"
echo "3. Redeploy if needed: vercel --prod"
echo ""

print_success "Vercel deployment completed! 🎉"
print_status "Next steps:"
echo "1. Update vercel.json with your Railway backend URL"
echo "2. Test your frontend application"
echo "3. Verify API integration is working"
echo "4. Set up custom domain if needed"
