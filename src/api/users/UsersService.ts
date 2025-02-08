import prisma from "../../config/prisma";
import { hashPassword } from "../../utils/bcrypt";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./UsersDto";

export default class UserService {
    private prisma: typeof prisma;

    constructor() {
        this.prisma = prisma;
    }

    async createUser(data: CreateUserDto) {
        const userExists = await this.prisma.user.findFirst({
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

        const role = await this.prisma.role.findUnique({
            where: {
                id: data.roleId,
            },
        });

        if (!role) {
            throw new Error("The specified role does not exist");
        }

        const createdUser = await this.prisma.user.create({
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

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
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

    async getAllUsers(sortBy: string = 'name', order: 'asc' | 'desc' = 'asc') {
        const users = await this.prisma.user.findMany({
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

    async updateUser(id: string, user: UpdateUserDto) {
        const updatedUser = await this.prisma.user.update({
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

    async deleteUser(id: string) {
        const deletedUser = await this.prisma.user.delete({
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