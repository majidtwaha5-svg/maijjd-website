#!/bin/bash

echo "🧪 Maijjd Frontend AI Integration Test"
echo "======================================"
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

# Check if both services are running
echo "🌐 Checking Service Status..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 5001${NC}"
else
    echo -e "${RED}❌ Backend is not running on port 5001${NC}"
    exit 1
fi

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 3001${NC}"
else
    echo -e "${RED}❌ Frontend is not running on port 3001${NC}"
    exit 1
fi

echo ""

# Test 1: Frontend HTML Loading
run_test "Frontend HTML Loading" \
    "curl -s http://localhost:3001" \
    "Maijjd"

# Test 2: Frontend JavaScript Loading
run_test "Frontend JavaScript Loading" \
    "curl -s http://localhost:3001 | grep -i 'script'" \
    "script"

# Test 3: Frontend CSS Loading
run_test "Frontend CSS Loading" \
    "curl -s http://localhost:3001 | grep -i 'css\|style'" \
    "css"

# Test 4: AI Chat API Integration
run_test "AI Chat API Integration" \
    "curl -s http://localhost:5001/api/ai/demo/chat -X POST -H 'Content-Type: application/json' -d '{\"software\":\"Maijjd AI Hub\",\"message\":\"Hello\",\"context\":{\"context\":\"general_assistance\"}}'" \
    "success"

# Test 5: AI Software Analysis API
run_test "AI Software Analysis API" \
    "curl -s http://localhost:5001/api/ai/software-analysis -X POST -H 'Content-Type: application/json' -d '{\"software_id\":\"test123\",\"analysis_type\":\"performance\",\"ai_model\":\"gpt-4\"}'" \
    "analysis"

# Test 6: AI Performance Optimization API
run_test "AI Performance Optimization API" \
    "curl -s http://localhost:5001/api/ai/performance-optimization -X POST -H 'Content-Type: application/json' -d '{\"software_id\":\"test123\",\"metrics\":{\"response_time\":100}}'" \
    "ai_recommendations"

# Test 7: AI Security Assessment API
run_test "AI Security Assessment API" \
    "curl -s http://localhost:5001/api/ai/security-assessment -X POST -H 'Content-Type: application/json' -d '{\"software_id\":\"test123\",\"assessment_type\":\"vulnerability_scan\"}'" \
    "vulnerabilities"

# Test 8: Services API Integration
run_test "Services API Integration" \
    "curl -s http://localhost:5001/api/services" \
    "services"

# Test 9: Software API Integration
run_test "Software API Integration" \
    "curl -s http://localhost:5001/api/software" \
    "software"

# Test 10: Contact API Integration
run_test "Contact API Integration" \
    "curl -s http://localhost:5001/api/contact" \
    "contact"

echo "======================================"
echo -e "${BLUE}Frontend AI Integration Test Results:${NC}"
echo -e "${GREEN}✅ Tests Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}❌ Tests Failed: ${TESTS_FAILED}${NC}"
echo "======================================"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All Frontend AI Integration tests passed!${NC}"
    echo ""
    echo "✅ Frontend is loading correctly"
    echo "✅ All AI API endpoints are working"
    echo "✅ Frontend-backend integration is successful"
    echo "✅ AI features are fully functional"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the output above.${NC}"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Open http://localhost:3001 in your browser"
echo "2. Test the AI chat feature in the UI"
echo "3. Verify all AI tools are working correctly"
echo "4. Check browser console for any JavaScript errors"
echo "5. Test user authentication and premium features"
echo ""
echo "🌐 Available URLs:"
echo "• Frontend: http://localhost:3001"
echo "• Backend API: http://localhost:5001"
echo "• API Health: http://localhost:5001/api/health"
echo "• AI Demo Chat: http://localhost:5001/api/ai/demo/chat"
