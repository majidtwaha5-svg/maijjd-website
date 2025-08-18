#!/bin/bash

# Maijjd Development Script
echo "🚀 Starting Maijjd Development Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if environment files exist
if [ ! -f "backend_maijjd/.env" ]; then
    print_warning "Backend .env file not found. Creating from example..."
    cp backend_maijjd/.env.example backend_maijjd/.env
fi

if [ ! -f "frontend_maijjd/.env" ]; then
    print_warning "Frontend .env file not found. Creating from example..."
    cp frontend_maijjd/.env.example frontend_maijjd/.env
fi

print_status "Starting backend and frontend services..."
print_status "Backend will be available at: http://localhost:5001"
print_status "Frontend will be available at: http://localhost:3000"
print_status "API Documentation will be available at: http://localhost:5001/api-docs"
echo ""

# Start both services using the root package.json scripts
npm run dev
