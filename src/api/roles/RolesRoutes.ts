import { Router } from "express";
import RolesController from "./RolesController";
import RolesService from "./RolesService";

const router = Router();

const rolesService = new RolesService();
const rolesController = new RolesController(rolesService);

// middleware
import { requirePermission } from "../../middlewares/requirePermission";

/**
 * @route POST /api/roles
 * @description Creates a new role.
 * @access Private
 */
router.post("/", requirePermission("create_role"), rolesController.createRole);

/**
 * @route GET /api/roles
 * @description Retrieves all roles.
 * @access Private
 */
router.get("/", requirePermission("read_all_roles"), rolesController.getAllRoles);

/**
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> bbca3aba4d87c15476eb25a50bb557585cfe7c7d
 * @route GET /api/roles/permissions
 * @description Retrieves all permissions.
 * @access Private
 */
<<<<<<< HEAD
router.get("/permissions", requirePermission("read_all_roles"), rolesController.getAllPermissions);

/**
>>>>>>> Stashed changes
=======
router.get("/permissions", rolesController.getAllPermissions);

/**
>>>>>>> bbca3aba4d87c15476eb25a50bb557585cfe7c7d
 * @route GET /api/roles/:id
 * @description Retrieves a role by ID.
 * @access Private
 */
router.get("/:id", requirePermission("read_all_roles"), rolesController.getRoleById);

/**
 * @route PUT /api/roles/:id
 * @description Updates a role by ID.
 * @access Private
 */
router.put("/:id", requirePermission("update_role"), rolesController.updateRole);

/**
 * @route DELETE /api/roles/:id
 * @description Deletes a role by ID.
 * @access Private
 */
router.delete("/:id", requirePermission("delete_role"), rolesController.deleteRole);

export default router;