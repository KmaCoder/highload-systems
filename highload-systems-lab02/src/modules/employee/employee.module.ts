import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../entities/employee.entity';
import { Resume } from '../../entities/resume.entity';
import { Hobby } from '../../entities/hobby.entity';
import { WorkExperience } from '../../entities/workexperience.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Resume, Hobby, WorkExperience])
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController]
})
export class EmployeeModule {} 