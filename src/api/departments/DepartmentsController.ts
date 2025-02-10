import { Request, Response } from "express";
import DepartmentsService from "./DepartmentsService";
import { CreateDepartmentDto } from "./DepartmentsDto";

/**
 * DepartmentsController class handles department-related requests.
 */
export default class DepartmentsController {
    /**
     * DepartmentsController constructor.
     * @param {DepartmentsService} departmentsService - The service layer for departments.
     */
    constructor(private readonly departmentsService: DepartmentsService) {
        this.departmentsService = departmentsService;

        this.createDepartment = this.createDepartment.bind(this);
        this.getDepartmentById = this.getDepartmentById.bind(this);
        this.getAllDepartments = this.getAllDepartments.bind(this);
        this.updateDepartment = this.updateDepartment.bind(this);
        this.deleteDepartment = this.deleteDepartment.bind(this);
    }

    /**
    * Creates a new department.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<void>}
    */
    async createDepartment(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            const data: CreateDepartmentDto = { name, description };

            if (!name) {
                res.status(400).json({ error: "Department name is required." });
            }

            const department = await this.departmentsService.createDepartment(data);

            res.status(201).json(department);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Gets a department by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getDepartmentById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: "No ID provided." });
            }

            const department = await this.departmentsService.getDepartmentById(id);
            res.status(200).json(department);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Gets all departments.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getAllDepartments(req: Request, res: Response): Promise<void> {
        try {
            const departments = await this.departmentsService.getAllDepartments();
            res.status(200).json(departments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Updates a department.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<void>}
    */
    async updateDepartment(req: Request, res: Response): Promise<void> {
        try {
            const department = await this.departmentsService.updateDepartment(req.params.id, req.body);
            res.status(200).json(department);
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.message });
        }
    }

    /**
    * Deletes a department.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<void>}
    */
    async deleteDepartment(req: Request, res: Response) {
        try {
            await this.departmentsService.deleteDepartment(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.message });
        }
    }
}