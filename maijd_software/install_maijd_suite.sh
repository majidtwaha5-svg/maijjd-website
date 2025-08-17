#!/bin/bash

# Maijd Software Suite Installation Script
# Comprehensive installation script for all Maijd software with unlimited versioning

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Configuration
MAIJD_VERSION="2024.1.0"
INSTALL_DIR="${HOME}/maijd_software"
DOWNLOAD_URL="https://download.maijd.software"
MIRROR_URLS=(
    "https://download.maijd.software"
    "https://mirror1.maijd.software"
    "https://mirror2.maijd.software"
)

# Software categories
SOFTWARE_CATEGORIES=(
    "system_software"
    "application_software"
    "crm_software"
    "crs_software"
    "dev_tools"
    "programming_software"
    "embedded_software"
    "real_time_software"
    "scientific_software"
)

# Check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    # Check OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    
    print_success "Operating system: $OS"
    
    # Check available disk space (at least 10GB) - Fixed for macOS
    if [[ "$OS" == "macos" ]]; then
        available_space=$(df -g "$HOME" | awk 'NR==2 {print $4}' | sed 's/G//')
    else
        available_space=$(df -BG "$HOME" | awk 'NR==2 {print $4}' | sed 's/G//')
    fi
    
    if [ "$available_space" -lt 10 ]; then
        print_error "Insufficient disk space. Need at least 10GB, available: ${available_space}GB"
        exit 1
    fi
    
    print_success "Available disk space: ${available_space}GB"
    
    # Check internet connectivity (optional for demo)
    if ping -c 1 google.com > /dev/null 2>&1; then
        print_success "Internet connectivity: OK"
    else
        print_warning "No internet connectivity detected - will use demo packages"
    fi
}

# Create installation directories
create_directories() {
    print_status "Creating installation directories..."
    
    directories=(
        "$INSTALL_DIR"
        "$INSTALL_DIR/versions"
        "$INSTALL_DIR/cache"
        "$INSTALL_DIR/config"
        "$INSTALL_DIR/logs"
        "$INSTALL_DIR/bin"
        "$INSTALL_DIR/lib"
        "$INSTALL_DIR/include"
    )
    
    for directory in "${directories[@]}"; do
        mkdir -p "$directory"
        print_status "Created: $directory"
    done
    
    print_success "Installation directories created"
}

