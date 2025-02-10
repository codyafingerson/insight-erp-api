// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Upsert the required permissions.
    const permissionsData = [
        { name: "create_user", description: "Permission to create a user" },
        { name: "update_user", description: "Permission to update a user" },
        { name: "delete_user", description: "Permission to delete a user" },
        { name: "read_all_users", description: "Permission to read all users" },
    ];

    const permissions = await Promise.all(
        permissionsData.map(permission =>
            prisma.permission.upsert({
                where: { name: permission.name },
                update: {},
                create: permission,
            })
        )
    );

    // 2. Upsert the SuperAdmin role and attach all the above permissions.
    const superAdminRole = await prisma.role.upsert({
        where: { name: "SuperAdmin" },
        update: {
            permissions: {
                // This ensures the role's permissions are updated to match the seeded ones.
                set: permissions.map(perm => ({ id: perm.id })),
            },
        },
        create: {
            name: "SuperAdmin",
            description: "Role with all permissions",
            permissions: {
                connect: permissions.map(perm => ({ id: perm.id })),
            },
        },
        include: {
            permissions: true,
        },
    });

    console.log("Seeded SuperAdmin role with permissions:", superAdminRole);

    // 3. Hash the developer user's password.
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 4. Upsert a developer user assigned to the SuperAdmin role.
    const developerUser = await prisma.user.upsert({
        where: { email: "developer@example.com" },
        update: {},
        create: {
            name: "Developer",
            username: "developer",
            email: "developer@example.com",
            password: hashedPassword,
            role: {
                connect: { id: superAdminRole.id },
            },
        },
    });

    console.log("Seeded Developer user:", developerUser);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
