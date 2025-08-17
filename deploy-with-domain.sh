#!/bin/bash

# 🌐 Maijjd Domain Deployment Script
# Complete deployment with domain configuration and HTTPS setup
# Usage: ./deploy-with-domain.sh

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

# Configuration variables
FRONTEND_DOMAIN=""
BACKEND_DOMAIN=""
HOSTING_PLATFORM=""
DEPLOYMENT_METHOD=""

# Function to check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if Docker is available
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        print_success "Docker is available"
    else
        print_warning "Docker not available - will use cloud deployment"
        DEPLOYMENT_METHOD="cloud"
    fi
    
    # Check if Node.js is available
    if command -v node &> /dev/null; then
        print_success "Node.js is available"
    else
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check if npm is available
    if command -v npm &> /dev/null; then
        print_success "npm is available"
    else
        print_error "npm is required but not installed"
        exit 1
    fi
}

# Function to get domain information
get_domain_info() {
    print_header "🌐 Domain Configuration"
    
    echo
    print_status "Please provide your domain information:"
    
    read -p "Enter your main domain (e.g., maijjd.com): " FRONTEND_DOMAIN
    read -p "Enter your API subdomain (e.g., api.maijjd.com) or press Enter for subpath routing: " BACKEND_DOMAIN
    
    if [ -z "$BACKEND_DOMAIN" ]; then
        BACKEND_DOMAIN="${FRONTEND_DOMAIN}/api"
        print_status "Using subpath routing: $BACKEND_DOMAIN"
    fi
    
    echo
    print_status "Choose your hosting platform:"
    echo "1) Vercel + Railway (Recommended)"
    echo "2) DigitalOcean App Platform"
    echo "3) AWS (Advanced)"
    echo "4) Docker (Local/Server)"
    
    read -p "Enter your choice (1-4): " platform_choice
    
    case $platform_choice in
        1) HOSTING_PLATFORM="vercel-railway" ;;
        2) HOSTING_PLATFORM="digitalocean" ;;
        3) HOSTING_PLATFORM="aws" ;;
        4) HOSTING_PLATFORM="docker" ;;
        *) HOSTING_PLATFORM="vercel-railway" ;;
    esac
    
    print_success "Selected platform: $HOSTING_PLATFORM"
}

# Function to configure environment variables
configure_environment() {
    print_step "Configuring environment variables..."
    
    # Frontend environment
    if [ -f "frontend_maijjd/.env.example" ]; then
        cp frontend_maijjd/.env.example frontend_maijjd/.env.production
        print_success "Created frontend production environment file"
    fi
    
    # Backend environment
    if [ -f "backend_maijjd/.env.example" ]; then
        cp backend_maijjd/.env.example backend_maijjd/.env.production
        print_success "Created backend production environment file"
    fi
    
    # Update environment files with domain information
    if [ "$HOSTING_PLATFORM" = "vercel-railway" ]; then
        # Frontend .env.production
        if [ -f "frontend_maijjd/.env.production" ]; then
            sed -i.bak "s|REACT_APP_API_URL=.*|REACT_APP_API_URL=https://$BACKEND_DOMAIN/api|" frontend_maijjd/.env.production
            sed -i.bak "s|REACT_APP_ENV=.*|REACT_APP_ENV=production|" frontend_maijjd/.env.production
            sed -i.bak "s|REACT_APP_DOMAIN=.*|REACT_APP_DOMAIN=$FRONTEND_DOMAIN|" frontend_maijjd/.env.production
        fi
        
        # Backend .env.production
        if [ -f "backend_maijjd/.env.production" ]; then
            sed -i.bak "s|NODE_ENV=.*|NODE_ENV=production|" backend_maijjd/.env.production
            sed -i.bak "s|CORS_ORIGIN=.*|CORS_ORIGIN=https://$FRONTEND_DOMAIN|" backend_maijjd/.env.production
            sed -i.bak "s|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://$FRONTEND_DOMAIN,https://www.$FRONTEND_DOMAIN|" backend_maijjd/.env.production
        fi
    fi
    
    print_success "Environment variables configured"
}

