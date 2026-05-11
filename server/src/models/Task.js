import mongoose from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../constants/task.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE],
      default: TASK_STATUS.TODO
    },
    priority: {
      type: String,
      enum: [TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH],
      default: TASK_PRIORITY.MEDIUM
    },
    dueDate: {
      type: Date
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
