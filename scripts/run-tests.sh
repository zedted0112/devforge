#!/bin/bash

# DevForge Test Runner
# Runs comprehensive tests for all microservices

set -e  # Exit on any error

echo "🚀 DevForge Test Suite Runner"
echo "=============================="

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

# Function to run tests for a service
run_service_tests() {
    local service_name=$1
    local service_path=$2
    
    print_status "Running tests for $service_name..."
    
    if [ ! -d "$service_path" ]; then
        print_error "Service directory not found: $service_path"
        return 1
    fi
    
    cd "$service_path"
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in $service_path"
        return 1
    fi
    
    # Check if test script exists
    if ! grep -q '"test"' package.json; then
        print_warning "No test script found in $service_name"
        return 0
    fi
    
    # Run tests
    if npm test; then
        print_success "$service_name tests passed!"
        return 0
    else
        print_error "$service_name tests failed!"
        return 1
    fi
}

# Main test execution
main() {
    local total_services=0
    local passed_services=0
    local failed_services=0
    
    print_status "Starting comprehensive test suite..."
    
    # Test Auth Service
    total_services=$((total_services + 1))
    if run_service_tests "Auth Service" "auth"; then
        passed_services=$((passed_services + 1))
    else
        failed_services=$((failed_services + 1))
    fi
    
    # Test Project Service
    total_services=$((total_services + 1))
    if run_service_tests "Project Service" "project-service"; then
        passed_services=$((passed_services + 1))
    else
        failed_services=$((failed_services + 1))
    fi
    
    # Return to root directory
    cd ..
    
    # Summary
    echo ""
    echo "=============================="
    echo "📊 Test Summary"
    echo "=============================="
    echo "Total Services: $total_services"
    echo -e "Passed: ${GREEN}$passed_services${NC}"
    echo -e "Failed: ${RED}$failed_services${NC}"
    
    if [ $failed_services -eq 0 ]; then
        print_success "All services passed! 🎉"
        exit 0
    else
        print_error "Some services failed! ❌"
        exit 1
    fi
}

# Run main function
main "$@" 