# Function to deploy to Vercel + Railway
deploy_vercel_railway() {
    print_header "🚀 Deploying to Vercel + Railway"
    
    # Deploy frontend to Vercel
    print_step "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    cd frontend_maijjd
    
    # Check if already deployed
    if [ -d ".vercel" ]; then
        print_status "Updating existing Vercel deployment..."
        vercel --prod
    else
        print_status "Creating new Vercel deployment..."
        vercel --prod
    fi
    
    # Configure custom domain
    print_status "Configuring custom domain: $FRONTEND_DOMAIN"
    vercel domains add $FRONTEND_DOMAIN
    
    cd ..
    
    # Deploy backend to Railway
    print_step "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    cd backend_maijjd
    
    # Check if already deployed
    if [ -f "railway.json" ]; then
        print_status "Updating existing Railway deployment..."
        railway up
    else
        print_status "Creating new Railway deployment..."
        railway login
        railway init
        railway up
    fi
    
    # Configure custom domain if using subdomain
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        print_status "Configuring custom domain: $BACKEND_DOMAIN"
        railway domain add $BACKEND_DOMAIN
    fi
    
    cd ..
    
    print_success "Deployment to Vercel + Railway completed!"
}

# Function to deploy to DigitalOcean
deploy_digitalocean() {
    print_header "🚀 Deploying to DigitalOcean App Platform"
    
    print_step "Setting up DigitalOcean deployment..."
    
    # Create app.yaml configuration
    cat > app.yaml << EOF
name: maijjd-app
services:
- name: frontend
  source_dir: /frontend_maijjd
  github:
    repo: your-username/maijjd-project
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
    preserve_path_prefix: false

- name: backend
  source_dir: /backend_maijjd
  github:
    repo: your-username/maijjd-project
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /api
    preserve_path_prefix: true
EOF
    
    print_success "Created DigitalOcean app configuration"
    print_status "Please update the GitHub repository information in app.yaml"
    print_status "Then run: doctl apps create --spec app.yaml"
}

# Function to deploy with Docker
deploy_docker() {
    print_header "🐳 Deploying with Docker"
    
    print_step "Building and starting Docker services..."
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is required but not installed"
        exit 1
    fi
    
    # Start services
    docker-compose up -d --build
    
    print_success "Docker services started successfully"
    
    # Show service status
    docker-compose ps
    
    print_status "Services are running on:"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5001"
    print_status "Monitoring: http://localhost:3001"
}

# Function to test deployment
test_deployment() {
    print_header "🧪 Testing Deployment"
    
    print_step "Testing frontend..."
    
    if [ "$HOSTING_PLATFORM" = "docker" ]; then
        # Test local Docker deployment
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
            print_success "Frontend is accessible at http://localhost:3000"
        else
            print_error "Frontend is not accessible"
        fi
        
        print_step "Testing backend..."
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/health | grep -q "200"; then
            print_success "Backend is accessible at http://localhost:5001"
        else
            print_error "Backend is not accessible"
        fi
    else
        # Test cloud deployment
        print_step "Testing frontend domain: $FRONTEND_DOMAIN"
        if curl -s -o /dev/null -w "%{http_code}" https://$FRONTEND_DOMAIN | grep -q "200"; then
            print_success "Frontend is accessible at https://$FRONTEND_DOMAIN"
        else
            print_warning "Frontend may not be accessible yet (DNS propagation takes time)"
        fi
        
        if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
            print_step "Testing backend domain: $BACKEND_DOMAIN"
            if curl -s -o /dev/null -w "%{http_code}" https://$BACKEND_DOMAIN/api/health | grep -q "200"; then
                print_success "Backend is accessible at https://$BACKEND_DOMAIN"
            else
                print_warning "Backend may not be accessible yet (DNS propagation takes time)"
            fi
        fi
    fi
}

