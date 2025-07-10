// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    console.log("🔐 JWT_SECRET in project-service:", process.env.JWT_SECRET);
console.log("📦 Incoming token:", token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found in DB" });
    }

    req.user = user; // Full user object if needed downstream
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};