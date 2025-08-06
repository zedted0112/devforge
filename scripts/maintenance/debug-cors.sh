#!/bin/bash

echo "🔍 Debugging CORS Issues in DevForge Docker Setup"
echo "=================================================="

# Check if Docker containers are running
echo "📦 Checking Docker containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 Testing Gateway CORS configuration..."
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3000/health \
     -v

echo ""
echo "🔧 Testing API endpoints..."
echo "Health check:"
curl -s http://localhost:3000/health

echo ""
echo "Auth service test:"
curl -s http://localhost:3000/api/auth/health || echo "Auth service not responding"

echo ""
echo "Project service test:"
curl -s http://localhost:3000/api/projects/health || echo "Project service not responding"

echo ""
echo "📋 Environment variables check:"
echo "NODE_ENV: ${NODE_ENV:-development}"
echo "FRONTEND_URL: ${FRONTEND_URL:-not set}"

echo ""
echo "🔍 Frontend container logs (last 10 lines):"
docker logs devforge-frontend-1 --tail 10 2>/dev/null || echo "Frontend container not running"

echo ""
echo "🔍 Gateway container logs (last 10 lines):"
docker logs devforge-gateway-1 --tail 10 2>/dev/null || echo "Gateway container not running"

echo ""
echo "✅ Debug complete!" 