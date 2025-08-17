#!/bin/bash

# Comprehensive Health Check Script for Maijjd Full Project
# This script tests all endpoints and identifies issues

echo "🔍 Maijjd Comprehensive Health Check Starting..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:5001"
FRONTEND_URL="http://localhost:3001"
HEALTH_ENDPOINT="/api/health"
AI_ENDPOINT="/api/ai/integration"
SERVICES_ENDPOINT="/api/services"
SOFTWARE_ENDPOINT="/api/software"

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -n "Testing $description... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$BACKEND_URL$endpoint")
    fi
    
    # Extract status code (last 3 characters)
    status_code=${response: -3}
    # Extract response body (everything except last 3 characters)
    response_body=${response%???}
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC} (Status: $status_code)"
        echo "   Response: $response_body" | head -c 100
        echo "..."
    elif [ "$status_code" = "401" ]; then
        echo -e "${YELLOW}⚠️  AUTH REQUIRED${NC} (Status: $status_code)"
    elif [ "$status_code" = "404" ]; then
        echo -e "${RED}❌ NOT FOUND${NC} (Status: $status_code)"
    elif [ "$status_code" = "500" ]; then
        echo -e "${RED}❌ SERVER ERROR${NC} (Status: $status_code)"
        echo "   Error: $response_body"
    else
        echo -e "${RED}❌ FAILED${NC} (Status: $status_code)"
        echo "   Response: $response_body"
    fi
    echo
}

# Function to test AI chat functionality
test_ai_chat() {
    echo "🤖 Testing AI Chat Functionality..."
    echo "--------------------------------"
    
    # Test demo chat endpoint
    test_endpoint "/api/ai/demo/chat" "AI Demo Chat" "POST" '{"message":"Hello, how can you help me?","software":"Maijjd AI Hub"}'
    
    # Test AI integration endpoint
    test_endpoint "$AI_ENDPOINT" "AI Integration Status"
    
    # Test with invalid data
    test_endpoint "/api/ai/demo/chat" "AI Demo Chat (Invalid Data)" "POST" '{"invalid":"data"}'
    
    # Test with missing message
    test_endpoint "/api/ai/demo/chat" "AI Demo Chat (Missing Message)" "POST" '{"software":"Test Software"}'
}

# Function to test backend services
test_backend_services() {
    echo "🔧 Testing Backend Services..."
    echo "-----------------------------"
    
    # Test health endpoint
    test_endpoint "$HEALTH_ENDPOINT" "Backend Health Check"
    
    # Test services endpoint
    test_endpoint "$SERVICES_ENDPOINT" "Services Endpoint"
    
    # Test software endpoint
    test_endpoint "$SOFTWARE_ENDPOINT" "Software Endpoint"
    
    # Test auth endpoints (should return 401 for unauthenticated)
    test_endpoint "/api/auth/profile" "Auth Profile (Unauthenticated)"
    test_endpoint "/api/auth/login" "Auth Login (No Credentials)" "POST" '{}'
}

# Function to test frontend accessibility
test_frontend() {
    echo "🌐 Testing Frontend Accessibility..."
    echo "----------------------------------"
    
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo -e "${GREEN}✅ Frontend is accessible at $FRONTEND_URL${NC}"
    else
        echo -e "${RED}❌ Frontend is not accessible at $FRONTEND_URL${NC}"
        echo "   Make sure the frontend is running on port 3001"
    fi
    echo
}

# Function to test database connectivity
test_database() {
    echo "🗄️  Testing Database Connectivity..."
    echo "-----------------------------------"
    
    # Test if MongoDB is running (if applicable)
    if command -v mongosh >/dev/null 2>&1; then
        if mongosh --eval "db.runCommand('ping')" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ MongoDB is running and accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  MongoDB is installed but not responding${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  MongoDB client not found${NC}"
    fi
    
    # Test Redis if available
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli ping >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Redis is running and accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  Redis is installed but not responding${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Redis client not found${NC}"
    fi
    echo
}

# Function to check process status
check_processes() {
    echo "📊 Checking Process Status..."
    echo "----------------------------"
    
    # Check backend process
    if pgrep -f "node.*server.js" > /dev/null; then
        echo -e "${GREEN}✅ Backend process is running${NC}"
        echo "   PID: $(pgrep -f 'node.*server.js')"
    else
        echo -e "${RED}❌ Backend process is not running${NC}"
    fi
    
    # Check frontend process
    if pgrep -f "react-scripts start" > /dev/null; then
        echo -e "${GREEN}✅ Frontend process is running${NC}"
        echo "   PID: $(pgrep -f 'react-scripts start')"
    else
        echo -e "${RED}❌ Frontend process is not running${NC}"
    fi
    
    # Check port usage
    echo
    echo "Port Usage:"
    echo "   Port 5001 (Backend): $(lsof -i :5001 2>/dev/null | grep LISTEN || echo 'Not in use')"
    echo "   Port 3001 (Frontend): $(lsof -i :3001 2>/dev/null | grep LISTEN || echo 'Not in use')"
    echo "   Port 3000 (Default React): $(lsof -i :3000 2>/dev/null | grep LISTEN || echo 'Not in use')"
    echo
}

# Function to generate summary report
generate_summary() {
    echo "📋 Health Check Summary"
    echo "======================="
    echo "Timestamp: $(date)"
    echo "Backend URL: $BACKEND_URL"
    echo "Frontend URL: $FRONTEND_URL"
    echo
    
    # Check if all critical endpoints are working
    echo "Critical Endpoints Status:"
    
    # Test critical endpoints silently
    health_status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$HEALTH_ENDPOINT")
    ai_status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$AI_ENDPOINT")
    
    if [ "$health_status" = "200" ]; then
        echo -e "   Health Check: ${GREEN}✅ OK${NC}"
    else
        echo -e "   Health Check: ${RED}❌ FAILED (Status: $health_status)${NC}"
    fi
    
    if [ "$ai_status" = "200" ]; then
        echo -e "   AI Integration: ${GREEN}✅ OK${NC}"
    else
        echo -e "   AI Integration: ${RED}❌ FAILED (Status: $ai_status)${NC}"
    fi
    
    echo
}

# Main execution
main() {
    echo "🚀 Starting comprehensive health check..."
    echo
    
    # Check if backend is accessible
    if ! curl -s "$BACKEND_URL$HEALTH_ENDPOINT" > /dev/null; then
        echo -e "${RED}❌ Backend is not accessible at $BACKEND_URL${NC}"
        echo "   Please ensure the backend server is running on port 5001"
        echo
        check_processes
        exit 1
    fi
    
    # Run all tests
    test_backend_services
    test_ai_chat
    test_frontend
    test_database
    check_processes
    generate_summary
    
    echo "🏁 Health check completed!"
}

# Run main function
main "$@"
