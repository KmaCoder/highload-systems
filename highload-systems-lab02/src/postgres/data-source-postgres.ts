import { DataSource } from 'typeorm';
import { Employee as PostgresEmployee } from './entities/employee.entity';
import { Resume as PostgresResume } from './entities/resume.entity';
import { Hobby as PostgresHobby } from './entities/hobby.entity';
import { WorkExperience as PostgresWorkExperience } from './entities/workexperience.entity';

import * as dotenv from 'dotenv';

dotenv.config();

const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [PostgresEmployee, PostgresResume, PostgresHobby, PostgresWorkExperience],
});

export default PostgresDataSource;
