import type { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import ProductsService from "./ProductsService";

class ProductsController extends BaseController<ProductsService> {
    constructor(productsService: ProductsService) {
        super(productsService);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.createProduct(req.body), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(() => this.service.getProducts(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        this.handleRequest(() => this.service.getProductById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        this.handleRequest(
            () => this.service.updateProduct(req.params.id, req.body),
            res,
            next,
            200
        );
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        await this.handleRequest(() => this.service.deleteProduct(req.params.id), res, next, 204);
    }
}

export default ProductsController;
