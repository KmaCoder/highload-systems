import { DataSource } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Resume } from './entities/resume.entity';
import { Hobby } from './entities/hobby.entity';
import { WorkExperience } from './entities/workexperience.entity';

import * as dotenv from 'dotenv';

dotenv.config();

const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HAPROXY_HOST,
  port: Number(process.env.POSTGRES_HAPROXY_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [Employee, Resume, Hobby, WorkExperience],
});

export default PostgresDataSource;
