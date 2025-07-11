///Users/himalayancoder/Projects and learnings/Projects/devforge/project-service/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/client");
exports.authenticate = async (req, res, next) => {

  console.log("✅ authMiddleware loaded fresh");
  console.log("🔥 [authMiddleware] called");

  const authHeader = req.headers["authorization"];
  console.log("Auth Header Received:" ,authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔐 Incoming token:", token);
  console.log("🔎 URL:", req.originalUrl);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded token payload:", decoded);

    if (req.originalUrl.startsWith("/api/sync/user")) {
      req.user = decoded;
      return next();
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(403).json({ message: "User not found in DB" });
    }

    req.user = user;
    next();
  } 
  
  
  catch (err) {
    console.error("❌ Token error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};