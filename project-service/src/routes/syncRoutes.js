const express = require("express");
const router = express.Router();

const { createUserIfNotExists } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

// 🔐 Protected internal sync route
router.post("/user", authenticate, createUserIfNotExists);

module.exports = router;