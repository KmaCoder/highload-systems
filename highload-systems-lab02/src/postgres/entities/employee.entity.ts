import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Column({ select: false })
  password!: string;

  @OneToMany(() => Resume, resume => resume.employee)
  resumes!: Resume[];
} 