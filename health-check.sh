#!/bin/bash

# 🏥 Maijjd Comprehensive Health Check Script
# Monitors all services and provides detailed status information

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

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

print_step() {
    echo -e "${CYAN}➤${NC} $1"
}

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        if [ "$status_code" = "$expected_status" ]; then
            print_success "$service_name is healthy (Status: $status_code)"
            return 0
        else
            print_warning "$service_name responded with status $status_code (expected $expected_status)"
            return 1
        fi
    else
        print_error "$service_name is not responding"
        return 1
    fi
}

# Function to check Docker service
check_docker_service() {
    local service_name=$1
    local container_name=$2
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$container_name"; then
        local status=$(docker ps --format "{{.Status}}" --filter "name=$container_name")
        print_success "$service_name is running: $status"
        return 0
    else
        print_error "$service_name is not running"
        return 1
    fi
}

# Function to check port availability
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        local process=$(lsof -ti:$port 2>/dev/null | head -1)
        local process_name=$(ps -p $process -o comm= 2>/dev/null || echo "Unknown")
        print_success "Port $port is available for $service (Process: $process_name)"
        return 0
    else
        print_warning "Port $port is not in use"
        return 1
    fi
}

# Function to check system resources
check_system_resources() {
    print_step "Checking system resources..."
    
    # CPU usage
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    if [ ! -z "$cpu_usage" ]; then
        if (( $(echo "$cpu_usage < 80" | bc -l) )); then
            print_success "CPU usage: ${cpu_usage}%"
        else
            print_warning "CPU usage: ${cpu_usage}% (high)"
        fi
    fi
    
    # Memory usage
    local memory_info=$(vm_stat | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
    local total_memory=$(sysctl -n hw.memsize 2>/dev/null || echo "0")
    if [ "$total_memory" != "0" ]; then
        local free_memory_mb=$((memory_info * 4096 / 1024 / 1024))
        local total_memory_mb=$((total_memory / 1024 / 1024))
        local memory_usage=$((100 - (free_memory_mb * 100 / total_memory_mb)))
        
        if [ $memory_usage -lt 80 ]; then
            print_success "Memory usage: ${memory_usage}% (${free_memory_mb}MB free / ${total_memory_mb}MB total)"
        else
            print_warning "Memory usage: ${memory_usage}% (${free_memory_mb}MB free / ${total_memory_mb}MB total) - high usage"
        fi
    fi
    
    # Disk usage
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ ! -z "$disk_usage" ]; then
        if [ $disk_usage -lt 80 ]; then
            print_success "Disk usage: ${disk_usage}%"
        else
            print_warning "Disk usage: ${disk_usage}% - high usage"
        fi
    fi
}

# Function to check Docker environment
check_docker_environment() {
    print_step "Checking Docker environment..."
    
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        print_success "Docker is running"
        
        # Check Docker Compose
        if command -v docker-compose &> /dev/null; then
            print_success "Docker Compose is available"
            
            # Check if services are running
            if [ -f "docker-compose.yml" ]; then
                print_status "Checking Docker services..."
                
                check_docker_service "Frontend" "maijjd-frontend"
                check_docker_service "Backend" "maijjd-backend"
                check_docker_service "MongoDB" "maijjd-mongodb"
                check_docker_service "Redis" "maijjd-redis"
                check_docker_service "Nginx" "maijjd-nginx"
                check_docker_service "Prometheus" "maijjd-prometheus"
                check_docker_service "Grafana" "maijjd-grafana"
                
                # Show overall status
                echo ""
                print_status "Docker services status:"
                docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
            else
                print_warning "docker-compose.yml not found"
            fi
        else
            print_error "Docker Compose not found"
        fi
    else
        print_warning "Docker not available or not running"
        return 1
    fi
}

# Function to check local environment
check_local_environment() {
    print_step "Checking local environment..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "Node.js: $node_version"
    else
        print_error "Node.js not found"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        print_success "npm: $npm_version"
    else
        print_error "npm not found"
        return 1
    fi
    
    # Check if services are running locally
    print_status "Checking local services..."
    
    check_port 3000 "Frontend"
    check_port 5001 "Backend"
    
    # Check service health
    check_service "Local Backend" "http://localhost:5001/api/health"
    check_service "Local Frontend" "http://localhost:3000"
}

# Function to check network connectivity
check_network_connectivity() {
    print_step "Checking network connectivity..."
    
    # Check internet connectivity
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        print_success "Internet connectivity: OK"
    else
        print_warning "Internet connectivity: Limited or unavailable"
    fi
    
    # Check DNS resolution
    if nslookup google.com > /dev/null 2>&1; then
        print_success "DNS resolution: OK"
    else
        print_warning "DNS resolution: Issues detected"
    fi
    
    # Check localhost
    if ping -c 1 localhost > /dev/null 2>&1; then
        print_success "Localhost connectivity: OK"
    else
        print_error "Localhost connectivity: Failed"
    fi
}

