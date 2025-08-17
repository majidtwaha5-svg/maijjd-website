#!/bin/bash

# 🔒 Maijjd SSL Services Restart Script
# Safely restarts SSL-related services and reloads configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="maijjd.com"
FRONTEND_PORT=3000
BACKEND_PORT=5001
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/maijjd-ssl-restart.log"

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

# Function to log messages
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
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

# Function to check if service is running
check_service() {
    local service_name=$1
    if systemctl is-active --quiet $service_name 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to backup current configuration
backup_configuration() {
    print_status "Creating backup of current configuration..."
    
    local backup_dir="/tmp/maijjd-ssl-backup-$(date +%Y%m%d-%H%M%S)"
    sudo mkdir -p "$backup_dir"
    
    # Backup nginx configuration
    if [[ -d /etc/nginx ]]; then
        sudo cp -r /etc/nginx "$backup_dir/"
        print_success "Nginx configuration backed up to: $backup_dir/nginx"
    fi
    
    # Backup SSL certificates (read-only copy)
    if [[ -d /etc/letsencrypt ]]; then
        sudo cp -r /etc/letsencrypt "$backup_dir/"
        print_success "SSL certificates backed up to: $backup_dir/letsencrypt"
    fi
    
    # Backup project configuration
    if [[ -f "$PROJECT_ROOT/backend_maijjd/.env" ]]; then
        cp "$PROJECT_ROOT/backend_maijjd/.env" "$backup_dir/backend.env"
        print_success "Backend environment backed up"
    fi
    
    if [[ -f "$PROJECT_ROOT/frontend_maijjd/.env" ]]; then
        cp "$PROJECT_ROOT/frontend_maijjd/.env" "$backup_dir/frontend.env"
        print_success "Frontend environment backed up"
    fi
    
    log_message "INFO" "Configuration backup created at: $backup_dir"
    echo "Backup location: $backup_dir"
}

# Function to stop services gracefully
stop_services() {
    print_status "Stopping services gracefully..."
    
    # Stop backend if running
    if check_port $BACKEND_PORT; then
        print_status "Stopping backend service on port $BACKEND_PORT..."
        local backend_pid=$(lsof -ti:$BACKEND_PORT)
        if [[ -n "$backend_pid" ]]; then
            kill -TERM "$backend_pid"
            sleep 3
            if kill -0 "$backend_pid" 2>/dev/null; then
                print_warning "Backend not responding to SIGTERM, forcing shutdown..."
                kill -KILL "$backend_pid"
            fi
        fi
        print_success "Backend service stopped"
    fi
    
    # Stop frontend if running
    if check_port $FRONTEND_PORT; then
        print_status "Stopping frontend service on port $FRONTEND_PORT..."
        local frontend_pid=$(lsof -ti:$FRONTEND_PORT)
        if [[ -n "$frontend_pid" ]]; then
            kill -TERM "$frontend_pid"
            sleep 3
            if kill -0 "$frontend_pid" 2>/dev/null; then
                print_warning "Frontend not responding to SIGTERM, forcing shutdown..."
                kill -KILL "$frontend_pid"
            fi
        fi
        print_success "Frontend service stopped"
    fi
    
    # Stop nginx if running
    if check_service nginx; then
        print_status "Stopping nginx service..."
        sudo systemctl stop nginx
        print_success "Nginx service stopped"
    fi
    
    log_message "INFO" "All services stopped"
}

# Function to reload SSL certificates
reload_ssl_certificates() {
    print_status "Reloading SSL certificates..."
    
    # Check if certificates need renewal
    if command -v certbot >/dev/null 2>&1; then
        print_status "Checking certificate renewal status..."
        if sudo certbot renew --dry-run >/dev/null 2>&1; then
            print_status "Certificates are up to date"
        else
            print_warning "Certificate renewal check failed"
        fi
    fi
    
    # Verify certificate files exist
    local cert_path="/etc/letsencrypt/live/$DOMAIN"
    if [[ ! -f "$cert_path/fullchain.pem" ]] || [[ ! -f "$cert_path/privkey.pem" ]]; then
        print_error "SSL certificate files not found at: $cert_path"
        log_message "ERROR" "SSL certificate files missing"
        return 1
    fi
    
    # Check certificate expiration
    local expiry=$(openssl x509 -in "$cert_path/fullchain.pem" -noout -enddate | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$expiry" +%s 2>/dev/null)
    local current_epoch=$(date +%s)
    local days_left=$(( ($expiry_epoch - $current_epoch) / 86400 ))
    
    if [[ $days_left -le 7 ]]; then
        print_warning "SSL certificate expires in $days_left days"
        log_message "WARNING" "SSL certificate expires in $days_left days"
    else
        print_success "SSL certificate valid for $days_left days"
    fi
    
    log_message "INFO" "SSL certificates reloaded successfully"
}

# Function to restart nginx
restart_nginx() {
    print_status "Restarting nginx service..."
    
    # Test nginx configuration
    if sudo nginx -t; then
        print_success "Nginx configuration is valid"
    else
        print_error "Nginx configuration has errors"
        log_message "ERROR" "Nginx configuration validation failed"
        return 1
    fi
    
    # Start nginx
    if sudo systemctl start nginx; then
        print_success "Nginx service started"
        
        # Wait for nginx to fully start
        sleep 3
        
        # Check if nginx is running
        if check_service nginx; then
            print_success "Nginx is running and healthy"
            log_message "INFO" "Nginx restarted successfully"
        else
            print_error "Nginx failed to start properly"
            log_message "ERROR" "Nginx failed to start"
            return 1
        fi
    else
        print_error "Failed to start nginx"
        log_message "ERROR" "Failed to start nginx service"
        return 1
    fi
}

# Function to restart backend service
restart_backend() {
    print_status "Restarting backend service..."
    
    cd "$PROJECT_ROOT/backend_maijjd"
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        print_error "Backend package.json not found"
        log_message "ERROR" "Backend package.json not found"
        return 1
    fi
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Start backend service
    print_status "Starting backend service on port $BACKEND_PORT..."
    npm start &
    local backend_pid=$!
    
    # Wait for backend to start
    local attempts=0
    while [[ $attempts -lt 30 ]]; do
        if check_port $BACKEND_PORT; then
            print_success "Backend service started successfully"
            log_message "INFO" "Backend service restarted successfully"
            return 0
        fi
        sleep 1
        attempts=$((attempts + 1))
    done
    
    print_error "Backend service failed to start within 30 seconds"
    log_message "ERROR" "Backend service failed to start"
    return 1
}

# Function to restart frontend service
restart_frontend() {
    print_status "Restarting frontend service..."
    
    cd "$PROJECT_ROOT/frontend_maijjd"
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        print_error "Frontend package.json not found"
        log_message "ERROR" "Frontend package.json not found"
        return 1
    fi
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend service
    print_status "Starting frontend service on port $FRONTEND_PORT..."
    npm start &
    local frontend_pid=$!
    
    # Wait for frontend to start
    local attempts=0
    while [[ $attempts -lt 60 ]]; do
        if check_port $FRONTEND_PORT; then
            print_success "Frontend service started successfully"
            log_message "INFO" "Frontend service restarted successfully"
            return 0
        fi
        sleep 1
        attempts=$((attempts + 1))
    done
    
    print_error "Frontend service failed to start within 60 seconds"
    log_message "ERROR" "Frontend service failed to start"
    return 1
}

# Function to test services
test_services() {
    print_status "Testing services..."
    
    # Test nginx
    if check_service nginx; then
        print_success "Nginx: Running"
        
        # Test nginx configuration
        if sudo nginx -t >/dev/null 2>&1; then
            print_success "Nginx configuration: Valid"
        else
            print_error "Nginx configuration: Invalid"
            return 1
        fi
    else
        print_error "Nginx: Not running"
        return 1
    fi
    
    # Test backend
    if check_port $BACKEND_PORT; then
        print_success "Backend: Running on port $BACKEND_PORT"
        
        # Test API health endpoint
        if curl -s "http://localhost:$BACKEND_PORT/api/health" >/dev/null 2>&1; then
            print_success "Backend API: Responding"
        else
            print_warning "Backend API: Not responding"
        fi
    else
        print_error "Backend: Not running on port $BACKEND_PORT"
        return 1
    fi
    
    # Test frontend
    if check_port $FRONTEND_PORT; then
        print_success "Frontend: Running on port $FRONTEND_PORT"
        
        # Test frontend response
        if curl -s "http://localhost:$FRONTEND_PORT" >/dev/null 2>&1; then
            print_success "Frontend: Responding"
        else
            print_warning "Frontend: Not responding"
        fi
    else
        print_error "Frontend: Not running on port $FRONTEND_PORT"
        return 1
    fi
    
    log_message "INFO" "All services tested successfully"
}

# Function to show service status
show_service_status() {
    echo
    echo "🔒 Maijjd SSL Services Status"
    echo "============================="
    echo
    
    # Nginx status
    if check_service nginx; then
        echo "✅ Nginx: Running"
        echo "   Status: $(systemctl is-active nginx)"
        echo "   Port: 80, 443"
    else
        echo "❌ Nginx: Not running"
    fi
    
    # Backend status
    if check_port $BACKEND_PORT; then
        echo "✅ Backend: Running"
        echo "   Port: $BACKEND_PORT"
        echo "   Process: $(lsof -ti:$BACKEND_PORT)"
    else
        echo "❌ Backend: Not running"
    fi
    
    # Frontend status
    if check_port $FRONTEND_PORT; then
        echo "✅ Frontend: Running"
        echo "   Port: $FRONTEND_PORT"
        echo "   Process: $(lsof -ti:$FRONTEND_PORT)"
    else
        echo "❌ Frontend: Not running"
    fi
    
    # SSL certificate status
    local cert_path="/etc/letsencrypt/live/$DOMAIN"
    if [[ -f "$cert_path/fullchain.pem" ]]; then
        local expiry=$(openssl x509 -in "$cert_path/fullchain.pem" -noout -enddate | cut -d= -f2)
        echo "✅ SSL Certificate: Valid"
        echo "   Expires: $expiry"
    else
        echo "❌ SSL Certificate: Not found"
    fi
    
    echo
}

# Function to show help
show_help() {
    echo "🔒 Maijjd SSL Services Restart Script"
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo "  -a, --all        Restart all services (default)"
    echo "  -n, --nginx      Restart only nginx"
    echo "  -b, --backend    Restart only backend"
    echo "  -f, --frontend   Restart only frontend"
    echo "  -s, --status     Show service status"
    echo "  -t, --test       Test services after restart"
    echo "  -v, --verbose    Verbose output"
    echo
    echo "Examples:"
    echo "  $0                # Restart all services"
    echo "  $0 -n             # Restart only nginx"
    echo "  $0 -s             # Show service status"
    echo "  $0 -a -t          # Restart all services and test"
    echo
}

# Main execution
main() {
    # Parse command line arguments
    local restart_all=true
    local restart_nginx=false
    local restart_backend=false
    local restart_frontend=false
    local show_status=false
    local test_after_restart=false
    local verbose=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -a|--all)
                restart_all=true
                shift
                ;;
            -n|--nginx)
                restart_all=false
                restart_nginx=true
                shift
                ;;
            -b|--backend)
                restart_all=false
                restart_backend=true
                shift
                ;;
            -f|--frontend)
                restart_all=false
                restart_frontend=true
                shift
                ;;
            -s|--status)
                show_status=true
                shift
                ;;
            -t|--test)
                test_after_restart=true
                shift
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Create log directory if it doesn't exist
    sudo mkdir -p "$(dirname "$LOG_FILE")"
    sudo touch "$LOG_FILE"
    sudo chown $USER:$USER "$LOG_FILE"
    
    echo "🔒 Maijjd SSL Services Restart"
    echo "=============================="
    echo "Project root: $PROJECT_ROOT"
    echo "Domain: $DOMAIN"
    echo "Log file: $LOG_FILE"
    echo "Timestamp: $(date)"
    echo
    
    # Show status if requested
    if [[ "$show_status" == true ]]; then
        show_service_status
        exit 0
    fi
    
    # Confirm before proceeding
    if [[ "$restart_all" == true ]]; then
        echo "This will restart ALL services (nginx, backend, frontend)"
    else
        echo "This will restart the following services:"
        [[ "$restart_nginx" == true ]] && echo "  - Nginx"
        [[ "$restart_backend" == true ]] && echo "  - Backend"
        [[ "$restart_frontend" == true ]] && echo "  - Frontend"
    fi
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Service restart cancelled"
        exit 0
    fi
    
    # Create backup
    backup_configuration
    
    # Determine which services to restart
    if [[ "$restart_all" == true ]]; then
        restart_nginx=true
        restart_backend=true
        restart_frontend=true
    fi
    
    # Stop services if needed
    if [[ "$restart_nginx" == true ]] || [[ "$restart_backend" == true ]] || [[ "$restart_frontend" == true ]]; then
        stop_services
    fi
    
    # Reload SSL certificates
    reload_ssl_certificates
    
    # Restart services
    local restart_success=true
    
    if [[ "$restart_nginx" == true ]]; then
        if ! restart_nginx; then
            restart_success=false
        fi
    fi
    
    if [[ "$restart_backend" == true ]]; then
        if ! restart_backend; then
            restart_success=false
        fi
    fi
    
    if [[ "$restart_frontend" == true ]]; then
        if ! restart_frontend; then
            restart_success=false
        fi
    fi
    
    # Test services if requested
    if [[ "$test_after_restart" == true ]]; then
        sleep 5  # Wait for services to stabilize
        if ! test_services; then
            restart_success=false
        fi
    fi
    
    # Show final status
    show_service_status
    
    # Final result
    if [[ "$restart_success" == true ]]; then
        echo
        print_success "🎉 All requested services restarted successfully!"
        log_message "INFO" "Service restart completed successfully"
    else
        echo
        print_warning "⚠️  Some services may not have restarted properly"
        log_message "WARNING" "Service restart completed with issues"
        echo "Check the log file for details: $LOG_FILE"
    fi
    
    echo
    echo "📋 Next steps:"
    echo "1. Test your site: https://$DOMAIN"
    echo "2. Test your API: https://$DOMAIN/api/health"
    echo "3. Monitor SSL health: sudo ./ssl-health-check.sh"
    echo "4. Check logs: $LOG_FILE"
}

# Run main function
main "$@"
