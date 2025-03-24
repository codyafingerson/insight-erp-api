import type { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);

    const status = err.status || 500;

    res.status(status).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
}
