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
app.use(cors());
app.use(express.json());
//test

app.use("/api/projects", projectRoutes);

app.use('/api/sync', syncRoutes);
app.use('/api/user', userRoutes);
app.get("/api/projects/ping", (req, res) => {
  res.send("📡 Project Service is live");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Project service running on port ${PORT}`);
});