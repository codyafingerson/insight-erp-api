export interface CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    departmentId: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    startDate: Date;
    endDate?: Date;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
    managerId?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhoneNumber?: string;
    compensationSalary: number;
    compensationPayStructure: 'HOURLY' | 'SALARY' | 'COMMISSION';
    timeOffVacationDays?: number;
    timeOffSickDays?: number;
    timeOffPersonalDays?: number;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

export interface EmployeeResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: {
        id: string;
        name: string;
    };
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    startDate: Date;
    endDate?: Date;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
    manager?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhoneNumber?: string;
    compensationSalary: number;
    compensationPayStructure: 'HOURLY' | 'SALARY' | 'COMMISSION';
    timeOffVacationDays?: number;
    timeOffSickDays?: number;
    timeOffPersonalDays?: number;
}