import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Use Railway internal URLs for service communication
const AUTH_TARGET = process.env.AUTH_SERVICE_URL || 'http://auth-service.railway.internal:3001';
const PROJECT_TARGET = process.env.PROJECT_SERVICE_URL || 'http://project-service.railway.internal:3002';

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
}));

app.listen(PORT, () => {
  console.log(`🚀 Gateway service running on port ${PORT}`);
  console.log(`📡 Auth Service: ${AUTH_TARGET}`);
  console.log(`📡 Project Service: ${PROJECT_TARGET}`);
});