// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const projectRoutes = require("./src/routes/projectRoutes");
const syncRoutes = require('./src/routes/syncRoutes');
const userRoutes = require('./src/routes/userRoutes');


//app.use('/', userRoutes);
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
//test
app.get('/health', (req, res) => {
  res.send('✅ project Service Healthy');
});
app.use("/api/projects", projectRoutes);

app.use('/api/sync', syncRoutes);
app.use('/api/user', userRoutes);
app.get("/api/projects/ping", (req, res) => {
  res.send("📡 Project Service is live");
});

module.exports = app;

if (require.main === module) {
  (async () => {
    try {
      // Run database schema push on startup (more reliable than migrations)
      console.log("🔁 Setting up project service database schema...");
      const { execSync } = require('child_process');
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log("✅ Project service database schema pushed successfully");
      } catch (pushError) {
        console.error("❌ Project service database setup failed:", pushError.message);
        console.error("❌ Full error:", pushError);
      }

      const PORT = process.env.PORT || 3002;
      app.listen(PORT, () => {
        console.log(`🚀 Project service running on port ${PORT}`);
      });
    } catch (err) {
      console.error("🔥 Failed to start project service:", err);
      process.exit(1);
    }
  })();
}