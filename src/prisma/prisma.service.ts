import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Triggers when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Triggers when the application shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}