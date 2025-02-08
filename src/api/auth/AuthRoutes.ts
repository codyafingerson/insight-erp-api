import { Router } from "express";
import AuthController from "./AuthController";

const router = Router();

const authController = new AuthController();

/**
 * @route POST /api/auth/login
 * @description Logs in a user.
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route POST /api/auth/logout
 * @description Logs out a user.
 * @access Public
 */
router.post("/logout", authController.logout);

export default router;