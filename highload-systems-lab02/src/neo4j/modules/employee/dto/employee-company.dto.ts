import { Employee } from '../../../entities/employee.entity';

export interface EmployeesByCompanyDto {
  company: string;
  employees: Employee[];
} 