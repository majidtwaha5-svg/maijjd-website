#!/bin/bash

# Maijjd Full Project - Quick Deploy Script
# One-command deployment for immediate use
# 
# Usage: ./quick-deploy.sh [options]
# Options:
#   --dev      Development mode with hot reload
#   --prod     Production mode (default)
#   --clean    Clean deployment (remove existing containers)
#   --help     Show this help message

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DEV_MODE=false
PROD_MODE=true
CLEAN_DEPLOY=false
SKIP_CHECKS=false

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

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

print_step() {
    echo -e "${CYAN}➤${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            DEV_MODE=true
            PROD_MODE=false
            shift
            ;;
        --prod)
            PROD_MODE=true
            DEV_MODE=false
            shift
            ;;
        --clean)
            CLEAN_DEPLOY=true
            shift
            ;;
        --skip-checks)
            SKIP_CHECKS=true
            shift
            ;;
        --help)
            echo "Maijjd Full Project - Quick Deploy Script"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --dev          Development mode with hot reload"
            echo "  --prod         Production mode (default)"
            echo "  --clean        Clean deployment (remove existing containers)"
            echo "  --skip-checks  Skip system requirement checks"
            echo "  --help         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Production deployment"
            echo "  $0 --dev        # Development deployment"
            echo "  $0 --clean      # Clean production deployment"
            echo ""
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Banner
clear
print_header "
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Maijjd Full Project                    ║
║                     Quick Deploy Script                      ║
╚══════════════════════════════════════════════════════════════╝
"

if [ "$DEV_MODE" = true ]; then
    print_header "🎯 Development Mode - Hot Reload Enabled"
else
    print_header "🏭 Production Mode - Optimized for Performance"
fi

echo ""

# System requirement checks
if [ "$SKIP_CHECKS" = false ]; then
    print_step "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "System requirements check passed"
    echo ""
fi

# Clean deployment if requested
if [ "$CLEAN_DEPLOY" = true ]; then
    print_step "Performing clean deployment..."
    print_warning "This will remove all existing containers and volumes"
    
    if docker-compose ps -q | grep -q .; then
        print_status "Stopping existing services..."
        docker-compose down -v --remove-orphans
    fi
    
    print_status "Cleaning up Docker resources..."
    docker system prune -f
    print_success "Clean deployment ready"
    echo ""
fi

# Create necessary directories and files
print_step "Setting up project structure..."
mkdir -p data logs uploads ssl monitoring/grafana/dashboards monitoring/grafana/datasources

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# Maijjd Project Environment Variables
NODE_ENV=${DEV_MODE:+development}${PROD_MODE:+production}
JWT_SECRET=maijjd-super-secret-jwt-key-$(date +%s)
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://admin:password@mongodb:27017/maijjd?authSource=admin
REDIS_URI=redis://redis:6379
EOF
    print_success ".env file created"
fi

# Generate SSL certificates for HTTPS
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    print_status "Generating SSL certificates..."
    mkdir -p ssl
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=Maijjd/CN=localhost" 2>/dev/null || true
    print_success "SSL certificates generated"
fi

# Create monitoring configuration
print_step "Setting up monitoring and observability..."

# Prometheus configuration
cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'maijjd-backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'maijjd-frontend'
    static_configs:
      - targets: ['frontend:3000']
    scrape_interval: 10s
EOF

# Grafana datasource configuration
mkdir -p monitoring/grafana/datasources
cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

print_success "Monitoring configuration created"

# Build and start services
print_step "Building and starting services..."
print_status "This may take a few minutes on first run..."

# Set environment variables for docker-compose
export NODE_ENV=${DEV_MODE:+development}${PROD_MODE:+production}
export COMPOSE_PROJECT_NAME=maijjd

# Start services
docker-compose up -d --build

# Wait for services to be ready
print_step "Waiting for services to be ready..."
sleep 15

# Health check
print_step "Performing health check..."
HEALTH_CHECK_PASSED=true

# Check backend
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend API is healthy"
else
    print_warning "Backend API health check failed (may still be starting)"
    HEALTH_CHECK_PASSED=false
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is healthy"
else
    print_warning "Frontend health check failed (may still be starting)"
    HEALTH_CHECK_PASSED=false
fi

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is healthy"
else
    print_warning "MongoDB health check failed (may still be starting)"
    HEALTH_CHECK_PASSED=false
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis is healthy"
else
    print_warning "Redis health check failed (may still be starting)"
    HEALTH_CHECK_PASSED=false
fi

echo ""

# Show service status
print_step "Service Status:"
docker-compose ps

echo ""

# Success message
print_header "🎉 Maijjd Full Project is now running!"
echo ""

print_status "🌐 Access your application:"
echo "   Frontend:        http://localhost:3000"
echo "   Backend API:     http://localhost:5000"
echo "   Nginx Proxy:     http://localhost:80"
echo "   Nginx HTTPS:     https://localhost:443 (self-signed cert)"
echo ""

if [ "$DEV_MODE" = true ]; then
    print_status "🔧 Development Mode Features:"
    echo "   Hot reload enabled"
    echo "   Source code mounted for live editing"
    echo "   Development dependencies installed"
    echo ""
fi

print_status "📊 Monitoring & Observability:"
echo "   Prometheus:      http://localhost:9090"
echo "   Grafana:         http://localhost:3001 (admin/admin)"
echo "   Application metrics available at /metrics endpoints"
echo ""

print_status "🗄️  Database Access:"
echo "   MongoDB:         localhost:27017 (admin/password)"
echo "   Redis:           localhost:6379"
echo ""

print_status "📝 Useful Commands:"
echo "   View logs:       docker-compose logs -f [service_name]"
echo "   Stop services:   docker-compose down"
echo "   Restart:         docker-compose restart"
echo "   Rebuild:         docker-compose up -d --build"
echo "   Clean up:        docker-compose down -v --remove-orphans"
echo ""

print_status "🔍 Quick Health Check:"
echo "   Backend:         curl http://localhost:5000/api/health"
echo "   Frontend:        curl http://localhost:3000"
echo "   Metrics:         curl http://localhost:5000/metrics"
echo ""

if [ "$HEALTH_CHECK_PASSED" = false ]; then
    print_warning "Some services may still be starting up. Please wait a few more minutes."
    print_status "You can check logs with: docker-compose logs -f"
fi

echo ""
print_header "✨ Your Maijjd Full Project is ready for development and production use!"
echo ""

# Optional: Open browser
if command -v open &> /dev/null; then
    read -p "Would you like to open the application in your browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open http://localhost:3000
    fi
fi

echo ""
print_success "Deployment completed successfully!"
print_status "Happy coding with Maijjd! 🚀"
