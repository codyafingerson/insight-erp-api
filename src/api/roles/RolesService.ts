import prisma from "../../config/prisma";
import { UserResponseDto } from "../users/UsersDto";
import { CreateRoleDto, RoleResponseDto } from "./RolesDto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
        const existingRole = await this.prisma.role.findUnique({
            where: { name: data.name },
        });

        if (existingRole) {
            throw new Error(`Role with name "${data.name}" already exists.`);
        }

        return await this.prisma.role.create({
            data,
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
    }

    /**
     * Retrieves a role by its ID.
     * @param {string} id - The role ID.
     * @returns {Promise<RoleResponseDto>} - The role object.
     * @throws {Error} - If the role is not found.
     */
    async getRoleById(id: string): Promise<RoleResponseDto> {
        const role = await this.prisma.role.findUnique({
            where: { id },
            select: { id: true, name: true, description: true },
        });

        if (!role) {
            throw new Error(`Role with ID "${id}" not found.`);
        }

        return role;
    }

    /**
     * Retrieves all roles.
     * @returns {Promise<RoleResponseDto[]>} - An array of role objects.
     */
    async getAllRoles(): Promise<RoleResponseDto[]> {
        return await this.prisma.role.findMany({
            select: { id: true, name: true, description: true },
        });
    }

    /**
     * Updates a role with new data.
     * @param {string} id - The role ID.
     * @param {CreateRoleDto} data - The updated role data.
     * @returns {Promise<RoleResponseDto>} - The updated role object.
     * @throws {Error} - If the role is not found.
     */
    async updateRole(id: string, data: CreateRoleDto): Promise<RoleResponseDto> {
        try {
            return await this.prisma.role.update({
                where: { id },
                data,
                select: { id: true, name: true, description: true },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Role with ID "${id}" not found.`);
            }

            throw error;
        }
    }

    /**
     * Deletes a role by its ID.
     * @param {string} id - The role ID.
     * @throws {Error} - If the role is not found.
     */
    async deleteRole(id: string): Promise<void> {
        try {
            await this.prisma.role.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new Error(`Role with ID "${id}" not found.`);
            }
            throw error;
        }
    }

    /**
    * Retrieves a role by its name.
    * @param {string} name - The role name.
    * @returns {Promise<RoleResponseDto>} - The role object.
    * @throws {Error} - If the role is not found.
    */
    async getRoleByName(name: string): Promise<RoleResponseDto> {
        const role = await this.prisma.role.findUnique({
            where: { name },
            select: { id: true, name: true, description: true },
        });

        if (!role) {
            throw new Error(`Role with name "${name}" not found.`);
        }

        return role;
    }

    /**
     * Retrieves all users associated with a specific role.
     * @param {string} id - The role ID.
     * @returns {Promise<UserResponseDto[]>} - An array of user objects.
     */
    async getRoleUsers(id: string): Promise<UserResponseDto[]> {
        return await this.prisma.user.findMany({
            where: { roleId: id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: {
                    select: { id: true, name: true },
                },
            },
        });
    }
}
