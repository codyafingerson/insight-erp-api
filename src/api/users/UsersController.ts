import { Request, Response } from "express";
import UserService from "./UsersService";
import { CreateUserDto, UpdateUserDto } from "./UsersDto";

export default class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const { isActive = true, roleId, name, username, email, password } = req.body;
            const data: CreateUserDto = { isActive, roleId, name, username, email, password };
            const user = await UserService.createUser(data);

            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { isActive, roleId, name, username, email, password } = req.body;
            const data: UpdateUserDto = { isActive, roleId, name, username, email, password };
            const user = await UserService.updateUser(id, data);

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();

            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);

            res.status(204).end();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}