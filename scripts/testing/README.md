# Testing Scripts

Scripts for running tests and quality assurance for the DevForge platform.

## 🧪 Scripts Overview

### `run-tests.sh` ⭐ **COMPREHENSIVE TEST SUITE**
Run all tests across all microservices with detailed reporting.

**What it does:**
- Runs tests for all services (auth, project, gateway)
- Provides detailed test results and summaries
- Handles test failures gracefully
- Shows coverage and performance metrics
- Validates test environment

**Usage:**
```bash
./scripts/testing/run-tests.sh
```

**When to use:** Before commits, CI/CD pipelines, quality assurance

**Test coverage:**
- Auth Service tests
- Project Service tests
- Gateway Service tests
- Integration tests
- Unit tests

## 🔄 Testing Workflow

### Pre-commit Testing
```bash
# Run all tests before committing
./scripts/testing/run-tests.sh
```

### CI/CD Pipeline Integration
```bash
# In your CI/CD pipeline
./scripts/testing/run-tests.sh
```

### Manual Testing
```bash
# Run tests for specific service
cd auth && npm test
cd ../project-service && npm test
cd ../gateway && npm test
```

## 📋 Test Categories

### Unit Tests
- Individual function testing
- Service method validation
- Utility function testing
- Database operation testing

### Integration Tests
- Service-to-service communication
- API endpoint testing
- Database integration
- Authentication flow testing

### End-to-End Tests
- Complete user workflows
- Cross-service interactions
- Real-world scenario testing

## 🎯 Test Best Practices

### Before Running Tests
- Ensure all services are stopped
- Clear any test data
- Set up test environment variables
- Verify database connectivity

### Test Environment Setup
```bash
# Set test environment
export NODE_ENV=test
export DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_db
export REDIS_URL=redis://localhost:6379
```

### Running Specific Tests
```bash
# Auth service tests only
cd auth && npm test

# Project service tests only
cd project-service && npm test

# Gateway tests only
cd gateway && npm test
```

## 📊 Test Results Interpretation

### Success Indicators
- All tests pass (green checkmarks)
- Coverage above 80%
- No critical warnings
- Performance within acceptable limits

### Failure Indicators
- Red X marks for failed tests
- Coverage below threshold
- Critical warnings or errors
- Performance degradation

### Common Test Failures
- Database connection issues
- Missing environment variables
- Service dependency problems
- Network connectivity issues

## 🚨 Troubleshooting Tests

### Database Issues
```bash
# Reset test database
docker-compose down -v
docker-compose up -d postgres
```

### Environment Issues
```bash
# Check environment variables
echo $NODE_ENV
echo $DATABASE_URL
echo $REDIS_URL
```

### Service Dependencies
```bash
# Ensure services are running for integration tests
./scripts/development/start-docker.sh
```

## 📈 Test Coverage

### Coverage Targets
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **End-to-End Tests**: Critical paths covered

### Coverage Reports
```bash
# Generate coverage reports
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Jest Configuration
Each service has its own Jest configuration:
- `auth/jest.config.js`
- `project-service/jest.config.js`
- `gateway/jest.config.js`

### Test Environment Variables
```bash
# Test-specific environment
NODE_ENV=test
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-jwt-secret
REFRESH_TOKEN_SECRET=test-refresh-secret
```

## 🎯 Testing Tips

- **Run tests frequently** during development
- **Write tests for new features** before implementation
- **Use descriptive test names** for better debugging
- **Mock external dependencies** for unit tests
- **Test error conditions** and edge cases
- **Keep tests fast** and reliable
- **Use test data factories** for consistent test data

## 📝 Test Documentation

### Writing New Tests
```javascript
// Example test structure
describe('User Authentication', () => {
  it('should authenticate valid user', async () => {
    // Test implementation
  });

  it('should reject invalid credentials', async () => {
    // Test implementation
  });
});
```

### Test Naming Conventions
- Use descriptive names that explain the test purpose
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests using describe blocks

### Test Data Management
- Use factories for creating test data
- Clean up test data after each test
- Use unique identifiers to avoid conflicts 