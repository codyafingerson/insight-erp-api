import type { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import ProductsService from "./ProductsService";
import ApiError from "../../utils/ApiError";

class ProductsController extends BaseController<ProductsService> {
    constructor(service: ProductsService) {
        super(service);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.createProduct(req.body), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getProducts(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getProductById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.updateProduct(id, req.body), res, next, 200);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(
            async () => {
                await this.service.deleteProduct(id);
                return null;
            },
            res,
            next,
            204
        );
    }
}

export default ProductsController;
