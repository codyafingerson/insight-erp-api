import type { Request, Response, NextFunction } from "express";
import DepartmentsService from "./DepartmentsService";
import type { CreateDepartmentDto } from "./DepartmentsDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

/**
 * DepartmentsController class handles department-related requests by extending BaseController.
 */
export default class DepartmentsController extends BaseController<DepartmentsService> {
    constructor(departmentsService: DepartmentsService) {
        super(departmentsService);
    }

    /**
     * Creates a new department.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
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
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getAllDepartments(), res, next, 200);
    }

    /**
     * Gets a department by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getDepartmentById(id), res, next, 200);
    }

    /**
     * Updates a department.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(
            () => this.service.updateDepartment(req.params.id, req.body),
            res,
            next,
            200
        );
    }

    /**
     * Deletes a department.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
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
}
