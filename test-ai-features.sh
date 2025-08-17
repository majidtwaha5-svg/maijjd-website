#!/bin/bash

echo "🔍 Maijjd AI Features Comprehensive Test"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -e "${BLUE}Testing: ${test_name}${NC}"
    
    if eval "$test_command" | grep -q "$expected_result"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Check if backend is running
echo "🌐 Checking Backend Status..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 5001${NC}"
else
    echo -e "${RED}❌ Backend is not running on port 5001${NC}"
    exit 1
fi

echo ""

# Test 1: Health Check
run_test "Health Check" \
    "curl -s http://localhost:5001/api/health" \
    "status"

# Test 2: AI Integration Status
run_test "AI Integration Status" \
    "curl -s http://localhost:5001/api/ai/integration" \
    "message"

# Test 3: Demo Chat
run_test "AI Demo Chat" \
    "curl -s http://localhost:5001/api/ai/demo/chat -X POST -H 'Content-Type: application/json' -d '{\"software\":\"Test Software\",\"message\":\"Hello\"}'" \
    "success"

# Test 4: Software Analysis
run_test "Software Analysis" \
    "curl -s http://localhost:5001/api/ai/software-analysis -X POST -H 'Content-Type: application/json' -d '{\"software_id\":\"test123\",\"analysis_type\":\"performance\",\"ai_model\":\"gpt-4\"}'" \
    "analysis"

# Test 5: Performance Optimization
run_test "Performance Optimization" \
    "curl -s http://localhost:5001/api/ai/performance-optimization -X POST -H 'Content-Type: application/json' -d '{\"software_id\":\"test123\",\"metrics\":{\"response_time\":100}}'" \
    "ai_recommendations"

# Test 6: Security Assessment
run_test "Security Assessment" \
    "curl -s http://localhost:5001/api/ai/security-assessment -X POST -H 'Content-Type: application/json' -d '{\"software_id\":\"test123\",\"assessment_type\":\"vulnerability_scan\"}'" \
    "vulnerabilities"

# Test 7: Services Endpoint
run_test "Services Endpoint" \
    "curl -s http://localhost:5001/api/services" \
    "services"

# Test 8: Software Endpoint
run_test "Software Endpoint" \
    "curl -s http://localhost:5001/api/software" \
    "software"

# Test 9: Auth Endpoint (should return error for invalid token)
run_test "Auth Endpoint" \
    "curl -s http://localhost:5001/api/auth/profile -H 'Authorization: Bearer invalid'" \
    "Invalid token"

# Test 10: Contact Endpoint
run_test "Contact Endpoint" \
    "curl -s http://localhost:5001/api/contact" \
    "contact"

echo "========================================"
echo -e "${BLUE}Test Results Summary:${NC}"
echo -e "${GREEN}✅ Tests Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}❌ Tests Failed: ${TESTS_FAILED}${NC}"
echo "========================================"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All AI features are working perfectly!${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the output above.${NC}"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Check browser console for any frontend errors"
echo "2. Verify all AI features are working in the UI"
echo "3. Test user authentication and premium features"
echo "4. Monitor server logs for any issues"
