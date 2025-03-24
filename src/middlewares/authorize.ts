import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUserDto } from "../api/auth/AuthDto";
import ApiError from "../utils/ApiError";

export const authorize = (permission?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Ensure the user is authenticated.
        if (!req.user || !req.isAuthenticated()) {
            return next(new ApiError(401, "Unauthorized"));
        }

        if (permission) {
            const user = req.user as AuthenticatedUserDto;

            // Check if the user's role includes the required permission.
            const hasPermission = user.role?.permissions.some((perm) => perm.name === permission);

            if (!hasPermission) {
                return next(new ApiError(403, "Forbidden"));
            }
        }

        // If no permission is required, or the user has the required permission, call next().

        next();
    };
};
