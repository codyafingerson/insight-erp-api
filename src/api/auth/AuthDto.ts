/**
 * Data transfer object for user credentials
 */
export interface CredentialsDto {
    username: string;
    password: string;
}

/**
 * Data transfer object for after a user has been authenticated
 */
export interface AuthenticatedUserDto {
    id: string;
    name: string;
    username: string;
    email: string;
    role: {
        id: string;
        name: string;
        permissions: Array<{
            id: string;
            name: string;
            description?: string;
        }>;
    };
}