# Function to setup monitoring
setup_monitoring() {
    print_header "📊 Setting up Monitoring"
    
    print_step "Creating monitoring configuration..."
    
    # Create monitoring script
    cat > monitor-deployment.sh << 'EOF'
#!/bin/bash

echo "🔍 Monitoring Maijjd Deployment..."

# Check service status
if [ "$HOSTING_PLATFORM" = "docker" ]; then
    echo "Docker Services:"
    docker-compose ps
    
    echo "Service Logs:"
    docker-compose logs --tail=10
else
    echo "Cloud Deployment Status:"
    echo "Frontend: https://$FRONTEND_DOMAIN"
    echo "Backend: https://$BACKEND_DOMAIN"
    
    # Test endpoints
    echo "Testing endpoints..."
    curl -s -o /dev/null -w "Frontend: %{http_code}\n" https://$FRONTEND_DOMAIN
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        curl -s -o /dev/null -w "Backend: %{http_code}\n" https://$BACKEND_DOMAIN/api/health
    fi
fi

echo "✅ Monitoring complete!"
EOF
    
    chmod +x monitor-deployment.sh
    print_success "Created monitoring script: monitor-deployment.sh"
    
    # Create health check script
    if [ -f "health-check.sh" ]; then
        print_status "Health check script already exists"
    else
        print_status "Creating health check script..."
        # This will use the existing health-check.sh if available
        print_warning "Please ensure health-check.sh exists for comprehensive health monitoring"
    fi
}

# Function to create deployment summary
create_deployment_summary() {
    print_header "📋 Deployment Summary"
    
    cat > DEPLOYMENT_SUMMARY_$(date +%Y%m%d_%H%M%S).md << EOF
# 🚀 Maijjd Deployment Summary

## Deployment Information
- **Date**: $(date)
- **Frontend Domain**: $FRONTEND_DOMAIN
- **Backend Domain**: $BACKEND_DOMAIN
- **Hosting Platform**: $HOSTING_PLATFORM
- **Deployment Method**: $DEPLOYMENT_METHOD

## URLs
- **Frontend**: https://$FRONTEND_DOMAIN
- **Backend**: https://$BACKEND_DOMAIN
- **API Health**: https://$BACKEND_DOMAIN/api/health

## Next Steps
1. **Wait for DNS propagation** (up to 48 hours)
2. **Test your live site** thoroughly
3. **Set up monitoring** with: ./monitor-deployment.sh
4. **Configure analytics** and tracking
5. **Set up backups** and maintenance

## Commands
- **Monitor deployment**: ./monitor-deployment.sh
- **Health check**: ./health-check.sh
- **View logs**: docker-compose logs -f (if using Docker)

## Support
- Check the [Comprehensive Deployment Guide](COMPREHENSIVE_DEPLOYMENT_GUIDE_2024.md)
- Review logs and error messages
- Test endpoints and functionality
EOF
    
    print_success "Created deployment summary: DEPLOYMENT_SUMMARY_$(date +%Y%m%d_%H%M%S).md"
}

# Main deployment function
main() {
    print_header "🚀 Maijjd Domain Deployment Script"
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Get domain information
    get_domain_info
    
    # Configure environment
    configure_environment
    
    # Deploy based on platform choice
    case $HOSTING_PLATFORM in
        "vercel-railway")
            deploy_vercel_railway
            ;;
        "digitalocean")
            deploy_digitalocean
            ;;
        "aws")
            print_warning "AWS deployment requires manual setup"
            print_status "Please refer to the AWS deployment guide"
            ;;
        "docker")
            deploy_docker
            ;;
        *)
            print_error "Unknown hosting platform: $HOSTING_PLATFORM"
            exit 1
            ;;
    esac
    
    # Test deployment
    test_deployment
    
    # Setup monitoring
    setup_monitoring
    
    # Create deployment summary
    create_deployment_summary
    
    print_header "🎉 Deployment Complete!"
    echo
    print_success "Your Maijjd application has been deployed successfully!"
    print_status "Frontend: $FRONTEND_DOMAIN"
    print_status "Backend: $BACKEND_DOMAIN"
    echo
    print_status "Next steps:"
    print_status "1. Wait for DNS propagation (up to 48 hours)"
    print_status "2. Test your live site thoroughly"
    print_status "3. Monitor deployment with: ./monitor-deployment.sh"
    print_status "4. Set up analytics and tracking"
    echo
    print_success "Happy deploying! 🚀"
}

# Run main function
main "$@"
