import { Router } from "express";
import EmployeesController from "./EmployeesController";
import EmployeesService from "./EmployeesService";

const router = Router();

const employeesService = new EmployeesService();
const employeesController = new EmployeesController(employeesService);

// Middleware
import { requirePermission } from "../../middlewares/requirePermission";

/**
 * @route POST /api/employees
 * @description Creates a new employee.
 * @access Private
 */
router.post("/", requirePermission("create_employee"), employeesController.createEmployee);

/**
 * @route GET /api/employees
 * @description Retrieves all employees.
 * @access Private
 */
router.get("/", requirePermission("read_all_employees"), employeesController.getAllEmployees);

/**
 * @route GET /api/employees/:id
 * @description Retrieves a employee by ID.
 * @access Private
 */
router.get("/:id", requirePermission("read_all_employees"), employeesController.getEmployeeById);

/**
 * @route PUT /api/employees/:id
 * @description Updates a employee by ID.
 * @access Private
 */
router.put("/:id", requirePermission("update_employee"), employeesController.updateEmployee);

/**
 * @route DELETE /api/employees/:id
 * @description Deletes a employee by ID.
 * @access Private
 */
router.delete("/:id", requirePermission("delete_employee"), employeesController.deleteEmployee);

export default router;