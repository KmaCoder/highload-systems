import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresEmployeeModule } from './postgres/modules/employee/employee.module';
import { MongoEmployeeModule } from './mongo/modules/employee/employee.module';
import { Neo4jEmployeeModule } from './neo4j/modules/employee/employee.module';
import { Employee as PostgresEmployee } from './postgres/entities/employee.entity';
import { Resume as PostgresResume } from './postgres/entities/resume.entity';
import { Hobby as PostgresHobby } from './postgres/entities/hobby.entity';
import { WorkExperience as PostgresWorkExperience } from './postgres/entities/workexperience.entity';
import { Employee as MongoEmployee } from './mongo/entities/employee.entity';
import { Resume as MongoResume } from './mongo/entities/resume.entity';
import { Hobby as MongoHobby } from './mongo/entities/hobby.entity';
import { WorkExperience as MongoWorkExperience } from './mongo/entities/workexperience.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'postgres',
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [PostgresEmployee, PostgresResume, PostgresHobby, PostgresWorkExperience],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mongo',
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      port: Number(process.env.MONGO_PORT) || 27017,
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      database: process.env.MONGO_DATABASE,
      useUnifiedTopology: true,
      entities: [MongoEmployee, MongoResume, MongoHobby, MongoWorkExperience],
      synchronize: true,
    }),
    
    PostgresEmployeeModule,
    MongoEmployeeModule,
    Neo4jEmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 