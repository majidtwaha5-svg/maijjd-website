#!/bin/bash

# =============================================================================
# SSL Setup Test Script for Maijjd Project
# =============================================================================
# This script tests the SSL setup functionality
# =============================================================================

set -e

# Color codes for output
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

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_exit="$3"
    
    print_status "Running test: $test_name"
    
    if eval "$command" >/dev/null 2>&1; then
        if [ "$expected_exit" = "0" ] || [ -z "$expected_exit" ]; then
            print_success "Test passed: $test_name"
            return 0
        else
            print_error "Test failed: $test_name (expected exit $expected_exit, got 0)"
            return 1
        fi
    else
        if [ "$expected_exit" != "0" ]; then
            print_success "Test passed: $test_name (expected failure)"
            return 0
        else
            print_error "Test failed: $test_name (expected success, got failure)"
            return 1
        fi
    fi
}

# Function to check file exists
check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        print_success "File exists: $description ($file)"
        return 0
    else
        print_error "File missing: $description ($file)"
        return 1
    fi
}

# Function to check directory exists
check_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        print_success "Directory exists: $description ($dir)"
        return 0
    else
        print_error "Directory missing: $description ($dir)"
        return 1
    fi
}

# Function to check Docker status
check_docker() {
    print_status "Checking Docker status..."
    
    if docker info >/dev/null 2>&1; then
        print_success "Docker is running"
        return 0
    else
        print_error "Docker is not running"
        return 1
    fi
}

# Function to check Docker Compose
check_docker_compose() {
    print_status "Checking Docker Compose..."
    
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        print_success "Docker Compose is available"
        return 0
    else
        print_error "Docker Compose is not available"
        return 1
    fi
}

# Function to test SSL setup script help
test_help() {
    print_status "Testing SSL setup script help..."
    
    if ./docker-ssl-setup.sh --help >/dev/null 2>&1; then
        print_success "Help command works"
        return 0
    else
        print_error "Help command failed"
        return 1
    fi
}

# Function to test self-signed certificate generation
test_self_signed() {
    print_status "Testing self-signed certificate generation..."
    
    # Clean up any existing SSL files
    rm -rf ssl nginx-ssl.conf docker-compose.ssl.yml renew-ssl.sh ssl-health-check.sh
    
    # Run self-signed setup
    if ./docker-ssl-setup.sh --self-signed >/dev/null 2>&1; then
        print_success "Self-signed certificate generation successful"
        
        # Check generated files
        local all_files_exist=true
        
        check_file "ssl/cert.pem" "SSL certificate" || all_files_exist=false
        check_file "ssl/key.pem" "SSL private key" || all_files_exist=false
        check_file "nginx-ssl.conf" "Nginx SSL configuration" || all_files_exist=false
        check_file "docker-compose.ssl.yml" "Docker Compose SSL configuration" || all_files_exist=false
        check_file "renew-ssl.sh" "SSL renewal script" || all_files_exist=false
        check_file "ssl-health-check.sh" "SSL health check script" || all_files_exist=false
        
        if [ "$all_files_exist" = true ]; then
            print_success "All SSL files generated successfully"
            return 0
        else
            print_error "Some SSL files are missing"
            return 1
        fi
    else
        print_error "Self-signed certificate generation failed"
        return 1
    fi
}

# Function to test SSL certificate check
test_certificate_check() {
    print_status "Testing SSL certificate check..."
    
    if ./docker-ssl-setup.sh --check >/dev/null 2>&1; then
        print_success "SSL certificate check successful"
        return 0
    else
        print_error "SSL certificate check failed"
        return 1
    fi
}

# Function to test SSL health check script
test_health_check_script() {
    print_status "Testing SSL health check script..."
    
    if ./ssl-health-check.sh >/dev/null 2>&1; then
        print_success "SSL health check script works"
        return 0
    else
        print_error "SSL health check script failed"
        return 1
    fi
}

# Function to test SSL renewal script
test_renewal_script() {
    print_status "Testing SSL renewal script..."
    
    if ./renew-ssl.sh >/dev/null 2>&1; then
        print_success "SSL renewal script works"
        return 0
    else
        print_error "SSL renewal script failed"
        return 1
    fi
}

