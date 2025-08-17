#!/bin/bash

# SSL Certificate Renewal Script for Maijjd Project
# Run this script to renew Let's Encrypt certificates

set -e

SSL_DIR="./ssl"
DOMAIN_NAME="${DOMAIN_NAME:-localhost}"

if [ "$DOMAIN_NAME" = "localhost" ]; then
    echo "Cannot renew certificates for localhost. Using self-signed certificates."
    exit 0
fi

echo "Renewing SSL certificates..."

# Stop nginx temporarily
docker-compose -f docker-compose.ssl.yml stop nginx-ssl

# Renew certificates
docker run --rm \
    -v "$(pwd)/$SSL_DIR/letsencrypt:/etc/letsencrypt" \
    -v "$(pwd)/$SSL_DIR:/var/lib/letsencrypt" \
    certbot/certbot renew --quiet

# Copy renewed certificates
cp "$SSL_DIR/letsencrypt/live/$DOMAIN_NAME/fullchain.pem" "$SSL_DIR/cert.pem"
cp "$SSL_DIR/letsencrypt/live/$DOMAIN_NAME/privkey.pem" "$SSL_DIR/key.pem"

# Set proper permissions
chmod 600 "$SSL_DIR/key.pem"
chmod 644 "$SSL_DIR/cert.pem"

# Restart nginx
docker-compose -f docker-compose.ssl.yml start nginx-ssl

echo "SSL certificates renewed successfully"
