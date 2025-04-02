import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { Employee } from './entities/employee.entity';
import { Resume } from './entities/resume.entity';
import { Hobby } from './entities/hobby.entity';
import { WorkExperience } from './entities/workexperience.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HAPROXY_HOST,
      port: Number(process.env.POSTGRES_HAPROXY_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Employee, Resume, Hobby, WorkExperience],
      synchronize: true,
      connectTimeoutMS: 5000,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 