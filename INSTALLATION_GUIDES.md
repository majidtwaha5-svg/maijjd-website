# Maijjd Installation Guides

## 🚀 Universal Installation (Recommended)

For most users, use our universal installation script:

```bash
# Make the script executable
chmod +x install-maijjd-universal.sh

# Run the installation
./install-maijjd-universal.sh
```

This script automatically detects your platform and installs everything needed.

## 📱 Platform-Specific Installation

### 🍎 macOS

#### Prerequisites
- macOS 10.15 (Catalina) or later
- Homebrew (will be installed automatically if missing)

#### Installation Steps
1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Dependencies**:
   ```bash
   brew install node python3 docker git
   ```

3. **Clone and Install Maijjd**:
   ```bash
   git clone https://github.com/your-username/maijjd.git
   cd maijjd
   chmod +x install-maijjd-universal.sh
   ./install-maijjd-universal.sh
   ```

#### Alternative Manual Installation
```bash
# Install dependencies
brew install node python3 docker git

# Clone repository
git clone https://github.com/your-username/maijjd.git
cd maijjd

# Install backend dependencies
cd backend_maijjd
npm install
cd ..

# Install frontend dependencies
cd frontend_maijjd
npm install
cd ..

# Start services
./start-maijjd.sh
```

### 🐧 Linux (Ubuntu/Debian)

#### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- sudo privileges

#### Installation Steps
1. **Update system**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install dependencies**:
   ```bash
   sudo apt install -y curl wget git nodejs npm python3 python3-pip docker.io
   ```

3. **Install Maijjd**:
   ```bash
   git clone https://github.com/your-username/maijjd.git
   cd maijjd
   chmod +x install-maijjd-universal.sh
   ./install-maijjd-universal.sh
   ```

#### Alternative Manual Installation
```bash
# Install dependencies
sudo apt install -y curl wget git nodejs npm python3 python3-pip docker.io

# Clone repository
git clone https://github.com/your-username/maijjd.git
cd maijjd

# Install backend dependencies
cd backend_maijjd
npm install
cd ..

# Install frontend dependencies
cd frontend_maijjd
npm install
cd ..

# Start services
./start-maijjd.sh
```

### 🐧 Linux (CentOS/RHEL/Fedora)

#### Prerequisites
- CentOS 8+ or RHEL 8+ or Fedora 32+
- sudo privileges

#### Installation Steps
1. **Install dependencies**:
   ```bash
   # For CentOS/RHEL
   sudo yum install -y curl wget git nodejs npm python3 python3-pip docker
   
   # For Fedora
   sudo dnf install -y curl wget git nodejs npm python3 python3-pip docker
   ```

2. **Install Maijjd**:
   ```bash
   git clone https://github.com/your-username/maijjd.git
   cd maijjd
   chmod +x install-maijjd-universal.sh
   ./install-maijjd-universal.sh
   ```

### 🪟 Windows

#### Prerequisites
- Windows 10 or later
- Administrator privileges
- Git for Windows
- Node.js (LTS version)
- Python 3.8+
- Docker Desktop

