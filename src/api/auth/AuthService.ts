import prisma from "../../config/prisma";
import { comparePasswords } from "../../utils/bcrypt";
import { CredentialsDto } from "./AuthDto";

export default class AuthService {
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