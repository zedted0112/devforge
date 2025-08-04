#!/bin/bash

# DevForge Production Deployment Script
# This script handles deployment to production environments

set -e  # Exit on any error

echo "🚀 DevForge Production Deployment"
echo "================================"

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

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "REDIS_URL"
        "JWT_SECRET"
        "REFRESH_TOKEN_SECRET"
        "NODE_ENV"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Missing required environment variable: $var"
            exit 1
        fi
    done
    
    print_success "All required environment variables are set"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Auth service migrations
    cd auth
    npx prisma migrate deploy
    cd ..
    
    # Project service migrations
    cd project-service
    npx prisma migrate deploy
    cd ..
    
    print_success "Database migrations completed"
}

# Build and deploy services
deploy_services() {
    print_status "Building and deploying services..."
    
    # Build Docker images
    docker-compose build
    
    # Deploy to production
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    
    print_success "Services deployed successfully"
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check auth service
    if curl -f http://localhost:3001/ping > /dev/null 2>&1; then
        print_success "Auth service is healthy"
    else
        print_error "Auth service health check failed"
        exit 1
    fi
    
    # Check project service
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        print_success "Project service is healthy"
    else
        print_error "Project service health check failed"
        exit 1
    fi
    
    # Check gateway
    if curl -f http://localhost:3000/ping > /dev/null 2>&1; then
        print_success "Gateway is healthy"
    else
        print_error "Gateway health check failed"
        exit 1
    fi
    
    print_success "All services are healthy"
}

# Main deployment function
main() {
    print_status "Starting production deployment..."
    
    # Check environment
    check_env_vars
    
    # Run migrations
    run_migrations
    
    # Deploy services
    deploy_services
    
    # Health check
    health_check
    
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Services are now running at:"
    echo "- Frontend: http://localhost:5173"
    echo "- Gateway: http://localhost:3000"
    echo "- Auth Service: http://localhost:3001"
    echo "- Project Service: http://localhost:3002"
}

# Run main function
main "$@" 