import Project from "../models/Project.js";

/* ---------- PUBLIC ---------- */

// GET all projects (portfolio)
export const getProjects = async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
};

/* ---------- ADMIN ---------- */

// ADD project
export const addProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
};

// UPDATE project
export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

// DELETE project
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await project.deleteOne();
  res.json({ message: "Project deleted successfully" });
};
