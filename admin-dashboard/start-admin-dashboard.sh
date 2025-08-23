#!/bin/bash

echo "🎯 Starting Maijjd Admin Dashboard System..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p reports
mkdir -p logs

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. You can start it with: brew services start mongodb-community"
        echo "   Or use MongoDB Atlas (cloud) by updating the MONGODB_URI in .env"
    fi
else
    echo "⚠️  MongoDB is not installed. You can install it with: brew install mongodb-community"
    echo "   Or use MongoDB Atlas (cloud) by updating the MONGODB_URI in .env"
fi

echo ""
echo "🚀 Starting Admin Dashboard Server..."
echo "📊 Dashboard will be available at: http://localhost:5002"
echo "🔗 API Documentation: http://localhost:5002/api/docs"
echo ""
echo "📧 Default Admin Login:"
echo "   Email: admin@maijjd.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=============================================="

# Start the server
npm start
