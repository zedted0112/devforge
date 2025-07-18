// Test setup file
process.env.NODE_ENV = 'test';

// Mock Redis to avoid connection issues during testing
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    quit: jest.fn()
  }))
}));

// Mock Prisma client with proper user data
jest.mock('../prisma/client', () => {
  const mockUsers = new Map();
  let mockUserIdCounter = 1;
  
  return {
    user: {
      findUnique: jest.fn(({ where }) => {
        const user = mockUsers.get(where.email);
        return Promise.resolve(user || null);
      }),
      create: jest.fn((data, callback) => {
        // Handle the incorrect syntax where callback is passed as second argument
        const actualData = data.data || data;
        const newUser = {
          id: mockUserIdCounter++,
          name: actualData.name,
          email: actualData.email,
          password: actualData.password,
          role: actualData.role || 'user',
          createdAt: new Date()
        };
        mockUsers.set(actualData.email, newUser);
        
        // Execute callback if provided (for console.log)
        if (callback && typeof callback === 'function') {
          callback();
        }
        
        return Promise.resolve(newUser);
      })
    }
  };
});

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'; 