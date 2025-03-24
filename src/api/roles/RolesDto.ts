/**
 * Create Role Data Transfer Object
 */
export interface CreateRoleDto {
    name: string;
    description?: string;
    permissions?: { id: string }[];
}

/**
 * Update Role Data Transfer Object
 */
export interface UpdateRoleDto {
    name?: string;
    description?: string;
    permissions?: { id: string }[];
}

/**
 * Role Data Transfer Object for getting a role
 */
export interface RoleResponseDto {
    id: string;
    name: string;
    description?: string;
    permissions?: { id: string; name: string }[];
}
