#!/bin/bash

# Maijjd Full Project - Master Deployment Script
# Choose your deployment strategy: Local, Cloud, or Custom Domain

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
clear
print_header "
╔══════════════════════════════════════════════════════════════╗
║                    🚀 Maijjd Full Project                    ║
║                   Master Deployment Script                   ║
╚══════════════════════════════════════════════════════════════╝
"

echo ""

# Function to show menu
show_menu() {
    echo "Choose your deployment strategy:"
    echo ""
    echo "1. 🏠 Local Development (No Docker)"
    echo "   - Run frontend and backend locally"
    echo "   - Perfect for development and testing"
    echo "   - Requires Node.js and local databases"
    echo ""
    echo "2. 🐳 Local Docker Deployment"
    echo "   - Full stack with Docker containers"
    echo "   - Includes monitoring and databases"
    echo "   - Requires Docker and Docker Compose"
    echo ""
    echo "3. ☁️  Cloud Deployment (Live Website)"
    echo "   - Deploy to Vercel + Railway"
    echo "   - Free hosting with custom domains"
    echo "   - Professional live website"
    echo ""
    echo "4. 🌐 Custom Domain Setup"
    echo "   - Configure your own domain"
    echo "   - Professional branding"
    echo "   - SEO and trust benefits"
    echo ""
    echo "5. 📚 View Documentation"
    echo "   - Read deployment guides"
    echo "   - Troubleshooting tips"
    echo "   - Best practices"
    echo ""
    echo "6. ❌ Exit"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking system prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        print_success "Node.js $(node --version) is installed"
    else
        print_error "Node.js is not installed"
        print_status "Install with: brew install node"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        print_success "npm $(npm --version) is installed"
    else
        print_error "npm is not installed"
        return 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        print_success "Git $(git --version | cut -d' ' -f3) is installed"
    else
        print_error "Git is not installed"
        print_status "Install with: brew install git"
        return 1
    fi
    
    return 0
}

# Function to check Docker
check_docker() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        if docker info &> /dev/null; then
            print_success "Docker and Docker Compose are running"
            return 0
        else
            print_warning "Docker is installed but not running"
            print_status "Start Docker Desktop and try again"
            return 1
        fi
    else
        print_warning "Docker is not installed"
        print_status "Install with: brew install --cask docker"
        return 1
    fi
}

# Function to setup local development
setup_local_dev() {
    print_header "🏠 Setting up Local Development Environment"
    echo ""
    
    if ! check_prerequisites; then
        print_error "Prerequisites not met. Please install required software first."
        return 1
    fi
    
    print_status "Installing dependencies..."
    
    # Install frontend dependencies
    if [ ! -d "frontend_maijjd/node_modules" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend_maijjd
        npm install
        cd ..
    fi
    
    # Install backend dependencies
    if [ ! -d "backend_maijjd/node_modules" ]; then
        print_status "Installing backend dependencies..."
        cd backend_maijjd
        npm install
        cd ..
    fi
    
    print_success "Dependencies installed successfully"
    
    # Create environment files
    print_status "Creating environment files..."
    
    if [ ! -f "backend_maijjd/.env" ]; then
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
    
    if [ ! -f "frontend_maijjd/.env" ]; then
        cat > frontend_maijjd/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
EOF
        print_success "Frontend .env file created"
    fi
    
    echo ""
    print_success "Local development environment is ready!"
    echo ""
    print_status "Next steps:"
    echo "   1. Install MongoDB: brew install mongodb-community"
    echo "   2. Install Redis: brew install redis"
    echo "   3. Start services: ./local-dev.sh"
    echo ""
    print_status "Or run the local development script now:"
    read -p "Start local development now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./local-dev.sh
    fi
}

# Function to setup Docker deployment
setup_docker() {
    print_header "🐳 Setting up Docker Deployment"
    echo ""
    
    if ! check_docker; then
        print_error "Docker setup incomplete. Please install and start Docker first."
        return 1
    fi
    
    print_success "Docker is ready for deployment"
    echo ""
    print_status "Starting Docker deployment..."
    
    if [ -f "quick-deploy.sh" ]; then
        ./quick-deploy.sh --dev
    else
        print_error "Quick deploy script not found"
        return 1
    fi
}

# Function to setup cloud deployment
setup_cloud() {
    print_header "☁️  Setting up Cloud Deployment"
    echo ""
    
    if ! check_prerequisites; then
        print_error "Prerequisites not met. Please install required software first."
        return 1
    fi
    
    print_status "Cloud deployment requires:"
    echo "   1. GitHub repository with your code"
    echo "   2. Vercel account (free)"
    echo "   3. Railway account (free)"
    echo "   4. MongoDB Atlas account (free)"
    echo "   5. Redis Cloud account (free)"
    echo ""
    
    print_status "Would you like to:"
    echo "   1. View detailed cloud deployment guide"
    echo "   2. Get started with cloud deployment steps"
    echo "   3. Return to main menu"
    echo ""
    
    read -p "Choose option (1-3): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            if [ -f "CLOUD_DEPLOYMENT_GUIDE.md" ]; then
                print_status "Opening cloud deployment guide..."
                if command -v open &> /dev/null; then
                    open CLOUD_DEPLOYMENT_GUIDE.md
                else
                    print_status "Guide available at: CLOUD_DEPLOYMENT_GUIDE.md"
                fi
            else
                print_error "Cloud deployment guide not found"
            fi
            ;;
        2)
            print_status "Starting cloud deployment setup..."
            print_status "Step 1: Ensure your project is in a GitHub repository"
            print_status "Step 2: Visit vercel.com and sign up with GitHub"
            print_status "Step 3: Visit railway.app and sign up with GitHub"
            print_status "Step 4: Follow the detailed guide in CLOUD_DEPLOYMENT_GUIDE.md"
            echo ""
            print_success "Cloud deployment setup initiated!"
            ;;
        3)
            return 0
            ;;
        *)
            print_error "Invalid option"
            return 1
            ;;
    esac
}

