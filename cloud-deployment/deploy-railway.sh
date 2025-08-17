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
