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
