/**
 * User Data Transfer Object for creating a new user
 */
export interface CreateUserDto {
    isActive?: boolean;
    roleId: string;
    name: string;
    username: string;
    email: string;
    password: string;
}

/**
 * User Data Transfer Object for updating a user
 */
export interface UpdateUserDto extends Partial<CreateUserDto> {}

/**
 * User Data Transfer Object for getting a user
 */
export interface UserResponseDto {
    id: string;
    name: string;
    username: string;
    email: string;
    role: {
        id: string;
        name: string;
    };
}