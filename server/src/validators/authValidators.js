import { body } from "express-validator";
import { ROLES } from "../constants/roles.js";

export const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars."),
  body("role")
    .optional()
    .isIn([ROLES.ADMIN, ROLES.MEMBER])
    .withMessage("Role must be admin or member.")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required.")
];
