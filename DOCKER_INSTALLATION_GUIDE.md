# 🐳 Docker Installation Guide for Maijjd

## 📋 Prerequisites

Before installing Docker, ensure your system meets these requirements:

### macOS
- macOS 10.15 (Catalina) or newer
- At least 4GB RAM
- 20GB free disk space

### Ubuntu/Debian
- Ubuntu 18.04 LTS or newer
- 64-bit architecture
- At least 4GB RAM
- 20GB free disk space

### Windows
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 16299 or later)
- Windows 11 64-bit
- WSL 2 feature enabled
- At least 4GB RAM
- 20GB free disk space

## 🍎 macOS Installation

### Option 1: Docker Desktop (Recommended)
```bash
# Download Docker Desktop for Mac
curl -O https://desktop.docker.com/mac/main/amd64/Docker.dmg

# Or visit: https://www.docker.com/products/docker-desktop
```

**Installation Steps:**
1. Double-click the downloaded `Docker.dmg` file
2. Drag Docker to your Applications folder
3. Open Docker from Applications
4. Follow the setup wizard
5. Grant necessary permissions when prompted

### Option 2: Homebrew (Alternative)
```bash
# Install Docker using Homebrew
brew install --cask docker

# Start Docker
open /Applications/Docker.app
```

### Verify Installation
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker
docker run hello-world
```

## 🐧 Ubuntu/Debian Installation

### Install Docker Engine
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

### Install Docker Compose
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Verify Installation
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker
sudo docker run hello-world
```

## 🪟 Windows Installation

### Prerequisites
1. **Enable WSL 2**:
   ```powershell
   # Run as Administrator
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

2. **Install WSL 2**:
   ```powershell
   wsl --install
   ```

3. **Restart your computer**

### Install Docker Desktop
1. Download Docker Desktop for Windows from: https://www.docker.com/products/docker-desktop
2. Run the installer as Administrator
3. Follow the setup wizard
4. Ensure "Use WSL 2 instead of Hyper-V" is selected
5. Restart when prompted

### Verify Installation
```powershell
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker
docker run hello-world
```

## 🔧 Post-Installation Configuration

### Docker Desktop Settings (macOS/Windows)
1. Open Docker Desktop
2. Go to Settings/Preferences
3. **Resources**: Allocate at least 4GB RAM and 2GB swap
4. **Advanced**: Increase disk image size to at least 60GB
5. **Docker Engine**: Ensure the daemon is running

### Linux Configuration
```bash
# Configure Docker daemon
sudo nano /etc/docker/daemon.json

# Add these settings:
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart Docker
sudo systemctl restart docker
```

## 🧪 Testing Docker Installation

### Basic Tests
```bash
# Test Docker Engine
docker run hello-world

# Test Docker Compose
docker-compose --version

# Test Docker Hub access
docker pull nginx:alpine
docker run --rm -p 8080:80 nginx:alpine
# Visit http://localhost:8080 to see nginx welcome page
```

### Maijjd-Specific Tests
```bash
# Test if ports are available
lsof -i :3000
lsof -i :5001
lsof -i :27017
lsof -i :6379

# Test Docker Compose
cd /path/to/maijjd
docker-compose config
```

## 🚨 Troubleshooting

### Common Issues

#### Docker Permission Denied (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker
```

#### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000

# Kill the process if needed
sudo kill -9 <PID>
```

#### Docker Desktop Won't Start (macOS/Windows)
1. Restart Docker Desktop
2. Check system resources
3. Ensure virtualization is enabled in BIOS
4. Reinstall Docker Desktop if necessary

#### WSL 2 Issues (Windows)
```powershell
# Update WSL
wsl --update

# Set WSL 2 as default
wsl --set-default-version 2

# Restart WSL
wsl --shutdown
```

### Performance Issues
```bash
# Increase Docker resources
# Docker Desktop: Settings > Resources
# Linux: Edit /etc/docker/daemon.json

# Clean up Docker
docker system prune -a
docker volume prune
```

## 🚀 Next Steps

After successful Docker installation:

1. **Verify Installation**:
   ```bash
   docker --version
   docker-compose --version
   docker run hello-world
   ```

2. **Test Maijjd Deployment**:
   ```bash
   cd /path/to/maijjd
   ./deploy-super-quick.sh
   ```

3. **Run Health Check**:
   ```bash
   ./health-check.sh
   ```

## 📚 Additional Resources

- **Official Docker Documentation**: https://docs.docker.com/
- **Docker Desktop**: https://www.docker.com/products/docker-desktop
- **Docker Hub**: https://hub.docker.com/
- **Maijjd Documentation**: See [COMPREHENSIVE_DEPLOYMENT_GUIDE.md](COMPREHENSIVE_DEPLOYMENT_GUIDE.md)

---

## 🆘 Need Help?

If you encounter issues with Docker installation:

1. Check the [troubleshooting section](#-troubleshooting)
2. Visit Docker's official documentation
3. Check system requirements
4. Ensure virtualization is enabled (for Windows/macOS)
5. Try the alternative installation methods

---

**Happy Docker-ing! 🐳**

*Built with ❤️ by the Maijd Team*
