// projectRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
console.log("📦 projectRoutes loaded");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/", authenticate, getAllProjects); // Get all projects

router.post("/", authenticate, createProject); //  Create

router.get("/:id", authenticate, getProjectById); //  Get single project by ID

router.put("/:id", authenticate, updateProject); //  Update

router.delete("/:id", authenticate, deleteProject); //  Delete

module.exports = router;