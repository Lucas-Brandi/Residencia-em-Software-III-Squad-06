import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Isso faz com que você não precise importar o Prisma em todo lugar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
