import prisma from "../../config/prisma";
import { comparePasswords } from "../../utils/bcrypt";
import { CredentialsDto } from "./AuthDto";

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
                username: credentials.username,
            },
        });

        if (!user) {
            return null;
        }

        const passwordMatch = await comparePasswords(credentials.password, user.password);

        if (!passwordMatch) {
            return null;
        }

        return user;
    }
}