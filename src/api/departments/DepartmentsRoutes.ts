import { Router } from "express";
import DepartmentsController from "./DepartmentsController";
import DepartmentsService from "./DepartmentsService";
// Middleware
import { authorize } from "../../middlewares/authorize";

const router = Router();

const departmentsService = new DepartmentsService();
const departmentsController = new DepartmentsController(departmentsService);

/**
 * @route POST /api/departments
 * @description Creates a new department.
 * @access Private
 */
router.post("/", authorize("create_department"), departmentsController.create);

/**
 * @route GET /api/departments
 * @description Retrieves all departments.
 * @access Private
 */
router.get("/", authorize("read_all_departments"), departmentsController.getAll);

/**
 * @route GET /api/departments/:id
 * @description Retrieves a department by ID.
 * @access Private
 */
router.get("/:id", authorize("read_all_departments"), departmentsController.getById);

/**
 * @route GET /api/departments/:name
 * @description Retrieves a department by name.
 * @access Private
 */
router.get("/:name", authorize("read_all_departments"), departmentsController.getDepartmentByName);

/**
 * @route PUT /api/departments/:id
 * @description Updates a department by ID.
 * @access Private
 */
router.put("/:id", authorize("update_department"), departmentsController.update);

/**
 * @route DELETE /api/departments/:id
 * @description Deletes a department by ID.
 * @access Private
 */
router.delete("/:id", authorize("update_department"), departmentsController.delete);

export default router;
