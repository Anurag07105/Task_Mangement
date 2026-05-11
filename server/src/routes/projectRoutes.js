import express from "express";
import {
  addMember,
  createProject,
  getProjectById,
  getProjects,
  removeMember,
  updateProjectStatus
} from "../controllers/projectController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createProjectValidator,
  memberValidator,
  projectIdValidator,
  updateProjectStatusValidator
} from "../validators/projectValidators.js";
import { ROLES } from "../constants/roles.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.get("/", asyncHandler(getProjects));
router.post(
  "/",
  authorizeRoles(ROLES.ADMIN),
  createProjectValidator,
  validateRequest,
  asyncHandler(createProject)
);
router.get("/:id", projectIdValidator, validateRequest, asyncHandler(getProjectById));
router.post(
  "/:id/members",
  authorizeRoles(ROLES.ADMIN),
  projectIdValidator,
  memberValidator,
  validateRequest,
  asyncHandler(addMember)
);
router.delete(
  "/:id/members/:memberId",
  authorizeRoles(ROLES.ADMIN),
  asyncHandler(removeMember)
);
router.patch(
  "/:id/status",
  updateProjectStatusValidator,
  validateRequest,
  asyncHandler(updateProjectStatus)
);

export default router;
