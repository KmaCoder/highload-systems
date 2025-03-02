import { Controller, Get, Post, Body, Param, Delete, Put, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { Neo4jEmployeeService } from './employee.service';
import { EmployeesByCompanyDto } from './dto/employee-company.dto';
import { Hobby } from '../../entities/hobby.entity';

@Controller('neo4j/employee')
export class Neo4jEmployeeController {
  constructor(private readonly employeeService: Neo4jEmployeeService) {}

  @Get(':login/resume')
  async getEmployeeResume(@Param('login') login: string) {
    return await this.employeeService.getResume(login);
  }

  @Get('resume/cities/all')
  async getAllCities(): Promise<string[]> {
    return await this.employeeService.getAllCities();
  }

  @Get('resume/hobbies/by-city')
  async getHobbiesByCity(@Query('city') city: string): Promise<Hobby[]> {
    if (!city) {
      throw new BadRequestException('City is required');
    }
    return await this.employeeService.getHobbiesByCity(city);
  }

  @Get('group-by-company')
  async getEmployeesByCompany(
    @Query('min-employees', ParseIntPipe) minEmployees: number
  ): Promise<EmployeesByCompanyDto[]> {
    return await this.employeeService.getEmployeesByCompany(minEmployees);
  }
} 