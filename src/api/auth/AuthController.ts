import { Request, Response, NextFunction } from "express";
import AuthService from "./AuthService";
import passport from "passport";

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
                return res.status(400).json({ message: info.message });
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({ message: "Login successful", user: user });
            });
        })(req, res, next);
    }

    /**
     * Handles user logout.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>}
     */
    async logout(req: Request, res: Response): Promise<void> {
        req.logout((err: any) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Logout failed" });
            }
            return res.status(200).json({ success: true });
        });
    }
}