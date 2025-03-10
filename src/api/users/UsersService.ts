import prisma from "../../config/prisma";
import { comparePasswords, hashPassword } from "../../utils/bcrypt";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./UsersDto";
import ApiError from "../../utils/ApiError";
import { sendMailWithTemplate } from "../../utils/mailer";

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
        try {
            const userExists = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.email },
                        { username: data.username },
                    ],
                },
            });

            if (userExists) {
                throw new ApiError(400, "User already exists");
            }

            const role = await this.prisma.role.findUnique({
                where: {
                    id: data.roleId,
                },
            });

            if (!role) {
                throw new ApiError(400, "The specified role does not exist");
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

            await sendMailWithTemplate(
                createdUser.email,
                'Welcome to Insight ERP!',
                'welcome',
                {
                    name: createdUser.name,
                    username: createdUser.username,
                }
            );

            return createdUser as UserResponseDto;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Gets a user by ID.
     * @param {string} id - The user ID.
     * @returns {Promise<UserResponseDto | null>} - The user, or null if not found.
     */
    async getUserById(id: string): Promise<UserResponseDto | null> {
        try {
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

            if (!user) {
                throw new ApiError(404, "User not found");
            }

            return user as UserResponseDto;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Gets all users.
     * @param {string} sortBy - The field to sort by.
     * @param {'asc' | 'desc'} order - The sort order.
     * @returns {Promise<Array<UserResponseDto>>} - The list of users.
     */
    async getAllUsers(sortBy: string = 'name', order: 'asc' | 'desc' = 'asc'): Promise<Array<UserResponseDto>> {
        try {
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
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Updates a user.
     * @param {string} id - The user ID.
     * @param {UpdateUserDto} user - The user data to update.
     * @returns {Promise<UserResponseDto>} - The updated user.
     */
    async updateUser(id: string, user: UpdateUserDto): Promise<UserResponseDto> {
        try {
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
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ApiError(404, `User with ID "${id}" not found.`);
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
 * Deletes a user.
 * @param {string} id - The user ID.
 * @returns {Promise<UserResponseDto>} - The deleted user.
 */
    async deleteUser(id: string): Promise<UserResponseDto> {
        try {
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
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ApiError(404, `User with ID "${id}" not found.`);
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    async generateResetToken(email: string): Promise<string> {
        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const token = Math.random().toString(36);

        // Calculate expiration time (15 minutes from now)
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        // Save token and expiration to the user record
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpires: expires
            }
        });

        return token;
    }


    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Find user with this reset token, and ensure token is not expired
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }  // token is not expired
            }
        }) 
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Hash the new password
        const hashed = await hashPassword(newPassword);

        // 3. Update the user with the new password and remove the reset token fields
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpires: null
            }
        });
        // After this, the token is invalidated so it can't be used again!
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        // Find the user by ID
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        // Verify the old password matches the stored password
        const passwordMatch = await comparePasswords(oldPassword, user.password);
        if (!passwordMatch) {
            throw new Error('Old password is incorrect');
        }

        // Hash the new password and save it
        const hashed = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed }
        });
    }
}