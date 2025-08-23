#!/bin/bash

echo "🚀 Maijjd Internal Deployment Script"
echo "====================================="

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

print_status "Starting Maijjd Internal Deployment..."

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.production.yml down --remove-orphans

# Remove old images
print_status "Removing old images..."
docker system prune -f

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p data/mongodb uploads reports logs ssl

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.production.yml up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check MongoDB
if docker exec maijjd-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is running and healthy"
else
    print_error "MongoDB is not responding"
fi

# Check Backend
if curl -f http://localhost:5001/api/health > /dev/null 2>&1; then
    print_success "Backend API is running and healthy"
else
    print_error "Backend API is not responding"
fi

# Check Admin Dashboard
if curl -f http://localhost:5002/health > /dev/null 2>&1; then
    print_success "Admin Dashboard is running and healthy"
else
    print_error "Admin Dashboard is not responding"
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is running and healthy"
else
    print_error "Frontend is not responding"
fi

# Check Nginx
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_success "Nginx reverse proxy is running and healthy"
else
    print_error "Nginx reverse proxy is not responding"
fi

echo ""
echo "🌐 Maijjd Services are now running internally:"
echo "==============================================="
echo "Frontend:        http://localhost:3000"
echo "Backend API:     http://localhost:5001"
echo "Admin Dashboard: http://localhost:5002"
echo "Nginx Proxy:     http://localhost"
echo "MongoDB:         localhost:27017"
echo ""
echo "📊 To view logs: docker-compose -f docker-compose.production.yml logs -f"
echo "🛑 To stop:      docker-compose -f docker-compose.production.yml down"
echo "🔄 To restart:   docker-compose -f docker-compose.production.yml restart"
echo ""
print_success "Deployment completed successfully!"
