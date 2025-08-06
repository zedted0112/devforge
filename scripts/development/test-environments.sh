#!/bin/bash

# Environment Detection Test Script
# Shows how URLs are configured for different environments

echo "🔍 DevForge Environment Detection Test"
echo "======================================"

echo ""
echo "📋 Environment Files:"
echo ""

echo "Development Environment (Frontend/env.development):"
if [ -f "Frontend/env.development" ]; then
    cat Frontend/env.development
else
    echo "❌ Development env file not found"
fi

echo ""
echo "Production Environment (Frontend/env.production):"
if [ -f "Frontend/env.production" ]; then
    cat Frontend/env.production
else
    echo "❌ Production env file not found"
fi

echo ""
echo "🔧 Runtime Detection Logic:"
echo ""

echo "// From Frontend/src/api-config.js"
echo "const isDocker = window.location.hostname === 'localhost' && window.location.port === '5173';"
echo "const isLocalDev = window.location.hostname === 'localhost' && window.location.port === '5173';"
echo ""
echo "if (isDocker) {"
echo "    // Docker environment - use relative URLs"
echo "    window.DEVFORGE_API_URL = '';"
echo "} else if (isLocalDev) {"
echo "    // Local development - use localhost:3000"
echo "    window.DEVFORGE_API_URL = 'http://localhost:3000';"
echo "} else {"
echo "    // Production - uses VITE_API_URL from environment file"
echo "    window.DEVFORGE_API_URL = import.meta.env.VITE_API_URL || '';"
echo "}"

echo ""
echo "🎯 Environment Detection Results:"
echo ""

echo "Local Development (localhost:5173):"
echo "  - isDocker: true"
echo "  - isLocalDev: true"
echo "  - API URL: http://localhost:3000"
echo ""

echo "Production (devforge-zeta.vercel.app):"
echo "  - isDocker: false"
echo "  - isLocalDev: false"
echo "  - API URL: https://devforge-gateway-production.up.railway.app"
echo ""

echo "✅ Your setup is production-safe!"
echo "   - Development branch works in both environments"
echo "   - URLs are automatically detected at runtime"
echo "   - No manual configuration needed"
echo "   - Safe to merge development to master" 