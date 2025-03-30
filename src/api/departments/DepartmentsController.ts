import type { NextFunction, Request, Response } from "express";
import DepartmentsService from "./DepartmentsService";
import type { CreateDepartmentDto } from "./DepartmentsDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

/**
 * DepartmentsController class handles department-related requests by extending BaseController.
 */
export default class DepartmentsController extends BaseController<DepartmentsService> {
    constructor(service: DepartmentsService) {
        super(service);

        this.getDepartmentByName = this.getDepartmentByName.bind(this);
    }

    /**
     * Creates a new department.
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, description } = req.body;
        if (!name) {
            return next(new ApiError(400, "Department name is required."));
        }
        const data: CreateDepartmentDto = { name, description };
        await this.handleRequest(() => this.service.createDepartment(data), res, next, 201);
    }

    /**
     * Gets all departments.
     */
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getAllDepartments(), res, next);
    }

    /**
     * Gets a department by ID.
     */
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getDepartmentById(id), res, next);
    }

    /**
     * Updates a department.
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.updateDepartment(req.params.id, req.body), res, next);
    }

    /**
     * Deletes a department.
     */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(
            async () => {
                await this.service.deleteDepartment(req.params.id);
                return null;
            },
            res,
            next,
            204
        );
    }

    /**
     * Retrieves a department by name.
     */
    async getDepartmentByName(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name } = req.params;
        if (!name) {
            return next(new ApiError(400, "Department name is required."));
        }
        await this.handleRequest(() => this.service.getDepartmentByName(name), res, next);
    }
}
