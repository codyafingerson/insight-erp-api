export interface CreateUserDto {
    isActive?: boolean;
    roleId: string;
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    isActive?: boolean;
    roleId?: string;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
}

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