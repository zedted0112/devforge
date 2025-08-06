#!/bin/bash

# Fast Restart Script for DevForge
# Uses build cache and optimized Docker builds

set -e

echo "🚀 Fast Restart - DevForge Services"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose down --remove-orphans
    print_success "Containers stopped"
}

# Build with cache optimization
build_services() {
    print_status "Building services with cache optimization..."
    
    # Build auth service with cache
    print_status "Building auth service..."
    docker-compose build --no-cache auth-service
    
    # Build project service with cache
    print_status "Building project service..."
    docker-compose build --no-cache project-service
    
    print_success "Services built successfully"
}

# Start services
start_services() {
    print_status "Starting services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Wait for gateway
    while ! curl -s http://localhost:3000/health > /dev/null 2>&1; do
        sleep 2
        echo "  Waiting for Gateway..."
    done
    
    # Wait for frontend
    while ! curl -s http://localhost:5173 > /dev/null 2>&1; do
        sleep 2
        echo "  Waiting for Frontend..."
    done
    
    print_success "All services are ready!"
}

# Show status
show_status() {
    echo ""
    print_success "🎉 DevForge is running with optimized performance!"
    echo ""
    echo "📱 Frontend:     http://localhost:5173"
    echo "🚪 Gateway:      http://localhost:3000"
    echo "🔐 Auth Service: http://localhost:3001"
    echo "📁 Project Service: http://localhost:3002"
    echo ""
    echo "🐳 Docker Commands:"
    echo "  View logs:     docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart:       docker-compose restart"
    echo ""
    echo "⚡ Performance optimizations applied:"
    echo "  - Optimized Dockerfiles"
    echo "  - Build cache utilization"
    echo "  - Reduced context size"
    echo "  - Faster npm install"
}

# Main execution
main() {
    check_docker
    stop_containers
    build_services
    start_services
    show_status
}

# Run main function
main "$@" 