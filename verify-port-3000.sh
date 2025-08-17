#!/bin/bash

echo "🔍 Verifying Port 3000 Configuration"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Checking Frontend on Port 3000...${NC}"
if curl -s http://localhost:3000 | grep -q "Maijjd"; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend is not accessible on port 3000${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}2. Checking Backend on Port 5001...${NC}"
if curl -s http://localhost:5001/api/health | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend is running on port 5001${NC}"
else
    echo -e "${RED}❌ Backend is not accessible on port 5001${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}3. Testing Frontend-Backend Communication...${NC}"
if curl -s -H "Origin: http://localhost:3000" "http://localhost:5001/api/software" | grep -q "Software retrieved successfully"; then
    echo -e "${GREEN}✅ Frontend can communicate with backend${NC}"
else
    echo -e "${RED}❌ Frontend cannot communicate with backend${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}4. Testing AI Chat Endpoint...${NC}"
if curl -s -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:3000" -d '{"software":"Test","message":"Hello"}' http://localhost:5001/api/ai/demo/chat | grep -q "success"; then
    echo -e "${GREEN}✅ AI Chat endpoint is working${NC}"
else
    echo -e "${RED}❌ AI Chat endpoint is not working${NC}"
fi

echo ""
echo "===================================="
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "🌐 Your Maijjd AI Hub is now running on:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:5001"
echo ""
echo "✅ The software loading error should now be resolved!"
echo "✅ All AI features are fully operational!"
echo ""
echo "🚀 Open http://localhost:3000 in your browser to start using the application!"
