import type { NextFunction, Request, Response } from "express";
import RolesService from "./RolesService";
import type { CreateRoleDto } from "./RolesDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

export default class RolesController extends BaseController<RolesService> {
    constructor(service: RolesService) {
        super(service);

        this.getAllPermissions = this.getAllPermissions.bind(this);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, description, permissions } = req.body;
        if (!name) {
            return next(new ApiError(400, "Role name is required."));
        }
        const data: CreateRoleDto = { name, description, permissions };
        await this.handleRequest(() => this.service.createRole(data), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getAllRoles(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getRoleById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.updateRole(req.params.id, req.body), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(
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
        await this.handleRequest(() => this.service.getAllPermissions(), res, next);
    }
}
