import type { Request, Response, NextFunction } from "express";
import RolesService from "./RolesService";
import type { CreateRoleDto } from "./RolesDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

export default class RolesController extends BaseController<RolesService> {
    constructor(service: RolesService) {
        super(service);
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getAllPermissions = this.getAllPermissions.bind(this);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, description, permissions } = req.body;
        if (!name) {
            return next(new ApiError(400, "Role name is required."));
        }
        const data: CreateRoleDto = { name, description, permissions };
        this.handleRequest(() => this.service.createRole(data), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.handleRequest(() => this.service.getAllRoles(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        this.handleRequest(() => this.service.getRoleById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.handleRequest(() => this.service.updateRole(req.params.id, req.body), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Wrap in an async function so we can return null and avoid sending back data.
        this.handleRequest(
            async () => {
                await this.service.deleteRole(req.params.id);
                return null;
            },
            res,
            next,
            204
        );
    }

    async getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.handleRequest(() => this.service.getAllPermissions(), res, next);
    }
}
