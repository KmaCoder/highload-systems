import { Employee } from './entities/employee.entity';
import { Resume } from './entities/resume.entity';
import { Hobby } from './entities/hobby.entity';
import { WorkExperience } from './entities/workexperience.entity';
import PostgresDataSource from './data-source';

async function seed() {
  try {
    // Initialize the data source
    await PostgresDataSource.initialize();
    console.log('PostgreSQL connection initialized');

    // Clear existing data
    await PostgresDataSource.getRepository(WorkExperience).delete({});
    await PostgresDataSource.getRepository(Resume).delete({});
    await PostgresDataSource.getRepository(Hobby).delete({});
    await PostgresDataSource.getRepository(Employee).delete({});
    console.log('Cleared existing data');

    // Create hobbies
    const hobbies = [
      { name: 'Reading' },
      { name: 'Gaming' },
      { name: 'Hiking' },
      { name: 'Cooking' },
      { name: 'Photography' },
      { name: 'Traveling' }
    ];

    const savedHobbies = await PostgresDataSource.getRepository(Hobby).save(hobbies);
    console.log(`Created ${savedHobbies.length} hobbies`);

    // Create employees
    const employees = [
      { login: 'john.doe', password: 'password123' },
      { login: 'jane.smith', password: 'secure456' },
      { login: 'bob.johnson', password: 'bobpass789' },
      { login: 'alice.wonder', password: 'alicePwd!' },
      { login: 'sarah.connor', password: 'terminator123' },
      { login: 'mike.jackson', password: 'smooth789' },
      { login: 'emily.chen', password: 'secure321' }
    ];

    const savedEmployees = await PostgresDataSource.getRepository(Employee).save(employees);
    console.log(`Created ${savedEmployees.length} employees`);

    // Create resumes with work experiences
    const resumes = [];

    // John's resume
    const johnResume = new Resume();
    johnResume.employee = savedEmployees[0];
    johnResume.hobbies = [savedHobbies[0], savedHobbies[2]]; // Reading, Hiking
    resumes.push(johnResume);

    // Jane's resume
    const janeResume = new Resume();
    janeResume.employee = savedEmployees[1];
    janeResume.hobbies = [savedHobbies[1], savedHobbies[3], savedHobbies[5]]; // Gaming, Cooking, Traveling
    resumes.push(janeResume);

    // Bob's resume
    const bobResume = new Resume();
    bobResume.employee = savedEmployees[2];
    bobResume.hobbies = [savedHobbies[4], savedHobbies[5]]; // Photography, Traveling
    resumes.push(bobResume);

    // Alice's resume
    const aliceResume = new Resume();
    aliceResume.employee = savedEmployees[3];
    aliceResume.hobbies = [savedHobbies[0], savedHobbies[3], savedHobbies[4]]; // Reading, Cooking, Photography
    resumes.push(aliceResume);

    // Sarah's resume
    const sarahResume = new Resume();
    sarahResume.employee = savedEmployees[4];
    sarahResume.hobbies = [savedHobbies[2], savedHobbies[5]]; // Hiking, Traveling
    resumes.push(sarahResume);

    // Mike's resume
    const mikeResume = new Resume();
    mikeResume.employee = savedEmployees[5];
    mikeResume.hobbies = [savedHobbies[1], savedHobbies[3]]; // Gaming, Cooking
    resumes.push(mikeResume);

    // Emily's resume
    const emilyResume = new Resume();
    emilyResume.employee = savedEmployees[6];
    emilyResume.hobbies = [savedHobbies[0], savedHobbies[4]]; // Reading, Photography
    resumes.push(emilyResume);

    const savedResumes = await PostgresDataSource.getRepository(Resume).save(resumes);
    console.log(`Created ${savedResumes.length} resumes`);

    // Create work experiences
    const workExperiences = [
      { city: 'New York', company: 'Google', resume: savedResumes[0] },
      { city: 'San Francisco', company: 'Apple', resume: savedResumes[0] },
      { city: 'Seattle', company: 'Amazon', resume: savedResumes[1] },
      { city: 'Boston', company: 'Microsoft', resume: savedResumes[1] },
      { city: 'Austin', company: 'Dell', resume: savedResumes[2] },
      { city: 'Chicago', company: 'IBM', resume: savedResumes[3] },
      { city: 'Denver', company: 'Oracle', resume: savedResumes[3] },
      { city: 'Seattle', company: 'Amazon', resume: savedResumes[4] },
      { city: 'Cupertino', company: 'Apple', resume: savedResumes[5] },
      { city: 'Austin', company: 'Apple', resume: savedResumes[6] }
    ];

    const savedWorkExperiences = await PostgresDataSource.getRepository(WorkExperience).save(workExperiences);
    console.log(`Created ${savedWorkExperiences.length} work experiences`);

    console.log('PostgreSQL seed completed successfully');
  } catch (error) {
    console.error('Error seeding PostgreSQL database:', error);
  } finally {
    // Close the connection
    await PostgresDataSource.destroy();
    console.log('PostgreSQL connection closed');
  }
}

// Run the seed function
seed(); 