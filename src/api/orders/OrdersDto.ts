export interface OrderItemDto {
    id?: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
}

export interface OrderDto {
    id?: string;
    name: string;
    description?: string;
    orderDate: Date;
    status: "PENDING" | "COMPLETED" | "CANCELED";
    totalAmount: number;
    orderItems: OrderItemDto[];
}
