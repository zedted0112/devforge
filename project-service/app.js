// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const projectRoutes = require("./src/routes/projectRoutes");
// 👇 Add this line after other imports
// const userRoutes = require('./routes/userRoutes');

// 👇 After other app.use()
//app.use('/', userRoutes);
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
//test

app.use("/api/projects", projectRoutes);

app.get("/api/projects/ping", (req, res) => {
  res.send("📡 Project Service is live");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Project service running on port ${PORT}`);
});