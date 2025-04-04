import { Router } from "express";
import UserController from "./UsersController";
import UserService from "./UsersService";

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

// middleware
import { authorize } from "../../middlewares/authorize";
import { PermissionName } from "../../config/auth/permissions";

/**
 * @route POST /api/users
 * @description Creates a new user.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateUser), userController.create);

/**
 * @route PUT /api/users/:id
 * @description Updates a user.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateUser), userController.update);

/**
 * @route GET /api/users
 * @description Gets all users.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllUsers), userController.getAll);

/**
 * @route GET /api/users/:id
 * @description Gets a user by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllUsers), userController.getById);

/**
 * @route DELETE /api/users/:id
 * @description Deletes a user.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteUser), userController.delete);

/**
 * @route POST /api/users/request-password-reset
 * @description Initiates the password reset process for a user.
 * @access Public
 */
router.post("/request-password-reset", userController.requestPasswordReset);

/**
 * @route POST /api/users/reset-password
 * @description Resets the user's password.
 * @access Public
 */
router.post("/reset-password", userController.resetPassword);

/**
 * @route POST /api/users/change-password
 * @description Changes the user's password.
 * @access Private
 */
router.post("/change-password", authorize("change_password"), userController.changePassword);

export default router;
