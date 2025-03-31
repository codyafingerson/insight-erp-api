import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;

    // Log the error with method, original url, IP, status, and error message
    logger.error(`[${req.method}] - ${req.originalUrl} ${status} - ${err.message}`);

    if (err.stack && process.env.NODE_ENV !== "production") {
        logger.error(err.stack);
    }

    res.status(status).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
}