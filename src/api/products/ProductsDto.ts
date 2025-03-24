export interface ProductsDto {
    id: string;
    isActive: boolean;
    name: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
