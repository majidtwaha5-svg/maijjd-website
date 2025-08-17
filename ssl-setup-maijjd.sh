#!/bin/bash

# 🔒 Maijjd SSL Setup Script
# This script sets up SSL/HTTPS for your Maijjd application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="maijjd.com"
EMAIL="admin@maijjd.com"
FRONTEND_PORT=3000
BACKEND_PORT=5001
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to stop services
stop_services() {
    print_status "Stopping existing services..."
    
    # Stop backend if running
    if check_port $BACKEND_PORT; then
        print_status "Stopping backend service on port $BACKEND_PORT..."
        pkill -f "node.*server.js" || true
        sleep 2
    fi
    
    # Stop frontend if running
    if check_port $FRONTEND_PORT; then
        print_status "Stopping frontend service on port $FRONTEND_PORT..."
        pkill -f "react-scripts" || true
        sleep 2
    fi
    
    # Stop nginx if running
    if command_exists nginx; then
        print_status "Stopping nginx..."
        sudo systemctl stop nginx 2>/dev/null || true
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing SSL dependencies..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux (Ubuntu/Debian)
        if command_exists apt-get; then
            sudo apt-get update
            sudo apt-get install -y certbot nginx python3-certbot-nginx
        elif command_exists yum; then
            sudo yum install -y certbot nginx python3-certbot
        else
            print_error "Unsupported package manager. Please install certbot and nginx manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install certbot nginx
        else
            print_error "Homebrew not found. Please install certbot and nginx manually."
            exit 1
        fi
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Function to create SSL directories
create_ssl_directories() {
    print_status "Creating SSL directories..."
    
    sudo mkdir -p /etc/nginx/ssl
    sudo mkdir -p /etc/nginx/sites-available
    sudo mkdir -p /etc/nginx/sites-enabled
    sudo mkdir -p /var/www/html/.well-known/acme-challenge
    
    # Set proper permissions
    sudo chown -R root:root /etc/nginx/ssl
    sudo chmod -R 755 /etc/nginx/ssl
    sudo chown -R www-data:www-data /var/www/html/.well-known 2>/dev/null || true
}

# Function to generate DH parameters
generate_dh_params() {
    print_status "Generating DH parameters (this may take a while)..."
    
    if [[ ! -f /etc/nginx/dhparam.pem ]]; then
        sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
        print_success "DH parameters generated"
    else
        print_status "DH parameters already exist"
    fi
}

# Function to create initial nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."
    
    # Create main nginx config
    sudo tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Include site configurations
    include /etc/nginx/sites-enabled/*;
}
EOF

    # Create Maijjd site configuration
    sudo tee /etc/nginx/sites-available/maijjd > /dev/null << EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all HTTP traffic to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_dhparam /etc/nginx/dhparam.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Frontend (React app)
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        
        # WebSocket support for development
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/maijjd /etc/nginx/sites-enabled/
    
    # Remove default site if it exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    print_success "Nginx configuration created"
}

# Function to obtain SSL certificate
obtain_ssl_certificate() {
    print_status "Obtaining SSL certificate from Let's Encrypt..."
    
    # Start nginx temporarily for ACME challenge
    sudo systemctl start nginx
    
    # Wait for nginx to start
    sleep 3
    
    # Check if nginx is running
    if ! sudo systemctl is-active --quiet nginx; then
        print_error "Failed to start nginx"
        exit 1
    fi
    
    # Obtain certificate
    if sudo certbot certonly --webroot \
        --webroot-path=/var/www/html \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --domains $DOMAIN,www.$DOMAIN; then
        
        print_success "SSL certificate obtained successfully"
    else
        print_error "Failed to obtain SSL certificate"
        print_status "Trying standalone method..."
        
        # Stop nginx for standalone method
        sudo systemctl stop nginx
        
        if sudo certbot certonly --standalone \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            --domains $DOMAIN,www.$DOMAIN; then
            
            print_success "SSL certificate obtained successfully using standalone method"
        else
            print_error "Failed to obtain SSL certificate using both methods"
            exit 1
        fi
    fi
}

# Function to configure auto-renewal
configure_auto_renewal() {
    print_status "Configuring SSL certificate auto-renewal..."
    
    # Create renewal script
    sudo tee /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh > /dev/null << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF
    
    sudo chmod +x /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
    
    # Test renewal
    print_status "Testing certificate renewal..."
    if sudo certbot renew --dry-run; then
        print_success "Auto-renewal configured successfully"
    else
        print_warning "Auto-renewal test failed, but continuing..."
    fi
    
    # Add to crontab if not already present
    if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
        print_success "Added renewal cron job"
    fi
}

# Function to start services
start_services() {
    print_status "Starting services..."
    
    # Start backend
    print_status "Starting backend service..."
    cd "$PROJECT_ROOT/backend_maijjd"
    npm start &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    print_status "Starting frontend service..."
    cd "$PROJECT_ROOT/frontend_maijjd"
    npm start &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 10
    
    # Start nginx
    print_status "Starting nginx..."
    sudo systemctl start nginx
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > /tmp/maijjd_backend.pid
    echo $FRONTEND_PID > /tmp/maijjd_frontend.pid
    
    print_success "All services started"
}

# Function to test SSL configuration
test_ssl_configuration() {
    print_status "Testing SSL configuration..."
    
    # Test nginx configuration
    if sudo nginx -t; then
        print_success "Nginx configuration is valid"
    else
        print_error "Nginx configuration has errors"
        exit 1
    fi
    
    # Test SSL connection
    if command_exists openssl; then
        print_status "Testing SSL connection..."
        if echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>&1 | grep -q "Verify return code: 0"; then
            print_success "SSL connection successful"
        else
            print_warning "SSL connection test failed (this is normal if DNS is not configured yet)"
        fi
    fi
    
    # Test HTTP to HTTPS redirect
    print_status "Testing HTTP to HTTPS redirect..."
    if curl -s -I "http://$DOMAIN" | grep -q "301\|302"; then
        print_success "HTTP to HTTPS redirect working"
    else
        print_warning "HTTP to HTTPS redirect test failed"
    fi
}

# Function to display final information
display_final_info() {
    echo
    print_success "🎉 SSL setup completed successfully!"
    echo
    echo "📋 Next steps:"
    echo "1. Configure your DNS to point $DOMAIN to this server's IP address"
    echo "2. Wait for DNS propagation (can take up to 24 hours)"
    echo "3. Test your site: https://$DOMAIN"
    echo "4. Test your API: https://$DOMAIN/api/health"
    echo
    echo "🔧 SSL certificate will auto-renew every 60 days"
    echo "📊 Monitor SSL health: sudo ./ssl-health-check.sh"
    echo "🔄 Restart services: sudo ./ssl-restart-services.sh"
    echo
    echo "📁 SSL files location: /etc/letsencrypt/live/$DOMAIN/"
    echo "⚙️  Nginx config: /etc/nginx/sites-available/maijjd"
    echo
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up..."
    
    # Kill background processes
    if [[ -f /tmp/maijjd_backend.pid ]]; then
        kill $(cat /tmp/maijjd_backend.pid) 2>/dev/null || true
        rm -f /tmp/maijjd_backend.pid
    fi
    
    if [[ -f /tmp/maijjd_frontend.pid ]]; then
        kill $(cat /tmp/maijjd_frontend.pid) 2>/dev/null || true
        rm -f /tmp/maijjd_frontend.pid
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main execution
main() {
    echo "🔒 Maijjd SSL Setup Script"
    echo "=========================="
    echo
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
    
    # Check if domain is provided
    if [[ -z "$DOMAIN" ]]; then
        print_error "Please set the DOMAIN variable"
        exit 1
    fi
    
    # Check if email is provided
    if [[ -z "$EMAIL" ]]; then
        print_error "Please set the EMAIL variable"
        exit 1
    fi
    
    print_status "Starting SSL setup for domain: $DOMAIN"
    print_status "Email: $EMAIL"
    print_status "Project root: $PROJECT_ROOT"
    echo
    
    # Confirm before proceeding
    read -p "Do you want to continue with SSL setup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "SSL setup cancelled"
        exit 0
    fi
    
    # Execute setup steps
    stop_services
    install_dependencies
    create_ssl_directories
    generate_dh_params
    create_nginx_config
    obtain_ssl_certificate
    configure_auto_renewal
    start_services
    test_ssl_configuration
    display_final_info
}

# Run main function
main "$@"
