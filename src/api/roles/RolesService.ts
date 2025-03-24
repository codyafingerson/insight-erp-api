import prisma from "../../config/prisma";
import type { UserResponseDto } from "../users/UsersDto";
import type { CreateRoleDto, RoleResponseDto, UpdateRoleDto } from "./RolesDto";
import ApiError from "../../utils/ApiError";

/**
 * RolesService class handles role-related data operations with Prisma.
 */
export default class RolesService {
    private prisma = prisma;

    /**
     * Creates a new role.
     * @param {CreateRoleDto} data - The role data.
     * @returns {Promise<RoleResponseDto>} - The created role.
     * @throws {Error} - If a role with the same name already exists.
     */
    async createRole(data: CreateRoleDto): Promise<RoleResponseDto> {
        try {
            const existingRole = await this.prisma.role.findUnique({
                where: { name: data.name }
            });

            if (existingRole) {
                throw new ApiError(400, `Role with name "${data.name}" already exists.`);
            }

            // Validate permissions exist
            if (data.permissions) {
                const existingPermissions = await this.prisma.permission.findMany({
                    where: {
                        id: {
                            in: data.permissions.map((p) => p.id)
                        }
                    }
                });

                if (existingPermissions.length !== data.permissions.length) {
                    throw new ApiError(400, "One or more permissions do not exist.");
                }
            }

            return await this.prisma.role.create({
                data: {
                    name: data.name,
                    description: data.description,
                    permissions: {
                        connect: data.permissions?.map((p) => ({ id: p.id }))
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    permissions: {
                        select: { id: true, name: true }
                    }
                }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves a role by its ID.
     * @param {string} id - The role ID.
     * @returns {Promise<RoleResponseDto>} - The role object.
     * @throws {Error} - If the role is not found.
     */
    async getRoleById(id: string): Promise<RoleResponseDto> {
        try {
            const role = await this.prisma.role.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    permissions: { select: { id: true, name: true } }
                }
            });

            if (!role) {
                throw new ApiError(404, `Role with ID "${id}" not found.`);
            }

            return role;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves all roles.
     * @returns {Promise<RoleResponseDto[]>} - An array of role objects.
     */
    async getAllRoles(): Promise<RoleResponseDto[]> {
        try {
            return await this.prisma.role.findMany({
                select: {
                    id: true,
                    isEditable: true,
                    name: true,
                    description: true,
                    permissions: { select: { id: true, name: true } }
                }
            });
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Updates a role with new data.
     * @param {string} id - The role ID.
     * @param {CreateRoleDto} data - The updated role data.
     * @returns {Promise<RoleResponseDto>} - The updated role object.
     * @throws {Error} - If the role is not found.
     */
    async updateRole(id: string, data: UpdateRoleDto): Promise<RoleResponseDto> {
        try {
            const foundRole = await this.prisma.role.findUnique({
                where: { id },
                select: { id: true, isEditable: true }
            });

            if (!foundRole) {
                throw new ApiError(404, `Role with ID "${id}" not found.`);
            }

            if (!foundRole.isEditable) {
                throw new ApiError(403, `Role with ID "${id}" is not editable.`);
            }

            // Validate permissions exist
            if (data.permissions) {
                const existingPermissions = await this.prisma.permission.findMany({
                    where: {
                        id: {
                            in: data.permissions.map((p) => p.id)
                        }
                    }
                });

                if (existingPermissions.length !== data.permissions.length) {
                    throw new ApiError(400, "One or more permissions do not exist.");
                }
            }

            return await this.prisma.role.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    permissions: {
                        set: data.permissions.map((p) => ({ id: p.id }))
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    permissions: {
                        select: { id: true, name: true }
                    }
                }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Deletes a role by its ID.
     * @param {string} id - The role ID.
     * @throws {Error} - If the role is not found.
     */
    async deleteRole(id: string): Promise<void> {
        try {
            const roleToDelete = await this.prisma.role.findUnique({
                where: { id },
                select: { id: true, isEditable: true }
            });

            if (!roleToDelete) {
                throw new ApiError(404, `Role with ID "${id}" not found.`);
            }

            if (!roleToDelete.isEditable) {
                throw new ApiError(403, `Role with ID "${id}" is not editable.`);
            }

            await this.prisma.role.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves a role by its name.
     * @param {string} name - The role name.
     * @returns {Promise<RoleResponseDto>} - The role object.
     * @throws {Error} - If the role is not found.
     */
    async getRoleByName(name: string): Promise<RoleResponseDto> {
        try {
            const role = await this.prisma.role.findUnique({
                where: { name },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    permissions: { select: { id: true, name: true } }
                }
            });

            if (!role) {
                throw new ApiError(404, `Role with name "${name}" not found.`);
            }

            return role;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves all users associated with a specific role.
     * @param {string} id - The role ID.
     * @returns {Promise<UserResponseDto[]>} - An array of user objects.
     */
    async getRoleUsers(id: string): Promise<UserResponseDto[]> {
        try {
            return await this.prisma.user.findMany({
                where: { roleId: id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    role: {
                        select: { id: true, name: true }
                    }
                }
            });
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves all permissions.
     * @returns An array of permission objects.
     */
    async getAllPermissions() {
        try {
            return await this.prisma.permission.findMany({
                select: { id: true, name: true, description: true }
            });
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }
}
