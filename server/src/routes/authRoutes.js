import express from "express";
import { getMe, getUsers, login, signup } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginValidator, signupValidator } from "../validators/authValidators.js";
import { ROLES } from "../constants/roles.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, asyncHandler(signup));
router.post("/login", loginValidator, validateRequest, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));
router.get("/users", protect, authorizeRoles(ROLES.ADMIN), asyncHandler(getUsers));

export default router;
