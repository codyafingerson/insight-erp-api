import type { Request, Response, NextFunction } from "express";
import EmployeesService from "./EmployeesService";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

class EmployeesController extends BaseController<EmployeesService> {
    constructor(service: EmployeesService) {
        super(service);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.createEmployee(req.body), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getEmployees(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getEmployeeById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.updateEmployee(id, req.body), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(
            async () => {
                await this.service.deleteEmployee(id);
                return null;
            },
            res,
            next,
            204
        );
    }
}

export default EmployeesController;
