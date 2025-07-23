import { Module } from '@nestjs/common';
import { PurchasedCoursesService } from './purchased-courses.service';
import { PurchasedCoursesController } from './purchased-courses.controller';

@Module({
  controllers: [PurchasedCoursesController],
  providers: [PurchasedCoursesService],
})
export class PurchasedCoursesModule {}
