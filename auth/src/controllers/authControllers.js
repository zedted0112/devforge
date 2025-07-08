const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const redisClient = require("../config/db");

// Temporary in-memory user storage
//const users = [];
// replacing i with real db
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // ✅ Real PostgreSQL DB



// ─────────────── Signup ───────────────

exports.signupUser = async (req, res) => {
  try {
    console.log("📥 Incoming signup:", req.body);
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



    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

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
    })

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
  console.log("📥 Incoming login:", req.body);

  try {
    const { email, password } = req.body;

    //const user = users.find((u) => u.email === email);
    

    // fetch user from database
    const user =await prisma.user.findUnique({
      where:{email},
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid user. Please sign up." });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await redisClient.set(`refresh:${user.id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("✅ Login successful, tokens issued");

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
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