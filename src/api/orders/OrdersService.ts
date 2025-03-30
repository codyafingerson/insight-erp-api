import prisma from "../../config/database/prisma";
import type { OrderDto, OrderItemDto } from "./OrdersDto.ts";
import ApiError from "../../utils/ApiError";

/**
 * OrdersService class that provides methods to create, read, update, and delete orders.
 */
export default class OrdersService {
    private prisma = prisma;

    /**
     * Creates a new order with associated order items.
     *
     * @param {OrderDto} data - The order data transfer object containing order details and items.
     * @returns {Promise<OrderDto>} A promise that resolves to the created order data.
     */
    async createOrder(data: OrderDto): Promise<OrderDto> {
        // Remove 'id' from orderItems to avoid conflicts when creating new records
        const orderItems = data.orderItems.map(({ id, ...rest }: OrderItemDto) => rest);

        const order = await this.prisma.order.create({
            data: {
                name: data.name,
                description: data.description,
                status: data.status,
                totalAmount: data.totalAmount,
                orderItems: {
                    create: orderItems
                }
            },
            include: {
                orderItems: true
            }
        });
        return order as OrderDto;
    }

    /**
     * Retrieves an order by its unique identifier.
     *
     * @param {string} id - The unique identifier of the order.
     * @returns {Promise<OrderDto>} A promise that resolves to the found order data.
     * @throws {ApiError} Throws an error if the order is not found.
     */
    async getOrderById(id: string): Promise<OrderDto> {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { orderItems: true }
        });

        if (!order) {
            throw new ApiError(400, `Order with ID "${id}" not found.`);
        }
        return order as OrderDto;
    }

    /**
     * Retrieves all orders.
     *
     * @returns {Promise<OrderDto[]>} A promise that resolves to an array of order data objects.
     */
    async getAllOrders(): Promise<OrderDto[]> {
        const orders = await this.prisma.order.findMany({
            include: { orderItems: true }
        });
        return orders as OrderDto[];
    }

    /**
     * Updates an existing order with the given data.
     *
     * @param {string} id - The unique identifier of the order to update.
     * @param {Partial<Omit<OrderDto, "id" | "orderItems">>} data - Partial data to update for the order (excluding id and orderItems).
     * @returns {Promise<OrderDto>} A promise that resolves to the updated order data.
     * @throws {ApiError} Throws an error if the order is not found.
     */
    async updateOrder(
        id: string,
        data: Partial<Omit<OrderDto, "id" | "orderItems">>
    ): Promise<OrderDto> {
        try {
            const order = await this.prisma.order.update({
                where: { id },
                data,
                include: { orderItems: true }
            });
            return order as OrderDto;
        } catch (error) {
            throw new ApiError(400, `Order with ID "${id}" not found.`);
        }
    }

    /**
     * Deletes an order by its unique identifier.
     *
     * @param {string} id - The unique identifier of the order to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     * @throws {ApiError} Throws an error if the order is not found.
     */
    async deleteOrder(id: string): Promise<void> {
        try {
            await this.prisma.order.delete({
                where: { id }
            });
        } catch (error) {
            throw new ApiError(400, `Order with ID "${id}" not found.`);
        }
    }
}
