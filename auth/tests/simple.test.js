const request = require('supertest');
const app = require('../src/app');

describe('Auth Service Basic Tests', () => {
  describe('Health Check', () => {
    it('should respond to /ping', async () => {
      const res = await request(app).get('/ping');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('✅ Auth Service Healthy');
    });

    it('should respond to /api/auth/ping', async () => {
      const res = await request(app).get('/api/auth/ping');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Auth service is live');
    });
  });

  describe('CORS Support', () => {
    it('should support CORS for frontend requests', async () => {
      const res = await request(app)
        .get('/ping')
        .set('Origin', 'http://localhost:3000');
      
      expect(res.statusCode).toBe(200);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Protected Routes', () => {
    it('should reject access to protected route without token', async () => {
      const res = await request(app).get('/api/protected/secret');
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
}); 