import type { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import ProductCategoriesService from "./ProductsCategoriesService";
import ApiError from "../../utils/ApiError";

class ProductCategoriesController extends BaseController<ProductCategoriesService> {
    constructor(service: ProductCategoriesService) {
        super(service);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.createProductCategory(req.body), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getProductCategories(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getProductCategoryById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.updateProductCategory(id, req.body), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(
            async () => {
                await this.service.deleteProductCategory(id);
                return null;
            },
            res,
            next,
            204
        );
    }
}

export default ProductCategoriesController;
