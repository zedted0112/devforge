const request = require('supertest');
const app = require('../src/app');

describe('Simple Auth Service Tests', () => {
  describe('Health Check', () => {
    it('should respond to /api/auth/ping', async () => {
      const res = await request(app).get('/api/auth/ping');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Auth service is live');
    });
  });

  describe('Input Validation', () => {
    it('should reject signup with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test', email: 'test@example.com' }); // Missing password

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should reject signup with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ 
          name: 'Test User', 
          email: 'invalid-email', 
          password: 'password123' 
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }); // Missing password

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

  describe('Protected Routes', () => {
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
  });

  describe('Frontend Integration Readiness', () => {
    it('should support CORS for frontend requests', async () => {
      const res = await request(app)
        .get('/api/auth/ping')
        .set('Origin', 'http://localhost:3000');

      expect(res.statusCode).toBe(200);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should return proper HTTP status codes', async () => {
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