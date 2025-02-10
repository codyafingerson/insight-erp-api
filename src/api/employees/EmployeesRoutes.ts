import { Router } from "express";
import EmployeesController from "./EmployeesController";
import EmployeesService from "./EmployeesService";

const router = Router();

const employeesService = new EmployeesService();
const employeesController = new EmployeesController(employeesService);

/**
 * @route POST /api/employees
 * @description Creates a new employee.
 * @access Private
 */
router.post("/", employeesController.createEmployee);

/**
 * @route GET /api/employees
 * @description Retrieves all employees.
 * @access Private
 */
router.get("/", employeesController.getAllEmployees);

/**
 * @route GET /api/employees/:id
 * @description Retrieves a employee by ID.
 * @access Private
 */
router.get("/:id", employeesController.getEmployeeById);

/**
 * @route PUT /api/employees/:id
 * @description Updates a employee by ID.
 * @access Private
 */
router.put("/:id", employeesController.updateEmployee);

/**
 * @route DELETE /api/employees/:id
 * @description Deletes a employee by ID.
 * @access Private
 */
router.delete("/:id", employeesController.deleteEmployee);

export default router;