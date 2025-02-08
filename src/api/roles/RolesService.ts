import prisma from "../../config/prisma";
import { UserResponseDto } from "../users/UsersDto";
import { CreateRoleDto, RoleResponseDto } from "./RolesDto";

/**
 * RolesService class handles role-related data operations with Prisma.
 */
export default class RolesService {
    private prisma: typeof prisma;

    constructor() {
        this.prisma = prisma;
    }

    /**
    * Creates a new role.
    * @param {CreateRoleDto} data - The role data.
    * @returns {Promise<RoleResponseDto>} - The created role.
    * @throws {Error} - If a role with the same name already exists.
    */
    async createRole(data: CreateRoleDto): Promise<RoleResponseDto> {
        const roleExists = await this.prisma.role.findFirst({
            where: {
                name: data.name,
            },
        });

        if (roleExists) {
            throw new Error("Role already exists");
        }

        const createdRole = await this.prisma.role.create({
            data: {
                name: data.name,
                description: data.description
            },
            select: {
                id: true,
                name: true,
                description: data.description != null ? true : false,
            },
        });

        return createdRole as RoleResponseDto;
    }

    /**
     * Retrieves a role by its ID.
     * @param {string} id - The role ID.
     * @returns {Promise<RoleResponseDto>} - The role object.
     * @throws {Error} - If the role is not found.
     */
    async getRoleById(id: string): Promise<RoleResponseDto> {
        const role = await this.prisma.role.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!role) {
            throw new Error("Role not found");
        }

        return role as RoleResponseDto;
    }

    /**
     * Retrieves all roles.
     * @returns {Promise<RoleResponseDto[]>} - An array of role objects.
     */
    async getAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.prisma.role.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return roles as RoleResponseDto[];
    }


    /**
     * Updates a role with new data.
     * @param {string} id - The role ID.
     * @param {CreateRoleDto} data - The updated role data.
     * @returns {Promise<RoleResponseDto>} - The updated role object.
     * @throws {Error} - If the role is not found.
     */
    async updateRole(id: string, data: CreateRoleDto): Promise<RoleResponseDto> {
        const role = await this.prisma.role.findUnique({
            where: {
                id,
            },
        });

        if (!role) {
            throw new Error("Role not found");
        }

        const updatedRole = await this.prisma.role.update({
            where: {
                id,
            },
            data: {
                name: data.name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return updatedRole as RoleResponseDto;
    }

    /**
     * Updates a role with new data.
     * @param {string} id - The role ID.
     * @param {CreateRoleDto} data - The updated role data.
     * @returns {Promise<RoleResponseDto>} - The updated role object.
     * @throws {Error} - If the role is not found.
     */
    async deleteRole(id: string): Promise<RoleResponseDto> {
        const role = await this.prisma.role.findUnique({
            where: {
                id,
            },
        });

        if (!role) {
            throw new Error("Role not found");
        }

        await this.prisma.role.delete({
            where: {
                id,
            },
        });

        return;
    }

    /**
    * Retrieves a role by its name.
    * @param {string} name - The role name.
    * @returns {Promise<RoleResponseDto>} - The role object.
    * @throws {Error} - If the role is not found.
    */
    async getRoleByName(name: string): Promise<RoleResponseDto> {
        const role = await this.prisma.role.findFirst({
            where: {
                name,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!role) {
            throw new Error("Role not found");
        }

        return role as RoleResponseDto;
    }

    /**
     * Retrieves all users associated with a specific role.
     * @param {string} id - The role ID.
     * @returns {Promise<UserResponseDto[]>} - An array of user objects.
     */
    async getRoleUsers(id: string): Promise<UserResponseDto[]> {
        const users = await this.prisma.user.findMany({
            where: {
                roleId: id,
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
}