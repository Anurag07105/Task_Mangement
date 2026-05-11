import express from "express";
import {
  createTask,
  getTaskDashboard,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { ROLES } from "../constants/roles.js";
import {
  createTaskValidator,
  taskFilterValidator,
  updateTaskValidator
} from "../validators/taskValidators.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.get("/", taskFilterValidator, validateRequest, asyncHandler(getTasks));
router.get("/dashboard", asyncHandler(getTaskDashboard));
router.post(
  "/",
  authorizeRoles(ROLES.ADMIN),
  createTaskValidator,
  validateRequest,
  asyncHandler(createTask)
);
router.patch("/:id", updateTaskValidator, validateRequest, asyncHandler(updateTask));

export default router;
