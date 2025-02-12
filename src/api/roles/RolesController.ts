import { Request, Response, NextFunction } from "express";
import RolesService from "./RolesService";
import { CreateRoleDto } from "./RolesDto";
import ApiError from "../../utils/ApiError";

/**
 * RolesController class handles role-related requests.
 */
export default class RolesController {
    /**
     * RolesController constructor.
     * @param {RolesService} rolesService - The service layer for roles.
     */
    constructor(private readonly rolesService: RolesService) {
        this.rolesService = rolesService;

        this.createRole = this.createRole.bind(this);
        this.getRoleById = this.getRoleById.bind(this);
        this.getAllRoles = this.getAllRoles.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.getAllPermissions = this.getAllPermissions.bind(this);
    }

    /**
    * Creates a new role.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @param {NextFunction} next - The Express next function.
    * @returns {Promise<void>}
    */
    async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description, permissions } = req.body;
            const data: CreateRoleDto = { name, description, permissions };

            if (!name) {
                return next(new ApiError(400, "Role name is required."));
            }

            const role = await this.rolesService.createRole(data);

            res.status(201).json(role);
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Gets a role by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                return next(new ApiError(400, "No ID provided."));
            }

            const role = await this.rolesService.getRoleById(id);
            res.status(200).json(role);
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Gets all roles.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const roles = await this.rolesService.getAllRoles();
            res.status(200).json(roles);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }

    /**
    * Updates a role.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @param {NextFunction} next - The Express next function.
    * @returns {Promise<void>}
    */
    async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const role = await this.rolesService.updateRole(req.params.id, req.body);
            res.status(200).json(role);
        } catch (error: any) {
            next(new ApiError(404, error.message));
        }
    }

    /**
    * Deletes a role.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @param {NextFunction} next - The Express next function.
    * @returns {Promise<void>}
    */
    async deleteRole(req: Request, res: Response, next: NextFunction) {
        try {
            await this.rolesService.deleteRole(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            next(new ApiError(404, error.message));
        }
    }

    /**
     * Retrieves all permissions.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     */
    async getAllPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const permissions = await this.rolesService.getAllPermissions();
            res.status(200).json(permissions);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }
}