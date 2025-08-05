const jwt = require("jsonwebtoken");

// 🔍 Debug log
// console.log("🔐 JWT_SECRET =", process.env.JWT_SECRET);
// console.log("🔐 REFRESH_TOKEN_SECRET  for rotation ", process.env.REFRESH_TOKEN_SECRET);
exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};