# Function to test Docker Compose SSL configuration
test_docker_compose_ssl() {
    print_status "Testing Docker Compose SSL configuration..."
    
    # Check if the file is valid YAML
    if command -v python3 &> /dev/null; then
        if python3 -c "import yaml; yaml.safe_load(open('docker-compose.ssl.yml'))" >/dev/null 2>&1; then
            print_success "Docker Compose SSL configuration is valid YAML"
        else
            print_error "Docker Compose SSL configuration is invalid YAML"
            return 1
        fi
    fi
    
    # Check if the file contains expected services
    if grep -q "nginx-ssl" docker-compose.ssl.yml && grep -q "certbot" docker-compose.ssl.yml; then
        print_success "Docker Compose SSL configuration contains expected services"
        return 0
    else
        print_error "Docker Compose SSL configuration missing expected services"
        return 1
    fi
}

# Function to test Nginx SSL configuration
test_nginx_ssl_config() {
    print_status "Testing Nginx SSL configuration..."
    
    # Check if the file contains SSL configuration
    if grep -q "ssl_certificate" nginx-ssl.conf && grep -q "ssl_certificate_key" nginx-ssl.conf; then
        print_success "Nginx SSL configuration contains SSL directives"
        return 0
    else
        print_error "Nginx SSL configuration missing SSL directives"
        return 1
    fi
}

# Function to run all tests
run_all_tests() {
    print_status "Starting SSL setup tests..."
    echo ""
    
    local total_tests=0
    local passed_tests=0
    local failed_tests=0
    
    # Test 1: Check Docker
    ((total_tests++))
    if check_docker; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 2: Check Docker Compose
    ((total_tests++))
    if check_docker_compose; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 3: Test help command
    ((total_tests++))
    if test_help; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 4: Test self-signed certificate generation
    ((total_tests++))
    if test_self_signed; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 5: Test certificate check
    ((total_tests++))
    if test_certificate_check; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 6: Test health check script
    ((total_tests++))
    if test_health_check_script; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 7: Test renewal script
    ((total_tests++))
    if test_renewal_script; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 8: Test Docker Compose SSL configuration
    ((total_tests++))
    if test_docker_compose_ssl; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Test 9: Test Nginx SSL configuration
    ((total_tests++))
    if test_nginx_ssl_config; then
        ((passed_tests++))
    else
        ((failed_tests++))
    fi
    
    # Print summary
    echo ""
    echo "=========================================="
    echo "SSL Setup Test Results"
    echo "=========================================="
    echo "Total tests: $total_tests"
    echo "Passed: $passed_tests"
    echo "Failed: $failed_tests"
    echo "=========================================="
    
    if [ $failed_tests -eq 0 ]; then
        print_success "All tests passed! SSL setup is working correctly."
        return 0
    else
        print_error "Some tests failed. Please check the errors above."
        return 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -a, --all               Run all tests (default)"
    echo "  -d, --docker            Test Docker functionality only"
    echo "  -s, --ssl               Test SSL setup only"
    echo "  -c, --config            Test configuration files only"
    echo ""
    echo "Examples:"
    echo "  $0                      # Run all tests"
    echo "  $0 --docker             # Test Docker only"
    echo "  $0 --ssl                # Test SSL setup only"
}

# Main execution
main() {
    # Parse command line arguments
    local test_mode="all"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -a|--all)
                test_mode="all"
                shift
                ;;
            -d|--docker)
                test_mode="docker"
                shift
                ;;
            -s|--ssl)
                test_mode="ssl"
                shift
                ;;
            -c|--config)
                test_mode="config"
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    case "$test_mode" in
        "all")
            run_all_tests
            ;;
        "docker")
            check_docker
            check_docker_compose
            ;;
        "ssl")
            test_self_signed
            test_certificate_check
            test_health_check_script
            test_renewal_script
            ;;
        "config")
            test_docker_compose_ssl
            test_nginx_ssl_config
            ;;
        *)
            print_error "Unknown test mode: $test_mode"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
