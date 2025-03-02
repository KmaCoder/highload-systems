import { Module, OnModuleInit } from '@nestjs/common';
import { Neo4jModule } from '../../neo4j.module';
import { Neo4jEmployeeController } from './employee.controller';
import { Neo4jEmployeeService } from './employee.service';

@Module({
  imports: [
    Neo4jModule.forRoot({
      uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
      username: process.env.NEO4J_USERNAME!,
      password: process.env.NEO4J_PASSWORD!,
      isGlobal: false,
    }),
  ],
  controllers: [Neo4jEmployeeController],
  providers: [Neo4jEmployeeService],
})
export class Neo4jEmployeeModule {} 