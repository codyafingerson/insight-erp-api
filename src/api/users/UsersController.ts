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
        await this.handleRequest(
            () => this.service.createUser(req.body as CreateUserDto),
            res,
            next,
            201
        );
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "User ID is required."));
        }

        await this.handleRequest(
            () => this.service.updateUser(id, req.body as UpdateUserDto),
            res,
            next,
            200
        );
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getAllUsers(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "User ID is required."));
        }

        await this.handleRequest(() => this.service.getUserById(id), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "User ID is required."));
        }

        await this.handleRequest(
            async () => {
                await this.service.deleteUser(id);
                return null;
            },
            res,
            next,
            204
        );
    }

    async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email } = req.body;
        if (!email) {
            return next(new ApiError(400, "Email is required."));
        }

        await this.handleRequest(async () => {
            const token = await this.service.generateResetToken(email);
            const resetLink = `http://localhost:3000/api/users/reset-password?token=${token}`;

            await sendMailWithTemplate(email, "Password Reset Request", "password-reset", {
                resetLink,
            });

            return { message: "Password reset link sent to your email." };
        }, res, next, 200);
    }

    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { token, password } = req.body;
        if (!token || !password) {
            return next(new ApiError(400, "Token and new password are required."));
        }

        await this.handleRequest(
            () => this.service.resetPassword(token, password),
            res,
            next,
            200
        );
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = (req.user as any)?.id;
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!oldPassword || !newPassword) {
            return next(new ApiError(400, "Old and new passwords are required."));
        }

        await this.handleRequest(
            () => this.service.changePassword(userId, oldPassword, newPassword),
            res,
            next,
            200
        );
    }
}

export default UserController;
