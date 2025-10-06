#!/bin/bash

echo "🚀 Deploying Kube Credential Services to EC2..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Clean up old images
echo "🧹 Cleaning up..."
docker system prune -f

# Build and start services
echo "📦 Building Docker images..."
docker-compose build --no-cache

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 45

echo "🔍 Checking service status..."
docker-compose ps

echo "📋 Checking logs..."
docker-compose logs --tail=20

echo "🏥 Health check..."
echo "Issuance Service:"
curl -f http://localhost:3001/health || echo "❌ Issuance service not ready"

echo ""
echo "Verification Service:"
curl -f http://localhost:3002/health || echo "❌ Verification service not ready"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Services available at:"
echo "   Issuance API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001"
echo "   Verification API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3002"