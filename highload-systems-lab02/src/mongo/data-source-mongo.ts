import { DataSource } from 'typeorm';
import { Employee as MongoEmployee } from './entities/employee.entity';
import { Resume as MongoResume } from './entities/resume.entity';
import { Hobby as MongoHobby } from './entities/hobby.entity';
import { WorkExperience as MongoWorkExperience } from './entities/workexperience.entity';

import * as dotenv from 'dotenv';

dotenv.config();

const MongoDataSource = new DataSource({
  type: 'mongodb',
  host: process.env.MONGO_HOST || 'localhost',
  port: Number(process.env.MONGO_PORT) || 27017,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DATABASE,
  useUnifiedTopology: true,
  entities: [MongoEmployee, MongoResume, MongoHobby, MongoWorkExperience],
});

export default MongoDataSource;