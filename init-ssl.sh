#!/bin/bash
# init-ssl.sh — First-time Let's Encrypt certificate provisioning
# Run this ONCE on your VPS after the first deployment.
#
# Usage:  chmod +x init-ssl.sh && ./init-ssl.sh

set -e

DOMAIN="questlog.kfranklyn.dev"
EMAIL="kfranklyn7@gmail.com"

echo "=== Step 1: Creating certbot directories ==="
mkdir -p certbot/conf certbot/www

echo "=== Step 2: Starting temporary HTTP-only nginx ==="
# Create a temporary nginx config that only serves the ACME challenge
cat > nginx/nginx_temp.conf << 'EOF'
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name questlog.kfranklyn.dev www.questlog.kfranklyn.dev;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / { return 200 'Questlog SSL setup in progress...'; add_header Content-Type text/plain; }
    }
}
EOF

# Start nginx with the temporary config
docker run -d --name temp-nginx \
    -p 80:80 \
    -v "$(pwd)/nginx/nginx_temp.conf:/etc/nginx/nginx.conf:ro" \
    -v "$(pwd)/certbot/www:/var/www/certbot:ro" \
    nginx:alpine

echo "=== Step 3: Requesting certificate from Let's Encrypt ==="
docker run --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

echo "=== Step 4: Cleaning up temporary nginx ==="
docker stop temp-nginx && docker rm temp-nginx
rm nginx/nginx_temp.conf

echo "=== Step 5: Starting full stack with HTTPS ==="
docker-compose up -d

echo ""
echo "✅ SSL certificate installed! https://$DOMAIN should now be live."
echo "   Certbot will auto-renew certificates in the background."
