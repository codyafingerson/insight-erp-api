import { Request, Response, NextFunction } from "express";
import EmployeesService from "./EmployeesService";
import { CreateEmployeeDto, EmployeeResponseDto } from "./EmployeesDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

class EmployeesController extends BaseController<EmployeesService> {
    constructor(employeesService: EmployeesService) {
        super(employeesService);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.createEmployee(req.body), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.getEmployees(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        this.handleRequest(() => this.service.getEmployeeById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.updateEmployee(req.params.id, req.body), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        await this.service.deleteEmployee(req.params.id);
        res.status(204).end();
    }
}

export default EmployeesController;