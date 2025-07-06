const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  refreshTokenHandler,
} = require("../controllers/authControllers");
const {
  validateSignup,
  validateLogin,
} = require("../middlewares/validateAuthInput");

// temporary test routes
router.get("/ping", (req, res) => {
  res.send("Auth service is live");
});

//user sign up routes
router.post("/signup", validateSignup, signupUser);

// user login route

router.post("/login", validateLogin, loginUser);

// refresh token routes

router.post("/refresh", (req, res, next) => {
    console.log("✅ /refresh route hit");
    next();
  }, refreshTokenHandler);

module.exports = router;
