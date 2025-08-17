# Docker SSL Configuration Guide for Maijjd Project

This guide explains how to set up SSL/HTTPS for your Maijjd project running in Docker containers.

## 🚀 Quick Start

### 1. Basic SSL Setup (Self-Signed Certificate)
```bash
# Generate self-signed certificate and create SSL configuration
./docker-ssl-setup.sh --self-signed

# Start SSL-enabled services
./docker-ssl-setup.sh --start

# Test SSL connection
./docker-ssl-setup.sh --test
```

### 2. Production SSL Setup (Let's Encrypt)
```bash
# Setup Let's Encrypt certificate for your domain
./docker-ssl-setup.sh --domain yourdomain.com --letsencrypt --auto-renew

# Start services and test
./docker-ssl-setup.sh --start --test
```

## 📋 Prerequisites

- Docker and Docker Compose installed and running
- OpenSSL (for certificate generation)
- curl (for health checks)
- A domain name pointing to your server (for Let's Encrypt)

## 🔧 Script Options

| Option | Description | Example |
|--------|-------------|---------|
| `-h, --help` | Show help message | `./docker-ssl-setup.sh --help` |
| `-d, --domain` | Set domain name | `./docker-ssl-setup.sh --domain example.com` |
| `-e, --email` | Set email for Let's Encrypt | `./docker-ssl-setup.sh --email admin@example.com` |
| `-s, --self-signed` | Generate self-signed certificate | `./docker-ssl-setup.sh --self-signed` |
| `-l, --letsencrypt` | Setup Let's Encrypt certificate | `./docker-ssl-setup.sh --letsencrypt` |
| `-a, --auto-renew` | Setup automatic certificate renewal | `./docker-ssl-setup.sh --auto-renew` |
| `-t, --test` | Test SSL connection after setup | `./docker-ssl-setup.sh --test` |
| `-c, --check` | Check SSL certificate status | `./docker-ssl-setup.sh --check` |
| `--start` | Start SSL-enabled services | `./docker-ssl-setup.sh --start` |
| `--stop` | Stop SSL-enabled services | `./docker-ssl-setup.sh --stop` |

## 🏗️ Architecture

The SSL setup creates the following structure:

```
Maijjd_Full_Project/
├── docker-ssl-setup.sh          # Main SSL setup script
├── docker-compose.ssl.yml       # SSL-enabled Docker Compose
├── nginx-ssl.conf              # SSL-enabled Nginx configuration
├── ssl/                        # SSL certificates directory
│   ├── cert.pem               # SSL certificate
│   ├── key.pem                # Private key
│   └── letsencrypt/           # Let's Encrypt data (if used)
├── renew-ssl.sh               # Certificate renewal script
├── ssl-health-check.sh        # SSL health monitoring
└── logs/                      # Log files
    ├── nginx/                 # Nginx logs
    └── ssl-renewal.log        # SSL renewal logs
```

## 🔐 Certificate Types

### Self-Signed Certificates
- **Use case**: Development, testing, internal networks
- **Pros**: No external dependencies, immediate setup
- **Cons**: Browser warnings, not trusted by default
- **Command**: `./docker-ssl-setup.sh --self-signed`

### Let's Encrypt Certificates
- **Use case**: Production environments, public websites
- **Pros**: Free, trusted by browsers, automatic renewal
- **Cons**: Requires public domain, external validation
- **Command**: `./docker-ssl-setup.sh --domain example.com --letsencrypt`

## 🚀 Step-by-Step Setup

### Step 1: Basic Setup
```bash
# Navigate to your project directory
cd /path/to/Maijjd_Full_Project

# Make script executable (if not already)
chmod +x docker-ssl-setup.sh

# Run basic setup
./docker-ssl-setup.sh --self-signed
```

### Step 2: Start Services
```bash
# Start SSL-enabled services
./docker-ssl-setup.sh --start
```

### Step 3: Test Configuration
```bash
# Test SSL connection
./docker-ssl-setup.sh --test

# Check SSL status
./docker-ssl-setup.sh --check
```

## 🔄 Certificate Renewal

### Manual Renewal
```bash
# Renew certificates manually
./renew-ssl.sh
```

### Automatic Renewal
```bash
# Setup automatic renewal (twice daily)
./docker-ssl-setup.sh --auto-renew

# Check cron jobs
crontab -l
```

## 📊 Monitoring and Health Checks

### SSL Health Check
```bash
# Run SSL health check
./ssl-health-check.sh

# Check health logs
tail -f logs/ssl-health.log
```

### Container Status
```bash
# Check running containers
docker-compose -f docker-compose.ssl.yml ps

# View logs
docker-compose -f docker-compose.ssl.yml logs nginx-ssl
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using port 443
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop apache2  # or nginx, etc.
```

#### 2. Certificate Generation Failed
```bash
# Check Let's Encrypt logs
docker logs $(docker ps -q --filter "ancestor=certbot/certbot")

# Verify domain DNS
nslookup yourdomain.com
```

#### 3. Nginx Won't Start
```bash
# Check Nginx configuration
docker run --rm -v $(pwd)/nginx-ssl.conf:/etc/nginx/nginx.conf nginx:alpine nginx -t

# View Nginx logs
docker-compose -f docker-compose.ssl.yml logs nginx-ssl
```

### Debug Mode
```bash
# Run with verbose output
bash -x ./docker-ssl-setup.sh --self-signed

# Check Docker Compose logs
docker-compose -f docker-compose.ssl.yml logs -f
```

## 🔒 Security Considerations

### SSL Configuration
- Uses modern TLS protocols (TLS 1.2, 1.3)
- Implements secure cipher suites
- Includes security headers (HSTS, CSP, etc.)
- Rate limiting for API endpoints

### File Permissions
- Private keys: 600 (owner read/write only)
- Certificates: 644 (owner read/write, others read)
- Scripts: 755 (owner read/write/execute, others read/execute)

### Network Security
- HTTP to HTTPS redirect
- Blocks access to sensitive files
- Implements proper proxy headers
- Health check endpoints

## 📈 Performance Optimization

### Nginx Configuration
- Gzip compression enabled
- Static file caching
- Connection pooling
- Buffer optimization

### Docker Resources
- Memory and CPU limits
- Health checks
- Restart policies
- Volume mounting optimization

## 🔄 Integration with Existing Setup

The SSL setup integrates with your existing Docker Compose setup:

1. **Uses existing networks**: `maijjd-network`
2. **Preserves existing services**: frontend, backend, mongodb, redis
3. **Adds SSL layer**: nginx-ssl, certbot
4. **Maintains compatibility**: All existing functionality preserved

## 📝 Configuration Files

### Environment Variables
```bash
# Set these before running the script
export DOMAIN_NAME="yourdomain.com"
export EMAIL="admin@yourdomain.com"
export LETSENCRYPT_EMAIL="admin@yourdomain.com"
```

### Custom Nginx Configuration
You can modify `nginx-ssl.conf` to:
- Add custom locations
- Modify security headers
- Adjust rate limiting
- Customize SSL settings

## 🚀 Production Deployment

### 1. Domain Setup
```bash
# Point your domain to your server
# A record: yourdomain.com -> YOUR_SERVER_IP
# CNAME: www.yourdomain.com -> yourdomain.com
```

### 2. SSL Setup
```bash
# Setup Let's Encrypt with auto-renewal
./docker-ssl-setup.sh --domain yourdomain.com --letsencrypt --auto-renew
```

### 3. Start Services
```bash
# Start all services
./docker-ssl-setup.sh --start
```

### 4. Verify Setup
```bash
# Test SSL configuration
./docker-ssl-setup.sh --test

# Check certificate
./docker-ssl-setup.sh --check
```

## 📚 Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs in the `logs/` directory
3. Run health checks: `./ssl-health-check.sh`
4. Verify Docker and Docker Compose versions
5. Check system resources and port availability

## 📄 License

This SSL setup script is part of the Maijjd project and follows the same licensing terms.

---

**Note**: Always backup your SSL certificates and configuration files before making changes. For production use, ensure your domain DNS is properly configured and your server is accessible from the internet.
