import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS properly
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://devforge-zeta.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Add request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} -> ${req.get('origin') || 'unknown'}`);
  next();
});

// Use Railway internal URLs for service communication
const AUTH_TARGET = process.env.AUTH_SERVICE_URL || 'http://devforge-auth.railway.internal:3001';
const PROJECT_TARGET = process.env.PROJECT_SERVICE_URL || 'http://devforge-project-service.railway.internal:3002';

// Health check endpoint
app.get('/health', (_, res) => res.send('✅ Gateway Service Healthy'));
app.get('/ping', (_, res) => res.send('pong'));

// Proxy to project-service
app.use('/api/projects', createProxyMiddleware({
  target: PROJECT_TARGET,
  changeOrigin: true,
  logLevel: 'debug',
}));

app.use('/api/user', createProxyMiddleware({
  target: PROJECT_TARGET,
  changeOrigin: true,
  logLevel: 'debug',
}));

app.use('/api/sync', createProxyMiddleware({
  target: PROJECT_TARGET,
  changeOrigin: true,
  logLevel: 'debug',
}));

// Proxy for all /api/auth routes
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_TARGET,
  changeOrigin: true,
  logLevel: 'debug',
  timeout: 30000, // 30 second timeout
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error('🚨 Auth Service Proxy Error:', err.message);
    res.status(504).json({ 
      error: 'Auth service unavailable', 
      message: 'The authentication service is not responding' 
    });
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 Gateway service running on port ${PORT}`);
  console.log(`📡 Auth Service: ${AUTH_TARGET}`);
  console.log(`📡 Project Service: ${PROJECT_TARGET}`);
});