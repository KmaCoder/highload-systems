import { Module, DynamicModule, Provider } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';
import { Neo4jService } from './neo4j.service';
import { Config } from 'neo4j-driver';

interface Neo4jConfig {
  uri: string;
  username: string;
  password: string;
  options?: Config;
  isGlobal?: boolean;
}

@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    const configProvider: Provider = {
      provide: NEO4J_CONFIG,
      useValue: config,
    };

    const driverProvider: Provider = {
      provide: NEO4J_DRIVER,
      useFactory: async (): Promise<Driver> => {
        const driver = neo4j.driver(
          config.uri,
          neo4j.auth.basic(config.username, config.password),
          config.options,
        );
        await driver.verifyConnectivity();
        return driver;
      },
      inject: [NEO4J_CONFIG],
    };

    return {
      module: Neo4jModule,
      global: config.isGlobal,
      providers: [configProvider, driverProvider, Neo4jService],
      exports: [Neo4jService],
    };
  }
} 