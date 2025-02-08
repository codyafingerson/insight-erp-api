/**
 * Create Role Data Transfer Object
 */
export interface CreateRoleDto {
    name: string;
    description?: string;
}

/**
 * Role Data Transfer Object for getting a role
 */
export interface RoleResponseDto {
    id: string;
    name: string;
    description: string;
}