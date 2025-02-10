/**
 * Create Department Data Transfer Object
 */
export interface CreateDepartmentDto {
    name: string;
    description?: string;
}

/**
 * Department Data Transfer Object for getting a department
 */
export interface DepartmentResponseDto {
    id: string;
    name: string;
    description?: string;
}