# Create demo package for demonstration
create_demo_package() {
    local category=$1
    local version=$2
    local target_dir=$3
    
    print_status "Creating demo package for $category v$version..."
    
    # Create demo files
    cat > "$target_dir/README.md" << EOF
# Maijd $category v$version

This is a demo package for $category version $version.

## Features
- Unlimited versioning
- High-performance optimization
- Easy installation
- Cross-platform compatibility

## Installation
\`\`\`bash
./install.sh
\`\`\`

## Usage
\`\`\`bash
maijd-$category --help
\`\`\`

Generated on $(date)
EOF
    
    # Create installation script
    cat > "$target_dir/install.sh" << EOF
#!/bin/bash
# Installation script for Maijd $category v$version

echo "Installing Maijd $category v$version..."
echo "Installation completed successfully!"
EOF
    chmod +x "$target_dir/install.sh"
    
    # Create binary
    mkdir -p "$target_dir/bin"
    cat > "$target_dir/bin/maijd-$category" << EOF
#!/bin/bash
echo "Maijd $category v$version"
echo "This is a demo binary for $category"
echo "Usage: maijd-$category [options]"
echo "Features:"
echo "  - Unlimited versioning"
echo "  - High-performance optimization"
echo "  - Easy installation"
echo "  - Cross-platform compatibility"
EOF
    chmod +x "$target_dir/bin/maijd-$category"
    
    # Create config file
    cat > "$target_dir/config.json" << EOF
{
  "name": "$category",
  "version": "$version",
  "description": "Demo package for $category",
  "features": [
    "Unlimited versioning",
    "High-performance optimization",
    "Easy installation",
    "Cross-platform compatibility"
  ],
  "installed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    
    print_success "Demo package created for $category v$version"
}

# Install software category
install_category() {
    local category=$1
    local version=${2:-$MAIJD_VERSION}
    
    print_status "Installing $category version $version..."
    
    local category_dir="$INSTALL_DIR/versions/$category"
    local version_dir="$category_dir/$version"
    
    # Create version directory
    mkdir -p "$version_dir"
    
    # Create demo package
    create_demo_package "$category" "$version" "$version_dir"
    
    # Create symlinks
    if [ -f "$version_dir/bin/maijd-$category" ]; then
        ln -sf "$version_dir/bin/maijd-$category" "$INSTALL_DIR/bin/maijd-$category"
    fi
    
    # Update configuration
    update_config "$category" "$version" "$version_dir"
    
    print_success "Successfully installed $category v$version"
    return 0
}

# Update configuration
update_config() {
    local category=$1
    local version=$2
    local path=$3
    
    local config_file="$INSTALL_DIR/config/installed_software.json"
    
    # Load existing config or create new
    if [ -f "$config_file" ]; then
        config=$(cat "$config_file")
    else
        config='{"installed_software":{}}'
    fi
    
    # Update config using jq if available, otherwise use sed
    if command -v jq > /dev/null 2>&1; then
        config=$(echo "$config" | jq --arg cat "$category" --arg ver "$version" --arg path "$path" \
            '.installed_software[$cat] = {"version": $ver, "path": $path, "installed_at": now | strftime("%Y-%m-%dT%H:%M:%SZ")}')
    else
        # Simple JSON update without jq
        config=$(echo "$config" | sed "s/\"installed_software\":{/\"installed_software\":{\"$category\":{\"version\":\"$version\",\"path\":\"$path\",\"installed_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}/")
    fi
    
    echo "$config" > "$config_file"
}

# Install all software categories
install_all_categories() {
    print_status "Installing all Maijd software categories..."
    
    local success_count=0
    local total_count=${#SOFTWARE_CATEGORIES[@]}
    
    for category in "${SOFTWARE_CATEGORIES[@]}"; do
        if install_category "$category"; then
            ((success_count++))
        fi
    done
    
    print_success "Installed $success_count out of $total_count categories"
    
    if [ $success_count -eq $total_count ]; then
        print_success "All software categories installed successfully!"
    else
        print_warning "Some software categories failed to install"
    fi
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Add to PATH
    local bashrc="$HOME/.bashrc"
    local zshrc="$HOME/.zshrc"
    local profile="$HOME/.profile"
    
    local path_line="export PATH=\"\$PATH:$INSTALL_DIR/bin\""
    
    # Add to bashrc
    if [ -f "$bashrc" ] && ! grep -q "$INSTALL_DIR/bin" "$bashrc"; then
        echo "" >> "$bashrc"
        echo "# Maijd Software Suite" >> "$bashrc"
        echo "$path_line" >> "$bashrc"
        print_status "Added to $bashrc"
    fi
    
    # Add to zshrc
    if [ -f "$zshrc" ] && ! grep -q "$INSTALL_DIR/bin" "$zshrc"; then
        echo "" >> "$zshrc"
        echo "# Maijd Software Suite" >> "$zshrc"
        echo "$path_line" >> "$zshrc"
        print_status "Added to $zshrc"
    fi
    
    # Add to profile
    if [ -f "$profile" ] && ! grep -q "$INSTALL_DIR/bin" "$profile"; then
        echo "" >> "$profile"
        echo "# Maijd Software Suite" >> "$profile"
        echo "$path_line" >> "$profile"
        print_status "Added to $profile"
    fi
    
    print_success "Environment setup completed"
}

# Create launcher script
create_launcher() {
    print_status "Creating launcher script..."
    
    cat > "$INSTALL_DIR/bin/maijd" << 'EOF'
#!/bin/bash
# Maijd Software Suite Launcher

MAIJD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

show_help() {
    echo "Maijd Software Suite v2024.1.0"
    echo ""
    echo "Usage: maijd [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  list                    - List installed software"
    echo "  install <category>      - Install software category"
    echo "  uninstall <category>    - Uninstall software category"
    echo "  update <category>       - Update software category"
    echo "  info <category>         - Show software information"
    echo "  version                 - Show version information"
    echo "  help                    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  maijd list"
    echo "  maijd install system_software"
    echo "  maijd update crm_software"
}

list_installed() {
    local config_file="$MAIJD_DIR/config/installed_software.json"
    if [ -f "$config_file" ]; then
        echo "Installed software:"
        echo "=================="
        if command -v jq > /dev/null 2>&1; then
            jq -r '.installed_software | to_entries[] | "\(.key): \(.value.version)"' "$config_file"
        else
            cat "$config_file" | grep -o '"[^"]*":' | sed 's/":$//' | sed 's/^"//'
        fi
    else
        echo "No software installed"
    fi
}

case "${1:-help}" in
    list)
        list_installed
        ;;
    install)
        if [ -z "$2" ]; then
            echo "Usage: maijd install <category>"
            exit 1
        fi
        "$MAIJD_DIR/install_maijd_suite.sh" install "$2"
        ;;
    uninstall)
        if [ -z "$2" ]; then
            echo "Usage: maijd uninstall <category>"
            exit 1
        fi
        "$MAIJD_DIR/install_maijd_suite.sh" uninstall "$2"
        ;;
    update)
        if [ -z "$2" ]; then
            echo "Usage: maijd update <category>"
            exit 1
        fi
        "$MAIJD_DIR/install_maijd_suite.sh" update "$2"
        ;;
    info)
        if [ -z "$2" ]; then
            echo "Usage: maijd info <category>"
            exit 1
        fi
        "$MAIJD_DIR/install_maijd_suite.sh" info "$2"
        ;;
    version)
        echo "Maijd Software Suite v2024.1.0"
        echo "Installation directory: $MAIJD_DIR"
        ;;
    help|*)
        show_help
        ;;
esac
EOF
    
    chmod +x "$INSTALL_DIR/bin/maijd"
    print_success "Launcher script created"
}

# Main installation function
main() {
    echo "=========================================="
    echo "    Maijd Software Suite Installer"
    echo "    Version: $MAIJD_VERSION"
    echo "=========================================="
    echo ""
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_warning "Running as root is not recommended"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check system requirements
    check_system_requirements
    
    # Create directories
    create_directories
    
    # Install all categories
    install_all_categories
    
    # Setup environment
    setup_environment
    
    # Create launcher
    create_launcher
    
    echo ""
    echo "=========================================="
    print_success "Maijd Software Suite installation completed!"
    echo "=========================================="
    echo ""
    echo "Installation directory: $INSTALL_DIR"
    echo ""
    echo "To start using Maijd software:"
    echo "1. Restart your terminal or run: source ~/.bashrc"
    echo "2. Use the launcher: maijd --help"
    echo "3. List installed software: maijd list"
    echo ""
    echo "For more information, visit: https://docs.maijd.software"
    echo ""
}

# Handle command line arguments
case "${1:-install}" in
    install)
        if [ -n "$2" ]; then
            # Install specific category
            check_system_requirements
            create_directories
            install_category "$2" "$3"
            setup_environment
        else
            # Install all categories
            main
        fi
        ;;
    uninstall)
        if [ -z "$2" ]; then
            echo "Usage: $0 uninstall <category>"
            exit 1
        fi
        print_status "Uninstalling $2..."
        rm -rf "$INSTALL_DIR/versions/$2"
        rm -f "$INSTALL_DIR/bin/maijd-$2"
        print_success "Uninstalled $2"
        ;;
    update)
        if [ -z "$2" ]; then
            echo "Usage: $0 update <category>"
            exit 1
        fi
        print_status "Updating $2..."
        install_category "$2" "$MAIJD_VERSION"
        print_success "Updated $2"
        ;;
    info)
        if [ -z "$2" ]; then
            echo "Usage: $0 info <category>"
            exit 1
        fi
        local config_file="$INSTALL_DIR/config/installed_software.json"
        if [ -f "$config_file" ] && command -v jq > /dev/null 2>&1; then
            jq ".installed_software.$2" "$config_file"
        else
            echo "Information not available"
        fi
        ;;
    help|*)
        echo "Maijd Software Suite Installer"
        echo ""
        echo "Usage: $0 [COMMAND] [OPTIONS]"
        echo ""
        echo "Commands:"
        echo "  install [category] [version]  - Install all software or specific category"
        echo "  uninstall <category>          - Uninstall specific category"
        echo "  update <category>             - Update specific category"
        echo "  info <category>               - Show category information"
        echo "  help                          - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 install                    # Install all software"
        echo "  $0 install system_software    # Install system software only"
        echo "  $0 update crm_software        # Update CRM software"
        ;;
esac
