#!/bin/bash

# Maijjd Start Script
# Starts both backend and frontend services

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Maijjd Services...${NC}"

# Check if we're in the right directory
if [[ ! -d "backend_maijjd" ]] || [[ ! -d "frontend_maijjd" ]]; then
    echo -e "${YELLOW}⚠️  Please run this script from the Maijjd project root directory${NC}"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    if [[ -n "$BACKEND_PID" ]]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [[ -n "$FRONTEND_PID" ]]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Set trap for cleanup
trap cleanup INT TERM EXIT

# Start backend server
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd backend_maijjd
PORT=5001 npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 5

# Check if backend is running
if ! curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${YELLOW}⚠️  Backend might not be ready yet, continuing...${NC}"
fi

# Start frontend
echo -e "${BLUE}🌐 Starting frontend...${NC}"
cd frontend_maijjd
npm start &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo -e "${BLUE}🌐 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 Backend: http://localhost:5001${NC}"
echo -e "${BLUE}📊 Health Check: http://localhost:5001/api/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for services
wait
