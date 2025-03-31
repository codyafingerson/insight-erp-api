import { test, expect } from "bun:test";
import RolesService from "../../../src/api/roles/RolesService";
import ApiError from "../../../src/utils/ApiError";

const createMockPrisma = (overrides: any = {}) => ({
    role: {
        findUnique: async (args: any) => {
            if (overrides.role && overrides.role.findUnique) {
                return overrides.role.findUnique(args);
            }
            return null;
        },
        findMany: async (args: any) => {
            if (overrides.role && overrides.role.findMany) {
                return overrides.role.findMany(args);
            }
            return [];
        },
        create: async (args: any) => {
            if (overrides.role && overrides.role.create) {
                return overrides.role.create(args);
            }
            return args.data;
        },
        update: async (args: any) => {
            if (overrides.role && overrides.role.update) {
                return overrides.role.update(args);
            }
            return { id: args.where.id, ...args.data };
        },
        delete: async (args: any) => {
            if (overrides.role && overrides.role.delete) {
                return overrides.role.delete(args);
            }
            return { id: args.where.id };
        }
    },
    permission: {
        findMany: async (args: any) => {
            if (overrides.permission && overrides.permission.findMany) {
                return overrides.permission.findMany(args);
            }
            return [];
        }
    },
    user: {
        findMany: async (args: any) => {
            if (overrides.user && overrides.user.findMany) {
                return overrides.user.findMany(args);
            }
            return [];
        }
    }
});

test("createRole succeeds when role does not exist and permissions are valid", async () => {
    const mockRole = { id: "1", name: "Admin", description: "Admin role", permissions: [] };
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => null, // no role exists
            create: async (_args) => mockRole,
        },
        permission: {
            findMany: async (args) => {
                // simulate valid permissions: return same length as input
                return args.where.id.in.map((id: string) => ({ id, name: "Permission " + id }));
            }
        }
    });
    const service = new RolesService();
    // Override prisma with mockPrisma
    // @ts-ignore
    service.prisma = mockPrisma;

    const input = {
        name: "Admin",
        description: "Admin role",
        permissions: [{ id: "p1" }, { id: "p2" }],
    };
    const result = await service.createRole(input);
    expect(result).toEqual(mockRole);
});

test("createRole throws error if role already exists", async () => {
    const existing = { id: "1", name: "Admin" };
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async (args) => {
                // return found role when checking by name
                if (args.where.name === "Admin") return existing;
                return null;
            }
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const input = { name: "Admin" };
    await expect(service.createRole(input)).rejects.toThrow(
        new ApiError(400, 'Role with name "Admin" already exists.')
    );
});

test("createRole throws error for invalid permissions", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => null,
        },
        permission: {
            findMany: async () => {
                // return less permissions than provided
                return [{ id: "p1", name: "Permission p1" }];
            }
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const input = {
        name: "Editor",
        permissions: [{ id: "p1" }, { id: "p2" }],
    };
    await expect(service.createRole(input)).rejects.toThrow(
        new ApiError(400, "One or more permissions do not exist.")
    );
});

test("getRoleById returns role when found", async () => {
    const roleFound = { id: "1", name: "User", description: "User role", permissions: [] };
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async (args) => {
                if (args.where.id === "1") return roleFound;
                return null;
            }
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const result = await service.getRoleById("1");
    expect(result).toEqual(roleFound);
});

test("getRoleById throws error if role not found", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => null,
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    await expect(service.getRoleById("nonexistent")).rejects.toThrow(
        new ApiError(404, 'Role with ID "nonexistent" not found.')
    );
});

test("getAllRoles returns an array of roles", async () => {
    const roles = [
        { id: "1", isEditable: true, name: "User", description: "desc", permissions: [] }
    ];
    const mockPrisma = createMockPrisma({
        role: {
            findMany: async () => roles,
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const result = await service.getAllRoles();
    expect(result).toEqual(roles);
});

test("updateRole succeeds when role exists, is editable, and permissions valid", async () => {
    const updatedRole = { id: "1", name: "Updated", description: "new desc", permissions: [] };
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async (args) => {
                if (args.where.id === "1") return { id: "1", isEditable: true };
                return null;
            },
            update: async () => updatedRole,
        },
        permission: {
            findMany: async (args) => {
                // return all matching permissions
                return args.where.id.in.map((id: string) => ({ id, name: "Permission " + id }));
            }
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const input = {
        name: "Updated",
        description: "new desc",
        permissions: [{ id: "p1" }]
    };
    const result = await service.updateRole("1", input);
    expect(result).toEqual(updatedRole);
});

test("updateRole throws 404 if role not found", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => null,
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const input = { name: "Updated" };
    await expect(service.updateRole("nonexistent", input)).rejects.toThrow(
        new ApiError(404, 'Role with ID "nonexistent" not found.')
    );
});

test("updateRole throws 403 if role is not editable", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => ({ id: "1", isEditable: false }),
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const input = { name: "Updated" };
    await expect(service.updateRole("1", input)).rejects.toThrow(
        new ApiError(403, 'Role with ID "1" is not editable.')
    );
});

test("deleteRole succeeds when role exists and is editable", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => ({ id: "1", isEditable: true }),
            delete: async (args) => ({ id: args.where.id })
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    await expect(service.deleteRole("1")).resolves.toBeUndefined();
});

test("deleteRole throws 404 if role not found", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => null,
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    await expect(service.deleteRole("nonexistent")).rejects.toThrow(
        new ApiError(404, 'Role with ID "nonexistent" not found.')
    );
});

test("deleteRole throws 403 if role is not editable", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => ({ id: "1", isEditable: false }),
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    await expect(service.deleteRole("1")).rejects.toThrow(
        new ApiError(403, 'Role with ID "1" is not editable.')
    );
});

test("getRoleByName returns role when found", async () => {
    const roleFound = { id: "1", name: "Moderator", description: "desc", permissions: [] };
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async (args) => {
                if (args.where.name === "Moderator") return roleFound;
                return null;
            },
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const result = await service.getRoleByName("Moderator");
    expect(result).toEqual(roleFound);
});

test("getRoleByName throws error if role not found", async () => {
    const mockPrisma = createMockPrisma({
        role: {
            findUnique: async () => null,
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    await expect(service.getRoleByName("Nonexistent")).rejects.toThrow(
        new ApiError(404, 'Role with name "Nonexistent" not found.')
    );
});

test("getRoleUsers returns users associated with a role", async () => {
    const users = [
        { id: "u1", name: "Alice", username: "alice", email: "alice@example.com", role: { id: "1", name: "User" } }
    ];
    const mockPrisma = createMockPrisma({
        user: {
            findMany: async (args) => {
                if (args.where.roleId === "1") return users;
                return [];
            }
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const result = await service.getRoleUsers("1");
    expect(result).toEqual(users);
});

test("getAllPermissions returns all permissions", async () => {
    const permissions = [
        { id: "p1", name: "Permission1", description: "desc" },
        { id: "p2", name: "Permission2", description: "desc" }
    ];
    const mockPrisma = createMockPrisma({
        permission: {
            findMany: async () => permissions,
        }
    });
    const service = new RolesService();
    // @ts-ignore
    service.prisma = mockPrisma;
    const result = await service.getAllPermissions();
    expect(result).toEqual(permissions);
});