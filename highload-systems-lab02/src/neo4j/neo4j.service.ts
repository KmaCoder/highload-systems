import { Injectable, Inject, OnApplicationShutdown } from '@nestjs/common';
import { Driver, Session, Transaction } from 'neo4j-driver';
import { NEO4J_DRIVER } from './neo4j.constants';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    // @ts-ignore
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
  ) {}

  getDriver(): Driver {
    return this.driver;
  }

  getSession(database?: string): Session {
    return this.driver.session({ database });
  }

  beginTransaction(database?: string): Transaction {
    const session = this.getSession(database);
    return session.beginTransaction();
  }

  async run(query: string, params: Record<string, any> = {}, database?: string): Promise<any> {
    const session = this.getSession(database);
    try {
      const result = await session.run(query, params);
      return result;
    } finally {
      await session.close();
    }
  }

  async onApplicationShutdown() {
    await this.driver.close();
  }
} 