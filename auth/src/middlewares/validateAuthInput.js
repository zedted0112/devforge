const { body, validationResult } = require("express-validator");

exports.validateSignup = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),

  body("email")
    .normalizeEmail()
    .isEmail().withMessage("Valid email is required"),

  body("password")
    .trim()
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  body("email")
    .normalizeEmail()
    .isEmail().withMessage("Valid email is required"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  }
];