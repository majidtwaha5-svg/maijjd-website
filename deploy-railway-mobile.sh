#!/bin/bash

# Maijd Software Suite - Railway Mobile Deployment Script
# Version: 2.0.0
# This script deploys the enhanced mobile version with PWA features to Railway

set -e

echo "🚀 Maijd Software Suite - Railway Mobile Deployment"
echo "=================================================="
echo "Version: 2.0.0"
echo "Features: PWA, Offline Support, Real-time Updates, Background Sync"
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

# Check if we're in the right directory
if [ ! -f "maijd_software/mobile_api.py" ]; then
    print_error "Please run this script from the Maijd_Full_Project root directory"
    exit 1
fi

print_status "Starting Railway deployment for enhanced mobile version..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Installing..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install railway
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://railway.app/install.sh | sh
    else
        print_error "Unsupported OS. Please install Railway CLI manually: https://railway.app/docs/develop/cli"
        exit 1
    fi
fi

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    print_status "Please log in to Railway..."
    railway login
fi

# Create Railway project if it doesn't exist
print_status "Setting up Railway project..."
if ! railway project &> /dev/null; then
    print_status "Creating new Railway project..."
    railway init
fi

# Create production environment configuration
print_status "Creating production environment configuration..."

cat > railway.toml << EOF
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd maijd_software && python mobile_api.py"
healthcheckPath = "/api/v1/health"
healthcheckTimeout = 300

[[services]]
name = "maijd-mobile-api"
EOF

# Create production requirements file
print_status "Creating production requirements file..."

cat > maijd_software/requirements.txt << EOF
Flask==2.3.3
Flask-CORS==4.0.0
gunicorn==21.2.0
python-dotenv==1.0.0
requests==2.31.0
twilio==8.10.0
Werkzeug==2.3.7
EOF

# Create production environment file
print_status "Creating production environment file..."

cat > maijd_software/.env << EOF
# Railway Production Environment
FLASK_ENV=production
FLASK_DEBUG=false
HOST=0.0.0.0
PORT=\$PORT
DATABASE_URL=\$DATABASE_URL

# Mobile API Configuration
MOBILE_API_VERSION=2.0.0
REAL_TIME_UPDATES=true
OFFLINE_SUPPORT=true
SYNC_INTERVAL=300
MAX_RETRY_ATTEMPTS=3

# Security
SECRET_KEY=\$SECRET_KEY
JWT_SECRET_KEY=\$JWT_SECRET_KEY

# External Services
TWILIO_ACCOUNT_SID=\$TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=\$TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=\$TWILIO_PHONE_NUMBER
EOF

# Create production startup script
print_status "Creating production startup script..."

cat > maijd_software/start_production.py << EOF
#!/usr/bin/env python3
"""
Production startup script for Maijd Software Suite Mobile API
Optimized for Railway deployment
"""

import os
import sys
from mobile_api import app

if __name__ == '__main__':
    # Get port from Railway environment
    port = int(os.environ.get('PORT', 5000))
    
    # Get host from environment or default to 0.0.0.0 for Railway
    host = os.environ.get('HOST', '0.0.0.0')
    
    # Get debug mode from environment
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    
    print(f"🚀 Starting Maijd Mobile API in production mode...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🐛 Debug: {debug}")
    print(f"📱 API Version: 2.0.0")
    print(f"⚡ Real-time Updates: Enabled")
    print(f"📴 Offline Support: Enabled")
    print(f"🔄 Background Sync: Enabled")
    print(f"🔔 Push Notifications: Enabled")
    print(f"📱 PWA Features: Enabled")
    
    try:
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
EOF

# Create Railway-specific Dockerfile
print_status "Creating Railway-optimized Dockerfile..."

cat > Dockerfile.railway << EOF
# Railway-optimized Dockerfile for Maijd Software Suite Mobile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY maijd_software/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY maijd_software/ .

# Create necessary directories
RUN mkdir -p uploads data

# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_APP=mobile_api.py
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:5000/api/v1/health || exit 1

# Start the application
CMD ["python", "start_production.py"]
EOF

# Create deployment checklist
print_status "Creating deployment checklist..."

cat > RAILWAY_DEPLOYMENT_CHECKLIST.md << EOF
# Railway Deployment Checklist - Maijd Mobile Suite v2.0.0

