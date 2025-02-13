import { Router } from "express";
import RolesController from "./RolesController";
import RolesService from "./RolesService";

const router = Router();

const rolesService = new RolesService();
const rolesController = new RolesController(rolesService);

// middleware
import { authorize } from "../../middlewares/authorize";

/**
 * @route POST /api/roles
 * @description Creates a new role.
 * @access Private
 */
router.post("/", authorize("create_role"), rolesController.createRole);

/**
 * @route GET /api/roles
 * @description Retrieves all roles.
 * @access Private
 */
router.get("/", authorize("read_all_roles"), rolesController.getAllRoles);

/**
>>>>>>> bbca3aba4d87c15476eb25a50bb557585cfe7c7d
 * @route GET /api/roles/permissions
 * @description Retrieves all permissions.
 * @access Private
 */
router.get("/permissions", authorize("read_all_roles"), rolesController.getAllPermissions);

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
router.get("/:id", authorize("read_all_roles"), rolesController.getRoleById);

/**
 * @route PUT /api/roles/:id
 * @description Updates a role by ID.
 * @access Private
 */
router.put("/:id", authorize("update_role"), rolesController.updateRole);

/**
 * @route DELETE /api/roles/:id
 * @description Deletes a role by ID.
 * @access Private
 */
router.delete("/:id", authorize("delete_role"), rolesController.deleteRole);

export default router;