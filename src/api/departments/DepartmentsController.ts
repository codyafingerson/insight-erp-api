import { Request, Response, NextFunction } from "express";
import DepartmentsService from "./DepartmentsService";
import { CreateDepartmentDto } from "./DepartmentsDto";
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
        try {
            const { name, description } = req.body;
            const data: CreateDepartmentDto = { name, description };

            if (!name) {
                return next(new ApiError(400, "Department name is required."));
            }

            const department = await this.service.createDepartment(data);
            res.status(201).json(department);
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Gets all departments.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const departments = await this.service.getAllDepartments();
            res.status(200).json(departments);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }

    /**
     * Gets a department by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                return next(new ApiError(400, "No ID provided."));
            }

            const department = await this.service.getDepartmentById(id);
            res.status(200).json(department);
        } catch (error: any) {
            next(error);
        }
    }

    /**
    * Updates a department.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @param {NextFunction} next - The Express next function.
    * @returns {Promise<void>}
    */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const department = await this.service.updateDepartment(req.params.id, req.body);
            res.status(200).json(department);
        } catch (error: any) {
            next(new ApiError(404, error.message));
        }
    }

    /**
    * Deletes a department.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @param {NextFunction} next - The Express next function.
    * @returns {Promise<void>}
    */
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.service.deleteDepartment(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            next(new ApiError(404, error.message));
        }
    }
}