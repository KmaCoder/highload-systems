import { DataSource } from 'typeorm';
import { Employee } from './src/entities/employee.entity';
import { Resume } from './src/entities/resume.entity';
import { Hobby } from './src/entities/hobby.entity';
import { WorkExperience } from './src/entities/workexperience.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'test',
  entities: [Employee, Resume, Hobby, WorkExperience],
  synchronize: false,
  migrations: [__dirname + '/src/migrations/*{.ts,.js}']
});

export default AppDataSource; 