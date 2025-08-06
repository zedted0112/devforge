#!/bin/bash

echo "🚀 Starting production build for DevForge..."

# Set production environment
export NODE_ENV=production

# Frontend build
echo "📦 Building frontend..."
cd Frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend built successfully"

# Back to root
cd ..

# Install production dependencies for backend services
echo "📦 Installing production dependencies..."

# Auth service
echo "🔐 Setting up auth service..."
cd auth
npm ci --only=production
if [ $? -ne 0 ]; then
    echo "❌ Auth service dependencies failed"
    exit 1
fi
cd ..

# Project service
echo "📋 Setting up project service..."
cd project-service
npm ci --only=production
if [ $? -ne 0 ]; then
    echo "❌ Project service dependencies failed"
    exit 1
fi
cd ..

# Gateway service
echo "🌐 Setting up gateway service..."
cd gateway
npm ci --only=production
if [ $? -ne 0 ]; then
    echo "❌ Gateway service dependencies failed"
    exit 1
fi
cd ..

echo "✅ Production build completed successfully!"
echo "🎯 Ready for deployment" 