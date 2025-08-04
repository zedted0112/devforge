// Test setup file
process.env.NODE_ENV = 'test';

// Mock users storage
const mockUsers = new Map();
let mockUserIdCounter = 1;

// Create mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn(({ where }) => {
      const user = mockUsers.get(where.email);
      return Promise.resolve(user || null);
    }),
    create: jest.fn(({ data }) => {
      const newUser = {
        id: mockUserIdCounter++,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'user',
        createdAt: new Date()
      };
      mockUsers.set(data.email, newUser);
      return Promise.resolve(newUser);
    })
  }
};

// Create mock Redis client
const mockRedisClient = {
  connect: jest.fn(),
  on: jest.fn(),
  set: jest.fn(() => Promise.resolve('OK')),
  get: jest.fn(() => Promise.resolve('mock-refresh-token')),
  quit: jest.fn()
};

// Mock all external dependencies
jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient)
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));

// Mock the Prisma client module
jest.mock('../prisma/client', () => mockPrisma);

// Mock the Redis config module
jest.mock('../src/config/db', () => mockRedisClient);

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Export mocks for use in tests
module.exports = {
  mockPrisma,
  mockRedisClient,
  mockUsers
}; 