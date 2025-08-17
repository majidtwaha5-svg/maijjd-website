#!/bin/bash

# Maijjd Full Project - Local Development Script
# Run without Docker for immediate development

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Banner
clear
print_header "
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Maijjd Full Project                    ║
║                   Local Development Mode                     ║
╚══════════════════════════════════════════════════════════════╝
"

echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

print_success "Node.js $(node --version) and npm $(npm --version) are installed"

# Check if dependencies are installed
if [ ! -d "frontend_maijjd/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd frontend_maijjd
    npm install
    cd ..
fi

if [ ! -d "backend_maijjd/node_modules" ]; then
    print_status "Installing backend dependencies..."
    cd backend_maijjd
    npm install
    cd ..
fi

print_success "Dependencies are ready"

# Create .env file for backend if it doesn't exist
if [ ! -f "backend_maijjd/.env" ]; then
    print_status "Creating backend environment file..."
    cat > backend_maijjd/.env << EOF
NODE_ENV=development
PORT=5000
JWT_SECRET=maijjd-dev-secret-$(date +%s)
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/maijjd
REDIS_URI=redis://localhost:6379
EOF
    print_success "Backend .env file created"
fi

# Create .env file for frontend if it doesn't exist
if [ ! -f "frontend_maijjd/.env" ]; then
    print_status "Creating frontend environment file..."
    cat > frontend_maijjd/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
EOF
    print_success "Frontend .env file created"
fi

echo ""
print_header "🚀 Starting Local Development Environment"
echo ""

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down services..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
    print_success "Services stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Start backend in background
print_status "Starting backend server..."
cd backend_maijjd
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
print_status "Starting frontend development server..."
cd frontend_maijjd
npm start &
FRONTEND_PID=$!
cd ..

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

echo ""
print_header "🎉 Local Development Environment is Running!"
echo ""

print_status "🌐 Access your application:"
echo "   Frontend:        http://localhost:3000"
echo "   Backend API:     http://localhost:5001"
echo ""

print_status "📝 Development Features:"
echo "   ✅ Hot reload enabled for frontend"
echo "   ✅ Auto-restart for backend"
echo "   ✅ Source code editing in real-time"
echo ""

print_status "🔍 Quick Health Check:"
echo "   Backend:         curl http://localhost:5001/api/health"
echo "   Frontend:        curl http://localhost:3000"
echo ""

print_warning "Note: This setup requires MongoDB and Redis to be running locally."
print_status "If you don't have them installed, you can:"
echo "   1. Install MongoDB: brew install mongodb-community"
echo "   2. Install Redis: brew install redis"
echo "   3. Or use the Docker version: ./quick-deploy.sh"
echo ""

print_status "📝 Useful Commands:"
echo "   View backend logs:   tail -f backend_maijjd/logs/app.log"
echo "   View frontend logs:  Check browser console"
echo "   Stop services:       Press Ctrl+C"
echo ""

print_status "🚀 Your Maijjd Full Project is ready for local development!"
echo ""

# Keep script running and show status
while true; do
    echo -e "${CYAN}➤${NC} Services are running... Press Ctrl+C to stop"
    sleep 30
done
