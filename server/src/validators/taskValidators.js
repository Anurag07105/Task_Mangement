import { body, param, query } from "express-validator";
import { TASK_PRIORITY, TASK_STATUS } from "../constants/task.js";

export const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required."),
  body("projectId").isMongoId().withMessage("Valid project id is required."),
  body("assignedTo").isMongoId().withMessage("Valid assignee id is required."),
  body("priority")
    .optional()
    .isIn([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH])
    .withMessage("Invalid priority."),
  body("status")
    .optional()
    .isIn([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE])
    .withMessage("Invalid status."),
  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date.")
];

export const updateTaskValidator = [
  param("id").isMongoId().withMessage("Valid task id is required."),
  body("status")
    .optional()
    .isIn([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE])
    .withMessage("Invalid status."),
  body("priority")
    .optional()
    .isIn([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH])
    .withMessage("Invalid priority."),
  body("assignedTo").optional().isMongoId().withMessage("Valid assignee id is required."),
  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date.")
];

export const taskFilterValidator = [
  query("projectId").optional().isMongoId().withMessage("projectId must be valid."),
  query("assignedTo").optional().isMongoId().withMessage("assignedTo must be valid."),
  query("status")
    .optional()
    .isIn([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE])
    .withMessage("Invalid status filter."),
  query("priority")
    .optional()
    .isIn([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH])
    .withMessage("Invalid priority filter.")
];
