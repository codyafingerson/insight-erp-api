import prisma from "../../config/prisma";
import { hashPassword } from "../../utils/bcrypt";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./UsersDto";

export default class UserService {
    static async createUser(data: CreateUserDto) {
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { username: data.username },
                ],
            },
        });

        if (userExists) {
            throw new Error("User already exists");
        }

        const role = await prisma.role.findUnique({
            where: {
                id: data.roleId,
            },
        });

        if (!role) {
            throw new Error("The specified role does not exist");
        }

        const createdUser = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: await hashPassword(data.password),
                roleId: role.id,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return createdUser as UserResponseDto;
    }

    static async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return user as UserResponseDto;
    }

    static async getAllUsers(sortBy: string = 'name', order: 'asc' | 'desc' = 'asc') {
        const users = await prisma.user.findMany({
            orderBy: {
                [sortBy]: order,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return users as Array<UserResponseDto>;
    }

    static async updateUser(id: string, user: UpdateUserDto) {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                ...user,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return updatedUser as UserResponseDto;
    }

    static async deleteUser(id: string) {
        const deletedUser = await prisma.user.delete({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return deletedUser as UserResponseDto;
    }
}