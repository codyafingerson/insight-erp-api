import { Router } from "express";
import EmployeesController from "./EmployeesController";
import EmployeesService from "./EmployeesService";

const router = Router();

const employeesService = new EmployeesService();
const employeesController = new EmployeesController(employeesService);

// Middleware
import { authorize } from "../../middlewares/authorize";

/**
 * @route POST /api/employees
 * @description Creates a new employee.
 * @access Private
 */
router.post("/", authorize("create_employee"), employeesController.createEmployee);

/**
 * @route GET /api/employees
 * @description Retrieves all employees.
 * @access Private
 */
router.get("/", authorize("read_all_employees"), employeesController.getAllEmployees);

/**
 * @route GET /api/employees/:id
 * @description Retrieves a employee by ID.
 * @access Private
 */
router.get("/:id", authorize("read_all_employees"), employeesController.getEmployeeById);

/**
 * @route PUT /api/employees/:id
 * @description Updates a employee by ID.
 * @access Private
 */
router.put("/:id", authorize("update_employee"), employeesController.updateEmployee);

/**
 * @route DELETE /api/employees/:id
 * @description Deletes a employee by ID.
 * @access Private
 */
router.delete("/:id", authorize("delete_employee"), employeesController.deleteEmployee);

export default router;