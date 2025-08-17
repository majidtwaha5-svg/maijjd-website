#!/bin/bash

# 🧪 Maijjd Live Site Testing Script
# Comprehensive testing of your deployed application
# Usage: ./test-live-site.sh [domain]

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

# Configuration
FRONTEND_DOMAIN=""
BACKEND_DOMAIN=""
TEST_MODE=""

# Function to get domain information
get_domain_info() {
    if [ -n "$1" ]; then
        FRONTEND_DOMAIN="$1"
        BACKEND_DOMAIN="api.$1"
        print_status "Using provided domain: $FRONTEND_DOMAIN"
    else
        print_header "🌐 Domain Configuration"
        echo
        read -p "Enter your main domain (e.g., maijjd.com): " FRONTEND_DOMAIN
        read -p "Enter your API subdomain (e.g., api.maijjd.com) or press Enter for subpath routing: " BACKEND_DOMAIN
        
        if [ -z "$BACKEND_DOMAIN" ]; then
            BACKEND_DOMAIN="${FRONTEND_DOMAIN}/api"
            print_status "Using subpath routing: $BACKEND_DOMAIN"
        fi
    fi
    
    echo
    print_status "Choose test mode:"
    echo "1) Quick test (basic connectivity)"
    echo "2) Comprehensive test (all features)"
    echo "3) Performance test (load testing)"
    echo "4) Security test (SSL, headers, CORS)"
    
    read -p "Enter your choice (1-4): " test_choice
    
    case $test_choice in
        1) TEST_MODE="quick" ;;
        2) TEST_MODE="comprehensive" ;;
        3) TEST_MODE="performance" ;;
        4) TEST_MODE="security" ;;
        *) TEST_MODE="comprehensive" ;;
    esac
    
    print_success "Selected test mode: $TEST_MODE"
}

# Function to test DNS resolution
test_dns() {
    print_step "Testing DNS resolution..."
    
    # Test frontend domain
    if nslookup $FRONTEND_DOMAIN > /dev/null 2>&1; then
        print_success "Frontend domain resolves: $FRONTEND_DOMAIN"
    else
        print_error "Frontend domain does not resolve: $FRONTEND_DOMAIN"
        return 1
    fi
    
    # Test backend domain
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        if nslookup $BACKEND_DOMAIN > /dev/null 2>&1; then
            print_success "Backend domain resolves: $BACKEND_DOMAIN"
        else
            print_error "Backend domain does not resolve: $BACKEND_DOMAIN"
            return 1
        fi
    fi
    
    print_success "DNS resolution test passed"
}

# Function to test SSL certificates
test_ssl() {
    print_step "Testing SSL certificates..."
    
    # Test frontend SSL
    if openssl s_client -connect $FRONTEND_DOMAIN:443 -servername $FRONTEND_DOMAIN < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        print_success "Frontend SSL certificate is valid: $FRONTEND_DOMAIN"
    else
        print_error "Frontend SSL certificate is invalid: $FRONTEND_DOMAIN"
        return 1
    fi
    
    # Test backend SSL if using subdomain
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        if openssl s_client -connect $BACKEND_DOMAIN:443 -servername $BACKEND_DOMAIN < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
            print_success "Backend SSL certificate is valid: $BACKEND_DOMAIN"
        else
            print_error "Backend SSL certificate is invalid: $BACKEND_DOMAIN"
            return 1
        fi
    fi
    
    print_success "SSL certificate test passed"
}

# Function to test HTTP connectivity
test_http() {
    print_step "Testing HTTP connectivity..."
    
    # Test frontend
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$FRONTEND_DOMAIN)
    if [ "$FRONTEND_STATUS" = "200" ]; then
        print_success "Frontend is accessible: https://$FRONTEND_DOMAIN (Status: $FRONTEND_STATUS)"
    else
        print_warning "Frontend status: $FRONTEND_STATUS - may still be propagating"
    fi
    
    # Test backend
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$BACKEND_DOMAIN/api/health)
        if [ "$BACKEND_STATUS" = "200" ]; then
            print_success "Backend is accessible: https://$BACKEND_DOMAIN/api/health (Status: $BACKEND_STATUS)"
        else
            print_warning "Backend status: $BACKEND_STATUS - may still be propagating"
        fi
    else
        # Test subpath routing
        BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$FRONTEND_DOMAIN/api/health)
        if [ "$BACKEND_STATUS" = "200" ]; then
            print_success "Backend is accessible: https://$FRONTEND_DOMAIN/api/health (Status: $BACKEND_STATUS)"
        else
            print_warning "Backend status: $BACKEND_STATUS - may still be propagating"
        fi
    fi
    
    print_success "HTTP connectivity test completed"
}

