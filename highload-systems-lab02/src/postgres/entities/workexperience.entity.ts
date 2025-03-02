import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class WorkExperience {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  city!: string;

  @Column()
  company!: string;

  @ManyToOne(() => Resume, resume => resume.workExperiences)
  resume!: Resume;
} 