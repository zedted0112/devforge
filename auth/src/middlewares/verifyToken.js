///Users/himalayancoder/Projects and learnings/Projects/devforge/auth/src/middlewares/verifyToken.js

const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/client"); // 📦 DB client (Prisma)

const isDev = process.env.NODE_ENV !== "production"; // ⚙️ Toggle dev logs

/**
 * Verify JWT token and attach user to request.
 * - Decodes token
 * - Checks user in DB
 * - Blocks if invalid/missing
 */
const verifyToken = async (req, res, next) => {
  // 🛡️ Step 1: Extract token from headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (isDev) console.log("🛡️ [verifyToken] Auth Header:", authHeader);

  if (!token) {
    // ❌ No token? Abort with 401
    if (isDev) console.log("❌ No token provided.");
    return res.status(401).json({ message: "Auth token missing" });
  }

  try {
    // 🔍 Step 2: Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (isDev) console.log("✅ Token decoded:", decoded);

    // 🔎 Step 3: Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      // ❌ User not in DB? Block access
      if (isDev) console.log("❌ User not found in DB");
      return res.status(403).json({ message: "User not found" });
    }

    // ✅ Success: Attach user to request
    req.user = user;
    if (isDev) console.log("👤 Authenticated User:", user.email);

    next(); // 🎯 Go to next middleware/controller
  } catch (err) {
    // 🧨 Any error (e.g., expired token)
    if (isDev) console.error("🚨 Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;