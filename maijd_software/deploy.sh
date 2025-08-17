#!/bin/bash

# Maijd Software Suite - Deployment Script
# This script automates the deployment process for production

set -e

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

# Configuration
PROJECT_NAME="maijd-software-suite"
DOMAIN=${1:-"localhost"}
ENVIRONMENT=${2:-"production"}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Created .env file from template. Please edit it with your actual values."
        else
            print_error "env.example not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    # Create necessary directories
    mkdir -p data logs uploads ssl monitoring/grafana/dashboards monitoring/grafana/datasources
    
    print_success "Environment setup completed"
}

# Generate SSL certificates (self-signed for development)
generate_ssl() {
    print_status "Generating SSL certificates..."
    
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        mkdir -p ssl
        openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"
        print_success "SSL certificates generated"
    else
        print_status "SSL certificates already exist"
    fi
}

# Build and deploy
deploy() {
    print_status "Building and deploying Maijd Software Suite..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Build images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    print_success "Deployment completed successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for web service
    print_status "Waiting for web service..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:8000/health &> /dev/null; then
            print_success "Web service is ready"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    if [ $timeout -eq 0 ]; then
        print_warning "Web service may not be ready yet. Check logs with: docker-compose logs maijd-web"
    fi
    
    # Wait for database
    print_status "Waiting for database..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T postgres pg_isready -U maijd &> /dev/null; then
            print_success "Database is ready"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    if [ $timeout -eq 0 ]; then
        print_warning "Database may not be ready yet. Check logs with: docker-compose logs postgres"
    fi
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'maijd-web'
    static_configs:
      - targets: ['maijd-web:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
EOF
    
    # Create Grafana datasource
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
    
    print_success "Monitoring setup completed"
}

# Show status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    # Show running containers
    docker-compose ps
    
    echo ""
    print_status "Service URLs:"
    echo "  Web Application: http://$DOMAIN:8000"
    echo "  Nginx (HTTP):    http://$DOMAIN"
    echo "  Nginx (HTTPS):   https://$DOMAIN"
    echo "  Grafana:         http://$DOMAIN:3000 (admin/admin)"
    echo "  Prometheus:      http://$DOMAIN:9090"
    
    echo ""
    print_status "Useful commands:"
    echo "  View logs:       docker-compose logs -f [service-name]"
    echo "  Stop services:   docker-compose down"
    echo "  Restart:         docker-compose restart"
    echo "  Update:          git pull && ./deploy.sh"
}

# Main deployment process
main() {
    print_status "Starting Maijd Software Suite deployment..."
    echo "Domain: $DOMAIN"
    echo "Environment: $ENVIRONMENT"
    echo ""
    
    check_prerequisites
    setup_environment
    generate_ssl
    setup_monitoring
    deploy
    wait_for_services
    show_status
    
    print_success "Deployment completed! 🚀"
    print_status "Your Maijd Software Suite is now running at http://$DOMAIN:8000"
}

# Run main function
main "$@"
