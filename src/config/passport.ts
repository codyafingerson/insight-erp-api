// config/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import prisma from './prisma';

passport.use(
    new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' },
        async (username, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { username } });
                if (!user) {
                    return done(null, false, { message: 'Invalid username' });
                }
                const isMatch = await compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }
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
        if (!user) {
            return done(new Error('User not found'), null);
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
});

export default passport;
