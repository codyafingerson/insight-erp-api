import { Request, Response } from "express";
import RolesService from "./RolesService";
import { CreateRoleDto } from "./RolesDto";

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
    }

    /**
    * Creates a new role.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<void>}
    */
    async createRole(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            const data: CreateRoleDto = { name, description };

            if (!name) {
                res.status(400).json({ error: "Role name is required." });
            }

            const role = await this.rolesService.createRole(data);

            res.status(201).json(role);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Gets a role by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getRoleById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: "No ID provided." });
            }

            const role = await this.rolesService.getRoleById(id);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Gets all roles.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.rolesService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
    * Updates a role.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<void>}
    */
    async updateRole(req: Request, res: Response): Promise<void> {
        try {
            const role = await this.rolesService.updateRole(req.params.id, req.body);
            res.status(200).json(role);
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.message });
        }
    }

    /**
    * Deletes a role.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<void>}
    */
    async deleteRole(req: Request, res: Response) {
        try {
            await this.rolesService.deleteRole(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.message });
        }
    }
}