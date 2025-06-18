import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports:[CommonModule,PrismaModule]
})
export class LocationModule {}
