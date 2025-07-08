// ✅ Controller: Get current logged-in user
const prisma = require('../prisma/client');

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};