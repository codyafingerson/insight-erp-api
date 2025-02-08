import { Router } from "express";
import UserController from "./UsersController";
import UserService from "./UsersService";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

/**
 * @route POST /api/users
 * @description Creates a new user.
 * @access Private
 */
router.post("/", userController.createUser);

/**
 * @route PUT /api/users/:id
 * @description Updates a user.
 * @access Private
 */
router.put("/:id", userController.updateUser);

/**
 * @route GET /api/users
 * @description Gets all users.
 * @access Private
 */
router.get("/", userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @description Gets a user by ID.
 * @access Private
 */
router.get("/:id", userController.getUserById);

/**
 * @route DELETE /api/users/:id
 * @description Deletes a user.
 * @access Private
 */
router.delete("/:id", userController.deleteUser);

export default router;