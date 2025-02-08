import prisma from "../../config/prisma";
import { UserResponseDto } from "../users/UsersDto";
import { CreateRoleDto, RoleResponseDto } from "./RolesDto";

export default class RolesService {
    private prisma: typeof prisma;

    constructor() {
        this.prisma = prisma;
    }
    
    async createRole(data: CreateRoleDto) {
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

    async getRoleById(id: string) {
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

    async getAllRoles() {
        const roles = await this.prisma.role.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return roles as RoleResponseDto[];
    }

    async updateRole(id: string, data: CreateRoleDto) {
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

    async deleteRole(id: string) {
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

    async getRoleByName(name: string) {
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

    async getRoleUsers(id: string) {
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