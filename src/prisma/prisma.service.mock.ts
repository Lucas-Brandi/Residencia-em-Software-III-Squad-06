import { Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const mockPrismaServiceProvider: Provider = {
  provide: PrismaService,
  useValue: {},
};
