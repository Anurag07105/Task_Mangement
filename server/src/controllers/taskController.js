import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { ROLES } from "../constants/roles.js";
import { TASK_STATUS } from "../constants/task.js";

const canMemberAccessTask = async (task, userId) => {
  const project = await Project.findById(task.project).select("members");
  if (!project) return false;
  return project.members.some((memberId) => memberId.toString() === userId.toString());
};

export const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found." });

  const isMemberInProject = project.members.some((id) => id.toString() === assignedTo);
  if (!isMemberInProject) {
    return res.status(400).json({ message: "Assignee must be a project member." });
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo,
    status,
    priority,
    dueDate,
    createdBy: req.user._id
  });

  return res.status(201).json({ message: "Task created.", task });
};

export const getTasks = async (req, res) => {
  const { projectId, assignedTo, status, priority, search } = req.query;
  const filter = {};

  if (projectId) filter.project = projectId;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

  if (req.user.role === ROLES.MEMBER) {
    const memberProjects = await Project.find({ members: { $in: [req.user._id] } }).select("_id");
    filter.project = { $in: memberProjects.map((project) => project._id) };
  }

  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json({ tasks });
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  if (req.user.role === ROLES.MEMBER) {
    const canAccess = await canMemberAccessTask(task, req.user._id);
    if (!canAccess) {
      return res.status(403).json({ message: "You are not allowed to update this task." });
    }

    if (Object.keys(req.body).some((field) => field !== "status")) {
      return res.status(403).json({ message: "Members can only update task status." });
    }
  }

  const updatableFields = ["title", "description", "status", "priority", "dueDate", "assignedTo"];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  await task.save();
  const updated = await Task.findById(task._id)
    .populate("project", "name")
    .populate("assignedTo", "name email");
  return res.status(200).json({ message: "Task updated.", task: updated });
};

export const getTaskDashboard = async (req, res) => {
  const baseMatch =
    req.user.role === ROLES.MEMBER ? { assignedTo: new mongoose.Types.ObjectId(req.user._id) } : {};

  const tasks = await Task.find(baseMatch);
  const now = new Date();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  const pendingTasks = tasks.filter((t) => t.status !== TASK_STATUS.DONE).length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== TASK_STATUS.DONE && t.dueDate && t.dueDate < now
  ).length;

  const progressByStatus = [
    { name: "Todo", value: tasks.filter((t) => t.status === TASK_STATUS.TODO).length },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length
    },
    { name: "Done", value: completedTasks }
  ];

  return res.status(200).json({
    stats: { totalTasks, completedTasks, pendingTasks, overdueTasks },
    progressByStatus
  });
};
