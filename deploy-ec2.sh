#!/bin/bash

echo "🚀 Deploying Kube Credential Services to EC2..."

# Build and start services
echo "📦 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 30

echo "🔍 Checking service status..."
docker-compose ps

echo "🏥 Health check..."
echo "Issuance Service:"
curl -f http://localhost:3001/health || echo "❌ Issuance service not ready"

echo "Verification Service:"
curl -f http://localhost:3002/health || echo "❌ Verification service not ready"

echo "✅ Deployment complete!"
echo "🌐 Services available at:"
echo "   Issuance API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001"
echo "   Verification API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3002"