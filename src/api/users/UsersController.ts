import { Request, Response, NextFunction } from "express";
import UserService from "./UsersService";
import { CreateUserDto, UpdateUserDto } from "./UsersDto";
import ApiError from "../../utils/ApiError";

/**
 * UserController class handles user-related requests.
 */
export default class UserController {
    /**
     * @param {UserService} userService - The UserService instance.
     */
    constructor(private readonly userService: UserService) {
        this.userService = userService;

        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    /**
     * Creates a new user.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { isActive = true, roleId, name, username, email, password } = req.body;
            const data: CreateUserDto = { isActive, roleId, name, username, email, password };
            const user = await this.userService.createUser(data);

            res.status(201).json(user);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * Updates a user.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { isActive, roleId, name, username, email, password } = req.body;
            const data: UpdateUserDto = { isActive, roleId, name, username, email, password };
            const user = await this.userService.updateUser(id, data);

            res.status(200).json(user);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

    /**
     * Gets all users.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();

            res.status(200).json(users);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }

    /**
     * Gets a user by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);

            res.status(200).json(user);
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }

     /**
     * Deletes a user.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);

            res.status(204).end();
        } catch (error: any) {
            next(new ApiError(400, error.message));
        }
    }
}