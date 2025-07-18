const request = require('supertest');
const app = require('../app');

describe('Project Service API', () => {
  // Test data
  const testProject = {
    title: 'Test Project',
    description: 'This is a test project'
  };

  const testProject2 = {
    title: 'Another Test Project',
    description: 'This is another test project'
  };

  let accessToken;
  let projectId;

  // Helper function to get a valid token (you'll need to implement this based on your auth flow)
  const getValidToken = async () => {
    // This would typically come from your auth service
    // For now, we'll use a mock token or you can implement actual auth
    return 'mock-valid-token';
  };

  beforeAll(async () => {
    // Get a valid token for authenticated requests
    accessToken = await getValidToken();
  });

  describe('Health Check', () => {
    it('should respond to /api/projects/ping', async () => {
      const res = await request(app).get('/api/projects/ping');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('📡 Project Service is live');
    });
  });

  describe('Project Creation', () => {
    it('should create a new project successfully', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testProject);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Project created');
      expect(res.body).toHaveProperty('project');
      expect(res.body.project).toHaveProperty('id');
      expect(res.body.project).toHaveProperty('title', testProject.title);
      expect(res.body.project).toHaveProperty('description', testProject.description);
      expect(res.body.project).toHaveProperty('ownerId');
      expect(res.body.project).toHaveProperty('createdAt');

      projectId = res.body.project.id;
    });

    it('should reject project creation without title', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'No title project' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Title and user ID required');
    });

    it('should reject project creation without authentication', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send(testProject);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });

    it('should reject project creation with invalid token', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer invalid-token')
        .send(testProject);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message', 'Invalid or expired token');
    });
  });

  describe('Project Retrieval', () => {
    it('should get all projects for authenticated user', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('projects');
      expect(Array.isArray(res.body.projects)).toBe(true);
      
      // Should contain the project we created
      const project = res.body.projects.find(p => p.id === projectId);
      expect(project).toBeDefined();
      expect(project.title).toBe(testProject.title);
    });

    it('should reject getting projects without authentication', async () => {
      const res = await request(app)
        .get('/api/projects');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });

    it('should get a specific project by ID', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('project');
      expect(res.body.project.id).toBe(projectId);
      expect(res.body.project.title).toBe(testProject.title);
    });

    it('should reject getting non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'project not found !');
    });

    it('should reject getting project without authentication', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });
  });

  describe('Project Updates', () => {
    it('should update project successfully', async () => {
      const updateData = {
        title: 'Updated Project Title',
        description: 'Updated project description'
      };

      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Project updated');
      expect(res.body).toHaveProperty('project');
      expect(res.body.project.title).toBe(updateData.title);
      expect(res.body.project.description).toBe(updateData.description);
    });

    it('should reject updating non-existent project', async () => {
      const res = await request(app)
        .put('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Project Not Found or Unauthorized');
    });

    it('should reject updating project without authentication', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });
  });

  describe('Project Deletion', () => {
    it('should delete project successfully', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Project deleted');
    });

    it('should reject deleting non-existent project', async () => {
      const res = await request(app)
        .delete('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Project not found or not authorized');
    });

    it('should reject deleting project without authentication', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });
  });

  describe('API Response Format', () => {
    it('should return consistent error response format', async () => {
      const res = await request(app)
        .get('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    it('should return consistent success response format for project creation', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testProject2);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('project');
      expect(res.body.project).toHaveProperty('id');
      expect(res.body.project).toHaveProperty('title');
      expect(res.body.project).toHaveProperty('description');
      expect(res.body.project).toHaveProperty('ownerId');
      expect(res.body.project).toHaveProperty('createdAt');
    });

    it('should return consistent success response format for project retrieval', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('projects');
      expect(Array.isArray(res.body.projects)).toBe(true);
    });
  });

  describe('Frontend Integration Readiness', () => {
    it('should support CORS for frontend requests', async () => {
      const res = await request(app)
        .get('/api/projects/ping')
        .set('Origin', 'http://localhost:3000');

      expect(res.statusCode).toBe(200);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should accept JSON content type for all endpoints', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Content-Type', 'application/json')
        .send(testProject);

      expect(res.statusCode).toBe(201);
    });

    it('should return proper HTTP status codes for different scenarios', async () => {
      // 200 for successful operations
      const getRes = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(getRes.statusCode).toBe(200);

      // 201 for resource creation
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'New Project' });
      expect(createRes.statusCode).toBe(201);

      // 400 for client errors
      const badRequestRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({}); // Missing title
      expect(badRequestRes.statusCode).toBe(400);

      // 401 for unauthorized
      const unauthorizedRes = await request(app)
        .get('/api/projects');
      expect(unauthorizedRes.statusCode).toBe(401);

      // 403 for forbidden
      const forbiddenRes = await request(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer invalid-token');
      expect(forbiddenRes.statusCode).toBe(403);

      // 404 for not found
      const notFoundRes = await request(app)
        .get('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(notFoundRes.statusCode).toBe(404);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain project ownership', async () => {
      // Create a project
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Ownership Test Project' });

      const projectId = createRes.body.project.id;
      const ownerId = createRes.body.project.ownerId;

      // Verify the project has the correct owner
      const getRes = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(getRes.body.project.ownerId).toBe(ownerId);
    });

    it('should return projects ordered by creation date (newest first)', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.projects.length).toBeGreaterThan(1);

      // Check if projects are ordered by createdAt desc
      const projects = res.body.projects;
      for (let i = 0; i < projects.length - 1; i++) {
        const currentDate = new Date(projects[i].createdAt);
        const nextDate = new Date(projects[i + 1].createdAt);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });
}); 