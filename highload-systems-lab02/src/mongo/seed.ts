import { Employee } from './entities/employee.entity';
import { Hobby } from './entities/hobby.entity';
import { Resume } from './entities/resume.entity';
import { WorkExperience } from './entities/workexperience.entity';
import MongoDataSource from './data-source-mongo';

async function seed() {
  try {
    // Initialize the data source
    await MongoDataSource.initialize();
    console.log('MongoDB connection initialized');

    // Clear existing data
    await MongoDataSource.getMongoRepository(Employee).deleteMany({});
    console.log('Cleared existing data');

    // Create hobbies (these will be embedded in resume)
    const hobbies = [
      { name: 'Reading' },
      { name: 'Gaming' },
      { name: 'Hiking' },
      { name: 'Cooking' },
      { name: 'Photography' },
      { name: 'Traveling' }
    ];

    // Create work experiences (these will be embedded in resume)
    const johnWorkExps = [
      { city: 'New York', company: 'Google' },
      { city: 'San Francisco', company: 'Apple' }
    ];

    const janeWorkExps = [
      { city: 'Seattle', company: 'Amazon' },
      { city: 'Boston', company: 'Microsoft' }
    ];

    const bobWorkExps = [
      { city: 'Austin', company: 'Dell' }
    ];

    const aliceWorkExps = [
      { city: 'Chicago', company: 'IBM' },
      { city: 'Denver', company: 'Oracle' }
    ];

    const sarahWorkExps = [
      { city: 'Seattle', company: 'Amazon' }
    ];

    const mikeWorkExps = [
      { city: 'Cupertino', company: 'Apple' }
    ];

    const emilyWorkExps = [
      { city: 'Austin', company: 'Apple' }
    ];

    // Create employees with embedded resumes, hobbies and work experiences
    const employees = [
      {
        login: 'john.doe',
        password: 'password123',
        resumes: [
          {
            hobbies: [
              { name: hobbies[0].name }, // Reading
              { name: hobbies[2].name }, // Hiking
            ],
            workExperiences: johnWorkExps
          }
        ]
      },
      {
        login: 'jane.smith',
        password: 'secure456',
        resumes: [
          {
            hobbies: [
              { name: hobbies[1].name }, // Gaming
              { name: hobbies[3].name }, // Cooking
              { name: hobbies[5].name }, // Traveling
            ],
            workExperiences: janeWorkExps
          }
        ]
      },
      {
        login: 'bob.johnson',
        password: 'bobpass789',
        resumes: [
          {
            hobbies: [
              { name: hobbies[4].name }, // Photography
              { name: hobbies[5].name }, // Traveling
            ],
            workExperiences: bobWorkExps
          }
        ]
      },
      {
        login: 'alice.wonder',
        password: 'alicePwd!',
        resumes: [
          {
            hobbies: [
              { name: hobbies[0].name }, // Reading
              { name: hobbies[3].name }, // Cooking
              { name: hobbies[4].name }, // Photography
            ],
            workExperiences: aliceWorkExps
          }
        ]
      },
      {
        login: 'sarah.connor',
        password: 'terminator123',
        resumes: [
          {
            hobbies: [
              { name: hobbies[2].name }, // Hiking
              { name: hobbies[5].name }, // Traveling
            ],
            workExperiences: sarahWorkExps
          }
        ]
      },
      {
        login: 'mike.jackson',
        password: 'smooth789',
        resumes: [
          {
            hobbies: [
              { name: hobbies[1].name }, // Gaming
              { name: hobbies[3].name }, // Cooking
            ],
            workExperiences: mikeWorkExps
          }
        ]
      },
      {
        login: 'emily.chen',
        password: 'secure321',
        resumes: [
          {
            hobbies: [
              { name: hobbies[0].name }, // Reading
              { name: hobbies[4].name }, // Photography
            ],
            workExperiences: emilyWorkExps
          }
        ]
      }
    ];

    const savedEmployees = await MongoDataSource.getMongoRepository(Employee).save(employees);
    console.log(`Created ${savedEmployees.length} employees with embedded resumes, hobbies, and work experiences`);

    console.log('MongoDB seed completed successfully');
  } catch (error) {
    console.error('Error seeding MongoDB database:', error);
  } finally {
    // Close the connection
    await MongoDataSource.destroy();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seed(); 