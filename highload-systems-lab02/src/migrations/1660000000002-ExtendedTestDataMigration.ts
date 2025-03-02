import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendedTestDataMigration1660000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert 10 hobbies with descriptive names
    await queryRunner.query(`
      INSERT INTO "hobby" ("id", "name")
      VALUES 
        (1, 'Reading'),
        (2, 'Traveling'),
        (3, 'Cooking'),
        (4, 'Sports'),
        (5, 'Music'),
        (6, 'Art'),
        (7, 'Gaming'),
        (8, 'Hiking'),
        (9, 'Photography'),
        (10, 'Writing');
    `);

    // Insert 5 employees with explicit ids
    await queryRunner.query(`
      INSERT INTO "employee" ("id", "login", "password")
      VALUES 
        (1, 'employee1', 'password1'),
        (2, 'employee2', 'password2'),
        (3, 'employee3', 'password3'),
        (4, 'employee4', 'password4'),
        (5, 'employee5', 'password5');
    `);

    // Insert 5 resumes (one per employee, employeeId from 1 to 5)
    await queryRunner.query(`
      INSERT INTO "resume" ("id", "employeeId")
      VALUES 
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5);
    `);

    // Insert work experiences for each resume with descriptive company names:
    // Employee 1 (resume id 1): 2 experiences
    await queryRunner.query(`
      INSERT INTO "work_experience" ("id", "city", "company", "resumeId")
      VALUES 
        (1, 'New York', 'Acme Corp', 1),
        (2, 'Los Angeles', 'Globex Inc', 1);
    `);

    // Employee 2 (resume id 2): 2 experiences
    await queryRunner.query(`
      INSERT INTO "work_experience" ("id", "city", "company", "resumeId")
      VALUES 
        (3, 'Chicago', 'Soylent Corp', 2),
        (4, 'Houston', 'Initech', 2);
    `);

    // Employee 3 (resume id 3): 4 experiences
    await queryRunner.query(`
      INSERT INTO "work_experience" ("id", "city", "company", "resumeId")
      VALUES 
        (5, 'Phoenix', 'Umbrella Corp', 3),
        (6, 'Philadelphia', 'Hooli', 3),
        (7, 'San Antonio', 'Stark Industries', 3),
        (8, 'San Diego', 'Wayne Enterprises', 3);
    `);

    // Employee 4 (resume id 4): 3 experiences
    await queryRunner.query(`
      INSERT INTO "work_experience" ("id", "city", "company", "resumeId")
      VALUES 
        (9, 'Dallas', 'Wonka Industries', 4),
        (10, 'San Jose', 'Cyberdyne Systems', 4),
        (11, 'Austin', 'Tyrell Corp', 4);
    `);

    // Employee 5 (resume id 5): 2 experiences
    await queryRunner.query(`
      INSERT INTO "work_experience" ("id", "city", "company", "resumeId")
      VALUES 
        (12, 'San Francisco', 'Massive Dynamic', 5),
        (13, 'Seattle', 'Stargate Command', 5);
    `);

    // Insert join table data for many-to-many relation between resume and hobby
    // Resume 1: Reading, Traveling, Cooking
    // Resume 2: Traveling, Cooking, Sports
    // Resume 3: Reading, Music, Gaming, Photography
    // Resume 4: Cooking, Art, Hiking
    // Resume 5: Sports, Gaming, Writing
    await queryRunner.query(`
      INSERT INTO "resume_hobbies_hobby" ("resumeId", "hobbyId")
      VALUES 
        (1, 1), (1, 2), (1, 3),
        (2, 2), (2, 3), (2, 4),
        (3, 1), (3, 5), (3, 7), (3, 9),
        (4, 3), (4, 6), (4, 8),
        (5, 4), (5, 7), (5, 10);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order: delete join table data first, then work experiences, resumes, employees, then hobbies
    await queryRunner.query(`DELETE FROM "resume_hobbies_hobby"`);
    await queryRunner.query(`DELETE FROM "work_experience"`);
    await queryRunner.query(`DELETE FROM "resume"`);
    await queryRunner.query(`DELETE FROM "employee"`);
    await queryRunner.query(`DELETE FROM "hobby"`);
  }
} 