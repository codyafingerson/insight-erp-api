import { Request, Response, NextFunction } from "express";
import RolesService from "./RolesService";
import { CreateRoleDto } from "./RolesDto";
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
        try {
            const role = await this.service.createRole(data);
            res.status(201).json(role);
        } catch (error: any) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const roles = await this.service.getAllRoles();
            res.status(200).json(roles);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        try {
            const role = await this.service.getRoleById(id);
            res.status(200).json(role);
        } catch (error: any) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const role = await this.service.updateRole(req.params.id, req.body);
            res.status(200).json(role);
        } catch (error: any) {
            next(new ApiError(404, error.message));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.service.deleteRole(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            next(new ApiError(404, error.message));
        }
    }

    // Additional method not part of BaseController
    async getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const permissions = await this.service.getAllPermissions();
            res.status(200).json(permissions);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }
}