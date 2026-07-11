import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes the module available everywhere without re-importing 
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exported so other services can inject it 
})
export class PrismaModule {}