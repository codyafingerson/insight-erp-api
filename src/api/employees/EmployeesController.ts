import type { Request, Response, NextFunction } from "express";
import EmployeesService from "./EmployeesService";
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
        await this.handleRequest(() => this.service.deleteEmployee(req.params.id), res, next, 204);
    }
}

export default EmployeesController;
