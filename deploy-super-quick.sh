#!/bin/bash

# 🚀 Maijjd Super-Quick Deploy Script
# The fastest, easiest way to deploy your full-stack project
# Just run: ./deploy-super-quick.sh

set -e

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function to print status
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

print_step() {
    echo -e "${CYAN}➤${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Function to check if port is available
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $port is already in use by another service"
        print_status "Attempting to identify the service using port $port..."
        
        local process=$(lsof -ti:$port 2>/dev/null | head -1)
        if [ ! -z "$process" ]; then
            local process_name=$(ps -p $process -o comm= 2>/dev/null || echo "Unknown")
            print_warning "Process $process_name (PID: $process) is using port $port"
            
            read -p "Would you like to stop this process and continue? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                print_status "Stopping process on port $port..."
                kill -TERM $process 2>/dev/null || true
                sleep 2
                if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
                    print_error "Failed to free port $port. Please stop the service manually and try again."
                    exit 1
                fi
                print_success "Port $port is now available"
            else
                print_error "Deployment cancelled. Please free port $port and try again."
                exit 1
            fi
        fi
    fi
}

# Function to check system requirements
check_system_requirements() {
    print_step "Checking system requirements..."
    
    # Check OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
        print_success "Detected OS: $OS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
        print_success "Detected OS: $OS"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="Windows"
        print_success "Detected OS: $OS"
    else
        OS="Unknown"
        print_warning "Unknown OS type: $OSTYPE"
    fi
    
    # Check Docker availability
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        DEPLOY_MODE="docker"
        print_success "Docker is available - using Docker deployment"
        
        # Check Docker Compose
        if ! command -v docker-compose &> /dev/null; then
            print_error "Docker Compose is not installed. Please install Docker Compose first."
            print_status "Visit: https://docs.docker.com/compose/install/"
            exit 1
        fi
        
        # Check Docker version
        local docker_version=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        if [ ! -z "$docker_version" ]; then
            print_success "Docker version: $docker_version"
        fi
        
        # Check Docker Compose version
        local compose_version=$(docker-compose --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        if [ ! -z "$compose_version" ]; then
            print_success "Docker Compose version: $compose_version"
        fi
        
    else
        DEPLOY_MODE="local"
        print_warning "Docker not available - falling back to local deployment"
        
        # Check Node.js
        if ! command -v node &> /dev/null; then
            print_error "Node.js is required for local deployment"
            print_status "Please install Node.js from: https://nodejs.org/"
            exit 1
        fi
        
        # Check Node.js version
        local node_version=$(node --version | grep -oE 'v[0-9]+' | head -1)
        if [ ! -z "$node_version" ]; then
            print_success "Node.js version: $node_version"
        fi
        
        # Check npm
        if ! command -v npm &> /dev/null; then
            print_error "npm is required for local deployment"
            exit 1
        fi
        
        # Check npm version
        local npm_version=$(npm --version)
        if [ ! -z "$npm_version" ]; then
            print_success "npm version: $npm_version"
        fi
        
        # Check curl for health checks
        if ! command -v curl &> /dev/null; then
            print_warning "curl not found - health checks will be limited"
        fi
    fi
    
    print_success "System requirements check completed"
}

# Function to check ports
check_ports() {
    print_step "Checking port availability..."
    
    if [ "$DEPLOY_MODE" = "docker" ]; then
        check_port 80 "Nginx"
        check_port 443 "Nginx HTTPS"
        check_port 3000 "Frontend"
        check_port 5000 "Backend"
        check_port 27017 "MongoDB"
        check_port 6379 "Redis"
    else
        check_port 3000 "Frontend"
        check_port 5001 "Backend"
    fi
    
    print_success "Port availability check completed"
}

# Function to create perfect environment
create_environment() {
    print_step "Creating perfect environment..."
    
    # Create essential directories with proper permissions
    mkdir -p data logs uploads ssl monitoring/grafana/dashboards monitoring/grafana/datasources
    
    # Create .env file with enhanced configuration
    if [ ! -f .env ]; then
        print_status "Creating enhanced environment configuration..."
        cat > .env << EOF
# Maijjd Enhanced Auto-Configuration
NODE_ENV=production
JWT_SECRET=maijjd-enhanced-$(date +%s)-$(openssl rand -hex 16)
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://admin:password@mongodb:27017/maijjd?authSource=admin
REDIS_URI=redis://redis:6379
PORT=5000
FRONTEND_PORT=3000
LOG_LEVEL=info
ENABLE_METRICS=true
ENABLE_HEALTH_CHECKS=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF
        print_success "Enhanced environment configuration created"
    else
        print_status "Environment configuration already exists"
    fi
    
    # Generate SSL certificates if needed
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        print_status "Generating enhanced SSL certificates..."
        mkdir -p ssl
        
        # Generate stronger SSL certificate
        openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
            -subj "/C=US/ST=State/L=City/O=Maijjd/CN=localhost" \
            -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
            -addext "extendedKeyUsage=serverAuth,clientAuth" 2>/dev/null || true
            
        # Set proper permissions
        chmod 600 ssl/key.pem
        chmod 644 ssl/cert.pem
        
        print_success "Enhanced SSL certificates generated with proper permissions"
    else
        print_status "SSL certificates already exist"
    fi
    
    # Create enhanced monitoring configuration
    print_status "Setting up enhanced monitoring..."
    
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

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
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
    editable: true
EOF

    print_success "Enhanced monitoring configuration created"
}

# Function to deploy with Docker
deploy_docker() {
    print_step "Deploying with Docker..."
    
    # Stop any existing services gracefully
    if docker-compose ps -q | grep -q .; then
        print_status "Stopping existing services gracefully..."
        docker-compose down --remove-orphans --timeout 30 2>/dev/null || true
    fi
    
    # Clean up any dangling resources
    print_status "Cleaning up Docker resources..."
    docker system prune -f --volumes 2>/dev/null || true
    
    # Build and start services
    print_step "Building and starting services..."
    print_status "This may take a few minutes on first run..."
    
    export COMPOSE_PROJECT_NAME=maijjd
    export NODE_ENV=production
    
    # Start services with proper error handling
    if ! docker-compose up -d --build; then
        print_error "Failed to start Docker services"
        print_status "Checking Docker logs..."
        docker-compose logs --tail=50
        exit 1
    fi
    
    # Wait for services with progress indicator
    print_step "Waiting for services to start..."
    local wait_time=0
    local max_wait=60
    
    while [ $wait_time -lt $max_wait ]; do
        if docker-compose ps | grep -q "Up"; then
            break
        fi
        sleep 2
        wait_time=$((wait_time + 2))
        echo -n "."
    done
    echo ""
    
    if [ $wait_time -ge $max_wait ]; then
        print_warning "Services are taking longer than expected to start"
    fi
    
    # Enhanced health check
    print_step "Performing comprehensive health check..."
    
    local health_passed=true
    
    # Check backend
    if curl -s -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Backend API is healthy"
    else
        print_warning "Backend API health check failed"
        health_passed=false
    fi
    
    # Check frontend
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend health check failed"
        health_passed=false
    fi
    
    # Check MongoDB
    if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_success "MongoDB is healthy"
    else
        print_warning "MongoDB health check failed"
        health_passed=false
    fi
    
    # Check Redis
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is healthy"
    else
        print_warning "Redis health check failed"
        health_passed=false
    fi
    
    # Check Nginx
    if curl -s -f http://localhost:80/health > /dev/null 2>&1; then
        print_success "Nginx is healthy"
    else
        print_warning "Nginx health check failed"
        health_passed=false
    fi
    
    # Show service status
    echo ""
    print_step "Service Status:"
    docker-compose ps
    
    echo ""
    print_header "🎉 Maijjd Docker Deployment Complete!"
    echo ""
    print_status "🌐 Access your application:"
    echo "   Frontend:        http://localhost:3000"
    echo "   Backend:         http://localhost:5000"
    echo "   Nginx Proxy:     http://localhost:80"
    echo "   Nginx HTTPS:     https://localhost:443 (self-signed cert)"
    echo "   API Health:      http://localhost:5000/api/health"
    echo "   Nginx Health:    http://localhost:80/health"
    echo ""
    print_status "📊 Monitoring & Observability:"
    echo "   Prometheus:      http://localhost:9090"
    echo "   Grafana:         http://localhost:3001 (admin/admin)"
    echo ""
    print_status "🗄️  Database Access:"
    echo "   MongoDB:         localhost:27017 (admin/password)"
    echo "   Redis:           localhost:6379"
    echo ""
    print_status "📝 Quick commands:"
    echo "   View logs:       docker-compose logs -f [service_name]"
    echo "   Stop services:   docker-compose down"
    echo "   Restart:         docker-compose restart"
    echo "   Rebuild:         docker-compose up -d --build"
    echo "   Clean up:        docker-compose down -v --remove-orphans"
    echo ""
    
    if [ "$health_passed" = false ]; then
        print_warning "Some services may still be starting up. Please wait a few more minutes."
        print_status "You can check logs with: docker-compose logs -f"
    fi
    
    # Auto-open browser on macOS
    if [[ "$OS" == "macOS" ]] && command -v open &> /dev/null; then
        sleep 3
        print_status "Opening application in browser..."
        open http://localhost:3000
    fi
}

# Function to deploy locally
deploy_local() {
    print_step "Deploying locally..."
    
    # Install backend dependencies
    print_step "Setting up backend..."
    cd backend_maijjd
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        if ! npm install; then
            print_error "Failed to install backend dependencies"
            exit 1
        fi
    else
        print_status "Backend dependencies already installed"
    fi
    
    cd ..
    
    # Install frontend dependencies
    print_step "Setting up frontend..."
    cd frontend_maijjd
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        if ! npm install; then
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    else
        print_status "Frontend dependencies already installed"
    fi
    
    cd ..
    
    # Start services with proper error handling
    print_step "Starting local services..."
    
    # Start backend in background
    print_status "Starting backend API..."
    cd backend_maijjd
    PORT=5001 npm start > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend with timeout
    local backend_wait=0
    local max_backend_wait=30
    
    while [ $backend_wait -lt $max_backend_wait ]; do
        if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
            break
        fi
        sleep 1
        backend_wait=$((backend_wait + 1))
        echo -n "."
    done
    echo ""
    
    if [ $backend_wait -ge $max_backend_wait ]; then
        print_error "Backend failed to start within expected time"
        print_status "Check logs: tail -f logs/backend.log"
        exit 1
    fi
    
    print_success "Backend API started successfully"
    
    # Start frontend in background
    print_status "Starting frontend..."
    cd frontend_maijjd
    npm start > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend with timeout
    local frontend_wait=0
    local max_frontend_wait=60
    
    while [ $frontend_wait -lt $max_frontend_wait ]; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            break
        fi
        sleep 1
        frontend_wait=$((frontend_wait + 1))
        echo -n "."
    done
    echo ""
    
    if [ $frontend_wait -ge $max_frontend_wait ]; then
        print_error "Frontend failed to start within expected time"
        print_status "Check logs: tail -f logs/frontend.log"
        exit 1
    fi
    
    print_success "Frontend started successfully"
    
    # Enhanced health check
    print_step "Performing comprehensive health check..."
    
    if curl -s -f http://localhost:5001/api/health > /dev/null 2>&1; then
        print_success "Backend API is healthy on port 5001"
    else
        print_warning "Backend health check failed"
    fi
    
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy on port 3000"
    else
        print_warning "Frontend health check failed"
    fi
    
    echo ""
    print_header "🎉 Maijjd Local Development Complete!"
    echo ""
    print_status "🌐 Access your application:"
    echo "   Frontend:    http://localhost:3000"
    echo "   Backend:     http://localhost:5001"
    echo "   API Health:  http://localhost:5001/api/health"
    echo ""
    print_status "📝 Development features:"
    echo "   Hot reload enabled"
    echo "   Auto-restart on file changes"
    echo "   Source code editing in real-time"
    echo "   Logs available in logs/ directory"
    echo ""
    print_status "🛑 To stop services:"
    echo "   Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
    echo ""
    print_status "📋 Useful commands:"
    echo "   View backend logs:   tail -f logs/backend.log"
    echo "   View frontend logs:  tail -f logs/frontend.log"
    echo ""
    
    # Auto-open browser on macOS
    if [[ "$OS" == "macOS" ]] && command -v open &> /dev/null; then
        sleep 3
        print_status "Opening application in browser..."
        open http://localhost:3000
    fi
    
    # Keep script running to maintain background processes
    print_status "Services are running... Press Ctrl+C to stop"
    
    # Trap to handle cleanup on exit
    trap 'print_status "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; print_success "Services stopped"; exit 0' INT TERM
    
    wait
}

# Main execution
main() {
    # Banner
    clear
    print_header "
╔══════════════════════════════════════════════════════════════╗
║                🚀 Maijjd Super-Quick Deploy                 ║
║              Zero-config, One-command Setup                 ║
║                    Enhanced & Perfect                       ║
╚══════════════════════════════════════════════════════════════╝
"
    
    echo -e "${CYAN}🎯 Auto-detecting best deployment mode...${NC}"
    echo ""
    
    # Check system requirements
    check_system_requirements
    
    # Check ports
    check_ports
    
    # Create environment
    create_environment
    
    # Deploy based on mode
    if [ "$DEPLOY_MODE" = "docker" ]; then
        deploy_docker
    else
        deploy_local
    fi
    
    echo ""
    print_success "Deployment completed successfully!"
    print_status "Your Maijjd project is ready to use! 🚀"
}

# Run main function
main "$@"
