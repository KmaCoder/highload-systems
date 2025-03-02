import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id/resume')
  async getEmployeeResume(@Param('id', ParseIntPipe) id: number) {
    return await this.employeeService.getResume(id);
  }

  @Get(':id/resume/hobbies')
  async getEmployeeHobbies(@Param('id', ParseIntPipe) id: number) {
    return await this.employeeService.getHobbies(id);
  }

  @Get('resume/hobbies/all')
  async getAllEmployeeHobbies() {
    return await this.employeeService.getAllHobbies();
  }

  @Get('resume/cities/all')
  async getAllCities() {
    return await this.employeeService.getAllCities();
  }

  @Get('resume/hobbies/by-city')
  async getHobbiesByCity(@Query('city') city: string) {
    return await this.employeeService.getHobbiesByCity(city);
  }

  @Get('group-by-company')
  async getEmployeesByCompany(@Query('min-employees') minEmployees: number = 1) {
    return await this.employeeService.getEmployeesByCompany(minEmployees);
  }
} 