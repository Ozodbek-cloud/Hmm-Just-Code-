import { Module } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { PurchasedCoursesController } from './purchased-courses.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PurchasedCoursesController],
  providers: [PurchasedCoursesService],
})
export class PurchasedCoursesModule {}
