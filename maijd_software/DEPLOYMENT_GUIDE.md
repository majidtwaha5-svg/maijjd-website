# Maijd Software Suite - Deployment Guide

This guide will help you deploy your Maijd Software Suite website online so it can be accessed from anywhere on the internet.

## 🚀 Quick Start Deployment

### Option 1: Docker Compose (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   cd maijd_software
   ```

2. **Make deployment script executable:**
   ```bash
   chmod +x deploy.sh
   ```

3. **Run the deployment script:**
   ```bash
   ./deploy.sh yourdomain.com
   ```

4. **Access your website:**
   - Web Application: http://yourdomain.com:8000
   - Nginx (HTTP): http://yourdomain.com
   - Nginx (HTTPS): https://yourdomain.com
   - Grafana: http://yourdomain.com:3000 (admin/admin)
   - Prometheus: http://yourdomain.com:9090

### Option 2: Manual Docker Deployment

1. **Create environment file:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

2. **Build and start services:**
   ```bash
   docker-compose up -d --build
   ```

3. **Check status:**
   ```bash
   docker-compose ps
   ```

## 🌐 Making Your Website Publicly Accessible

### Option 1: Cloud Hosting (Recommended)

#### A. AWS EC2
1. **Launch EC2 instance:**
   - Choose Ubuntu 22.04 LTS
   - t3.medium or larger
   - Configure security groups (open ports 22, 80, 443, 8000)

2. **Connect and deploy:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   sudo apt update && sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   # Logout and login again
   git clone your-repo
   cd maijd_software
   ./deploy.sh yourdomain.com
   ```

#### B. DigitalOcean Droplet
1. **Create droplet:**
   - Choose Ubuntu 22.04 LTS
   - Basic plan ($12/month)
   - Add SSH key

2. **Deploy:**
   ```bash
   ssh root@your-droplet-ip
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   apt install docker-compose
   git clone your-repo
   cd maijd_software
   ./deploy.sh yourdomain.com
   ```

#### C. Google Cloud Platform
1. **Create VM instance:**
   - Choose e2-medium
   - Allow HTTP/HTTPS traffic
   - Add firewall rules for ports 8000, 3000, 9090

2. **Deploy:**
   ```bash
   gcloud compute ssh your-instance-name
   # Install Docker and deploy as above
   ```

### Option 2: VPS Hosting

#### A. Linode
1. **Create Linode:**
   - Choose Ubuntu 22.04 LTS
   - Linode 2GB ($10/month)

2. **Deploy:**
   ```bash
   ssh root@your-linode-ip
   # Install Docker and deploy
   ```

#### B. Vultr
1. **Create instance:**
   - Choose Ubuntu 22.04 LTS
   - Cloud Compute ($6/month)

2. **Deploy:**
   ```bash
   ssh root@your-vultr-ip
   # Install Docker and deploy
   ```

### Option 3: Shared Hosting (Limited)

For shared hosting providers like cPanel:
1. **Upload files via FTP**
2. **Set up Python environment**
3. **Configure WSGI**
4. **Note: Limited functionality due to shared hosting constraints**

## 🔧 Domain Configuration

### 1. Purchase Domain
- **Recommended providers:** Namecheap, GoDaddy, Google Domains
- **Cost:** $10-15/year

### 2. DNS Configuration
Point your domain to your server:

```
Type    Name    Value
A       @       YOUR_SERVER_IP
A       www     YOUR_SERVER_IP
```

### 3. SSL Certificate
The deployment script generates self-signed certificates. For production:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get Let's Encrypt certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📊 Monitoring and Analytics

### Built-in Monitoring
- **Prometheus:** Metrics collection at `/metrics`
- **Grafana:** Dashboard at port 3000
- **Health checks:** `/health` endpoint

### External Monitoring
- **UptimeRobot:** Free uptime monitoring
- **Google Analytics:** Website analytics
- **Hotjar:** User behavior analysis

## 🔒 Security Considerations

### 1. Firewall Configuration
```bash
# UFW firewall setup
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
```

### 2. Environment Variables
- **Never commit `.env` files**
- **Use strong, unique passwords**
- **Rotate API keys regularly**

### 3. Regular Updates
```bash
# Update system
sudo apt update && sudo apt upgrade

# Update Docker images
docker-compose pull
docker-compose up -d
```

## 📈 Scaling Your Application

### 1. Load Balancer
```yaml
# docker-compose.yml addition
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - maijd-web-1
      - maijd-web-2
```

### 2. Database Scaling
```yaml
# Add read replicas
  postgres-replica:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=maijd
      - POSTGRES_USER=maijd
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_replica_data:/var/lib/postgresql/data
```

### 3. Caching Layer
```yaml
# Redis cluster
  redis-cluster:
    image: redis:7-alpine
    command: redis-server --appendonly yes --cluster-enabled yes
    volumes:
      - redis_cluster_data:/data
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :8000

# Kill the process
sudo kill -9 PID
```

#### 2. Docker Permission Issues
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

#### 3. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### 4. SSL Certificate Issues
```bash
# Regenerate certificates
rm -rf ssl/*
./deploy.sh yourdomain.com
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f maijd-web

# Check service status
docker-compose ps
```

## 💰 Cost Estimation

### Monthly Costs (Estimated)

| Service | Provider | Plan | Cost |
|---------|----------|------|------|
| **VPS** | DigitalOcean | Basic ($12/month) | $12 |
| **Domain** | Namecheap | .com domain | $1.25 |
| **SSL** | Let's Encrypt | Free | $0 |
| **Monitoring** | UptimeRobot | Free tier | $0 |
| **Analytics** | Google Analytics | Free | $0 |
| **Total** | | | **~$13.25/month** |

### Free Alternatives
- **Render:** Free tier hosting
- **Railway:** Free tier deployment
- **Fly.io:** Free tier hosting
- **Heroku:** Free tier (discontinued)

## 🎯 Next Steps

### 1. Custom Domain
- Purchase domain name
- Configure DNS settings
- Set up SSL certificates

### 2. Content Management
- Add your content
- Customize branding
- Set up user accounts

### 3. Marketing
- SEO optimization
- Social media presence
- Content marketing

### 4. Analytics
- Google Analytics setup
- Conversion tracking
- Performance monitoring

## 📞 Support

If you encounter issues:

1. **Check logs:** `docker-compose logs`
2. **Verify configuration:** Check `.env` file
3. **Test endpoints:** Visit `/health` and `/metrics`
4. **Restart services:** `docker-compose restart`

## 🎉 Congratulations!

Your Maijd Software Suite is now deployed and accessible online! 

**Next steps:**
- Customize your website content
- Set up monitoring and alerts
- Configure your domain
- Start marketing your software suite

---

*For additional support, refer to the main README.md or create an issue in the project repository.*
