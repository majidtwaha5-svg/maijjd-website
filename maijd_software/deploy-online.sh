#!/bin/bash

# 🌐 Maijd Dashboard - One-Click Online Deployment
# This script deploys your dashboard to the cloud in minutes!

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 Maijd Dashboard                      ║"
echo "║                   One-Click Deployment                     ║"
echo "║                                                              ║"
echo "║              Work From Anywhere - 24/7 Access              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "static/quick-access-dashboard.html" ]; then
    echo -e "${RED}❌ Error: Please run this script from the maijd_software directory${NC}"
    echo "Current directory: $(pwd)"
    echo "Expected files: static/quick-access-dashboard.html"
    exit 1
fi

echo -e "${GREEN}✅ Found dashboard files${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js
install_node() {
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node
    else
        echo -e "${RED}❌ Please install Node.js manually from https://nodejs.org/${NC}"
        exit 1
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    
    if ! command_exists vercel; then
        echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${GREEN}✅ Vercel CLI ready${NC}"
    
    # Create vercel.json if it doesn't exist
    if [ ! -f "vercel.json" ]; then
        cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "static/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/static/quick-access-dashboard.html"
    },
    {
      "src": "/(.*)",
      "dest": "/static/\$1"
    }
  ]
}
EOF
        echo -e "${GREEN}✅ Created vercel.json configuration${NC}"
    fi
    
    echo -e "${YELLOW}🌐 Deploying... This may take a few minutes...${NC}"
    vercel --prod --yes
    
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${BLUE}Your dashboard is now available online!${NC}"
}

# Function to deploy to Netlify
deploy_netlify() {
    echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
    
    if ! command_exists netlify; then
        echo -e "${YELLOW}📦 Installing Netlify CLI...${NC}"
        npm install -g netlify-cli
    fi
    
    echo -e "${GREEN}✅ Netlify CLI ready${NC}"
    
    echo -e "${YELLOW}🌐 Deploying... This may take a few minutes...${NC}"
    netlify deploy --prod --dir=static --yes
    
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${BLUE}Your dashboard is now available online!${NC}"
}

# Function to deploy to GitHub Pages
deploy_github() {
    echo -e "${BLUE}🚀 Deploying to GitHub Pages...${NC}"
    
    if ! command_exists git; then
        echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
        exit 1
    fi
    
    # Check if this is a git repository
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}📦 Initializing Git repository...${NC}"
        git init
        git add .
        git commit -m "Initial commit - Maijd Dashboard"
    fi
    
    echo -e "${YELLOW}📝 Please create a new repository on GitHub and follow the instructions below:${NC}"
    echo ""
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository named 'maijd-dashboard'"
    echo "3. Copy the repository URL"
    echo "4. Run these commands:"
    echo ""
    echo "   git remote add origin YOUR_REPOSITORY_URL"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "5. Go to repository Settings > Pages"
    echo "6. Set source to 'Deploy from a branch'"
    echo "7. Select 'main' branch and '/ (root)' folder"
    echo "8. Click Save"
    echo ""
    echo -e "${GREEN}Your dashboard will be available at: https://YOUR_USERNAME.github.io/maijd-dashboard/${NC}"
}

# Function to deploy with Docker
deploy_docker() {
    echo -e "${BLUE}🐳 Deploying with Docker...${NC}"
    
    if ! command_exists docker; then
        echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
        exit 1
    fi
    
    # Create docker-compose.yml if it doesn't exist
    if [ ! -f "docker-compose.yml" ]; then
        cat > docker-compose.yml << EOF
version: '3.8'
services:
  maijd-dashboard:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./static:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    restart: unless-stopped
EOF
        echo -e "${GREEN}✅ Created docker-compose.yml${NC}"
    fi
    
    # Create nginx.conf if it doesn't exist
    if [ ! -f "nginx.conf" ]; then
        cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index quick-access-dashboard.html;
        
        location / {
            try_files \$uri \$uri/ /quick-access-dashboard.html;
        }
        
        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    }
}
EOF
        echo -e "${GREEN}✅ Created nginx.conf${NC}"
    fi
    
    echo -e "${YELLOW}🐳 Starting Docker container...${NC}"
    docker-compose up -d
    
    echo -e "${GREEN}🎉 Docker deployment successful!${NC}"
    echo -e "${BLUE}Your dashboard is now available at: http://localhost${NC}"
    echo -e "${YELLOW}To make it accessible from other devices, use your server's IP address${NC}"
}

# Function to show deployment options
show_options() {
    echo -e "${BLUE}🌐 Choose your deployment method:${NC}"
    echo ""
    echo "1) 🚀 Vercel (Recommended - Fastest, Free)"
    echo "2) 🌐 Netlify (Great for static sites, Free)"
    echo "3) 📚 GitHub Pages (Free hosting)"
    echo "4) 🐳 Docker (Self-hosted)"
    echo "5) 📋 Show all options"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_github
            ;;
        4)
            deploy_docker
            ;;
        5)
            show_all_options
            ;;
        *)
            echo -e "${RED}❌ Invalid choice. Please try again.${NC}"
            show_options
            ;;
    esac
}

# Function to show all deployment options
show_all_options() {
    echo -e "${BLUE}🌐 All Deployment Options:${NC}"
    echo ""
    echo "🚀 Vercel (Recommended)"
    echo "   - Fastest deployment (2-3 minutes)"
    echo "   - Free tier available"
    echo "   - Automatic HTTPS"
    echo "   - Global CDN"
    echo ""
    echo "🌐 Netlify"
    echo "   - Great for static sites"
    echo "   - Free tier available"
    echo "   - Form handling"
    echo "   - Git integration"
    echo ""
    echo "📚 GitHub Pages"
    echo "   - Free hosting"
    echo "   - Git integration"
    echo "   - Custom domains"
    echo "   - SSL certificates"
    echo ""
    echo "🐳 Docker"
    echo "   - Self-hosted"
    echo "   - Full control"
    echo "   - Customizable"
    echo "   - Production ready"
    echo ""
    echo "☁️ Cloud Providers"
    echo "   - AWS S3 + CloudFront"
    echo "   - Google Cloud Storage"
    echo "   - Azure Blob Storage"
    echo "   - DigitalOcean Spaces"
    echo ""
    
    show_options
}

# Main execution
main() {
    echo -e "${GREEN}🚀 Welcome to Maijd Dashboard Deployment!${NC}"
    echo ""
    echo "This script will help you deploy your dashboard online so you can:"
    echo "✅ Work from anywhere in the world"
    echo "✅ Access all features with single clicks"
    echo "✅ Stay connected 24/7"
    echo "✅ Collaborate remotely"
    echo ""
    
    # Check if Node.js is installed
    if ! command_exists node; then
        echo -e "${YELLOW}📦 Node.js not found. Installing...${NC}"
        install_node
    fi
    
    echo -e "${GREEN}✅ Node.js ready${NC}"
    
    # Show deployment options
    show_options
    
    echo ""
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test your dashboard on different devices"
    echo "2. Set up monitoring and analytics"
    echo "3. Configure authentication if needed"
    echo "4. Share the URL with your team"
    echo ""
    echo -e "${BLUE}Happy remote working! 🌍${NC}"
}

# Run main function
main "$@"
