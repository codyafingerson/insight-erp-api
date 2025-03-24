import type { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import ProductCategoriesService from "./ProductsCategoriesService";

class ProductCategoriesController extends BaseController<ProductCategoriesService> {
    constructor(productCategoriesService: ProductCategoriesService) {
        super(productCategoriesService);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.createProductCategory(req.body), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.getProductCategories(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        this.handleRequest(() => this.service.getProductCategoryById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(
            () => this.service.updateProductCategory(req.params.id, req.body),
            res,
            next
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        await this.handleRequest(
            () => this.service.deleteProductCategory(req.params.id),
            res,
            next,
            204
        );
    }
}

export default ProductCategoriesController;