# Function to check application health
check_application_health() {
    print_step "Checking application health..."
    
    local health_passed=true
    
    # Check Docker services if available
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        print_status "Checking Docker application health..."
        
        # Check backend API
        if check_service "Docker Backend" "http://localhost:5000/api/health"; then
            print_success "Docker Backend API is healthy"
        else
            print_warning "Docker Backend API health check failed"
            health_passed=false
        fi
        
        # Check frontend
        if check_service "Docker Frontend" "http://localhost:3000"; then
            print_success "Docker Frontend is healthy"
        else
            print_warning "Docker Frontend health check failed"
            health_passed=false
        fi
        
        # Check Nginx
        if check_service "Nginx Proxy" "http://localhost:80/health"; then
            print_success "Nginx proxy is healthy"
        else
            print_warning "Nginx proxy health check failed"
            health_passed=false
        fi
        
        # Check Prometheus
        if check_service "Prometheus" "http://localhost:9090/-/healthy"; then
            print_success "Prometheus is healthy"
        else
            print_warning "Prometheus health check failed"
            health_passed=false
        fi
        
        # Check Grafana
        if check_service "Grafana" "http://localhost:3001/api/health"; then
            print_success "Grafana is healthy"
        else
            print_warning "Grafana health check failed"
            health_passed=false
        fi
        
    else
        print_status "Checking local application health..."
        
        # Check local backend
        if check_service "Local Backend" "http://localhost:5001/api/health"; then
            print_success "Local Backend API is healthy"
        else
            print_warning "Local Backend API health check failed"
            health_passed=false
        fi
        
        # Check local frontend
        if check_service "Local Frontend" "http://localhost:3000"; then
            print_success "Local Frontend is healthy"
        else
            print_warning "Local Frontend health check failed"
            health_passed=false
        fi
    fi
    
    return $([ "$health_passed" = true ] && echo 0 || echo 1)
}

# Function to generate health report
generate_health_report() {
    local report_file="health-report-$(date +%Y%m%d-%H%M%S).txt"
    
    print_step "Generating health report..."
    
    {
        echo "Maijjd Health Check Report"
        echo "Generated: $(date)"
        echo "=================================="
        echo ""
        
        echo "System Information:"
        echo "OS: $(uname -s) $(uname -r)"
        echo "Hostname: $(hostname)"
        echo "User: $(whoami)"
        echo ""
        
        echo "Docker Status:"
        if command -v docker &> /dev/null; then
            docker --version
            docker-compose --version 2>/dev/null || echo "Docker Compose: Not available"
        else
            echo "Docker: Not available"
        fi
        echo ""
        
        echo "Node.js Status:"
        if command -v node &> /dev/null; then
            node --version
            npm --version
        else
            echo "Node.js: Not available"
        fi
        echo ""
        
        echo "Service Status:"
        if [ -f "docker-compose.yml" ]; then
            docker-compose ps 2>/dev/null || echo "Unable to get service status"
        fi
        echo ""
        
        echo "Port Status:"
        for port in 80 443 3000 3001 5000 5001 27017 6379 9090; do
            if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
                local process=$(lsof -ti:$port 2>/dev/null | head -1)
                local process_name=$(ps -p $process -o comm= 2>/dev/null || echo "Unknown")
                echo "Port $port: In use by $process_name (PID: $process)"
            else
                echo "Port $port: Available"
            fi
        done
        
    } > "$report_file"
    
    print_success "Health report generated: $report_file"
}

# Main execution
main() {
    # Banner
    clear
    print_header "
╔══════════════════════════════════════════════════════════════╗
║                🏥 Maijjd Health Check                       ║
║              Comprehensive Service Monitoring                ║
║                    Enhanced & Perfect                        ║
╚══════════════════════════════════════════════════════════════╝
"
    
    echo ""
    
    # Check system resources
    check_system_resources
    echo ""
    
    # Check network connectivity
    check_network_connectivity
    echo ""
    
    # Check Docker environment
    if check_docker_environment; then
        echo ""
        # Check application health
        if check_application_health; then
            echo ""
            print_success "All services are healthy! 🎉"
        else
            echo ""
            print_warning "Some services have issues. Check the details above."
        fi
    else
        echo ""
        # Check local environment
        if check_local_environment; then
            echo ""
            # Check application health
            if check_application_health; then
                echo ""
                print_success "All local services are healthy! 🎉"
            else
                echo ""
                print_warning "Some local services have issues. Check the details above."
            fi
        else
            echo ""
            print_error "Neither Docker nor local environment is properly configured."
        fi
    fi
    
    echo ""
    
    # Generate health report
    generate_health_report
    
    echo ""
    print_status "Health check completed. Check the generated report for details."
}

# Run main function
main "$@"
