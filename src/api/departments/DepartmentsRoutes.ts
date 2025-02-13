import { Router } from "express";
import DepartmentsController from "./DepartmentsController";
import DepartmentsService from "./DepartmentsService";

const router = Router();

const departmentsService = new DepartmentsService();
const departmentsController = new DepartmentsController(departmentsService);

// Middleware
import { authorize } from "../../middlewares/authorize";

/**
 * @route POST /api/departments
 * @description Creates a new department.
 * @access Private
 */
router.post("/", authorize("create_department"), departmentsController.createDepartment);

/**
 * @route GET /api/departments
 * @description Retrieves all departments.
 * @access Private
 */
router.get("/", authorize("read_all_departments"), departmentsController.getAllDepartments);

/**
 * @route GET /api/departments/:id
 * @description Retrieves a department by ID.
 * @access Private
 */
router.get("/:id", authorize("read_all_departments"), departmentsController.getDepartmentById);

/**
 * @route PUT /api/departments/:id
 * @description Updates a department by ID.
 * @access Private
 */
router.put("/:id", authorize("update_department"), departmentsController.updateDepartment);

/**
 * @route DELETE /api/departments/:id
 * @description Deletes a department by ID.
 * @access Private
 */
router.delete("/:id", authorize("update_department"), departmentsController.deleteDepartment);

export default router;