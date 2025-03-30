import prisma from "../../config/database/prisma";
import ApiError from "../../utils/ApiError";
import { comparePasswords } from "../../utils/bcrypt";
import type { CredentialsDto } from "./AuthDto";

/**
 * AuthService class handles user authentication logic.
 */
export default class AuthService {
    /**
     * Validates user credentials against the database.
     * @param {CredentialsDto} credentials - The user's credentials (username and password).
     * @returns {Promise<any | null>} - A promise that resolves to the user object if validation is successful, otherwise null.
     */
    async validateUser(credentials: CredentialsDto): Promise<any | null> {
        const user = await prisma.user.findUnique({
            where: {
                username: credentials.username
            }
        });

        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }

        const passwordMatch = await comparePasswords(credentials.password, user.password);

        if (!passwordMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        return user;
    }
}
