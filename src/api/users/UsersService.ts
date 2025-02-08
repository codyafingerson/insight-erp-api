import prisma from "../../config/prisma";
import { hashPassword } from "../../utils/bcrypt";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./UsersDto";

/**
 * UserService class handles user-related operations.
 */
export default class UserService {
    private prisma: typeof prisma;

    constructor() {
        this.prisma = prisma;
    }

    /**
     * Creates a new user.
     * @param {CreateUserDto} data - The user data.
     * @returns {Promise<UserResponseDto>} - The created user.
     * @throws {Error} - If the user already exists or the role does not exist.
     */
    async createUser(data: CreateUserDto): Promise<UserResponseDto> {
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

    /**
     * Gets a user by ID.
     * @param {string} id - The user ID.
     * @returns {Promise<UserResponseDto | null>} - The user, or null if not found.
     */
    async getUserById(id: string): Promise<UserResponseDto | null> {
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

    /**
     * Gets all users.
     * @param {string} sortBy - The field to sort by.
     * @param {'asc' | 'desc'} order - The sort order.
     * @returns {Promise<Array<UserResponseDto>>} - The list of users.
     */
    async getAllUsers(sortBy: string = 'name', order: 'asc' | 'desc' = 'asc'): Promise<Array<UserResponseDto>> {
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

    /**
     * Updates a user.
     * @param {string} id - The user ID.
     * @param {UpdateUserDto} user - The user data to update.
     * @returns {Promise<UserResponseDto>} - The updated user.
     */
    async updateUser(id: string, user: UpdateUserDto): Promise<UserResponseDto> {
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

        /**
     * Deletes a user.
     * @param {string} id - The user ID.
     * @returns {Promise<UserResponseDto>} - The deleted user.
     */
    async deleteUser(id: string): Promise<UserResponseDto> {
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