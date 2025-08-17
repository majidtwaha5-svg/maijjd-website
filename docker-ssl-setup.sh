#!/bin/bash

# =============================================================================
# Docker SSL Configuration Script for Maijjd Project
# =============================================================================
# This script sets up SSL/HTTPS for the Maijjd project running in Docker
# Features:
# - Self-signed certificate generation
# - Let's Encrypt certificate support
# - Docker container management
# - SSL configuration updates
# - Health checks and monitoring
# =============================================================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
PROJECT_NAME="maijjd"
DOMAIN_NAME="${DOMAIN_NAME:-localhost}"
EMAIL="${EMAIL:-admin@maijjd.com}"
SSL_DIR="./ssl"
NGINX_CONF="./nginx.conf"
DOCKER_COMPOSE_FILE="./docker-compose.yml"
CERT_VALIDITY_DAYS=365
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-admin@maijjd.com}"

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

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Function to create SSL directory
create_ssl_directory() {
    if [ ! -d "$SSL_DIR" ]; then
        mkdir -p "$SSL_DIR"
        print_success "Created SSL directory: $SSL_DIR"
    else
        print_status "SSL directory already exists: $SSL_DIR"
    fi
}

# Function to generate self-signed certificate
generate_self_signed_cert() {
    print_status "Generating self-signed SSL certificate..."
    
    # Generate private key
    openssl genrsa -out "$SSL_DIR/key.pem" 2048
    
    # Generate certificate signing request
    openssl req -new -key "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.csr" -subj "/C=US/ST=State/L=City/O=Maijjd/OU=IT/CN=$DOMAIN_NAME"
    
    # Generate self-signed certificate
    openssl x509 -req -in "$SSL_DIR/cert.csr" -signkey "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.pem" -days $CERT_VALIDITY_DAYS
    
    # Set proper permissions
    chmod 600 "$SSL_DIR/key.pem"
    chmod 644 "$SSL_DIR/cert.pem"
    
    # Clean up CSR
    rm "$SSL_DIR/cert.csr"
    
    print_success "Self-signed certificate generated successfully"
    print_status "Certificate valid for $CERT_VALIDITY_DAYS days"
}

# Function to setup Let's Encrypt certificate
setup_letsencrypt() {
    print_status "Setting up Let's Encrypt certificate..."
    
    # Check if domain is not localhost
    if [ "$DOMAIN_NAME" = "localhost" ]; then
        print_warning "Cannot use Let's Encrypt with localhost. Using self-signed certificate instead."
        generate_self_signed_cert
        return
    fi
    
    # Create Let's Encrypt configuration
    cat > "$SSL_DIR/letsencrypt.conf" << EOF
email = $LETSENCRYPT_EMAIL
domains = $DOMAIN_NAME
rsa-key-size = 2048
text = true
EOF
    
    # Run certbot in Docker to obtain certificate
    docker run --rm \
        -v "$(pwd)/$SSL_DIR:/etc/letsencrypt" \
        -v "$(pwd)/$SSL_DIR:/var/lib/letsencrypt" \
        certbot/certbot certonly \
        --standalone \
        --config /etc/letsencrypt/letsencrypt.conf \
        --agree-tos \
        --non-interactive
    
    # Copy certificates to expected locations
    cp "$SSL_DIR/live/$DOMAIN_NAME/fullchain.pem" "$SSL_DIR/cert.pem"
    cp "$SSL_DIR/live/$DOMAIN_NAME/privkey.pem" "$SSL_DIR/key.pem"
    
    # Set proper permissions
    chmod 600 "$SSL_DIR/key.pem"
    chmod 644 "$SSL_DIR/cert.pem"
    
    print_success "Let's Encrypt certificate obtained successfully"
}

# Function to create SSL-enabled Docker Compose override
create_ssl_docker_compose() {
    print_status "Creating SSL-enabled Docker Compose configuration..."
    
    cat > "docker-compose.ssl.yml" << EOF
version: '3.8'

services:
  # Nginx with SSL
  nginx-ssl:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
      - ./ssl/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    networks:
      - maijjd-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'
    command: >
      sh -c "nginx -g 'daemon off;'"

  # Certbot for Let's Encrypt renewal
  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl/letsencrypt:/etc/letsencrypt
      - ./ssl:/var/lib/letsencrypt
    command: renew --quiet
    depends_on:
      - nginx-ssl
    restart: unless-stopped

networks:
  maijjd-network:
    external: true
EOF
    
    print_success "SSL Docker Compose configuration created"
}

