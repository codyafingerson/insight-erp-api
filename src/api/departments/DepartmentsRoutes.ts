import { Router } from "express";
import DepartmentsController from "./DepartmentsController";
import DepartmentsService from "./DepartmentsService";

const router = Router();

const departmentsService = new DepartmentsService();
const departmentsController = new DepartmentsController(departmentsService);

/**
 * @route POST /api/departments
 * @description Creates a new department.
 * @access Private
 */
router.post("/", departmentsController.createDepartment);

/**
 * @route GET /api/departments
 * @description Retrieves all departments.
 * @access Private
 */
router.get("/", departmentsController.getAllDepartments);

/**
 * @route GET /api/departments/:id
 * @description Retrieves a department by ID.
 * @access Private
 */
router.get("/:id", departmentsController.getDepartmentById);

/**
 * @route PUT /api/departments/:id
 * @description Updates a department by ID.
 * @access Private
 */
router.put("/:id", departmentsController.updateDepartment);

/**
 * @route DELETE /api/departments/:id
 * @description Deletes a department by ID.
 * @access Private
 */
router.delete("/:id", departmentsController.deleteDepartment);

export default router;