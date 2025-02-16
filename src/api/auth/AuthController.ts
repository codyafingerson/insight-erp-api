import { Request, Response, NextFunction } from "express";
import AuthService from "./AuthService";
import passport from "passport";
import ApiError from "../../utils/ApiError";

/**
 * AuthController class handles authentication-related requests.
 */
export default class AuthController {
    private readonly authService: AuthService;

    /**
     * AuthController constructor.
     * @param {AuthService} authService - Optional AuthService instance for dependency injection.
     */
    constructor(authService?: AuthService) {
        this.authService = authService ?? new AuthService(); // Use a default instance if none is provided
        this.login = this.login.bind(this);
    }

    /**
     * Handles user login.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next function.
     * @returns {Promise<void>}
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        passport.authenticate("local", (err: Error, user: any, info: any) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(new ApiError(401, "Invalid credentials"));
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                // Regenerate session after successful login
                req.session.regenerate((err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.status(200).json({ message: "Login successful", user: user });
                });
            });
        })(req, res, next);
    }

    /**
     * Handles user logout.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.logout((err: any) => {
            if (err) {
                return next(new ApiError(500, "Logout failed"));
            }
            return res.status(200).json({ success: true });
        });
    }
}