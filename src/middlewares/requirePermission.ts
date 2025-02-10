import { Request, Response, NextFunction } from "express";
import { AuthenticatedUserDto } from "../api/auth/AuthDto";

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure the user is authenticated.
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.user as AuthenticatedUserDto;

    // Check if the user's role includes the required permission.
    const hasPermission = user.role?.permissions.some(
      (perm) => perm.name === permission
    );

    if (!hasPermission) {
      res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
