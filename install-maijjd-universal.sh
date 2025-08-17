#!/bin/bash

# Maijjd Universal Installation Script
# Supports: Windows, macOS, Linux, Android, iOS
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logo and welcome message
echo -e "${BLUE}"
cat << "EOF"
███╗   ███╗ █████╗ ██╗     ██╗     ██╗██████╗ ██████╗ 
████╗ ████║██╔══██╗██║     ██║     ██║██╔══██╗██╔══██╗
██╔████╔██║███████║██║     ██║     ██║██║  ██║██║  ██║
██║╚██╔╝██║██╔══██║██║     ██║     ██║██║  ██║██║  ██║
██║ ╚═╝ ██║██║  ██║███████╗███████╗██║██████╔╝██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═════╝ ╚═════╝ 
EOF
echo -e "${NC}"
echo -e "${GREEN}🚀 Maijjd Universal Installation Script${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Function to detect platform
detect_platform() {
    case "$(uname -s)" in
        Linux*)     
            if [[ -f /etc/os-release ]]; then
                . /etc/os-release
                if [[ "$ID" == "android" ]]; then
                    echo "android"
                else
                    echo "linux"
                fi
            else
                echo "linux"
            fi
            ;;
        Darwin*)    echo "macos";;
        CYGWIN*)   echo "windows";;
        MINGW*)    echo "windows";;
        MSYS*)     echo "windows";;
        *)         echo "unknown";;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies based on platform
install_dependencies() {
    local platform=$1
    
    echo -e "${YELLOW}📦 Installing dependencies for $platform...${NC}"
    
    case $platform in
        "linux")
            if command_exists apt-get; then
                echo "Installing with apt-get..."
                sudo apt-get update
                sudo apt-get install -y curl wget git nodejs npm python3 python3-pip docker.io
            elif command_exists yum; then
                echo "Installing with yum..."
                sudo yum install -y curl wget git nodejs npm python3 python3-pip docker
            elif command_exists dnf; then
                echo "Installing with dnf..."
                sudo dnf install -y curl wget git nodejs npm python3 python3-pip docker
            elif command_exists pacman; then
                echo "Installing with pacman..."
                sudo pacman -S --noconfirm curl wget git nodejs npm python python-pip docker
            else
                echo -e "${RED}❌ Unsupported package manager. Please install manually:${NC}"
                echo "  - Node.js (v16+)"
                echo "  - npm (v8+)"
                echo "  - Python 3 (v3.8+)"
                echo "  - Docker"
                echo "  - Git"
                return 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                echo "Installing with Homebrew..."
                brew install node python3 docker git
            else
                echo -e "${YELLOW}📦 Installing Homebrew first...${NC}"
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                brew install node python3 docker git
            fi
            ;;
        "windows")
            echo -e "${YELLOW}📦 For Windows, please install the following manually:${NC}"
            echo "  1. Node.js: https://nodejs.org/"
            echo "  2. Python: https://python.org/"
            echo "  3. Docker Desktop: https://docker.com/products/docker-desktop"
            echo "  4. Git: https://git-scm.com/"
            echo ""
            echo "After installation, run this script again."
            return 1
            ;;
        "android")
            echo -e "${YELLOW}📱 Android installation requires Termux or similar terminal app${NC}"
            echo "Please install Termux from F-Droid and run:"
            echo "  pkg install nodejs python git"
            return 1
            ;;
        *)
            echo -e "${RED}❌ Unsupported platform: $platform${NC}"
            return 1
            ;;
    esac
}

# Function to install Maijjd
install_maijjd() {
    local platform=$1
    
    echo -e "${GREEN}🔧 Installing Maijjd...${NC}"
    
    # Clone repository if not already present
    if [[ ! -d "maijd_software" ]]; then
        echo "Cloning Maijjd repository..."
        git clone https://github.com/your-username/maijjd.git maijd_software || {
            echo "Creating local maijd_software directory..."
            mkdir -p maijd_software
        }
    fi
    
    cd maijd_software
    
    # Install Python dependencies
    if command_exists python3; then
        echo "Installing Python dependencies..."
        python3 -m pip install --user -r requirements.txt 2>/dev/null || {
            echo "Creating basic requirements.txt..."
            cat > requirements.txt << EOF
flask==2.3.3
flask-cors==4.0.0
python-dotenv==1.0.0
requests==2.31.0
gunicorn==21.2.0
EOF
            python3 -m pip install --user -r requirements.txt
        }
    fi
    
    # Install Node.js dependencies
    if command_exists npm; then
        echo "Installing Node.js dependencies..."
        cd ../frontend_maijjd
        npm install
        cd ../backend_maijjd
        npm install
        cd ..
    fi
    
    echo -e "${GREEN}✅ Maijjd installation completed!${NC}"
}