# Function to create SSL-enabled Nginx configuration
create_ssl_nginx_conf() {
    print_status "Creating SSL-enabled Nginx configuration..."
    
    cat > "nginx-ssl.conf" << EOF
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for" '
                    'rt=\$request_time uct="\$upstream_connect_time" '
                    'uht="\$upstream_header_time" urt="\$upstream_response_time"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=general:10m rate=30r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream definitions
    upstream frontend {
        server frontend:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    upstream backend {
        server backend:5000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # HTTP server - redirect to HTTPS
    server {
        listen 80;
        server_name $DOMAIN_NAME;
        
        # ACME challenge for Let's Encrypt
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        # Redirect all HTTP traffic to HTTPS
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name $DOMAIN_NAME;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        
        # Modern SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-CHACHA20-POLY1305;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;
        
        # OCSP Stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        resolver 8.8.8.8 8.8.4.4 valid=300s;
        resolver_timeout 5s;
        
        # HSTS (uncomment if you're sure)
        # add_header Strict-Transport-Security "max-age=63072000" always;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" always;
        add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

        # Remove server tokens
        server_tokens off;

        # Frontend routes
        location / {
            limit_req zone=general burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # Buffering
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }

        # API routes with enhanced rate limiting
        location /api/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # Buffering
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }

        # Login endpoint with stricter rate limiting
        location /api/auth/login {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # Metrics endpoint for Prometheus
        location /metrics {
            access_log off;
            proxy_pass http://backend;
            proxy_set_header Host \$host;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary Accept-Encoding;
        }

        # Security: Block access to sensitive files
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }

        location ~ ~$ {
            deny all;
            access_log off;
            log_not_found off;
        }

        # Error pages
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
EOF
    
    print_success "SSL-enabled Nginx configuration created"
}

# Function to start SSL-enabled services
start_ssl_services() {
    print_status "Starting SSL-enabled services..."
    
    # Stop existing services if running
    if docker-compose ps | grep -q "Up"; then
        print_status "Stopping existing services..."
        docker-compose down
    fi
    
    # Start SSL-enabled services
    docker-compose -f docker-compose.ssl.yml up -d
    
    print_success "SSL-enabled services started successfully"
}

# Function to check SSL certificate
check_ssl_certificate() {
    print_status "Checking SSL certificate..."
    
    if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
        # Check certificate expiration
        if command -v openssl &> /dev/null; then
            EXPIRY=$(openssl x509 -enddate -noout -in "$SSL_DIR/cert.pem" | cut -d= -f2)
            print_success "SSL certificate found and valid until: $EXPIRY"
        else
            print_success "SSL certificate files found"
        fi
    else
        print_error "SSL certificate files not found"
        return 1
    fi
}

# Function to test SSL connection
test_ssl_connection() {
    print_status "Testing SSL connection..."
    
    # Wait for services to be ready
    sleep 10
    
    # Test HTTP to HTTPS redirect
    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN_NAME")
    if [ "$HTTP_RESPONSE" = "301" ]; then
        print_success "HTTP to HTTPS redirect working correctly"
    else
        print_warning "HTTP to HTTPS redirect not working (HTTP $HTTP_RESPONSE)"
    fi
    
    # Test HTTPS connection
    if command -v openssl &> /dev/null; then
        SSL_INFO=$(echo | openssl s_client -connect "$DOMAIN_NAME:443" -servername "$DOMAIN_NAME" 2>/dev/null | openssl x509 -noout -subject -dates)
        if [ $? -eq 0 ]; then
            print_success "HTTPS connection successful"
            echo "$SSL_INFO" | while read line; do
                print_status "$line"
            done
        else
            print_error "HTTPS connection failed"
        fi
    fi
}

# Function to create SSL renewal script
create_renewal_script() {
    print_status "Creating SSL renewal script..."
    
    cat > "renew-ssl.sh" << 'EOF'
#!/bin/bash

# SSL Certificate Renewal Script for Maijjd Project
# Run this script to renew Let's Encrypt certificates

set -e

SSL_DIR="./ssl"
DOMAIN_NAME="${DOMAIN_NAME:-localhost}"

if [ "$DOMAIN_NAME" = "localhost" ]; then
    echo "Cannot renew certificates for localhost. Using self-signed certificates."
    exit 0
fi

echo "Renewing SSL certificates..."

# Stop nginx temporarily
docker-compose -f docker-compose.ssl.yml stop nginx-ssl

# Renew certificates
docker run --rm \
    -v "$(pwd)/$SSL_DIR/letsencrypt:/etc/letsencrypt" \
    -v "$(pwd)/$SSL_DIR:/var/lib/letsencrypt" \
    certbot/certbot renew --quiet

# Copy renewed certificates
cp "$SSL_DIR/letsencrypt/live/$DOMAIN_NAME/fullchain.pem" "$SSL_DIR/cert.pem"
cp "$SSL_DIR/letsencrypt/live/$DOMAIN_NAME/privkey.pem" "$SSL_DIR/key.pem"

# Set proper permissions
chmod 600 "$SSL_DIR/key.pem"
chmod 644 "$SSL_DIR/cert.pem"

# Restart nginx
docker-compose -f docker-compose.ssl.yml start nginx-ssl

echo "SSL certificates renewed successfully"
EOF
    
    chmod +x "renew-ssl.sh"
    print_success "SSL renewal script created: renew-ssl.sh"
}

# Function to create cron job for automatic renewal
setup_automatic_renewal() {
    print_status "Setting up automatic SSL renewal..."
    
    # Check if crontab entry already exists
    if ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
        # Add cron job to run twice daily
        (crontab -l 2>/dev/null; echo "0 2,14 * * * cd $(pwd) && ./renew-ssl.sh >> ./logs/ssl-renewal.log 2>&1") | crontab -
        print_success "Automatic SSL renewal scheduled (twice daily at 2 AM and 2 PM)"
    else
        print_status "Automatic SSL renewal already scheduled"
    fi
}

# Function to create SSL health check script
create_ssl_health_check() {
    print_status "Creating SSL health check script..."
    
    cat > "ssl-health-check.sh" << 'EOF'
#!/bin/bash

# SSL Health Check Script for Maijjd Project

SSL_DIR="./ssl"
DOMAIN_NAME="${DOMAIN_NAME:-localhost}"
LOG_FILE="./logs/ssl-health.log"

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Check if certificate files exist
if [ ! -f "$SSL_DIR/cert.pem" ] || [ ! -f "$SSL_DIR/key.pem" ]; then
    log_message "ERROR: SSL certificate files not found"
    exit 1
fi

# Check certificate expiration
if command -v openssl &> /dev/null; then
    EXPIRY=$(openssl x509 -enddate -noout -in "$SSL_DIR/cert.pem" | cut -d= -f2)
    EXPIRY_DATE=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$EXPIRY" +%s 2>/dev/null)
    CURRENT_DATE=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_DATE - CURRENT_DATE) / 86400 ))
    
    if [ $DAYS_LEFT -lt 30 ]; then
        log_message "WARNING: SSL certificate expires in $DAYS_LEFT days"
    else
        log_message "INFO: SSL certificate valid for $DAYS_LEFT days"
    fi
