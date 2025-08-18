#!/bin/bash

# Maijjd Full Project Installation Script
echo "🚀 Installing Maijjd Full Project..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm 9+ first."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend_maijjd
npm install
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend_maijjd
npm install
cd ..

# Create environment files if they don't exist
print_status "Setting up environment files..."

# Backend .env
if [ ! -f "backend_maijjd/.env" ]; then
    print_warning "Creating backend .env file from .env.example..."
    cp backend_maijjd/.env.example backend_maijjd/.env
    print_success "Backend .env file created. Please update with your actual values."
else
    print_success "Backend .env file already exists."
fi

# Frontend .env
if [ ! -f "frontend_maijjd/.env" ]; then
    print_warning "Creating frontend .env file from .env.example..."
    cp frontend_maijjd/.env.example frontend_maijjd/.env
    print_success "Frontend .env file created. Please update with your actual values."
else
    print_success "Frontend .env file already exists."
fi

print_success "Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in backend_maijjd/.env"
echo "2. Update environment variables in frontend_maijjd/.env"
echo "3. Start the backend: cd backend_maijjd && npm start"
echo "4. Start the frontend: cd frontend_maijjd && npm start"
echo ""
echo "🌐 For production deployment:"
echo "- Backend: Deploy to Railway with environment variables"
echo "- Frontend: Deploy to Vercel with REACT_APP_API_URL pointing to your Railway backend"
