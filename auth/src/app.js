const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const redis = require("redis");
const protectedRoutes= require("./routes/protected")
dotenv.config();

const app = express();

// Configure CORS properly
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://devforge-zeta.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

// Health check endpoint
app.get('/ping', (req, res) => {
  console.log('🏥 Health check requested from:', req.get('origin') || 'unknown');
  res.send('✅ Auth Service Healthy');
});

app.get('/api/auth/ping', (req, res) => {
  console.log('🏥 Auth ping requested from:', req.get('origin') || 'unknown');
  res.send('Auth service is live');
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} -> ${req.get('origin') || 'unknown'}`);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", protectedRoutes);

module.exports = app;

if (require.main === module) {
  (async () => {
    try {
      console.log("🔁 Connecting to Redis...");
      await redisClient.connect();
      console.log("✅ Redis connected");

      // Run database migrations on startup
      console.log("🔁 Running database migrations...");
      const { execSync } = require('child_process');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log("✅ Database migrations completed");
      } catch (migrationError) {
        console.error("⚠️ Migration failed, trying db push...");
        try {
          execSync('npx prisma db push', { stdio: 'inherit' });
          console.log("✅ Database schema pushed");
        } catch (pushError) {
          console.error("❌ Database setup failed:", pushError.message);
        }
      }

      app.use((req, res, next) => {
        req.redis = redisClient;
        next();
      });
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => {
        console.log(`🚀 Auth service running on port ${PORT}`);
      });
    } catch (err) {
      console.error("🔥 Failed to start app:", err);
      process.exit(1);
    }
  })();
}
