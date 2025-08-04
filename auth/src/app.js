const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const redis = require("redis");
const protectedRoutes= require("./routes/protected")
dotenv.config();

const app = express();
app.use(cors());
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

app.get('/ping', (req, res) => {
  res.send('✅ Auth Service Healthy');
});

app.get('/api/auth/ping', (req, res) => {
  res.send('Auth service is live');
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
