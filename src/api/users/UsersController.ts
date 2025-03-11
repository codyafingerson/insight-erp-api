import type { Request, Response, NextFunction } from "express";
import UserService from "./UsersService";
import type { CreateUserDto, UpdateUserDto } from "./UsersDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";
import { sendMailWithTemplate } from "../../utils/mailer";

class UserController extends BaseController<UserService> {
    constructor(userService: UserService) {
        super(userService);

        this.requestPasswordReset = this.requestPasswordReset.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.changePassword = this.changePassword.bind(this);
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

    async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email } = req.body;

        try {
            const token = await this.service.generateResetToken(email);
            const resetLink = `http://localhost:3000/api/users/reset-password?token=${token}`;

            await sendMailWithTemplate(email, "Password Reset Request", "password-reset", { resetLink });

            res.status(200).json({ message: "Password reset link sent to your email" });
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { token, password } = req.body;

        try {
            await this.service.resetPassword(token, password);

            res.status(200).json({ message: "Password reset successful" });
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = (req.user as any).id;
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            // 1. Change the password after verifying the old password
            await this.service.changePassword(userId, oldPassword, newPassword);
            res.json({ message: 'Password changed successfully.' });
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }
}

export default UserController;