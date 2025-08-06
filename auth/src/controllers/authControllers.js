//auth/src/controllers/authControllers.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
const prisma = require("../../prisma/client")
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const redisClient = require("../config/db");

// Temporary in-memory user storage
//const users = [];
// replacing i with real db



// ─────────────── Signup ───────────────
exports.signupUser = async (req, res) => {
  try {
    // console.log("📥 Incoming signup:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // check if user is already exits
    // const existingUser = users.find((user) => user.email === email);
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    const existingUser = await prisma.user.findUnique({
      where :{email}
    });

    if(existingUser){
      return res.status(400).json({
        message:"User already exists"
      });
    }

    



    // console.log("🔐 Hashing password...");
    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("✅ Password hashed succesfully");

    //old logic for temp temp adding a new user
    // const newUser = {
    //   id: users.length + 1,
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role: "user",
    // };

    // users.push(newUser);

    // new logic to add user

    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    // console.log("✅ New user created in Auth-db", newUser);

    

    // sycning with project db passing token to project service
// new patch now token  is issued only after user login in project
   







    return res.status(201).json({
      message: "Signup successful",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// ─────────────── Login ───────────────

exports.loginUser = async (req, res) => {
      // console.log("📥 Incoming login:", req.body);

  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // console.log("❌ User not found in Auth DB");
      return res.status(400).json({ message: "Invalid user. Please sign up." });
    }

    // console.log("✅ User found:", { id: user.id, email: user.email });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid password" });
    }

    // console.log("🔐 Password matched");

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // console.log("🔑 Access Token:", accessToken);
    // console.log("🔄 Refresh Token:", refreshToken);

    await redisClient.set(`refresh:${user.id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    // console.log("✅ Login successful, tokens issued");

    // 🛰 Sync to project-service
    // Use external Railway URL for reliable service-to-service communication
    // Internal URLs (http://project-service:3002) don't work reliably in Railway
    try {
      const syncUrl = process.env.PROJECT_SERVICE_URL || "https://devforge-project-service-production.up.railway.app";
      const fullSyncUrl = `${syncUrl}/api/sync/user`;
      // console.log("📡 Syncing to Project Service:", fullSyncUrl);

      const syncResponse = await axios.post(fullSyncUrl,
        { id: user.id, email: user.email },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log("📬 Sync response from project:", syncResponse.data);
    } catch (err) {
      console.error("⚠️ User sync to project-service failed (login):", err.message);
    }

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// ─────────────── Refresh Token ───────────────

exports.refreshTokenHandler = async (req, res) => {
  console.log("🔄 /refresh-token endpoint hit");

  const { refreshToken } = req.body;
  console.log("🧾 Received token:", refreshToken);

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token missing" });
  }

  console.log("🔐 Verifying secret:");

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("✅ JWT verified. Payload:", payload);
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  const storedToken = await redisClient.get(`refresh:${payload.id}`);
  console.log("📦 Token in Redis:", storedToken);

  if (storedToken !== refreshToken) {
    console.warn("⚠️ Token mismatch - possible reuse or expired");
    return res.status(403).json({ message: "Token reuse detected or invalid" });
  }

  const newPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };

  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  await redisClient.set(`refresh:${payload.id}`, newRefreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  console.log("🔁 Tokens refreshed successfully");

  return res.status(200).json({
    message: "Token refreshed",
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

// ─────────────── Forgot Password ───────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration (1 hour from now)
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken,
        resetPasswordExpires,
      },
    });

    // In a real application, you would send an email here
    // For now, we'll return the token in the response (for testing)
    // In production, this should be sent via email
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    console.log('🔐 Password reset link generated:', resetUrl);

    return res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
      resetUrl, // Remove this in production
      resetToken, // Remove this in production
    });

  } catch (err) {
    console.error("❌ Forgot password error:", err);
    return res.status(500).json({ message: "Server error during password reset request" });
  }
};

// ─────────────── Reset Password ───────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Clear any existing refresh tokens for this user
    await redisClient.del(`refresh:${user.id}`);

    console.log('✅ Password reset successful for user:', user.email);

    return res.status(200).json({
      message: "Password has been reset successfully. You can now login with your new password.",
    });

  } catch (err) {
    console.error("❌ Reset password error:", err);
    return res.status(500).json({ message: "Server error during password reset" });
  }
};

// ─────────────── Validate Reset Token ───────────────
exports.validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Hash the token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ 
        valid: false,
        message: "Invalid or expired reset token" 
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Token is valid",
    });

  } catch (err) {
    console.error("❌ Validate reset token error:", err);
    return res.status(500).json({ 
      valid: false,
      message: "Server error during token validation" 
    });
  }
};