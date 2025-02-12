import prisma from "../../config/prisma";
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto } from "./EmployeesDto";
import ApiError from "../../utils/ApiError";

/**
 * EmployeesService class handles employee-related data operations with Prisma.
 */
export default class EmployeesService {
    private prisma = prisma;

    /**
     * Creates a new employee.
     * @param employee - Data to create a new employee record.
     * @returns A newly created employee.
     * @throws An error if an employee with the same email already exists.
     */
    async createEmployee(employee: CreateEmployeeDto): Promise<EmployeeResponseDto> {
        try {
            const existingEmployee = await this.prisma.employee.findUnique({
                where: { email: employee.email },
            });

            if (existingEmployee) {
                throw new ApiError(400, `Employee with email "${employee.email}" already exists.`);
            }

            const newEmployee = await this.prisma.employee.create({
                data: {
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    position: employee.position,
                    phoneNumber: employee.phoneNumber,
                    address: employee.address,
                    dateOfBirth: new Date(employee.dateOfBirth),
                    startDate: new Date(employee.startDate),
                    endDate: employee.endDate ? new Date(employee.endDate) : null,
                    employmentType: employee.employmentType as any,
                    department: {
                        connect: { id: employee.departmentId },
                    },
                    manager: employee.managerId
                        ? {
                            connect: { id: employee.managerId },
                        }
                        : undefined,
                    emergencyContactName: employee.emergencyContactName,
                    emergencyContactRelationship: employee.emergencyContactRelationship,
                    emergencyContactPhoneNumber: employee.emergencyContactPhoneNumber,
                    compensationSalary: employee.compensationSalary,
                    compensationPayStructure: employee.compensationPayStructure,
                    timeOffVacationDays: employee.timeOffVacationDays,
                    timeOffSickDays: employee.timeOffSickDays,
                    timeOffPersonalDays: employee.timeOffPersonalDays,
                },
                include: {
                    department: true,
                    manager: true,
                },
            });

            return newEmployee;
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves all employees with selected fields.
     * @returns An array of employees.
     */
    async getEmployees() {
        try {
            const employees = await this.prisma.employee.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    department: true,
                },
            });

            return employees;
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Retrieves a single employee by ID.
     * @param id - The employee's ID.
     * @returns An employee object or null if not found.
     */
    async getEmployeeById(id: string) {
        try {
            const employee = await this.prisma.employee.findUnique({
                where: { id },
                include: {
                    department: true,
                    manager: true,
                },
            });

            if (!employee) {
                throw new ApiError(404, `Employee with ID "${id}" not found.`);
            }

            return employee;
        } catch (error: any) {
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Updates employee details by ID.
     * @param id - The employee's ID.
     * @param employee - The updated employee data.
     * @returns The updated employee record.
     */
    async updateEmployee(id: string, employee: UpdateEmployeeDto) {
        try {
            const updatedEmployee = await this.prisma.employee.update({
                where: { id },
                data: {
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    position: employee.position,
                    phoneNumber: employee.phoneNumber,
                    address: employee.address,
                    dateOfBirth: employee.dateOfBirth,
                    startDate: employee.startDate,
                    endDate: employee.endDate,
                    employmentType: employee.employmentType,
                    department: {
                        connect: { id: employee.departmentId },
                    },
                    manager: employee.managerId
                        ? {
                            connect: { id: employee.managerId },
                        }
                        : undefined,
                    emergencyContactName: employee.emergencyContactName,
                    emergencyContactRelationship: employee.emergencyContactRelationship,
                    emergencyContactPhoneNumber: employee.emergencyContactPhoneNumber,
                    compensationSalary: employee.compensationSalary,
                    compensationPayStructure: employee.compensationPayStructure,
                    timeOffVacationDays: employee.timeOffVacationDays,
                    timeOffSickDays: employee.timeOffSickDays,
                    timeOffPersonalDays: employee.timeOffPersonalDays,
                },
                include: {
                    department: true,
                    manager: true,
                },
            });

            return updatedEmployee
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ApiError(404, `Employee with ID "${id}" not found.`);
            }
            throw new ApiError(500, error.message);
        }
    }

    /**
     * Deletes an employee by ID.
     * @param id - The employee's ID.
     * @returns The deleted employee record.
     */
    async deleteEmployee(id: string) {
        try {
            const deletedEmployee = await this.prisma.employee.delete({
                where: { id },
            });

            return deletedEmployee;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new ApiError(404, `Employee with ID "${id}" not found.`);
            }
            throw new ApiError(500, error.message);
        }
    }
}