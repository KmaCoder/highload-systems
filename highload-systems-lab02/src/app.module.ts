import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './modules/employee/employee.module';
import { Employee } from './entities/employee.entity';
import { Resume } from './entities/resume.entity';
import { Hobby } from './entities/hobby.entity';
import { WorkExperience } from './entities/workexperience.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'test',
      entities: [Employee, Resume, Hobby, WorkExperience],
      synchronize: true,
    }),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 