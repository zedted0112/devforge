const request = require('supertest');
const app = require('../src/app');

describe('Auth Service API', () => {
  // Test data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const testUser2 = {
    name: 'Test User 2',
    email: 'test2@example.com',
    password: 'password456'
  };

  let accessToken;
  let refreshToken;
  let userId;

  describe('Health Check', () => {
    it('should respond to /api/auth/ping', async () => {
      const res = await request(app).get('/api/auth/ping');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Auth service is live');
    });
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Signup successful');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).not.toHaveProperty('password'); // Password should not be returned

      userId = res.body.user.id;
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test', email: 'test@example.com' }); // Missing password

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ ...testUser, email: 'invalid-email' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });

    it('should reject registration with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser); // Same email as above

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should reject registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ ...testUser, email: 'new@example.com', password: '123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('User Authentication', () => {
    beforeEach(async () => {
      // Ensure test user exists before testing login
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should login user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', testUser.email);

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid password');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid user. Please sign up.');
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email }); // Missing password

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });

    it('should reject login with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('Token Refresh', () => {
    beforeEach(async () => {
      // Ensure we have valid tokens
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      accessToken = loginRes.body.accessToken;
      refreshToken = loginRes.body.refreshToken;
    });

    it('should refresh tokens successfully', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Token refreshed');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      
      // New tokens should be different from old ones
      expect(res.body.accessToken).not.toBe(accessToken);
      expect(res.body.refreshToken).not.toBe(refreshToken);

      // Update tokens for subsequent tests
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('should reject refresh with missing token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Refresh token missing');
    });

    it('should reject refresh with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message', 'Invalid or expired refresh token');
    });
  });

  describe('Protected Routes', () => {
    beforeEach(async () => {
      // Ensure we have valid tokens
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      accessToken = loginRes.body.accessToken;
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/protected/secret')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'you have accessed the protected zone');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email');
    });

    it('should reject access to protected route without token', async () => {
      const res = await request(app)
        .get('/api/protected/secret');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Auth token missing');
    });

    it('should reject access to protected route with invalid token', async () => {
      const res = await request(app)
        .get('/api/protected/secret')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message', 'Invalid or expired token');
    });

    it('should reject access to protected route with malformed authorization header', async () => {
      const res = await request(app)
        .get('/api/protected/secret')
        .set('Authorization', 'InvalidFormat');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Auth token missing');
    });
  });

  describe('API Response Format', () => {
    it('should return consistent error response format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email', password: '123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    it('should return consistent success response format for signup', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser2);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return consistent success response format for login', async () => {
      // First create the user
      await request(app)
        .post('/api/auth/signup')
        .send(testUser2);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser2.email,
          password: testUser2.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).not.toHaveProperty('password');
    });
  });

  describe('Frontend Integration Readiness', () => {
    it('should support CORS for frontend requests', async () => {
      const res = await request(app)
        .get('/api/auth/ping')
        .set('Origin', 'http://localhost:3000');

      expect(res.statusCode).toBe(200);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should accept JSON content type for all endpoints', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send(testUser);

      expect(res.statusCode).toBe(201);
    });

    it('should return proper HTTP status codes for different scenarios', async () => {
      // 200 for successful operations
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      expect(loginRes.statusCode).toBe(200);

      // 201 for resource creation
      const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({ ...testUser, email: 'newuser@example.com' });
      expect(signupRes.statusCode).toBe(201);

      // 400 for client errors
      const badRequestRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid' });
      expect(badRequestRes.statusCode).toBe(400);

      // 401 for unauthorized
      const unauthorizedRes = await request(app)
        .get('/api/protected/secret');
      expect(unauthorizedRes.statusCode).toBe(401);

      // 403 for forbidden
      const forbiddenRes = await request(app)
        .get('/api/protected/secret')
        .set('Authorization', 'Bearer invalid-token');
      expect(forbiddenRes.statusCode).toBe(403);
    });
  });
}); 