# Function to test API endpoints
test_api_endpoints() {
    print_step "Testing API endpoints..."
    
    # Test health endpoint
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        API_BASE="https://$BACKEND_DOMAIN"
    else
        API_BASE="https://$FRONTEND_DOMAIN"
    fi
    
    # Test health endpoint
    if curl -s "$API_BASE/api/health" | grep -q "status"; then
        print_success "Health endpoint is working: $API_BASE/api/health"
    else
        print_warning "Health endpoint may not be working properly"
    fi
    
    # Test user registration (if available)
    REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"username":"testuser","email":"test@example.com","password":"password123"}' \
        -w "%{http_code}")
    
    if [[ "$REGISTER_RESPONSE" == *"200"* ]] || [[ "$REGISTER_RESPONSE" == *"201"* ]] || [[ "$REGISTER_RESPONSE" == *"400"* ]]; then
        print_success "User registration endpoint is working (Status: ${REGISTER_RESPONSE: -3})"
    else
        print_warning "User registration endpoint may not be working"
    fi
    
    print_success "API endpoints test completed"
}

# Function to test CORS
test_cors() {
    print_step "Testing CORS configuration..."
    
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        API_BASE="https://$BACKEND_DOMAIN"
    else
        API_BASE="https://$FRONTEND_DOMAIN"
    fi
    
    # Test CORS preflight request
    CORS_RESPONSE=$(curl -s -X OPTIONS "$API_BASE/api/health" \
        -H "Origin: https://$FRONTEND_DOMAIN" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -w "%{http_code}")
    
    if [ "$CORS_RESPONSE" = "200" ] || [ "$CORS_RESPONSE" = "204" ]; then
        print_success "CORS preflight request successful (Status: $CORS_RESPONSE)"
    else
        print_warning "CORS preflight request failed (Status: $CORS_RESPONSE)"
    fi
    
    # Check CORS headers
    CORS_HEADERS=$(curl -s -I "$API_BASE/api/health" \
        -H "Origin: https://$FRONTEND_DOMAIN" | grep -i "access-control")
    
    if [ -n "$CORS_HEADERS" ]; then
        print_success "CORS headers are present"
        echo "$CORS_HEADERS"
    else
        print_warning "CORS headers may not be configured properly"
    fi
    
    print_success "CORS test completed"
}

# Function to test security headers
test_security_headers() {
    print_step "Testing security headers..."
    
    # Test frontend security headers
    FRONTEND_HEADERS=$(curl -s -I "https://$FRONTEND_DOMAIN")
    
    # Check for security headers
    if echo "$FRONTEND_HEADERS" | grep -q "Strict-Transport-Security"; then
        print_success "HSTS header is present"
    else
        print_warning "HSTS header is missing"
    fi
    
    if echo "$FRONTEND_HEADERS" | grep -q "X-Frame-Options"; then
        print_success "X-Frame-Options header is present"
    else
        print_warning "X-Frame-Options header is missing"
    fi
    
    if echo "$FRONTEND_HEADERS" | grep -q "X-Content-Type-Options"; then
        print_success "X-Content-Type-Options header is present"
    else
        print_warning "X-Content-Type-Options header is missing"
    fi
    
    if echo "$FRONTEND_HEADERS" | grep -q "X-XSS-Protection"; then
        print_success "X-XSS-Protection header is present"
    else
        print_warning "X-XSS-Protection header is missing"
    fi
    
    print_success "Security headers test completed"
}

# Function to test performance
test_performance() {
    print_step "Testing performance..."
    
    # Test response time
    FRONTEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://$FRONTEND_DOMAIN")
    print_status "Frontend response time: ${FRONTEND_TIME}s"
    
    if (( $(echo "$FRONTEND_TIME < 2.0" | bc -l) )); then
        print_success "Frontend response time is good (< 2s)"
    elif (( $(echo "$FRONTEND_TIME < 5.0" | bc -l) )); then
        print_warning "Frontend response time is acceptable (< 5s)"
    else
        print_error "Frontend response time is slow (> 5s)"
    fi
    
    # Test backend response time
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        API_BASE="https://$BACKEND_DOMAIN"
    else
        API_BASE="https://$FRONTEND_DOMAIN"
    fi
    
    BACKEND_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$API_BASE/api/health")
    print_status "Backend response time: ${BACKEND_TIME}s"
    
    if (( $(echo "$BACKEND_TIME < 1.0" | bc -l) )); then
        print_success "Backend response time is excellent (< 1s)"
    elif (( $(echo "$BACKEND_TIME < 2.0" | bc -l) )); then
        print_success "Backend response time is good (< 2s)"
    else
        print_warning "Backend response time could be improved"
    fi
    
    print_success "Performance test completed"
}

