import { Router } from "express";
import DepartmentsController from "./DepartmentsController";
import DepartmentsService from "./DepartmentsService";

const router = Router();

const departmentsService = new DepartmentsService();
const departmentsController = new DepartmentsController(departmentsService);

// Middleware
import { requirePermission } from "../../middlewares/requirePermission";

/**
 * @route POST /api/departments
 * @description Creates a new department.
 * @access Private
 */
router.post("/", requirePermission("create_department"), departmentsController.createDepartment);

/**
 * @route GET /api/departments
 * @description Retrieves all departments.
 * @access Private
 */
router.get("/", requirePermission("read_all_departments"), departmentsController.getAllDepartments);

/**
 * @route GET /api/departments/:id
 * @description Retrieves a department by ID.
 * @access Private
 */
router.get("/:id", requirePermission("read_all_departments"), departmentsController.getDepartmentById);

/**
 * @route PUT /api/departments/:id
 * @description Updates a department by ID.
 * @access Private
 */
router.put("/:id", requirePermission("update_department"), departmentsController.updateDepartment);

/**
 * @route DELETE /api/departments/:id
 * @description Deletes a department by ID.
 * @access Private
 */
router.delete("/:id", requirePermission("update_department"), departmentsController.deleteDepartment);

export default router;