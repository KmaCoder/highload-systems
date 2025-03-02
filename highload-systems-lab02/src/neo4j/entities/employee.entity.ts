import { Resume } from './resume.entity';

export interface Employee {
  login: string;
  password: string;
  resumes?: Resume[];
} 