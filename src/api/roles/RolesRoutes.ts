import { Router } from "express";
import RolesController from "./RolesController";
import RolesService from "./RolesService";

const router = Router();

const rolesService = new RolesService();
const rolesController = new RolesController(rolesService);

// middleware
import { authorize } from "../../middlewares/authorize";
import { PermissionName } from "../../config/auth/permissions";

/**
 * @route POST /api/roles
 * @description Creates a new role.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateRole), rolesController.create);

/**
 * @route GET /api/roles
 * @description Retrieves all roles.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllRoles), rolesController.getAll);

/**
 * @route GET /api/roles/permissions
 * @description Retrieves all permissions.
 * @access Private
 */
router.get("/permissions", authorize(PermissionName.ReadAllRoles), rolesController.getAllPermissions);

/**
 * @route GET /api/roles/:id
 * @description Retrieves a role by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllRoles), rolesController.getById);

/**
 * @route PUT /api/roles/:id
 * @description Updates a role by ID.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateRole), rolesController.update);

/**
 * @route DELETE /api/roles/:id
 * @description Deletes a role by ID.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteRole), rolesController.delete);

export default router;
