import { Router } from "express";
import AuthController from "./AuthController";

const router = Router();

const authController = new AuthController();

router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;