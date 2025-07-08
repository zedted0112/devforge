const express = require("express");
const router = express.Router();
const { createProject } = require("../controllers/projectController");
const { authenticate } = require("../middlewares/authMiddleware");

// POST /api/projects → create project (protected)
router.post("/", authenticate, createProject);
//test
router.get("/", (req, res) => {
    res.json([{ id: 1, title: "Test Project", ownerId: 123 }]);
  });

module.exports = router;