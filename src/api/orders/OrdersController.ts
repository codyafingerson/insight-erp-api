import type { NextFunction, Request, Response } from "express";
import OrdersService from "./OrdersService.ts";
import type { OrderDto } from "./OrdersDto.ts";
import ApiError from "../../utils/ApiError";
import BaseController from "../BaseController";

export default class OrdersController extends BaseController<OrdersService> {
    constructor(ordersService: OrdersService) {
        super(ordersService);
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
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
        await this.handleRequest(
            () => this.service.updateOrder(req.params.id, req.body),
            res,
            next
        );
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.handleRequest(
            async () => {
                await this.service.deleteOrder(req.params.id);
                return null;
            },
            res,
            next,
            204
        );
    }
}
