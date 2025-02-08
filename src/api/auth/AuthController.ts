import { Request, Response, NextFunction } from "express";
import AuthService from "./AuthService";
import passport from "passport";

export default class AuthController {
    constructor(private readonly authService?: AuthService) {
        this.authService = authService;

        this.login = this.login.bind(this);
    }

    async login(req: Request, res: Response, next: NextFunction) {
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

    async logout(req: Request, res: Response) {
        req.logout((err: any) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Logout failed" });
            }
            return res.status(200).json({ success: true });
        });
    }
}