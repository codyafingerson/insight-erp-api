import { Router } from "express";
import AuthController from "./AuthController";

const router = Router();

const authController = new AuthController();

import { authorize } from "../../middlewares/authorize";

/**
 * @route POST /api/auth/login
 * @description Logs in a user.
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route GET /api/auth/me
 * @description Returns the currently authenticated user.
 * @access Private
 */
router.get("/me", authorize(), authController.me);

/**
 * @route POST /api/auth/logout
 * @description Logs out a user.
 * @access Public
 */
router.post("/logout", authController.logout);

export default router;
