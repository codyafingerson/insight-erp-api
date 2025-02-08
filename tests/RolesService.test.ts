import RolesService from "../src/api/roles/RolesService";
import prisma from "../src/config/prisma";
import { CreateRoleDto } from "../src/api/roles/RolesDto";

describe("RolesService", () => {
    let rolesService: RolesService;
    let createdRoleId: string;

    beforeEach(() => {
        rolesService = new RolesService();
    });

    describe("Create Role", () => {
        it("Should create a role successfully", async () => {
            const roleData: CreateRoleDto = { name: "TestRole", description: "Test Role Description" };
            const newRole = await rolesService.createRole(roleData);

            expect(newRole).toBeDefined();
            expect(newRole.id).toBeDefined();
            expect(newRole.name).toBe("TestRole");
            createdRoleId = newRole.id;
        });

        it("Should throw an error when creating a role with an existing name", async () => {
            await expect(
                rolesService.createRole({
                    name: "TestRole",
                    description: "Test Role Description",
                })
            ).rejects.toThrow("Role already exists");
        });
    });

    describe("Get Role By ID", () => {
        it("Should get a role by ID successfully", async () => {
            const role = await rolesService.getRoleById(createdRoleId);
            expect(role).toBeDefined();
            expect(role.id).toBe(createdRoleId);
            expect(role.name).toBe("TestRole");
        });

        it("Should throw an error when a role with the given ID doesn't exist", async () => {
            await expect(rolesService.getRoleById("nonexistent-id")).rejects.toThrow("Role not found");
        });
    });

    describe("Get All Roles", () => {
        it("Should get all roles successfully", async () => {
            const roles = await rolesService.getAllRoles();
            expect(roles).toBeDefined();
            expect(Array.isArray(roles)).toBe(true);
        });
    });

    describe("Update Role", () => {
        it("Should update a role successfully", async () => {
            const updatedRole = await rolesService.updateRole(createdRoleId, { name: "UpdatedRole", description: "Updated Description" });
            expect(updatedRole).toBeDefined();
            expect(updatedRole.id).toBe(createdRoleId);
            expect(updatedRole.name).toBe("UpdatedRole");

            //Update the createdRoleId so the other tests don't fail
            createdRoleId = updatedRole.id;
        });

        it("Should throw an error when updating a non-existent role", async () => {
            await expect(
                rolesService.updateRole("nonexistent-id", { name: "UpdatedRole", description: "Updated Description" })
            ).rejects.toThrow("Role not found");
        });
    });

    describe("Delete Role", () => {
        it("Should delete a role successfully", async () => {
            await rolesService.deleteRole(createdRoleId);
            // Check if the role is actually deleted
            await expect(rolesService.getRoleById(createdRoleId)).rejects.toThrow("Role not found");
        });

        it("Should throw an error when deleting a non-existent role", async () => {
            await expect(rolesService.deleteRole("nonexistent-id")).rejects.toThrow("Role not found");
        });
    });

    describe("Get Role By Name", () => {
        beforeEach(async () => {
                //Re-create the role since the delete test deletes it
                const roleData: CreateRoleDto = { name: "TestRole", description: "Test Role Description" };
                const newRole = await rolesService.createRole(roleData);
                createdRoleId = newRole.id;
        });

        it("Should get a role by name successfully", async () => {
            const role = await rolesService.getRoleByName("TestRole");
            expect(role).toBeDefined();
            expect(role.name).toBe("TestRole");
        });

        it("Should throw an error when a role with the given name doesn't exist", async () => {
            await expect(rolesService.getRoleByName("nonexistent-role")).rejects.toThrow("Role not found");
        });
    });

    describe("Get Role Users", () => {
        it("Should get users for a role successfully", async () => {
            const users = await rolesService.getRoleUsers(createdRoleId);
            expect(users).toBeDefined();
            expect(Array.isArray(users)).toBe(true);
        });
    });

    afterAll(async () => {
        try {
            await prisma.role.deleteMany({ where: { name: { contains: "TestRole" } } });
            await prisma.role.deleteMany({ where: { name: { contains: "UpdatedRole" } } });
        } catch (error) {
            console.warn("Cleanup failed:", error);
        }
    });
});