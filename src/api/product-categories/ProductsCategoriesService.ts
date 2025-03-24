import prisma from "../../config/prisma";
import { type ProductsCategoriesDto } from "./ProductsCategoriesDto";
import ApiError from "../../utils/ApiError";

/**
 * ProductCategoriesService class handles employee-related data operations with Prisma.
 */
export default class ProductCategoriesService {
    private prisma = prisma;

    /**
     * Creates a new product category.
     * @param productCategory - Data to create a new productCategory record.
     * @returns A newly created productCategory.
     */
    async createProductCategory(
        productCategoryData: ProductsCategoriesDto
    ): Promise<ProductsCategoriesDto> {
        try {
            const existingProductCategory = await this.prisma.productCategory.findUnique({
                where: { name: productCategoryData.name }
            });

            if (existingProductCategory) {
                throw new ApiError(
                    400,
                    `Product category with name "${productCategoryData.name}" already exists.`
                );
            }

            const newProductCategory = await this.prisma.productCategory.create({
                data: {
                    name: productCategoryData.name,
                    description: productCategoryData.description
                }
            });

            return newProductCategory;
        } catch (error) {
            throw new ApiError(500, "Error creating product category");
        }
    }

    /**
     * Retrieves all product categories.
     */
    async getProductCategories(): Promise<ProductsCategoriesDto[]> {
        try {
            const productCategories = await this.prisma.productCategory.findMany();
            return productCategories;
        } catch (error) {
            throw new ApiError(500, "Error retrieving product categories");
        }
    }

    /**
     * Retrieves a product category by its ID.
     * @param id - The ID of the product category to retrieve.
     * @returns The productCategory with the specified ID.
     */
    async getProductCategoryById(id: string): Promise<ProductsCategoriesDto> {
        try {
            const productCategory = await this.prisma.productCategory.findUnique({
                where: { id }
            });

            if (!productCategory) {
                throw new ApiError(404, `Product category with ID "${id}" not found.`);
            }

            return productCategory;
        } catch (error) {
            throw new ApiError(500, "Error retrieving product category");
        }
    }

    /**
     * Updates an existing product category.
     * @param id - The ID of the product category to update.
     * @param productCategoryData - The updated product category data.
     * @returns The updated product category.
     */
    async updateProductCategory(
        id: string,
        productCategoryData: any
    ): Promise<ProductsCategoriesDto> {
        try {
            const updatedProductCategory = await this.prisma.productCategory.update({
                where: { id },
                data: productCategoryData
            });

            return updatedProductCategory;
        } catch (error) {
            throw new ApiError(500, "Error updating product category");
        }
    }

    /**
     * Deletes a product category by its ID.
     * @param id - The ID of the product category to delete.
     */
    async deleteProductCategory(id: string): Promise<void> {
        try {
            await this.prisma.productCategory.delete({
                where: { id }
            });
        } catch (error) {
            throw new ApiError(500, "Error deleting product category");
        }
    }
}