# Function to setup custom domain
setup_custom_domain() {
    print_header "🌐 Setting up Custom Domain"
    echo ""
    
    print_status "Custom domain setup requires:"
    echo "   1. Purchased domain name"
    echo "   2. Cloud deployment already configured"
    echo "   3. DNS access to your domain"
    echo ""
    
    print_status "Would you like to:"
    echo "   1. View detailed custom domain guide"
    echo "   2. Get started with domain setup"
    echo "   3. Return to main menu"
    echo ""
    
    read -p "Choose option (1-3): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            if [ -f "CUSTOM_DOMAIN_SETUP.md" ]; then
                print_status "Opening custom domain setup guide..."
                if command -v open &> /dev/null; then
                    open CUSTOM_DOMAIN_SETUP.md
                else
                    print_status "Guide available at: CUSTOM_DOMAIN_SETUP.md"
                fi
            else
                print_error "Custom domain setup guide not found"
            fi
            ;;
        2)
            print_status "Starting custom domain setup..."
            print_status "Step 1: Purchase a domain (recommended: maijjd.com)"
            print_status "Step 2: Configure DNS records"
            print_status "Step 3: Set up SSL certificates"
            print_status "Step 4: Update application configuration"
            echo ""
            print_success "Custom domain setup initiated!"
            ;;
        3)
            return 0
            ;;
        *)
            print_error "Invalid option"
            return 1
            ;;
    esac
}

# Function to show documentation
show_documentation() {
    print_header "📚 Documentation and Resources"
    echo ""
    
    print_status "Available guides:"
    echo ""
    
    if [ -f "QUICK_DEPLOY_README.md" ]; then
        echo "   📖 Quick Deploy Guide: QUICK_DEPLOY_README.md"
    fi
    
    if [ -f "CLOUD_DEPLOYMENT_GUIDE.md" ]; then
        echo "   ☁️  Cloud Deployment: CLOUD_DEPLOYMENT_GUIDE.md"
    fi
    
    if [ -f "CUSTOM_DOMAIN_SETUP.md" ]; then
        echo "   🌐 Custom Domain Setup: CUSTOM_DOMAIN_SETUP.md"
    fi
    
    if [ -f "README.md" ]; then
        echo "   📋 Main Project README: README.md"
    fi
    
    echo ""
    print_status "Would you like to open any of these guides?"
    echo "   1. Quick Deploy Guide"
    echo "   2. Cloud Deployment Guide"
    echo "   3. Custom Domain Setup Guide"
    echo "   4. Main README"
    echo "   5. Return to main menu"
    echo ""
    
    read -p "Choose option (1-5): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            if [ -f "QUICK_DEPLOY_README.md" ]; then
                if command -v open &> /dev/null; then
                    open QUICK_DEPLOY_README.md
                else
                    print_status "Guide available at: QUICK_DEPLOY_README.md"
                fi
            fi
            ;;
        2)
            if [ -f "CLOUD_DEPLOYMENT_GUIDE.md" ]; then
                if command -v open &> /dev/null; then
                    open CLOUD_DEPLOYMENT_GUIDE.md
                else
                    print_status "Guide available at: CLOUD_DEPLOYMENT_GUIDE.md"
                fi
            fi
            ;;
        3)
            if [ -f "CUSTOM_DOMAIN_SETUP.md" ]; then
                if command -v open &> /dev/null; then
                    open CUSTOM_DOMAIN_SETUP.md
                else
                    print_status "Guide available at: CUSTOM_DOMAIN_SETUP.md"
                fi
            fi
            ;;
        4)
            if [ -f "README.md" ]; then
                if command -v open &> /dev/null; then
                    open README.md
                else
                    print_status "Guide available at: README.md"
                fi
            fi
            ;;
        5)
            return 0
            ;;
        *)
            print_error "Invalid option"
            return 1
            ;;
    esac
}

# Main menu loop
while true; do
    show_menu
    
    read -p "Enter your choice (1-6): " -n 1 -r
    echo
    echo
    
    case $REPLY in
        1)
            setup_local_dev
            ;;
        2)
            setup_docker
            ;;
        3)
            setup_cloud
            ;;
        4)
            setup_custom_domain
            ;;
        5)
            show_documentation
            ;;
        6)
            print_success "Thank you for using Maijjd Master Deployment Script!"
            print_status "Happy coding! 🚀"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-6."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue to main menu..."
    echo ""
done
