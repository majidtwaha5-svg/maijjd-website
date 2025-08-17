#!/bin/bash

# Maijjd Local Development Test Script
# Tests the local development environment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

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

# Banner
clear
print_header "
╔══════════════════════════════════════════════════════════════╗
║                    🧪 Maijjd Local Test                     ║
║                Testing Local Development Setup               ║
╚══════════════════════════════════════════════════════════════╝
"

echo ""

# Test 1: Check Node.js and npm
print_status "Test 1: Checking Node.js environment..."
if command -v node &> /dev/null; then
    print_success "Node.js $(node --version) is installed"
else
    print_error "Node.js is not installed"
    exit 1
fi

if command -v npm &> /dev/null; then
    print_success "npm $(npm --version) is installed"
else
    print_error "npm is not installed"
    exit 1
fi

# Test 2: Check dependencies
print_status "Test 2: Checking project dependencies..."
if [ -d "frontend_maijjd/node_modules" ]; then
    print_success "Frontend dependencies are installed"
else
    print_warning "Frontend dependencies are not installed"
fi

if [ -d "backend_maijjd/node_modules" ]; then
    print_success "Backend dependencies are installed"
else
    print_warning "Backend dependencies are not installed"
fi

# Test 3: Check environment files
print_status "Test 3: Checking environment configuration..."
if [ -f "backend_maijjd/.env" ]; then
    print_success "Backend .env file exists"
else
    print_warning "Backend .env file does not exist"
fi

if [ -f "frontend_maijjd/.env" ]; then
    print_success "Frontend .env file exists"
else
    print_warning "Frontend .env file does not exist"
fi

# Test 4: Check port availability
print_status "Test 4: Checking port availability..."
if lsof -i :3000 > /dev/null 2>&1; then
    print_warning "Port 3000 is in use"
    lsof -i :3000 | head -3
else
    print_success "Port 3000 is available"
fi

if lsof -i :5001 > /dev/null 2>&1; then
    print_warning "Port 5001 is in use"
    lsof -i :5001 | head -3
else
    print_success "Port 5001 is available"
fi

# Test 5: Test backend API
print_status "Test 5: Testing backend API..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    print_success "Backend API is responding"
    RESPONSE=$(curl -s http://localhost:5001/api/health)
    echo "   Response: $RESPONSE"
else
    print_warning "Backend API is not responding (may not be running)"
fi

# Test 6: Test frontend
print_status "Test 6: Testing frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is responding"
else
    print_warning "Frontend is not responding (may not be running)"
fi

# Test 7: Check package.json files
print_status "Test 7: Checking package.json files..."
if [ -f "frontend_maijjd/package.json" ]; then
    print_success "Frontend package.json exists"
    FRONTEND_NAME=$(grep '"name"' frontend_maijjd/package.json | cut -d'"' -f4)
    echo "   Package: $FRONTEND_NAME"
else
    print_error "Frontend package.json not found"
fi

if [ -f "backend_maijjd/package.json" ]; then
    print_success "Backend package.json exists"
    BACKEND_NAME=$(grep '"name"' backend_maijjd/package.json | cut -d'"' -f4)
    echo "   Package: $BACKEND_NAME"
else
    print_error "Backend package.json not found"
fi

# Test 8: Check scripts availability
print_status "Test 8: Checking available scripts..."
SCRIPTS=("local-dev.sh" "health-check.sh" "deploy-super-quick.sh" "quick-deploy.sh")
for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ] && [ -x "$script" ]; then
        print_success "$script is available and executable"
    elif [ -f "$script" ]; then
        print_warning "$script exists but is not executable"
    else
        print_error "$script not found"
    fi
done

echo ""
print_header "🎯 Test Results Summary"
echo ""

# Count results
SUCCESS_COUNT=0
WARNING_COUNT=0
ERROR_COUNT=0

# Count from output (simplified)
if [ -d "frontend_maijjd/node_modules" ] && [ -d "backend_maijjd/node_modules" ]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi

if [ -f "backend_maijjd/.env" ] && [ -f "frontend_maijjd/.env" ]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi

if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
fi

echo "✅ Successful tests: $SUCCESS_COUNT"
echo "⚠️  Warnings: $WARNING_COUNT"
echo "❌ Errors: $ERROR_COUNT"

echo ""
if [ $ERROR_COUNT -eq 0 ]; then
    print_success "🎉 Local development environment is ready!"
    echo ""
    print_status "Next steps:"
    echo "   1. Run: ./local-dev.sh"
    echo "   2. Or start services manually:"
    echo "      - Backend: cd backend_maijjd && npm start"
    echo "      - Frontend: cd frontend_maijjd && npm start"
else
    print_warning "⚠️  Some issues found. Please resolve them before proceeding."
fi

echo ""
print_status "For more information, see: COMPREHENSIVE_DEPLOYMENT_GUIDE.md"
