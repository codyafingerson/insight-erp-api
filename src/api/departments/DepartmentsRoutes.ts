import { Router } from "express";
import DepartmentsController from "./DepartmentsController";
import DepartmentsService from "./DepartmentsService";
// Middleware
import { authorize } from "../../middlewares/authorize";
import { PermissionName } from "../../config/auth/permissions";

const router = Router();

const departmentsService = new DepartmentsService();
const departmentsController = new DepartmentsController(departmentsService);

/**
 * @route POST /api/departments
 * @description Creates a new department.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateDepartment), departmentsController.create);

/**
 * @route GET /api/departments
 * @description Retrieves all departments.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllDepartments), departmentsController.getAll);

/**
 * @route GET /api/departments/:id
 * @description Retrieves a department by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllDepartments), departmentsController.getById);

/**
 * @route PUT /api/departments/:id
 * @description Updates a department by ID.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateDepartment), departmentsController.update);

/**
 * @route DELETE /api/departments/:id
 * @description Deletes a department by ID.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteDepartment), departmentsController.delete);

export default router;
