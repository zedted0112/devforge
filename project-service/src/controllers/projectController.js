const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id; // Added from auth middleware

    if (!title || !userId) {
      return res.status(400).json({ message: "Title and user ID required" });
    }

    //
    // console.log("Creating project with:", {
    //     title,
    //     description,
    //     ownerId: userId,
    //     typeofOwnerId: typeof userId,
    //   });

    // stanity check
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User does not exist in DB" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        ownerId: Number(userId),
      },
    });

    return res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (err) {
    console.error("❌ Error creating project:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
