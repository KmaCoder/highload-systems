import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity()
export class WorkExperience {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  city!: string;

  @Column()
  company!: string;
} 