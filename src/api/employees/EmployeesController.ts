import { Request, Response, NextFunction } from "express";
import EmployeesService from "./EmployeesService";
import { CreateEmployeeDto, EmployeeResponseDto } from "./EmployeesDto";
import ApiError from "../../utils/ApiError";

/**
 * EmployeesController class handles employee-related requests.
 */
export default class EmployeesController {
    /**
     * EmployeesController constructor.
     * @param {EmployeesController} employeesService - The service layer for employees.
     */
    constructor(private readonly employeesService: EmployeesService) {
        this.employeesService = employeesService;

        this.createEmployee = this.createEmployee.bind(this);
        this.getAllEmployees = this.getAllEmployees.bind(this);
        this.getEmployeeById = this.getEmployeeById.bind(this);
        this.updateEmployee = this.updateEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
    }

    /**
     * Creates a new employee.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */
    async createEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const newEmployee = await this.employeesService.createEmployee(req.body as CreateEmployeeDto);
            res.status(201).json(newEmployee);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * Retrieves all employees.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */
    async getAllEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await this.employeesService.getEmployees();
            res.status(200).json(employees);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }

    /**
     * Retrieves an employee by ID.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */
    async getEmployeeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const employee = await this.employeesService.getEmployeeById(id);
            res.status(200).json(employee);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * Updates an employee.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */
    async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedEmployee = await this.employeesService.updateEmployee(req.params.id, req.body);
            res.status(200).json(updatedEmployee);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * Deletes an employee.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */
    async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            await this.employeesService.deleteEmployee(req.params.id);
            res.status(204).end();
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }
}