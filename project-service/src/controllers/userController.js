// 🔄 Sync user from auth-service
const prisma = require('../../prisma/client');
const getMe = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true } // Optional: name if available
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ user });
    } catch (err) {
      console.error("❌ Failed to fetch user profile:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const createUserIfNotExists = async (req, res) => {
    const { id, email } = req.body;
  
    if (!id || !email) {
      return res.status(400).json({ message: "Missing fields" });
    }
  
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const existing = await prisma.user.findUnique({
        where: { id: numericId },
      });
  
      if (existing) {
        return res.status(200).json({ message: "User already exists" });
      }
  
      await prisma.user.create({
        data: {
          id: numericId,
          email,
        },
      });
  
      return res.status(201).json({ message: "User synced successfully" });
    } catch (err) {
      console.error("❌ Failed to sync user:", err.message);
      return res.status(500).json({ message: "Error syncing user" });
    }
  };


  module.exports = {
    createUserIfNotExists,
    getMe,
  };