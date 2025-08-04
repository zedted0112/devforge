import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;
const isDocker = process.env.DOCKER === 'true';

const AUTH_TARGET = isDocker ? 'http://auth-service:3001' : 'http://localhost:3001';
const PROJECT_TARGET = isDocker ? 'http://project-service:3002' : 'http://localhost:3002';

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
  console.log(`[GATEWAY] Running on port ${PORT}`);
});