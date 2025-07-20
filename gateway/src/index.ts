import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// 🟢 Basic health route
app.get('/ping', (_, res) => res.send('pong'));

// 🔁 Proxy /api/auth → http://auth:3001
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
   //target: 'http://auth:3001',
  changeOrigin: true,
 // pathRewrite: { '^/api/auth': '' },
  logLevel: 'debug',
}));

app.listen(PORT, () => {
  console.log(`[GATEWAY] Running on port ${PORT}`);
}); 