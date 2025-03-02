import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';
import { Hobby } from './hobby.entity';
import { WorkExperience } from './workexperience.entity';

@Entity()
export class Resume {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column(() => Hobby)
  hobbies!: Hobby[];

  @Column(() => WorkExperience)
  workExperiences!: WorkExperience[];
} 