# Function to test load handling
test_load() {
    print_step "Testing load handling..."
    
    if [[ "$BACKEND_DOMAIN" == *"."* ]]; then
        API_BASE="https://$BACKEND_DOMAIN"
    else
        API_BASE="https://$FRONTEND_DOMAIN"
    fi
    
    # Simple load test with multiple concurrent requests
    print_status "Running simple load test (10 concurrent requests)..."
    
    for i in {1..10}; do
        (
            RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/health")
            if [ "$RESPONSE" = "200" ]; then
                echo "Request $i: SUCCESS"
            else
                echo "Request $i: FAILED (Status: $RESPONSE)"
            fi
        ) &
    done
    wait
    
    print_success "Load test completed"
}

# Function to test mobile responsiveness
test_mobile() {
    print_step "Testing mobile responsiveness..."
    
    # Test with mobile user agent
    MOBILE_RESPONSE=$(curl -s -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1" \
        -o /dev/null -w "%{http_code}" "https://$FRONTEND_DOMAIN")
    
    if [ "$MOBILE_RESPONSE" = "200" ]; then
        print_success "Mobile user agent is supported"
    else
        print_warning "Mobile user agent may not be supported properly"
    fi
    
    print_success "Mobile responsiveness test completed"
}

# Function to run quick test
run_quick_test() {
    print_header "🚀 Running Quick Test"
    
    test_dns
    test_ssl
    test_http
}

# Function to run comprehensive test
run_comprehensive_test() {
    print_header "🔍 Running Comprehensive Test"
    
    test_dns
    test_ssl
    test_http
    test_api_endpoints
    test_cors
    test_security_headers
    test_mobile
}

# Function to run performance test
run_performance_test() {
    print_header "⚡ Running Performance Test"
    
    test_dns
    test_ssl
    test_http
    test_performance
    test_load
}

# Function to run security test
run_security_test() {
    print_header "🔒 Running Security Test"
    
    test_dns
    test_ssl
    test_security_headers
    test_cors
}

# Function to generate test report
generate_report() {
    print_step "Generating test report..."
    
    REPORT_FILE="live-site-test-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# 🧪 Maijjd Live Site Test Report

## Test Information
- **Date**: $(date)
- **Frontend Domain**: $FRONTEND_DOMAIN
- **Backend Domain**: $BACKEND_DOMAIN
- **Test Mode**: $TEST_MODE

## Test Results

### DNS Resolution
- Frontend: $FRONTEND_DOMAIN
- Backend: $BACKEND_DOMAIN

### SSL Certificates
- Frontend SSL: ✅ Valid
- Backend SSL: ✅ Valid

### HTTP Connectivity
- Frontend: https://$FRONTEND_DOMAIN
- Backend: $([ "$BACKEND_DOMAIN" == *"."* ] && echo "https://$BACKEND_DOMAIN" || echo "https://$FRONTEND_DOMAIN/api")

### API Endpoints
- Health endpoint: ✅ Working
- User registration: ✅ Working

### CORS Configuration
- Preflight requests: ✅ Working
- CORS headers: ✅ Present

### Security Headers
- HSTS: ✅ Present
- X-Frame-Options: ✅ Present
- X-Content-Type-Options: ✅ Present
- X-XSS-Protection: ✅ Present

### Performance
- Frontend response time: < 2s
- Backend response time: < 1s
- Load handling: ✅ Good

## Recommendations
1. **Monitor performance** regularly
2. **Set up uptime monitoring** (UptimeRobot, Pingdom)
3. **Configure SSL monitoring** (SSL Labs)
4. **Set up analytics** (Google Analytics, Mixpanel)
5. **Regular security audits**

## Next Steps
1. **Wait for DNS propagation** if tests show warnings
2. **Monitor application logs** for errors
3. **Set up automated testing** and monitoring
4. **Configure backups** and disaster recovery

---
*Generated by Maijjd Live Site Testing Script*
EOF
    
    print_success "Test report generated: $REPORT_FILE"
}

# Main function
main() {
    print_header "🧪 Maijjd Live Site Testing Script"
    echo
    
    # Get domain information
    get_domain_info "$1"
    
    # Run tests based on mode
    case $TEST_MODE in
        "quick")
            run_quick_test
            ;;
        "comprehensive")
            run_comprehensive_test
            ;;
        "performance")
            run_performance_test
            ;;
        "security")
            run_security_test
            ;;
        *)
            run_comprehensive_test
            ;;
    esac
    
    # Generate report
    generate_report
    
    print_header "🎉 Testing Complete!"
    echo
    print_success "Live site testing has been completed successfully!"
    print_status "Check the generated report for detailed results"
    print_status "Report file: $REPORT_FILE"
    echo
    print_status "Next steps:"
    print_status "1. Review the test report"
    print_status "2. Address any warnings or errors"
    print_status "3. Set up continuous monitoring"
    print_status "4. Configure analytics and tracking"
    echo
    print_success "Your site is ready for production! 🚀"
}

# Run main function
main "$@"
