import neo4j from 'neo4j-driver';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const username = process.env.NEO4J_USERNAME!;
const password = process.env.NEO4J_PASSWORD!;
const database = process.env.NEO4J_DATABASE!;

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

async function clearDatabase() {
  const session = driver.session({ database });
  try {
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('Neo4j database cleared');
  } finally {
    await session.close();
  }
}

async function seed() {
  try {
    await clearDatabase();

    const session = driver.session({ database });
    
    try {
      // Create hobby nodes - using Neo4j's internal IDs instead of explicit UUIDs
      const hobbies = [
        { name: 'Reading' },
        { name: 'Gaming' },
        { name: 'Hiking' },
        { name: 'Cooking' },
        { name: 'Photography' },
        { name: 'Traveling' }
      ];

      for (const hobby of hobbies) {
        await session.run(
          `
          CREATE (h:Hobby {name: $name})
          RETURN h
          `,
          { name: hobby.name }
        );
      }
      console.log(`Created ${hobbies.length} hobbies`);

      // Create employee nodes - using Neo4j's internal IDs
      const employees = [
        { login: 'john.doe', password: 'password123' },
        { login: 'jane.smith', password: 'secure456' },
        { login: 'bob.johnson', password: 'bobpass789' },
        { login: 'alice.wonder', password: 'alicePwd!' },
        { login: 'sarah.connor', password: 'terminator123' },
        { login: 'mike.jackson', password: 'smooth789' },
        { login: 'emily.chen', password: 'secure321' }
      ];

      for (const employee of employees) {
        await session.run(
          `
          CREATE (e:Employee {login: $login, password: $password})
          RETURN e
          `,
          { login: employee.login, password: employee.password }
        );
      }
      console.log(`Created ${employees.length} employees`);

      // Create resume nodes and connect them to employees
      // Using employee login as a natural key for reference
      const resumeConnections = [
        { employeeLogin: 'john.doe', hobbyNames: ['Reading', 'Hiking'] },
        { employeeLogin: 'jane.smith', hobbyNames: ['Gaming', 'Cooking', 'Traveling'] },
        { employeeLogin: 'bob.johnson', hobbyNames: ['Photography', 'Traveling'] },
        { employeeLogin: 'alice.wonder', hobbyNames: ['Reading', 'Cooking', 'Photography'] },
        { employeeLogin: 'sarah.connor', hobbyNames: ['Hiking', 'Traveling'] },
        { employeeLogin: 'mike.jackson', hobbyNames: ['Gaming', 'Cooking'] },
        { employeeLogin: 'emily.chen', hobbyNames: ['Reading', 'Photography'] }
      ];

      for (const connection of resumeConnections) {
        // Create resume and connect to employee in one query
        const result = await session.run(
          `
          MATCH (e:Employee {login: $employeeLogin})
          CREATE (r:Resume)
          CREATE (e)-[:HAS_RESUME]->(r)
          RETURN r
          `,
          { employeeLogin: connection.employeeLogin }
        );

        // Extract the resume node for relationship creation
        const resumeNode = result.records[0].get('r');

        // Connect hobbies to resume
        for (const hobbyName of connection.hobbyNames) {
          await session.run(
            `
            MATCH (r:Resume) WHERE id(r) = $resumeId
            MATCH (h:Hobby {name: $hobbyName})
            CREATE (r)-[:HAS_HOBBY]->(h)
            `,
            { 
              resumeId: resumeNode.identity.toNumber(), 
              hobbyName: hobbyName
            }
          );
        }
      }
      console.log(`Created ${resumeConnections.length} resumes with hobbies`);

      // Create work experiences and connect them to resumes
      // Using a combination of queries to find the right resumes
      const workExperiences = [
        { city: 'New York', company: 'Google', employeeLogin: 'john.doe' },
        { city: 'San Francisco', company: 'Apple', employeeLogin: 'john.doe' },
        { city: 'Seattle', company: 'Amazon', employeeLogin: 'jane.smith' },
        { city: 'Boston', company: 'Microsoft', employeeLogin: 'jane.smith' },
        { city: 'Austin', company: 'Dell', employeeLogin: 'bob.johnson' },
        { city: 'Chicago', company: 'IBM', employeeLogin: 'alice.wonder' },
        { city: 'Denver', company: 'Oracle', employeeLogin: 'alice.wonder' },
        { city: 'Seattle', company: 'Amazon', employeeLogin: 'sarah.connor' },
        { city: 'Cupertino', company: 'Apple', employeeLogin: 'mike.jackson' },
        { city: 'Austin', company: 'Apple', employeeLogin: 'emily.chen' }
      ];

      for (const workExp of workExperiences) {
        // Find the resume connected to the employee, create the work experience, and connect it
        await session.run(
          `
          MATCH (e:Employee {login: $employeeLogin})-[:HAS_RESUME]->(r:Resume)
          CREATE (w:WorkExperience {city: $city, company: $company})
          CREATE (r)-[:HAS_WORK_EXPERIENCE]->(w)
          RETURN w
          `,
          { 
            employeeLogin: workExp.employeeLogin, 
            city: workExp.city, 
            company: workExp.company 
          }
        );
      }
      console.log(`Created ${workExperiences.length} work experiences`);
      
      console.log('Neo4j seed completed successfully');
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Error during Neo4j seeding:', error);
  } finally {
    await driver.close();
  }
}

seed(); 