import { Request, Response, NextFunction } from "express";
import UserService from "./UsersService";
import { CreateUserDto, UpdateUserDto } from "./UsersDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

class UserController extends BaseController<UserService> {
    constructor(userService: UserService) {
        super(userService);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { isActive = true, roleId, name, username, email, password } = req.body;
            const data: CreateUserDto = { isActive, roleId, name, username, email, password };
            const user = await this.service.createUser(data);

            res.status(201).json(user);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { isActive, roleId, name, username, email, password } = req.body;
            const data: UpdateUserDto = { isActive, roleId, name, username, email, password };
            const user = await this.service.updateUser(id, data);

            res.status(200).json(user);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.service.getAllUsers();

            res.status(200).json(users);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.service.getUserById(id);

            res.status(200).json(user);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.service.deleteUser(id);

            res.status(204).end();
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }
}

export default UserController;