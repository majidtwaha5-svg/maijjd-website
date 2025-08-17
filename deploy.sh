#!/bin/bash

# Maijjd Deployment Script
# This script helps you deploy the Maijjd application

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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. This is required for local development."
        print_warning "You can still use Docker deployment."
    else
        print_success "Node.js is installed (version: $(node --version))"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing frontend dependencies..."
    cd frontend_maijjd
    npm install
    cd ..

    print_status "Installing backend dependencies..."
    cd backend_maijjd
    npm install
    cd ..

    print_success "Dependencies installed successfully"
}

# Build the application
build_application() {
    print_status "Building frontend application..."
    cd frontend_maijjd
    npm run build
    cd ..

    print_success "Application built successfully"
}

# Start Docker services
start_docker() {
    print_status "Starting Docker services..."
    docker-compose up -d

    print_success "Docker services started successfully"
    print_status "Services are running on:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo "  - Nginx (reverse proxy): http://localhost:80"
}

# Stop Docker services
stop_docker() {
    print_status "Stopping Docker services..."
    docker-compose down
    print_success "Docker services stopped successfully"
}

# Show logs
show_logs() {
    print_status "Showing Docker logs..."
    docker-compose logs -f
}

# Clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Check if services are running
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Frontend is running"
    else
        print_error "Frontend is not responding"
    fi

    if curl -s http://localhost:5000/api/health > /dev/null; then
        print_success "Backend API is running"
    else
        print_error "Backend API is not responding"
    fi
}

# Show help
show_help() {
    echo "Maijjd Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install dependencies for local development"
    echo "  build       Build the application"
    echo "  start       Start Docker services"
    echo "  stop        Stop Docker services"
    echo "  restart     Restart Docker services"
    echo "  logs        Show Docker logs"
    echo "  cleanup     Clean up Docker resources"
    echo "  health      Perform health check"
    echo "  deploy      Full deployment (install + build + start)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy    # Full deployment"
    echo "  $0 start     # Start services only"
    echo "  $0 logs      # View logs"
}

# Main script
main() {
    case "${1:-help}" in
        install)
            check_nodejs
            install_dependencies
            ;;
        build)
            check_nodejs
            build_application
            ;;
        start)
            check_docker
            start_docker
            ;;
        stop)
            check_docker
            stop_docker
            ;;
        restart)
            check_docker
            stop_docker
            start_docker
            ;;
        logs)
            check_docker
            show_logs
            ;;
        cleanup)
            check_docker
            cleanup
            ;;
        health)
            health_check
            ;;
        deploy)
            check_docker
            check_nodejs
            install_dependencies
            build_application
            start_docker
            print_success "Deployment completed successfully!"
            print_status "You can now access the application at:"
            echo "  - Frontend: http://localhost:3000"
            echo "  - Backend API: http://localhost:5000"
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
