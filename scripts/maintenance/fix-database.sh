#!/bin/bash

# Database Recovery Script for DevForge
# Fixes missing tables and database issues

set -e

echo "🔧 DevForge Database Recovery"
echo "============================="

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

# Check if services are running
check_services() {
    print_status "Checking if services are running..."
    
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Services are not running. Please start them first:"
        echo "  ./scripts/development/start-docker.sh"
        exit 1
    fi
    
    print_success "Services are running"
}

# Fix auth service database
fix_auth_database() {
    print_status "Fixing auth service database..."
    
    if docker-compose exec auth-service npx prisma db push --accept-data-loss; then
        print_success "Auth service database fixed"
    else
        print_error "Failed to fix auth service database"
        return 1
    fi
}

# Fix project service database
fix_project_database() {
    print_status "Fixing project service database..."
    
    if docker-compose exec project-service npx prisma db push --accept-data-loss; then
        print_success "Project service database fixed"
    else
        print_error "Failed to fix project service database"
        return 1
    fi
}

# Test database connectivity
test_database() {
    print_status "Testing database connectivity..."
    
    # Test auth service
    if curl -s http://localhost:3001/ping > /dev/null; then
        print_success "Auth service responding"
    else
        print_error "Auth service not responding"
        return 1
    fi
    
    # Test project service
    if curl -s http://localhost:3002/health > /dev/null; then
        print_success "Project service responding"
    else
        print_error "Project service not responding"
        return 1
    fi
    
    # Test project creation (should return 401, not 500)
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/projects \
        -H "Content-Type: application/json" \
        -d '{"title":"Test","description":"Test"}')
    
    if [ "$response" = "401" ]; then
        print_success "Project API working (401 = authentication required)"
    elif [ "$response" = "500" ]; then
        print_error "Project API still has database issues"
        return 1
    else
        print_warning "Project API returned unexpected status: $response"
    fi
}

# Show recovery summary
show_summary() {
    echo ""
    print_success "🎉 Database recovery completed!"
    echo ""
    echo "📋 What was fixed:"
    echo "  ✅ Auth service database schema"
    echo "  ✅ Project service database schema"
    echo "  ✅ Database connectivity"
    echo ""
    echo "🌐 Test your application:"
    echo "  Frontend: http://localhost:5173"
    echo "  Gateway: http://localhost:3000"
    echo ""
    echo "🔧 If you still have issues:"
    echo "  ./scripts/maintenance/debug-cors.sh"
    echo "  ./scripts/maintenance/dev-restart.sh"
}

# Main execution
main() {
    check_docker
    check_services
    fix_auth_database
    fix_project_database
    test_database
    show_summary
}

# Run main function
main "$@" 