import prisma from "../../config/prisma";
import type { ProductsDto } from "./ProductsDto";
import ApiError from "../../utils/ApiError";

/**
 * ProductsService class handles product-related data operations with Prisma.
 */
export default class ProductsService {
    private prisma = prisma;

    /**
     * Creates a new product.
     * @param productData - Data to create a new product record.
     * @returns A newly created product.
     */
    async createProduct(productData: ProductsDto): Promise<ProductsDto> {
        try {
            const existingProduct = await this.prisma.product.findUnique({
                where: { name: productData.name }
            });

            if (existingProduct) {
                throw new ApiError(400, `Product with name "${productData.name}" already exists.`);
            }

            const newProduct = await this.prisma.product.create({
                data: {
                    isActive: productData.isActive,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    stock: productData.stock,
                    categoryId: productData.categoryId
                },
                include: {
                    category: true
                }
            });

            return newProduct;
        } catch (error) {
            throw new ApiError(500, "Error creating product");
        }
    }

    /**
     * Retrieves all products.
     */
    async getProducts(): Promise<ProductsDto[]> {
        try {
            const products = await this.prisma.product.findMany({
                include: {
                    category: true
                }
            });
            return products;
        } catch (error) {
            throw new ApiError(500, "Error retrieving products");
        }
    }

    /**
     * Retrieves a product by its ID.
     * @param id - The ID of the product to retrieve.
     * @returns The product with the specified ID.
     */
    async getProductById(id: string): Promise<ProductsDto> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
                include: {
                    category: true
                }
            });

            if (!product) {
                throw new ApiError(404, `Product with ID "${id}" not found.`);
            }

            return product;
        } catch (error) {
            throw new ApiError(500, "Error retrieving product");
        }
    }

    /**
     * Updates an existing product.
     * @param id - The ID of the product to update.
     * @param productData - The updated product data.
     * @returns The updated product.
     */
    async updateProduct(id: string, productData: ProductsDto): Promise<ProductsDto> {
        try {
            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: productData,
                include: {
                    category: true
                }
            });

            return updatedProduct;
        } catch (error) {
            throw new ApiError(500, "Error updating product");
        }
    }

    /**
     * Deletes a product by its ID.
     * @param id - The ID of the product to delete.
     */
    async deleteProduct(id: string): Promise<void> {
        try {
            await this.prisma.product.delete({
                where: { id }
            });
        } catch (error) {
            throw new ApiError(500, "Error deleting product");
        }
    }
}
