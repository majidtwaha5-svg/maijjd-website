#!/bin/bash

echo "🚀 Maijjd Frontend - Netlify Deployment Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
else
    echo -e "${GREEN}✅ Netlify CLI is already installed${NC}"
fi

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

# Check if build folder exists
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Build folder not found!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: netlify login"
echo "2. Run: netlify init"
echo "3. Choose 'Create & configure a new site'"
echo "4. Choose your team"
echo "5. Choose a site name (or press enter for auto-generated)"
echo "6. Choose 'build' as your publish directory"
echo "7. Choose 'No' for GitHub integration (or Yes if you want it)"
echo ""
echo "Or deploy manually:"
echo "1. Go to https://app.netlify.com"
echo "2. Drag and drop the 'build' folder"
echo "3. Wait for deployment to complete"
echo ""
echo "For custom domain setup:"
echo "1. Go to Site settings > Domain management"
echo "2. Click 'Add custom domain'"
echo "3. Enter your domain name"
echo "4. Follow DNS configuration instructions"
echo ""
echo "Happy deploying! 🚀"
