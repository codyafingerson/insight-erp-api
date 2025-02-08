import { Request, Response, NextFunction } from "express";

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  next(err); // Pass error to the next middleware
}

export function errorResponder(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}
