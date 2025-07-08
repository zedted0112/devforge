const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Middleware to verify JWT token and attach the authenticated user to the request.
 * 
 * - Verifies the token's validity and decodes it.
 * - Checks if the user exists in the database (extra safety).
 * - Attaches the full user object to `req.user` for downstream usage.
 */
const verifyToken = async (req, res, next) => {
  const header = req.headers["authorization"];

  // 1. Check if the Authorization header exists
  if (!header) {
    return res.status(401).json({ message: "Auth token missing" });
  }

  // 2. Extract Bearer token from header
  const token = header.split(" ")[1];

  try {
    // 3. Decode and verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Optional Logging (only during development)
    if (process.env.NODE_ENV !== "production") {
      console.log("🔐 Token decoded:", decoded);
    }

    /**
     * 5. Critical DB Check:
     * Ensures the user tied to the token still exists in the database.
     * This prevents access from deleted or invalid users.
     */
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found in DB" });
    }

    // 6. Attach the verified user object to request for downstream use
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;