import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';
@Entity()
export class Hobby {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;
}