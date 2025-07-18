import { Module } from '@nestjs/common';
import { CategoryRatingService } from './category-rating.service';
import { CategoryRatingController } from './category-rating.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryRatingController],
  providers: [CategoryRatingService],
})
export class CategoryRatingModule {}
