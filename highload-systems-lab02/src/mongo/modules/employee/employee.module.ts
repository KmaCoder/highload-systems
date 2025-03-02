import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../../mongo/entities/employee.entity';
import { Resume } from '../../../mongo/entities/resume.entity';
import { Hobby } from '../../../mongo/entities/hobby.entity';
import { WorkExperience } from '../../../mongo/entities/workexperience.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Resume, Hobby, WorkExperience], 'mongo')
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController]
})
export class MongoEmployeeModule {} 