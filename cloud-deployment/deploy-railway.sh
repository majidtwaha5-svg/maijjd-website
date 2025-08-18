#!/bin/bash

echo "🚂 Starting Railway Deployment for Maijjd Backend..."

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
    print_error "Please run this script from the backend_maijjd directory"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Installing..."
    npm install -g @railway/cli
    if [ $? -ne 0 ]; then
        print_error "Failed to install Railway CLI. Please install manually:"
        echo "   npm install -g @railway/cli"
        exit 1
    fi
fi

print_status "Checking Railway login status..."
if ! railway whoami &> /dev/null; then
    print_warning "Not logged in to Railway. Please login:"
    railway login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Railway"
        exit 1
    fi
fi

print_status "Checking if project exists..."
if ! railway status &> /dev/null; then
    print_warning "No Railway project found. Creating new project..."
    railway init
    if [ $? -ne 0 ]; then
        print_error "Failed to create Railway project"
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
npm test
if [ $? -ne 0 ]; then
    print_warning "Tests failed, but continuing with deployment..."
fi

print_status "Building project..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_status "Deploying to Railway..."
railway up
if [ $? -ne 0 ]; then
    print_error "Deployment failed"
    exit 1
fi

print_status "Getting deployment URL..."
DEPLOY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
if [ -n "$DEPLOY_URL" ]; then
    print_success "Deployment successful!"
    print_success "Your API is available at: $DEPLOY_URL"
    print_success "Health check: $DEPLOY_URL/api/health"
    print_success "API docs: $DEPLOY_URL/api-docs"
else
    print_warning "Could not retrieve deployment URL. Check Railway dashboard."
fi

print_status "Setting environment variables..."
print_warning "Please set the following environment variables in your Railway dashboard:"
echo ""
echo "Required variables:"
echo "  - MONGODB_URI (your MongoDB connection string)"
echo "  - JWT_SECRET (your JWT secret key)"
echo "  - SMTP_USER (your email for notifications)"
echo "  - SMTP_PASS (your email password/app password)"
echo "  - TWILIO_ACCOUNT_SID (your Twilio account SID)"
echo "  - TWILIO_AUTH_TOKEN (your Twilio auth token)"
echo ""
echo "Optional variables:"
echo "  - NODE_ENV=production"
echo "  - PORT=5001"
echo "  - LOG_LEVEL=info"
echo ""

print_success "Railway deployment completed! 🎉"
print_status "Next steps:"
echo "1. Set environment variables in Railway dashboard"
echo "2. Test your API endpoints"
echo "3. Update your frontend configuration with the new API URL"
