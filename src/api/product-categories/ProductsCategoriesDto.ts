export interface ProductsCategoriesDto {
    id: string;
    name: string;
    description?: string;
    products?: string[]; // Array of product IDs or references
}
