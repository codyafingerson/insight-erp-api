import { Request, Response, NextFunction } from "express";
import { AuthenticatedUserDto } from "../api/auth/AuthDto";
import ApiError from "../utils/ApiError"; // Import ApiError

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Ensure the user is authenticated.
        if (!req.user || !req.isAuthenticated()) {
            return next(new ApiError(401, "Unauthorized")); // Use ApiError and next()
        }

        const user = req.user as AuthenticatedUserDto;

        // Check if the user's role includes the required permission.
        const hasPermission = user.role?.permissions.some(
            (perm) => perm.name === permission
        );

        if (!hasPermission) {
            return next(new ApiError(403, "Forbidden")); // Use ApiError and next()
        }

        next();
    };
};