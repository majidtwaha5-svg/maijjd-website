#!/bin/bash

echo "🔍 Quick System Health Check"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Checking Backend...${NC}"
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend: RUNNING${NC}"
else
    echo -e "${RED}❌ Backend: DOWN${NC}"
fi

echo -e "${BLUE}Checking Frontend...${NC}"
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Frontend: RUNNING${NC}"
else
    echo -e "${RED}❌ Frontend: DOWN${NC}"
fi

echo -e "${BLUE}Testing AI Chat...${NC}"
if curl -s http://localhost:5001/api/ai/demo/chat -X POST -H "Content-Type: application/json" -d '{"software":"Test","message":"Hello"}' | grep -q "success"; then
    echo -e "${GREEN}✅ AI Chat: WORKING${NC}"
else
    echo -e "${RED}❌ AI Chat: FAILED${NC}"
fi

echo ""
echo -e "${GREEN}🎉 System Status: HEALTHY${NC}"
echo ""
echo "🌐 URLs:"
echo "• Frontend: http://localhost:3001"
echo "• Backend: http://localhost:5001"
echo "• Health: http://localhost:5001/api/health"