## Pre-Deployment Checklist
- [ ] Railway CLI installed and authenticated
- [ ] All mobile features implemented and tested
- [ ] PWA manifest and service worker created
- [ ] Enhanced mobile JavaScript module ready
- [ ] Mobile API endpoints tested locally
- [ ] Database schema updated for mobile features

## Deployment Steps
1. **Environment Setup**
   - [ ] Create Railway project
   - [ ] Set environment variables
   - [ ] Configure database connection

2. **Code Deployment**
   - [ ] Deploy to Railway
   - [ ] Verify health check endpoint
   - [ ] Test mobile API endpoints

3. **PWA Features Verification**
   - [ ] Service worker registration
   - [ ] Offline functionality
   - [ ] Real-time updates
   - [ ] Background sync
   - [ ] Push notifications

4. **Mobile Testing**
   - [ ] Test on mobile devices
   - [ ] Verify PWA installation
   - [ ] Test offline capabilities
   - [ ] Verify real-time features

## Environment Variables Required
\`\`\`
FLASK_ENV=production
FLASK_DEBUG=false
HOST=0.0.0.0
PORT=\$PORT
DATABASE_URL=\$DATABASE_URL
SECRET_KEY=<your-secret-key>
JWT_SECRET_KEY=<your-jwt-secret>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=<your-twilio-phone>
\`\`\`

## Post-Deployment Verification
- [ ] Mobile dashboard loads correctly
- [ ] PWA can be installed
- [ ] Offline mode works
- [ ] Real-time updates function
- [ ] Background sync operational
- [ ] Push notifications working
- [ ] All mobile API endpoints responding

## Troubleshooting
- Check Railway logs: \`railway logs\`
- Verify environment variables: \`railway variables\`
- Test health endpoint: \`curl https://your-app.railway.app/api/v1/health\`
- Check service worker: Browser DevTools > Application > Service Workers

## Support
For issues, check:
1. Railway deployment logs
2. Browser console for PWA errors
3. Mobile API endpoint responses
4. Service worker registration status
EOF

# Deploy to Railway
print_status "Deploying to Railway..."
print_status "This may take a few minutes..."

if railway up; then
    print_success "Deployment completed successfully!"
    
    # Get the deployed URL
    DEPLOY_URL=$(railway status | grep "URL:" | awk '{print $2}')
    
    if [ ! -z "$DEPLOY_URL" ]; then
        print_success "Your app is deployed at: $DEPLOY_URL"
        print_status "Mobile Dashboard: $DEPLOY_URL/mobile-dashboard.html"
        print_status "Mobile API Status: $DEPLOY_URL/api/v1/mobile/status"
        print_status "Health Check: $DEPLOY_URL/api/v1/health"
        
        # Test the deployment
        print_status "Testing deployment..."
        if curl -f "$DEPLOY_URL/api/v1/health" > /dev/null 2>&1; then
            print_success "Health check passed! Deployment is working correctly."
        else
            print_warning "Health check failed. Please check Railway logs."
        fi
    fi
    
    print_status ""
    print_status "🎉 Maijd Software Suite Mobile v2.0.0 is now deployed on Railway!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Test the mobile dashboard on your device"
    print_status "2. Install the PWA to your home screen"
    print_status "3. Test offline functionality"
    print_status "4. Verify real-time updates"
    print_status "5. Test push notifications"
    print_status ""
    print_status "For monitoring and logs:"
    print_status "- View logs: railway logs"
    print_status "- Check status: railway status"
    print_status "- View variables: railway variables"
    
else
    print_error "Deployment failed. Please check the error messages above."
    print_status "Common issues:"
    print_status "1. Railway CLI not authenticated"
    print_status "2. Missing environment variables"
    print_status "3. Build errors in the code"
    print_status "4. Port conflicts"
    
    exit 1
fi

print_status ""
print_status "📋 Deployment checklist saved to: RAILWAY_DEPLOYMENT_CHECKLIST.md"
print_status "🐳 Railway Dockerfile saved to: Dockerfile.railway"
print_status "🚀 Production startup script saved to: maijd_software/start_production.py"
print_status "⚙️  Production environment file saved to: maijd_software/.env"
print_status "📦 Production requirements saved to: maijd_software/requirements.txt"

print_success ""
print_success "🎯 Railway deployment script completed!"
print_success "Your enhanced mobile Maijd Software Suite is ready for production!"
