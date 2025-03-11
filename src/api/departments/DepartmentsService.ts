import prisma from "../../config/prisma";
import type { CreateDepartmentDto, DepartmentResponseDto } from "./DepartmentsDto";

/**
 * DepartmentsService class handles department-related data operations with Prisma.
 */
export default class DepartmentsService {
    private prisma = prisma;

    /**
    * Creates a new department.
    * @param {CreateDepartmentDto} data - The department data.
    * @returns {Promise<DepartmentResponseDto>} - The created department.
    * @throws {Error} - If a department with the same name already exists.
    */
    async createDepartment(data: CreateDepartmentDto): Promise<DepartmentResponseDto> {
        const existingDepartment = await this.prisma.department.findUnique({
            where: { name: data.name },
        });

        if (existingDepartment) {
            throw new Error(`Department with name ${data.name} already exists.`);
        }

        return await this.prisma.department.create({
            data,
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
    }

    /**
     * Retrieves a department by its ID.
     * @param {string} id - The department ID.
     * @returns {Promise<DepartmentResponseDto>} - The department object.
     * @throws {Error} - If the department is not found.
     */
    async getDepartmentById(id: string): Promise<DepartmentResponseDto> {
        const department = await this.prisma.department.findUnique({
            where: { id },
            select: { id: true, name: true, description: true },
        });

        if (!department) {
            throw new Error(`Department with ID "${id}" not found.`);
        }

        return department;
    }

    /**
     * Retrieves all departments.
     * @returns {Promise<DepartmentResponseDto[]>} - An array of department objects.
     */
    async getAllDepartments(): Promise<DepartmentResponseDto[]> {
        return await this.prisma.department.findMany({
            select: { id: true, name: true, description: true },
        });
    }

    /**
     * Updates a department with new data.
     * @param {string} id - The department ID.
     * @param {CreateDepartmentDto} data - The updated department data.
     * @returns {Promise<DepartmentResponseDto>} - The updated department object.
     * @throws {Error} - If the department is not found.
     */
    async updateDepartment(id: string, data: CreateDepartmentDto): Promise<DepartmentResponseDto> {
        try {
            return await this.prisma.department.update({
                where: { id },
                data,
                select: { id: true, name: true, description: true },
            });
        } catch (error) {
            throw new Error(`Department with ID "${id}" not found.`);
        }
    }

    /**
     * Deletes a department by its ID.
     * @param {string} id - The department ID.
     * @throws {Error} - If the department is not found.
     */
    async deleteDepartment(id: string): Promise<void> {
        try {
            await this.prisma.department.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Department with ID "${id}" not found.`);
            }

            throw error;
        }
    }

    /**
    * Retrieves a department by its name.
    * @param {string} name - The department name.
    * @returns {Promise<DepartmentResponseDto>} - The department object.
    * @throws {Error} - If the department is not found.
    */
    async getDepartmentByName(name: string): Promise<DepartmentResponseDto> {
        const department = await this.prisma.department.findUnique({
            where: { name },
            select: { id: true, name: true, description: true },
        });

        if (!department) {
            throw new Error(`Department with name "${name}" not found.`);
        }

        return department;
    }
}