fi

# Test HTTPS connection
if [ "$DOMAIN_NAME" != "localhost" ]; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN_NAME" --connect-timeout 10)
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN_NAME" --connect-timeout 10)
    
    if [ "$HTTP_STATUS" = "301" ]; then
        log_message "INFO: HTTP to HTTPS redirect working"
    else
        log_message "WARNING: HTTP to HTTPS redirect not working (HTTP $HTTP_STATUS)"
    fi
    
    if [ "$HTTPS_STATUS" = "200" ]; then
        log_message "INFO: HTTPS connection working"
    else
        log_message "ERROR: HTTPS connection failed (HTTPS $HTTPS_STATUS)"
    fi
fi

log_message "SSL health check completed"
EOF
    
    chmod +x "ssl-health-check.sh"
    print_success "SSL health check script created: ssl-health-check.sh"
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -d, --domain DOMAIN     Set domain name (default: localhost)"
    echo "  -e, --email EMAIL       Set email for Let's Encrypt (default: admin@maijjd.com)"
    echo "  -s, --self-signed       Generate self-signed certificate only"
    echo "  -l, --letsencrypt       Setup Let's Encrypt certificate"
    echo "  -a, --auto-renew        Setup automatic certificate renewal"
    echo "  -t, --test              Test SSL connection after setup"
    echo "  -c, --check             Check SSL certificate status"
    echo "  --start                 Start SSL-enabled services"
    echo "  --stop                  Stop SSL-enabled services"
    echo ""
    echo "Examples:"
    echo "  $0 --domain example.com --letsencrypt --auto-renew"
    echo "  $0 --self-signed --test"
    echo "  $0 --check"
}