# Function to start services
start_services() {
    echo -e "${GREEN}🚀 Starting Maijjd services...${NC}"
    
    # Start backend
    echo "Starting backend server..."
    cd backend_maijjd
    PORT=5001 npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    echo "Starting frontend..."
    cd frontend_maijjd
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo -e "${GREEN}✅ Services started!${NC}"
    echo -e "${BLUE}🌐 Frontend: http://localhost:3000${NC}"
    echo -e "${BLUE}🔧 Backend: http://localhost:5001${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop services${NC}"
    
    # Wait for user to stop
    trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
}

# Function to create desktop shortcuts
create_shortcuts() {
    local platform=$1
    
    echo -e "${YELLOW}📱 Creating desktop shortcuts...${NC}"
    
    case $platform in
        "linux")
            cat > ~/Desktop/Maijjd.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Maijjd
Comment=Maijjd Software Suite
Exec=xdg-open http://localhost:3000
Icon=applications-internet
Terminal=false
Categories=Network;WebBrowser;
EOF
            chmod +x ~/Desktop/Maijjd.desktop
            ;;
        "macos")
            cat > ~/Desktop/Maijjd.command << EOF
#!/bin/bash
cd "$(dirname "$0")/../maijd_software"
./start-maijjd.sh
EOF
            chmod +x ~/Desktop/Maijjd.command
            ;;
    esac
    
    echo -e "${GREEN}✅ Desktop shortcuts created!${NC}"
}

# Function to create mobile app wrapper
create_mobile_wrapper() {
    local platform=$1
    
    if [[ "$platform" == "android" ]]; then
        echo -e "${YELLOW}📱 Creating Android app wrapper...${NC}"
        
        # Create a simple HTML wrapper that can be opened in browser
        cat > maijd_software/mobile-app.html << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maijjd Mobile</title>
    <style>
        body { margin: 0; padding: 0; }
        iframe { width: 100%; height: 100vh; border: none; }
    </style>
</head>
<body>
    <iframe src="http://localhost:3000" allowfullscreen></iframe>
</body>
</html>
EOF
        
        echo -e "${GREEN}✅ Mobile app wrapper created!${NC}"
        echo "Open maijd_software/mobile-app.html in your mobile browser"
    fi
}

# Main installation flow
main() {
    echo -e "${BLUE}🔍 Detecting platform...${NC}"
    PLATFORM=$(detect_platform)
    echo -e "${GREEN}✅ Platform detected: $PLATFORM${NC}"
    
    # Check if running as root (not recommended)
    if [[ $EUID -eq 0 ]]; then
        echo -e "${RED}❌ Please don't run this script as root${NC}"
        exit 1
    fi
    
    # Install dependencies
    if ! install_dependencies "$PLATFORM"; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    
    # Install Maijjd
    install_maijjd "$PLATFORM"
    
    # Create shortcuts
    create_shortcuts "$PLATFORM"
    
    # Create mobile wrapper if applicable
    create_mobile_wrapper "$PLATFORM"
    
    # Ask user if they want to start services
    echo ""
    read -p "Do you want to start Maijjd services now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_services
    else
        echo -e "${GREEN}🎉 Installation completed!${NC}"
        echo ""
        echo -e "${BLUE}To start Maijjd manually:${NC}"
        echo "  1. cd maijd_software"
        echo "  2. ./start-maijjd.sh"
        echo ""
        echo -e "${BLUE}Or start services individually:${NC}"
        echo "  Backend: cd backend_maijjd && npm start"
        echo "  Frontend: cd frontend_maijjd && npm start"
    fi
}

# Run main function
main "$@"
