import { Router } from "express";
import UserController from "./UsersController";

const router = Router();

router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUser);

export default router;