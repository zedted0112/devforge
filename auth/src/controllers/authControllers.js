const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const redisClient = require("../config/db");

// Temporary in-memory user storage
const users = [];

// ─────────────── Signup ───────────────

exports.signupUser = async (req, res) => {
  try {
    console.log("Incoming signup:", req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check for existing user
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// ─────────────── Login ───────────────

exports.loginUser = async (req, res) => {
  console.log("Incoming login:", req.body);

  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid user. Please sign up." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token in Redis
    await redisClient.set(`refresh:${user.id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};