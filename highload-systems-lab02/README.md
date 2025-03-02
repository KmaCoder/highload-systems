# Highload Systems Lab 02

## Available Database Modules

### PostgreSQL Module

#### Available Endpoints

- `GET /api/postgres/employees/:id/resume` - Get employee's resume by ID
- `GET /api/postgres/employees/:id/resume/hobbies` - Get employee's hobbies by ID
- `GET /api/postgres/employees/resume/hobbies/all` - Get all hobbies across employees
- `GET /api/postgres/employees/resume/cities/all` - Get all cities from work experiences
- `GET /api/postgres/employees/resume/hobbies/by-city?city=<city>` - Get hobbies by city
- `GET /api/postgres/employees/group-by-company?min-employees=<number>` - Group employees by company

### Neo4j Module

#### Available Endpoints

- `GET /api/neo4j/employees/:login/resume` - Get employee's resume by login
- `GET /api/neo4j/employees/:id/resume/hobbies` - Get employee's hobbies by ID
- `GET /api/neo4j/employees/resume/hobbies/all` - Get all hobbies across employees
- `GET /api/neo4j/employees/resume/cities/all` - Get all cities from work experiences
- `GET /api/neo4j/employees/resume/hobbies/by-city?city=<city>` - Get hobbies by city
- `GET /api/neo4j/employees/group-by-company?min-employees=<number>` - Group employees by company

### MongoDB Module

- `GET /api/mongo/employees/:login/resume` - Get employee's resume by login
- `GET /api/mongo/employees/:id/resume/hobbies` - Get employee's hobbies by ID
- `GET /api/mongo/employees/resume/hobbies/all` - Get all hobbies across employees
- `GET /api/mongo/employees/resume/cities/all` - Get all cities from work experiences
- `GET /api/mongo/employees/resume/hobbies/by-city?city=<city>` - Get hobbies by city
- `GET /api/mongo/employees/group-by-company?min-employees=<number>` - Group employees by company

## Seeding the Databases

```bash
# PostgreSQL
npx ts-node src/postgres/seed.ts

# Neo4j
npx ts-node src/neo4j/seed.ts

# MongoDB
npx ts-node src/mongo/seed.ts
``` 