const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');

// Configuration
const MONGODB_URI = 'mongodb://localhost:30000/mydb';
const COLLECTION_NAME = 'users';
const TOTAL_USERS = 10000;

// Available countries for random assignment
const COUNTRIES = ["us", "de", "fr", "it", "es", "pl", "ua"];

// Connect to the MongoDB server
async function seedDatabase() {
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection(COLLECTION_NAME);
    
    // Generate users in batches to avoid memory issues
    const BATCH_SIZE = 1000;
    const batches = Math.ceil(TOTAL_USERS / BATCH_SIZE);
    
    console.log(`Generating ${TOTAL_USERS} users in ${batches} batches...`);
    
    for (let batch = 0; batch < batches; batch++) {
      const userBatch = [];
      const batchSize = Math.min(BATCH_SIZE, TOTAL_USERS - batch * BATCH_SIZE);
      
      for (let i = 0; i < batchSize; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        
        userBatch.push({
          name: `${firstName} ${lastName}`,
          email: faker.internet.email(firstName, lastName).toLowerCase(),
          country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
        });
      }
      
      // Insert the batch of users
      const result = await users.insertMany(userBatch);
      console.log(`Batch ${batch + 1}/${batches}: Inserted ${result.insertedCount} users`);
    }
    
    // Count documents by country
    console.log('\nDistribution by country:');
    for (const country of COUNTRIES) {
      const count = await users.countDocuments({ country });
      console.log(`${country}: ${count} users (${(count / TOTAL_USERS * 100).toFixed(2)}%)`);
    }
    
    console.log(`\nSuccessfully seeded ${TOTAL_USERS} users!`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the seeding function
seedDatabase().catch(console.error); 