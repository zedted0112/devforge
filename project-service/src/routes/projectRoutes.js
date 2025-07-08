const express = require("express");
const router = express.Router();
const { createProject } = require("../controllers/projectController");
const { authenticate } = require("../middlewares/authMiddleware");
// 🔐 Protected route: Create project
router.post("/", authenticate, createProject);

// 🧪 Public test route
router.get("/", (req, res) => {
  res.json([{ id: 1, title: "Test Project", ownerId: 123 }]);
});

module.exports = router;