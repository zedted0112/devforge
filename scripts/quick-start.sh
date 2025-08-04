#!/bin/bash

# DevForge Quick Start Script
# This script sets up the development environment quickly

set -e  # Exit on any error

echo "🚀 DevForge Quick Start"
echo "======================"

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

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    print_success "All requirements are met"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    # Auth service
    if [ ! -f "auth/.env" ]; then
        cp auth/env.example auth/.env
        print_success "Created auth/.env"
    else
        print_warning "auth/.env already exists"
    fi
    
    # Project service
    if [ ! -f "project-service/.env" ]; then
        cp project-service/env.example project-service/.env
        print_success "Created project-service/.env"
    else
        print_warning "project-service/.env already exists"
    fi
    
    # Gateway
    if [ ! -f "gateway/.env" ]; then
        cp gateway/env.example gateway/.env
        print_success "Created gateway/.env"
    else
        print_warning "gateway/.env already exists"
    fi
    
    # Frontend
    if [ ! -f "Frontend/.env" ]; then
        cp Frontend/env.example Frontend/.env
        print_success "Created Frontend/.env"
    else
        print_warning "Frontend/.env already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Auth service
    cd auth
    npm install
    cd ..
    
    # Project service
    cd project-service
    npm install
    cd ..
    
    # Gateway
    cd gateway
    npm install
    cd ..
    
    # Frontend
    cd Frontend
    npm install
    cd ..
    
    print_success "Dependencies installed"
}

# Start services
start_services() {
    print_status "Starting services with Docker Compose..."
    
    # Build and start services
    docker-compose up -d --build
    
    print_success "Services started"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for database..."
    until docker-compose exec -T postgres pg_isready -U devforge_user -d devforge > /dev/null 2>&1; do
        sleep 2
    done
    print_success "Database is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        sleep 2
    done
    print_success "Redis is ready"
    
    # Wait for services
    print_status "Waiting for services..."
    sleep 10
    
    # Check service health
    if curl -f http://localhost:3001/ping > /dev/null 2>&1; then
        print_success "Auth service is healthy"
    else
        print_warning "Auth service health check failed"
    fi
    
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        print_success "Project service is healthy"
    else
        print_warning "Project service health check failed"
    fi
    
    if curl -f http://localhost:3000/ping > /dev/null 2>&1; then
        print_success "Gateway is healthy"
    else
        print_warning "Gateway health check failed"
    fi
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

# Show status
show_status() {
    echo ""
    echo "🎉 DevForge is ready!"
    echo "===================="
    echo ""
    echo "Services are running at:"
    echo "- Frontend: http://localhost:5173"
    echo "- Gateway: http://localhost:3000"
    echo "- Auth Service: http://localhost:3001"
    echo "- Project Service: http://localhost:3002"
    echo "- Database: localhost:5432"
    echo "- Redis: localhost:6379"
    echo ""
    echo "Useful commands:"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- Run tests: ./scripts/run-tests.sh"
    echo ""
    echo "Happy coding! 🚀"
}

# Main function
main() {
    check_docker
    check_requirements
    setup_env
    install_dependencies
    start_services
    wait_for_services
    run_migrations
    show_status
}

# Run main function
main "$@" 