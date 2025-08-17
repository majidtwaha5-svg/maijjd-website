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
