import { Router } from "express";
import UserController from "./UsersController";
import UserService from "./UsersService";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);

export default router;