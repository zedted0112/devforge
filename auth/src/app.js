const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const redis = require('redis');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

(async () => {
  try {
    await redisClient.connect();

    app.use((req, res, next) => {
      req.redis = redisClient;
      next();
    });

    app.use('/api/auth', require('./routes/authRoutes'));

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Auth service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('🔥 Failed to start app:', err);
    process.exit(1);
  }
})();