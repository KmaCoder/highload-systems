import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../../postgres/entities/employee.entity';
import { Resume } from '../../../postgres/entities/resume.entity';
import { Hobby } from '../../../postgres/entities/hobby.entity';
import { WorkExperience } from '../../../postgres/entities/workexperience.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Resume, Hobby, WorkExperience], 'postgres')
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController]
})
export class PostgresEmployeeModule {} 