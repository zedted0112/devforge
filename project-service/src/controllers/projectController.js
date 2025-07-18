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
console.log("Project Created :",project);
    return res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (err) {
    console.error(" Error creating project:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all projects for a user

exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.user?.id;
    const projects = await prisma.project.findMany({
      where: {
        ownerId: Number(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({ projects });
  } catch (err) {
    console.error("Error Fetching projectcs", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//get project by id
exports.getProjectById = async (req, res) => {


  console.log("We are taking this as project id",req.params.id)
  try {
    const projectId = req.params.id;
    const userId = req.user?.id;
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "project not found !",
      });
    }
    res.status(200).json({
      project,
    });
  } catch (err) {
    console.error("Error Fetching project", err);

    return res.status(500).json({
      message: "Interal Server error",
    });
  }
};

//update project
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description } = req.body;
    const userId = req.user?.id;

    // Step 1: Check if the project exists AND belongs to the logged-in user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId, // 🔐 Only allow update if user owns it
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project Not Found or Unauthorized",
      });
    }

    // Step 2: Update the project
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { title, description },
    });

    res.status(200).json({
      message: "Project updated",
      project: updated,
    });
  } catch (err) {
    console.error("❌ Error updating project:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete the project
exports.deleteProject =async (req,res) =>{
  try{
    const projectId = req.params.id;
    const userId = req.user?.id;
    const project = await prisma.project.findFirst({


where:{
  id:projectId,
  ownerId:userId
},

    });
    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" });
    }

    await prisma.project.delete ({
      where :{
        id:projectId
      },
    });
 
res.status(200).json({
  message:"Project deleted"
});
 
  }


  

  catch(err){
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Internal server error" });
 

  }
}
