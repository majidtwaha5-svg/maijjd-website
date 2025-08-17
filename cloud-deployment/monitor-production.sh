#!/bin/bash

# Production Monitoring Script
# Monitor production deployment health

set -e

echo "📊 Production Monitoring Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment variables
if [ -f "production.env" ]; then
    export $(cat production.env | grep -v '^#' | xargs)
fi

if [ -f "frontend.env" ]; then
    export $(cat frontend.env | grep -v '^#' | xargs)
fi

echo -e "${BLUE}🔍 Checking Production Services...${NC}"

# Check backend health
if [ ! -z "$BACKEND_URL" ]; then
    echo -e "${YELLOW}🔧 Checking Backend Health...${NC}"
    if curl -s "$BACKEND_URL/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend URL not configured${NC}"
fi

# Check frontend accessibility
if [ ! -z "$FRONTEND_URL" ]; then
    echo -e "${YELLOW}⚡ Checking Frontend Accessibility...${NC}"
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${RED}❌ Frontend accessibility check failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Frontend URL not configured${NC}"
fi

echo ""
echo -e "${BLUE}📊 Monitoring Complete!${NC}"
echo ""
echo -e "${GREEN}🎯 Production Deployment Status:${NC}"
echo "Backend: $([ ! -z "$BACKEND_URL" ] && echo "✅ Configured" || echo "❌ Not configured")"
echo "Frontend: $([ ! -z "$FRONTEND_URL" ] && echo "✅ Configured" || echo "❌ Not configured")"
echo "Database: $([ ! -z "$MONGODB_URI" ] && echo "✅ Configured" || echo "❌ Not configured")"
echo "Cache: $([ ! -z "$REDIS_URI" ] && echo "✅ Configured" || echo "❌ Not configured")"
