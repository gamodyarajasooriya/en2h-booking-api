import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);

    // Initialize Prisma Client with the PostgreSQL driver adapter
    super({ adapter });
    this.pool = pool;
  }

  // Triggers when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Triggers when the application shuts down
  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}