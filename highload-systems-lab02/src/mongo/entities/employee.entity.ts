import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Employee {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  login!: string;

  @Column({ select: false })
  password!: string;

  @Column(() => Resume)
  resumes!: Resume[];
} 