#### Installation Steps
1. **Install Required Software**:
   - [Git for Windows](https://git-scm.com/download/win)
   - [Node.js LTS](https://nodejs.org/)
   - [Python 3.8+](https://python.org/)
   - [Docker Desktop](https://docker.com/products/docker-desktop)

2. **Clone Repository**:
   ```cmd
   git clone https://github.com/your-username/maijjd.git
   cd maijjd
   ```

3. **Install Dependencies**:
   ```cmd
   # Install backend dependencies
   cd backend_maijjd
   npm install
   cd ..
   
   # Install frontend dependencies
   cd frontend_maijjd
   npm install
   cd ..
   ```

4. **Start Services**:
   ```cmd
   # Start backend (in one terminal)
   cd backend_maijjd
   set PORT=5001
   npm start
   
   # Start frontend (in another terminal)
   cd frontend_maijjd
   npm start
   ```

#### Using Windows Subsystem for Linux (WSL)
If you prefer using WSL:

```bash
# Install WSL2
wsl --install

# Restart and open WSL
wsl

# Follow Linux installation steps above
```

### 🤖 Android

#### Prerequisites
- Android 8.0 (API level 26) or later
- Termux app (from F-Droid)
- Internet connection

#### Installation Steps
1. **Install Termux**:
   - Download from [F-Droid](https://f-droid.org/packages/com.termux/)
   - Install and open Termux

2. **Install Dependencies**:
   ```bash
   pkg update
   pkg install nodejs python git curl wget
   ```

3. **Clone and Install Maijjd**:
   ```bash
   git clone https://github.com/your-username/maijjd.git
   cd maijjd
   chmod +x install-maijjd-universal.sh
   ./install-maijjd-universal.sh
   ```

#### Alternative: Web App
For easier access, you can also:
1. Start Maijjd on your computer
2. Access it from your Android browser at `http://YOUR_COMPUTER_IP:3000`
3. Add to home screen for app-like experience

### 📱 iOS

#### Prerequisites
- iOS 12.0 or later
- Safari browser
- Computer running Maijjd (for local access)

#### Installation Steps
1. **Start Maijjd on your computer** (Windows, macOS, or Linux)

2. **Find your computer's IP address**:
   - **macOS/Linux**: `ifconfig` or `ip addr`
   - **Windows**: `ipconfig`

3. **Access from iOS**:
   - Open Safari on your iOS device
   - Navigate to `http://YOUR_COMPUTER_IP:3000`
   - Tap the share button and "Add to Home Screen"

#### Alternative: Use iSH Terminal
1. Install [iSH](https://ish.app/) from App Store
2. Follow Linux installation steps
3. Access via localhost in iSH

## 🔧 Docker Installation (All Platforms)

### Prerequisites
- Docker and Docker Compose installed

### Installation Steps
```bash
# Clone repository
git clone https://github.com/your-username/maijjd.git
cd maijjd

# Start with Docker
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:5001
```

## 🚀 Quick Start After Installation

1. **Navigate to project directory**:
   ```bash
   cd maijjd
   ```

2. **Start services**:
   ```bash
   ./start-maijjd.sh
   ```

3. **Access Maijjd**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001
   - Health Check: http://localhost:5001/api/health

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5001

# Kill the process
kill -9 <PID>
```

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Use nvm to manage versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Python Version Issues
```bash
# Check Python version
python3 --version

# Use pyenv to manage versions
curl https://pyenv.run | bash
pyenv install 3.11.0
pyenv global 3.11.0
```

#### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/your-username/maijjd/issues)
- **Documentation**: Check the [README.md](README.md)
- **Community**: Join our [Discord server](https://discord.gg/maijjd)

## 📋 System Requirements

### Minimum Requirements
- **CPU**: 2 cores, 1.5 GHz
- **RAM**: 4 GB
- **Storage**: 10 GB free space
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Network**: Internet connection for initial setup

### Recommended Requirements
- **CPU**: 4 cores, 2.5 GHz
- **RAM**: 8 GB
- **Storage**: 20 GB free space (SSD recommended)
- **OS**: Latest stable versions
- **Network**: High-speed internet connection

## 🔒 Security Notes

- Never run installation scripts as root
- Keep your system and dependencies updated
- Use strong passwords for any accounts
- Enable firewall protection
- Regularly backup your data

## 📚 Next Steps

After successful installation:

1. **Explore the Dashboard**: Navigate to http://localhost:3000
2. **Read Documentation**: Check the [docs/](docs/) folder
3. **Customize**: Modify configuration files as needed
4. **Deploy**: Follow [deployment guides](DEPLOYMENT_OPTIONS.md)
5. **Contribute**: Help improve Maijjd on GitHub

---

**Need help?** Check our [troubleshooting guide](docs/TROUBLESHOOTING.md) or [create an issue](https://github.com/your-username/maijjd/issues).
