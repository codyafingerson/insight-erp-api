import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import AuthService from "../api/auth/AuthService";
import { CredentialsDto } from "../api/auth/AuthDto";
import prisma from "./prisma";

const authService = new AuthService();

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await authService.validateUser({ username, password });

                if (!user) {
                    return done(null, false, { message: "Incorrect username or password." });
                }

                // Ensure the password IS NOT included in the user object
                // before passing the user object to the done callback.
                delete user.password;
                
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;