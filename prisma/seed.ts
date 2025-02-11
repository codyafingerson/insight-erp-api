import { PrismaClient, Permission } from '@prisma/client'
import bcrypt from 'bcrypt'
import { parseArgs } from 'node:util'

const prisma = new PrismaClient()

const options = {
    environment: { type: 'string' as const },
}

/**
 * Define the names and descriptions of each permission.
 * These will be used to seed the database with initial permissions.
 */
enum PermissionName {
    CreateUser = 'create_user',
    UpdateUser = 'update_user',
    DeleteUser = 'delete_user',
    ReadAllUsers = 'read_all_users',

    CreateEmployee = 'create_employee',
    UpdateEmployee = 'update_employee',
    DeleteEmployee = 'delete_employee',
    ReadAllEmployees = 'read_all_employees',

    CreateRole = 'create_role',
    UpdateRole = 'update_role',
    DeleteRole = 'delete_role',
    ReadAllRoles = 'read_all_roles',

    CreateDepartment = 'create_department',
    UpdateDepartment = 'update_department',
    DeleteDepartment = 'delete_department',
    ReadAllDepartments = 'read_all_departments',
}

const permissionsData = Object.values(PermissionName).map(name => ({
    name,
    description: `Permission to ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`
}));


// Define each role’s name, description, and the permission names that belong to it.
const rolesData = [
    {
        name: 'SuperAdmin',
        description: 'Role with all permissions',
        permissionNames: permissionsData.map((p) => p.name), // all
    },
    {
        name: 'Manager',
        description: 'Role with relevant permissions for managing employees and departments',
        permissionNames: [
            'create_employee',
            'update_employee',
            'read_all_employees',
            'create_department',
            'update_department',
            'read_all_departments',
            'read_all_roles',
        ],
    },
    {
        name: 'Employee',
        description: 'Role with relevant permissions for employees',
        permissionNames: ['read_all_employees', 'read_all_departments', 'read_all_roles'],
    },
]

/**
 * Upserts all permissions defined in permissionsData
 */
async function seedPermissions() {
    return Promise.all(
        permissionsData.map((permission) =>
            prisma.permission.upsert({
                where: { name: permission.name },
                update: {},
                create: permission,
            }),
        ),
    )
}

/**
 * Upserts each role defined in rolesData, connecting them with
 * the appropriate Permission records.
 *
 * @param {Permission[]} allPermissions
 */
async function seedRoles(allPermissions: Permission[]) {
    return Promise.all(
        rolesData.map(async (role) => {
            // Filter the permissions relevant to this role
            const filteredPermissions = allPermissions.filter((p) =>
                role.permissionNames.includes(p.name),
            )

            // Upsert the role
            return prisma.role.upsert({
                where: { name: role.name },
                update: {
                    permissions: {
                        // Overwrite the role's permissions in an update scenario
                        set: filteredPermissions.map((perm) => ({ id: perm.id })),
                    },
                },
                create: {
                    name: role.name,
                    description: role.description,
                    permissions: {
                        connect: filteredPermissions.map((perm) => ({ id: perm.id })),
                    },
                },
                include: { permissions: true },
            })
        }),
    )
}

/**
 * Seeds both Permissions and Roles
 * Returns { allPermissions, seededRoles } for further use/logging.
 */
async function seedPermissionsAndRoles() {
    const allPermissions = await seedPermissions()
    const seededRoles = await seedRoles(allPermissions)

    return { allPermissions, seededRoles }
}

/**
 * Seeding logic for Development environment
 */
async function seedDevelopmentEnvironment() {
    // 1. Seed Permissions and Roles
    const { seededRoles } = await seedPermissionsAndRoles()

    // 2. Optionally, seed a development user assigned to the SuperAdmin role
    const superAdminRole = seededRoles.find((role) => role.name === 'SuperAdmin')
    if (!superAdminRole) {
        throw new Error('SuperAdmin role was not found; cannot seed dev user.')
    }

    const hashedPassword = await bcrypt.hash('password123', 10)
    const developerUser = await prisma.user.upsert({
        where: { email: 'developer@example.com' },
        update: {},
        create: {
            name: 'Developer',
            username: 'developer',
            email: 'developer@example.com',
            password: hashedPassword,
            role: {
                connect: { id: superAdminRole.id },
            },
        },
    })

    console.log('Seeded Roles (development):', seededRoles)
    console.log('Seeded Developer user:', developerUser)
}

/**
 * Seeding logic for Production environment
 */
async function seedProductionEnvironment() {
    // 1. Seed Permissions and Roles
    const { seededRoles } = await seedPermissionsAndRoles()

    console.log('Seeded Roles (production):', seededRoles)
}

/**
 * The main entry point.
 */
async function main() {
    const {
        values: { environment },
    } = parseArgs({ options })

    switch (environment) {
        case 'development':
            console.log('Seeding data for development environment...')
            await seedDevelopmentEnvironment()
            break

        case 'production':
            console.log('Seeding data for production environment...')
            await seedProductionEnvironment()
            break

        default:
            console.log('No matching environment. Skipping seeding...')
            break
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
