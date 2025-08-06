const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  refreshTokenHandler,
  forgotPassword,
  resetPassword,
  validateResetToken,
} = require("../controllers/authControllers");
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middlewares/validateAuthInput");

// temporary test routes
router.get("/health", (req, res) => {
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

// forgot password route
router.post("/forgot-password", validateForgotPassword, forgotPassword);

// reset password route
router.post("/reset-password", validateResetPassword, resetPassword);

// validate reset token route
router.get("/validate-reset-token/:token", validateResetToken);

module.exports = router;
