import { Router } from "express";
import EmployeesController from "./EmployeesController";
import EmployeesService from "./EmployeesService";

const router = Router();

const employeesService = new EmployeesService();
const employeesController = new EmployeesController(employeesService);

// Middleware
import { authorize } from "../../middlewares/authorize";
import { PermissionName } from "../../config/auth/permissions";

/**
 * @route POST /api/employees
 * @description Creates a new employee.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateEmployee), employeesController.create);

/**
 * @route GET /api/employees
 * @description Retrieves all employees.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllEmployees), employeesController.getAll);

/**
 * @route GET /api/employees/:id
 * @description Retrieves a employee by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllEmployees), employeesController.getById);

/**
 * @route PUT /api/employees/:id
 * @description Updates a employee by ID.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateEmployee), employeesController.update);

/**
 * @route DELETE /api/employees/:id
 * @description Deletes a employee by ID.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteEmployee), employeesController.delete);

export default router;
