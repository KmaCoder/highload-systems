import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Hobby {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(() => Resume, resume => resume.hobbies)
  resumes!: Resume[];
} 