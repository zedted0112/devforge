#!/bin/bash

# DevForge Simple Development Startup Script
# This script starts all services in development mode (without Redis check)

set -e  # Exit on any error

echo "🚀 Starting DevForge Development Environment (Simple Mode)"
echo "========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start Auth Service
start_auth_service() {
    print_status "Starting Auth Service..."
    cd auth
    export NODE_ENV=development
    export PORT=3001
    export DATABASE_URL=postgresql://devforge_user:devforge_password@localhost:5432/devforge
    export REDIS_URL=redis://localhost:6379
    export JWT_SECRET=dev-jwt-secret-key
    export REFRESH_TOKEN_SECRET=dev-refresh-secret-key
    export CORS_ORIGIN=http://localhost:5173
    export PROJECT_SERVICE_URL=http://localhost:3002
    
    npm run dev &
    AUTH_PID=$!
    cd ..
    print_success "Auth Service started (PID: $AUTH_PID)"
}

# Start Project Service
start_project_service() {
    print_status "Starting Project Service..."
    cd project-service
    export NODE_ENV=development
    export PORT=3002
    export DATABASE_URL=postgresql://devforge_user:devforge_password@localhost:5432/devforge
    export JWT_SECRET=dev-jwt-secret-key
    export CORS_ORIGIN=http://localhost:5173
    export AUTH_SERVICE_URL=http://localhost:3001
    
    npm run dev &
    PROJECT_PID=$!
    cd ..
    print_success "Project Service started (PID: $PROJECT_PID)"
}

# Start Gateway Service
start_gateway_service() {
    print_status "Starting Gateway Service..."
    cd gateway
    export NODE_ENV=development
    export PORT=3000
    export DOCKER=false
    export AUTH_SERVICE_URL=http://localhost:3001
    export PROJECT_SERVICE_URL=http://localhost:3002
    export FRONTEND_URL=http://localhost:5173
    
    npm run dev &
    GATEWAY_PID=$!
    cd ..
    print_success "Gateway Service started (PID: $GATEWAY_PID)"
}

# Start Frontend
start_frontend() {
    print_status "Starting Frontend..."
    cd Frontend
    export VITE_API_URL=http://localhost:3000
    export VITE_PROJECT_API_URL=http://localhost:3002
    export VITE_APP_NAME=DevForge
    export VITE_APP_VERSION=1.0.0
    export VITE_DEV_MODE=true
    
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend started (PID: $FRONTEND_PID)"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for Gateway
    print_status "Waiting for Gateway..."
    while ! curl -s http://localhost:3000/health > /dev/null 2>&1; do
        sleep 2
        echo "  Still waiting for Gateway..."
    done
    
    print_success "Gateway is ready!"
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    while ! curl -s http://localhost:5173 > /dev/null 2>&1; do
        sleep 2
        echo "  Still waiting for Frontend..."
    done
    
    print_success "Frontend is ready!"
}

# Main execution
main() {
    print_warning "Note: This script assumes PostgreSQL and Redis are running"
    print_warning "If you get connection errors, please start them first"
    echo ""
    
    # Start services in background
    start_auth_service
    sleep 3
    
    start_project_service
    sleep 3
    
    start_gateway_service
    sleep 3
    
    start_frontend
    
    # Wait for services to be ready
    wait_for_services
    
    echo ""
    print_success "🎉 DevForge Development Environment is ready!"
    echo ""
    echo "📱 Frontend:     http://localhost:5173"
    echo "🚪 Gateway:      http://localhost:3000"
    echo "🔐 Auth Service: http://localhost:3001"
    echo "📁 Project Service: http://localhost:3002"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Handle cleanup on exit
cleanup() {
    print_status "Stopping all services..."
    kill $AUTH_PID $PROJECT_PID $GATEWAY_PID $FRONTEND_PID 2>/dev/null || true
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Run main function
main 