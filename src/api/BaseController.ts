import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

abstract class BaseController<T> {
    protected readonly service: T;

    protected constructor(service: T) {
        this.service = service;
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    abstract create(req: Request, res: Response, next: NextFunction): Promise<void>;
    abstract getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    abstract getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    abstract update(req: Request, res: Response, next: NextFunction): Promise<void>;
    abstract delete(req: Request, res: Response, next: NextFunction): Promise<void>;

    protected async handleRequest<T>(
        handler: (...args: any) => Promise<T>,
        res: Response,
        next: NextFunction,
        statusCode: number = 200
    ): Promise<void> {
        try {
            const result = await handler();
            res.status(statusCode).json(result);
        } catch (error: any) {
            next(new ApiError(500, error.message));
        }
    }
}

export default BaseController;
