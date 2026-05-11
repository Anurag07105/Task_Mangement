import Project from "../models/Project.js";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

const hasAccess = (project, userId) =>
  project.members.some((memberId) => memberId.toString() === userId.toString());

export const createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: [req.user._id]
  });

  return res.status(201).json({ message: "Project created.", project });
};

export const getProjects = async (req, res) => {
  const query =
    req.user.role === ROLES.ADMIN ? {} : { members: { $in: [req.user._id] } };
  const projects = await Project.find(query)
    .populate("members", "name email role")
    .populate("createdBy", "name email");
  return res.status(200).json({ projects });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("members", "name email role")
    .populate("createdBy", "name email");

  if (!project) return res.status(404).json({ message: "Project not found." });
  if (req.user.role !== ROLES.ADMIN && !hasAccess(project, req.user._id)) {
    return res.status(403).json({ message: "Access denied to this project." });
  }

  return res.status(200).json({ project });
};

export const addMember = async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;

  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found." });

  const user = await User.findById(memberId);
  if (!user) return res.status(404).json({ message: "Member not found." });

  if (!project.members.some((m) => m.toString() === memberId)) {
    project.members.push(memberId);
    await project.save();
  }

  const populated = await Project.findById(id).populate("members", "name email role");
  return res.status(200).json({ message: "Member added to project.", project: populated });
};

export const removeMember = async (req, res) => {
  const { id, memberId } = req.params;
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found." });

  project.members = project.members.filter((m) => m.toString() !== memberId);
  await project.save();

  return res.status(200).json({ message: "Member removed.", project });
};

export const updateProjectStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found." });

  if (req.user.role !== ROLES.ADMIN && !hasAccess(project, req.user._id)) {
    return res.status(403).json({ message: "You are not a member of this project." });
  }

  project.status = status;
  await project.save();

  return res.status(200).json({ message: "Project status updated.", project });
};
