import { Router } from "express";
import UserController from "./UsersController";
import UserService from "./UsersService";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// middleware
import { requirePermission } from "../../middlewares/requirePermission";

/**
 * @route POST /api/users
 * @description Creates a new user.
 * @access Private
 */
router.post("/", requirePermission('create_user'), userController.createUser);

/**
 * @route PUT /api/users/:id
 * @description Updates a user.
 * @access Private
 */
router.put("/:id", requirePermission('update_user'), userController.updateUser);

/**
 * @route GET /api/users
 * @description Gets all users.
 * @access Private
 */
router.get("/", requirePermission('read_all_users'), userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @description Gets a user by ID.
 * @access Private
 */
router.get("/:id", requirePermission('read_all_users'), userController.getUserById);

/**
 * @route DELETE /api/users/:id
 * @description Deletes a user.
 * @access Private
 */
router.delete("/:id", requirePermission('delete_user'), userController.deleteUser);

export default router;