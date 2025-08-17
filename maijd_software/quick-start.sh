#!/bin/bash

# Maijd Software Suite - Quick Start Script
# For immediate local deployment and testing

set -e

echo "🚀 Maijd Software Suite - Quick Start"
echo "====================================="
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data logs uploads ssl monitoring/grafana/dashboards monitoring/grafana/datasources

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your actual values if needed."
fi

# Generate SSL certificates
echo "🔐 Generating SSL certificates..."
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    mkdir -p ssl
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo "✅ SSL certificates generated"
fi

# Create monitoring configuration
echo "📊 Setting up monitoring..."
cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'maijd-web'
    static_configs:
      - targets: ['maijd-web:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s
EOF

mkdir -p monitoring/grafana/datasources
cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

echo "✅ Monitoring configuration created"

# Build and start services
echo "🐳 Building and starting services..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🎉 Maijd Software Suite is now running!"
echo ""
echo "🌐 Access your website:"
echo "   Web Application: http://localhost:8000"
echo "   Nginx (HTTP):    http://localhost"
echo "   Nginx (HTTPS):   https://localhost"
echo "   Grafana:         http://localhost:3000 (admin/admin)"
echo "   Prometheus:      http://localhost:9090"
echo ""
echo "📝 Useful commands:"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   docker-compose down"
echo "   Restart:         docker-compose restart"
echo ""
echo "🔍 Check health:   curl http://localhost:8000/health"
echo "📈 View metrics:   curl http://localhost:8000/metrics"
echo ""
echo "✨ Your Maijd Software Suite is ready!"
