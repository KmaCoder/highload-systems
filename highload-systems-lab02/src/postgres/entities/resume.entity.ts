import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Employee } from './employee.entity';
import { Hobby } from './hobby.entity';
import { WorkExperience } from './workexperience.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.resumes)
  employee!: Employee;

  @ManyToMany(() => Hobby, hobby => hobby.resumes, { cascade: true })
  @JoinTable()
  hobbies!: Hobby[];

  @OneToMany(() => WorkExperience, workExperience => workExperience.resume, { cascade: true })
  workExperiences!: WorkExperience[];
} 