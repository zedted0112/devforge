const express = require("express");
const router = express.Router();

const { getMe } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/ping", (req, res) => {
    res.send("✅ userRoutes live");
  });

router.get("/me", authenticate, getMe);

module.exports = router;