# Main script logic
main() {
    print_status "Starting Docker SSL setup for Maijjd project..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -d|--domain)
                DOMAIN_NAME="$2"
                shift 2
                ;;
            -e|--email)
                EMAIL="$2"
                LETSENCRYPT_EMAIL="$2"
                shift 2
                ;;
            -s|--self-signed)
                USE_SELF_SIGNED=true
                shift
                ;;
            -l|--letsencrypt)
                USE_LETSENCRYPT=true
                shift
                ;;
            -a|--auto-renew)
                SETUP_AUTO_RENEWAL=true
                shift
                ;;
            -t|--test)
                TEST_SSL=true
                shift
                ;;
            -c|--check)
                CHECK_SSL=true
                shift
                ;;
            --start)
                START_SERVICES=true
                shift
                ;;
            --stop)
                STOP_SERVICES=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Create SSL directory
    create_ssl_directory
    
    # Handle different modes
    if [ "$CHECK_SSL" = true ]; then
        check_ssl_certificate
        exit 0
    fi
    
    if [ "$STOP_SERVICES" = true ]; then
        print_status "Stopping SSL services..."
        docker-compose -f docker-compose.ssl.yml down 2>/dev/null || true
        print_success "SSL services stopped"
        exit 0
    fi
    
    # Generate certificates
    if [ "$USE_SELF_SIGNED" = true ]; then
        generate_self_signed_cert
    elif [ "$USE_LETSENCRYPT" = true ]; then
        setup_letsencrypt
    else
        # Default to self-signed for localhost
        if [ "$DOMAIN_NAME" = "localhost" ]; then
            generate_self_signed_cert
        else
            print_status "No certificate type specified. Using Let's Encrypt for domain: $DOMAIN_NAME"
            setup_letsencrypt
        fi
    fi
    
    # Create SSL configurations
    create_ssl_nginx_conf
    create_ssl_docker_compose
    
    # Create utility scripts
    create_renewal_script
    create_ssl_health_check
    
    # Setup automatic renewal if requested
    if [ "$SETUP_AUTO_RENEWAL" = true ]; then
        setup_automatic_renewal
    fi
    
    # Start services if requested
    if [ "$START_SERVICES" = true ]; then
        start_ssl_services
    fi
    
    # Test SSL if requested
    if [ "$TEST_SSL" = true ]; then
        if [ "$START_SERVICES" != true ]; then
            start_ssl_services
        fi
        test_ssl_connection
    fi
    
    print_success "Docker SSL setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start SSL services: $0 --start"
    echo "2. Test SSL connection: $0 --test"
    echo "3. Check SSL status: $0 --check"
    echo "4. Setup auto-renewal: $0 --auto-renew"
    echo ""
    echo "Files created:"
    echo "- nginx-ssl.conf (SSL-enabled Nginx configuration)"
    echo "- docker-compose.ssl.yml (SSL Docker Compose configuration)"
    echo "- renew-ssl.sh (Certificate renewal script)"
    echo "- ssl-health-check.sh (SSL health monitoring script)"
}

# Run main function with all arguments
main "$@"
