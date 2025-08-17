#!/bin/bash

# SSL Health Check Script for Maijjd Project

SSL_DIR="./ssl"
DOMAIN_NAME="${DOMAIN_NAME:-localhost}"
LOG_FILE="./logs/ssl-health.log"

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Check if certificate files exist
if [ ! -f "$SSL_DIR/cert.pem" ] || [ ! -f "$SSL_DIR/key.pem" ]; then
    log_message "ERROR: SSL certificate files not found"
    exit 1
fi

# Check certificate expiration
if command -v openssl &> /dev/null; then
    EXPIRY=$(openssl x509 -enddate -noout -in "$SSL_DIR/cert.pem" | cut -d= -f2)
    EXPIRY_DATE=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$EXPIRY" +%s 2>/dev/null)
    CURRENT_DATE=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_DATE - CURRENT_DATE) / 86400 ))
    
    if [ $DAYS_LEFT -lt 30 ]; then
        log_message "WARNING: SSL certificate expires in $DAYS_LEFT days"
    else
        log_message "INFO: SSL certificate valid for $DAYS_LEFT days"
    fi
fi

# Test HTTPS connection
if [ "$DOMAIN_NAME" != "localhost" ]; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN_NAME" --connect-timeout 10)
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN_NAME" --connect-timeout 10)
    
    if [ "$HTTP_STATUS" = "301" ]; then
        log_message "INFO: HTTP to HTTPS redirect working"
    else
        log_message "WARNING: HTTP to HTTPS redirect not working (HTTP $HTTP_STATUS)"
    fi
    
    if [ "$HTTPS_STATUS" = "200" ]; then
        log_message "INFO: HTTPS connection working"
    else
        log_message "ERROR: HTTPS connection failed (HTTPS $HTTPS_STATUS)"
    fi
fi

log_message "SSL health check completed"
