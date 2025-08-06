#!/bin/bash

# Feature Development Workflow Script
# Helps manage feature development safely

set -e

echo "🚀 DevForge Feature Development Workflow"
echo "========================================"

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

# Check if we're in a git repository
check_git() {
    if [ ! -d ".git" ]; then
        print_error "Not in a git repository"
        exit 1
    fi
}

# Check current branch
check_branch() {
    current_branch=$(git branch --show-current)
    print_status "Current branch: $current_branch"
}

# Create new feature branch
create_feature_branch() {
    if [ -z "$1" ]; then
        print_error "Please provide a feature name"
        echo "Usage: $0 create-feature <feature-name>"
        exit 1
    fi
    
    feature_name=$1
    branch_name="feature/$feature_name"
    
    print_status "Creating feature branch: $branch_name"
    
    # Ensure we're on development branch
    git checkout development
    git pull origin development
    
    # Create feature branch
    git checkout -b "$branch_name"
    
    print_success "Feature branch created: $branch_name"
    print_status "You can now start developing your feature"
}

# Test feature
test_feature() {
    print_status "Testing feature..."
    
    # Start development environment
    ./scripts/development/start-docker.sh
    
    # Run tests
    ./scripts/testing/run-tests.sh
    
    print_success "Feature testing completed"
    print_status "Test your feature manually at http://localhost:5173"
}

# Commit feature
commit_feature() {
    if [ -z "$1" ]; then
        print_error "Please provide a commit message"
        echo "Usage: $0 commit-feature <commit-message>"
        exit 1
    fi
    
    commit_message=$1
    
    print_status "Committing feature changes..."
    
    git add .
    git commit -m "feat: $commit_message"
    
    print_success "Feature committed"
}

# Push feature branch
push_feature() {
    current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        print_error "Not on a feature branch"
        exit 1
    fi
    
    print_status "Pushing feature branch: $current_branch"
    
    git push origin "$current_branch"
    
    print_success "Feature branch pushed"
    print_status "Create a pull request to merge into development"
}

# Merge feature to development
merge_to_development() {
    current_branch=$(git branch --show-current)
    
    if [[ ! $current_branch == feature/* ]]; then
        print_error "Not on a feature branch"
        exit 1
    fi
    
    print_status "Merging $current_branch to development..."
    
    # Switch to development
    git checkout development
    git pull origin development
    
    # Merge feature branch
    git merge "$current_branch"
    
    # Push development
    git push origin development
    
    # Delete feature branch
    git branch -d "$current_branch"
    git push origin --delete "$current_branch"
    
    print_success "Feature merged to development"
    print_status "Feature branch deleted"
}

# Deploy to production
deploy_to_production() {
    print_warning "This will deploy development to production!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deploying to production..."
        
        # Switch to master
        git checkout master
        git pull origin master
        
        # Merge development
        git merge development
        
        # Build and deploy
        ./scripts/production/build-production.sh
        ./scripts/production/deploy.sh
        
        # Push to master
        git push origin master
        
        print_success "Deployed to production!"
    else
        print_status "Deployment cancelled"
    fi
}

# Show workflow help
show_help() {
    echo ""
    echo "📋 Feature Development Workflow Commands:"
    echo ""
    echo "  $0 create-feature <name>     - Create new feature branch"
    echo "  $0 test-feature              - Test current feature"
    echo "  $0 commit-feature <message>  - Commit feature changes"
    echo "  $0 push-feature              - Push feature branch"
    echo "  $0 merge-to-dev              - Merge feature to development"
    echo "  $0 deploy-to-prod            - Deploy development to production"
    echo "  $0 help                      - Show this help"
    echo ""
    echo "🔄 Typical Workflow:"
    echo "  1. $0 create-feature my-feature"
    echo "  2. Develop your feature"
    echo "  3. $0 test-feature"
    echo "  4. $0 commit-feature 'Add new feature'"
    echo "  5. $0 push-feature"
    echo "  6. Create pull request"
    echo "  7. $0 merge-to-dev"
    echo "  8. Test in development"
    echo "  9. $0 deploy-to-prod (when ready)"
    echo ""
}

# Main execution
case "$1" in
    "create-feature")
        check_git
        create_feature_branch "$2"
        ;;
    "test-feature")
        check_git
        test_feature
        ;;
    "commit-feature")
        check_git
        commit_feature "$2"
        ;;
    "push-feature")
        check_git
        push_feature
        ;;
    "merge-to-dev")
        check_git
        merge_to_development
        ;;
    "deploy-to-prod")
        check_git
        deploy_to_production
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 