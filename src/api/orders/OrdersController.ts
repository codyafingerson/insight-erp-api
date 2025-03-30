import type { NextFunction, Request, Response } from "express";
import OrdersService from "./OrdersService";
import type { OrderDto } from "./OrdersDto";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

export default class OrdersController extends BaseController<OrdersService> {
    constructor(service: OrdersService) {
        super(service);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, description, status, totalAmount, orderItems, orderDate } = req.body;
        if (!name) {
            return next(new ApiError(400, "Order name is required."));
        }
        const data: OrderDto = { name, description, status, totalAmount, orderItems, orderDate };
        await this.handleRequest(() => this.service.createOrder(data), res, next, 201);
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(() => this.service.getAllOrders(), res, next);
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.getOrderById(id), res, next);
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(() => this.service.updateOrder(id, req.body), res, next);
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError(400, "No ID provided."));
        }
        await this.handleRequest(
            async () => {
                await this.service.deleteOrder(id);
                return null;
            },
            res,
            next,
            204
        );
    }
}
