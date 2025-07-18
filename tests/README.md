# 🧪 DevForge Testing Documentation

This document outlines the comprehensive testing strategy for the DevForge microservices platform.

## 📋 Overview

DevForge uses **Jest + Supertest** for automated API testing across all microservices. Our testing approach ensures:

- ✅ **API Contract Validation** - All endpoints return expected responses
- ✅ **Authentication & Authorization** - JWT tokens work correctly
- ✅ **Data Integrity** - CRUD operations maintain data consistency
- ✅ **Error Handling** - Proper HTTP status codes and error messages
- ✅ **Frontend Integration Readiness** - CORS, content types, response formats

## 🏗️ Test Architecture

```
devforge/
├── auth/
│   ├── tests/
│   │   ├── auth.test.js          # Auth service API tests
│   │   └── setup.js              # Test environment setup
│   ├── jest.config.js            # Jest configuration
│   └── package.json              # Test dependencies
├── project-service/
│   ├── tests/
│   │   └── project.test.js       # Project service API tests
│   └── package.json              # Test dependencies
└── scripts/
    └── run-tests.sh              # Comprehensive test runner
```

## 🚀 Running Tests

### Individual Service Tests

```bash
# Test Auth Service
cd auth
npm test

# Test Project Service
cd project-service
npm test
```

### All Services (Recommended)

```bash
# From project root
./scripts/run-tests.sh
```

### Test Coverage

```bash
# Generate coverage reports
cd auth && npm test -- --coverage
cd project-service && npm test -- --coverage
```

## 📊 Test Coverage

### Auth Service (`/auth/tests/auth.test.js`)

| Test Category | Endpoints | Coverage |
|---------------|-----------|----------|
| **Health Check** | `/api/auth/ping` | ✅ Service availability |
| **User Registration** | `POST /api/auth/signup` | ✅ Success, validation, duplicates |
| **User Authentication** | `POST /api/auth/login` | ✅ Success, wrong credentials, validation |
| **Token Refresh** | `POST /api/auth/refresh` | ✅ Success, invalid tokens, missing tokens |
| **Protected Routes** | `GET /api/protected/secret` | ✅ Auth middleware, token validation |
| **API Response Format** | All endpoints | ✅ Consistent JSON structure |
| **Frontend Integration** | All endpoints | ✅ CORS, content types, status codes |

### Project Service (`/project-service/tests/project.test.js`)

| Test Category | Endpoints | Coverage |
|---------------|-----------|----------|
| **Health Check** | `/api/projects/ping` | ✅ Service availability |
| **Project Creation** | `POST /api/projects` | ✅ Success, validation, auth required |
| **Project Retrieval** | `GET /api/projects`, `GET /api/projects/:id` | ✅ List, single, auth required |
| **Project Updates** | `PUT /api/projects/:id` | ✅ Success, not found, auth required |
| **Project Deletion** | `DELETE /api/projects/:id` | ✅ Success, not found, auth required |
| **Data Integrity** | All endpoints | ✅ Ownership, ordering, relationships |
| **Frontend Integration** | All endpoints | ✅ CORS, content types, status codes |

## 🔧 Test Environment Setup

### Environment Variables

Tests use a separate test environment with mocked dependencies:

```javascript
// tests/setup.js
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
```

### Mocked Dependencies

- **Redis**: Mocked to avoid connection issues
- **Prisma**: Mocked for database operations
- **External Services**: Mocked for isolation

## 📈 Test Metrics

### What We Test

1. **HTTP Status Codes**
   - 200: Successful operations
   - 201: Resource creation
   - 400: Client errors (validation, missing fields)
   - 401: Unauthorized (missing token)
   - 403: Forbidden (invalid token)
   - 404: Not found

2. **Response Format Consistency**
   - All success responses have `message` and data properties
   - All error responses have `message` property
   - No sensitive data (passwords) in responses

3. **Authentication Flow**
   - JWT token generation and validation
   - Refresh token rotation
   - Protected route access control

4. **Data Validation**
   - Input validation (email format, password length)
   - Business logic validation (unique emails, user existence)
   - Data integrity (ownership, relationships)

5. **Frontend Integration**
   - CORS headers
   - JSON content type support
   - Proper error handling for frontend consumption

## 🎯 Production Readiness Checklist

Our tests ensure your API is ready for production frontend integration:

- ✅ **Consistent API Contract** - All endpoints follow REST conventions
- ✅ **Proper Error Handling** - Meaningful error messages and status codes
- ✅ **Security** - JWT authentication, input validation, no data leaks
- ✅ **Performance** - Efficient database queries, proper indexing
- ✅ **Scalability** - Microservices architecture, service isolation
- ✅ **Monitoring** - Health check endpoints, proper logging

## 🔍 Debugging Tests

### Common Issues

1. **Redis Connection Errors**
   - Tests mock Redis, so these are expected and don't affect test results
   - Real Redis is only needed for integration tests

2. **Database Connection Issues**
   - Tests use mocked Prisma client
   - No real database connection required for unit tests

3. **Token Validation Failures**
   - Ensure JWT secrets are set in test environment
   - Check token format and expiration

### Verbose Output

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- auth.test.js

# Run tests in watch mode
npm test -- --watch
```

## 📝 Adding New Tests

### For New Endpoints

1. Add test cases to the appropriate service test file
2. Follow the existing pattern:
   ```javascript
   describe('New Feature', () => {
     it('should handle success case', async () => {
       const res = await request(app)
         .post('/api/new-endpoint')
         .send(testData);
       
       expect(res.statusCode).toBe(200);
       expect(res.body).toHaveProperty('expectedField');
     });
   });
   ```

2. Test both success and failure scenarios
3. Verify response format consistency
4. Test authentication requirements

### For New Services

1. Create `tests/` directory in the service
2. Add Jest configuration (`jest.config.js`)
3. Add test setup file (`tests/setup.js`)
4. Update `scripts/run-tests.sh` to include the new service

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: ./scripts/run-tests.sh
```

## 📊 Coverage Reports

After running tests, coverage reports are generated in:

- `auth/coverage/` - Auth service coverage
- `project-service/coverage/` - Project service coverage

Open `coverage/lcov-report/index.html` in your browser to view detailed coverage.

## 🎉 Success Metrics

Your API is production-ready when:

- ✅ All tests pass consistently
- ✅ Coverage > 80% for critical paths
- ✅ No security vulnerabilities detected
- ✅ Performance benchmarks met
- ✅ Frontend integration tested successfully

---

**Built with ❤️ for production-ready microservices** 