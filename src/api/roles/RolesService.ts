import prisma from "../../config/prisma";
import { UserResponseDto } from "../users/UsersDto";
import { CreateRoleDto, RoleResponseDto } from "./RolesDto";

export default class RolesService {
    static async createRole(data: CreateRoleDto) {
        const roleExists = await prisma.role.findFirst({
            where: {
                name: data.name,
            },
        });

        if (roleExists) {
            throw new Error("Role already exists");
        }

        const createdRole = await prisma.role.create({
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

    static async getRoleById(id: string) {
        const role = await prisma.role.findUnique({
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

    static async getAllRoles() {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        return roles as RoleResponseDto[];
    }

    static async updateRole(id: string, data: CreateRoleDto) {
        const role = await prisma.role.findUnique({
            where: {
                id,
            },
        });

        if (!role) {
            throw new Error("Role not found");
        }

        const updatedRole = await prisma.role.update({
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

    static async deleteRole(id: string) {
        const role = await prisma.role.findUnique({
            where: {
                id,
            },
        });

        if (!role) {
            throw new Error("Role not found");
        }

        await prisma.role.delete({
            where: {
                id,
            },
        });

        return;
    }

    static async getRoleByName(name: string) {
        const role = await prisma.role.findFirst({
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

    static async getRoleUsers(id: string) {
        const users = await prisma.user.findMany({
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