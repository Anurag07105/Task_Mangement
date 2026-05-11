import { body, param } from "express-validator";

export const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required.")
];

export const projectIdValidator = [
  param("id").isMongoId().withMessage("Valid project id is required.")
];

export const memberValidator = [
  body("memberId").isMongoId().withMessage("Valid member id is required.")
];

export const updateProjectStatusValidator = [
  param("id").isMongoId().withMessage("Valid project id is required."),
  body("status")
    .isIn(["planning", "active", "completed"])
    .withMessage("Status must be planning, active, or completed.")
];
